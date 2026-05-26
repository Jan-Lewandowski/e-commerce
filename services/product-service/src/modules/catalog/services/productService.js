import { randomUUID } from 'node:crypto';
import * as productRepository from '../repositories/productRepository.js';
import * as supplierService from '../../suppliers/services/supplierService.js';
import { HttpError } from '../../../utils/httpError.js';

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeString(value, label, minLength, maxLength) {
  const trimmed = String(value ?? '').trim();
  if (trimmed.length < minLength) {
    throw new HttpError(400, `${label} musi miec co najmniej ${minLength} znaki.`);
  }
  if (trimmed.length > maxLength) {
    throw new HttpError(400, `${label} nie moze przekraczac ${maxLength} znakow.`);
  }
  return trimmed;
}

function normalizeTags(rawValue, fallback = [], options = {}) {
  const { requireNonEmpty = false } = options;

  if (rawValue === undefined || rawValue === null) {
    if (requireNonEmpty) {
      throw new HttpError(400, 'Pole tags jest wymagane.');
    }
    return fallback;
  }

  let parsed = rawValue;
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      if (requireNonEmpty) {
        throw new HttpError(400, 'Pole tags jest wymagane.');
      }
      return [];
    }
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new HttpError(400, 'Nieprawidlowy format listy tagow.');
    }
  }

  if (!Array.isArray(parsed)) {
    throw new HttpError(400, 'Pole tags musi byc lista.');
  }

  const normalized = parsed
    .map((tag) => String(tag).trim())
    .filter(Boolean);

  if (normalized.length > 20) {
    throw new HttpError(400, 'Lista tagow moze miec maksymalnie 20 pozycji.');
  }

  if (normalized.some((tag) => tag.length > 30)) {
    throw new HttpError(400, 'Tagi nie moga przekraczac 30 znakow.');
  }

  if (requireNonEmpty && normalized.length === 0) {
    throw new HttpError(400, 'Lista tagow nie moze byc pusta.');
  }

  return normalized;
}

function normalizeSpecs(rawValue, fallback = {}, options = {}) {
  const { requireNonEmpty = false } = options;

  if (rawValue === undefined || rawValue === null) {
    if (requireNonEmpty) {
      throw new HttpError(400, 'Pole specs jest wymagane.');
    }
    return fallback;
  }

  let parsed = rawValue;
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      if (requireNonEmpty) {
        throw new HttpError(400, 'Pole specs jest wymagane.');
      }
      return {};
    }
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new HttpError(400, 'Nieprawidlowy format specyfikacji.');
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new HttpError(400, 'Pole specs musi byc obiektem JSON.');
  }

  const entries = Object.entries(parsed);
  if (entries.length > 40) {
    throw new HttpError(400, 'Specyfikacja moze zawierac maksymalnie 40 pol.');
  }

  const normalized = {};
  for (const [key, value] of entries) {
    const safeKey = String(key).trim();
    if (!safeKey) continue;
    if (safeKey.length > 40) {
      throw new HttpError(400, 'Nazwy pol specyfikacji nie moga przekraczac 40 znakow.');
    }
    if (value === null || value === undefined) continue;
    if (!['string', 'number', 'boolean'].includes(typeof value)) {
      throw new HttpError(400, 'Wartosci specyfikacji musza byc tekstem, liczba lub boolean.');
    }
    normalized[safeKey] = value;
  }

  if (requireNonEmpty && Object.keys(normalized).length === 0) {
    throw new HttpError(400, 'Specyfikacja nie moze byc pusta.');
  }

  return normalized;
}

function generateProductId() {
  const shortId = randomUUID().split('-')[0].toUpperCase();
  return `PRD-${shortId}`;
}

export function getCategories() {
  return productRepository.getCategories();
}

export function getProducts(query = {}) {
  return productRepository.findProducts({
    category: query.category || null,
    producer: query.producer || null,
    priceFrom: toNumber(query.priceFrom),
    priceTo: toNumber(query.priceTo),
    ratingFrom: toNumber(query.ratingFrom),
    ratingTo: toNumber(query.ratingTo),
    q: query.q ? String(query.q).trim() : null,
  });
}

export async function getProductById(productId) {
  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new HttpError(404, 'Nie znaleziono produktu.');
  }
  const supplier = await supplierService.getPrimarySupplierForProduct(productId);
  return supplier ? { ...product, supplier } : product;
}

// related - produkty dzielace tagi
export async function getRelatedProducts(productId, limit = 5) {
  const product = await getProductById(productId);
  const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;
  const all = await productRepository.getAllProducts();

  return all
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({
      product: candidate,
      score: (candidate.tags || []).filter((tag) => (product.tags || []).includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(safeLimit, 0))
    .map(({ product: p }) => p);
}

export async function updateProduct(productId, payload = {}) {
  const existing = await productRepository.getProductById(productId);
  if (!existing) {
    throw new HttpError(404, 'Nie znaleziono produktu.');
  }

  const name = normalizeString(payload.name, 'Nazwa', 3, 120);
  const description = normalizeString(payload.description, 'Opis', 10, 4000);

  const price = toNumber(payload.price);
  if (price === null || price < 0) {
    throw new HttpError(400, 'Cena musi byc liczba wieksza lub rowna 0.');
  }

  if (payload.stock === undefined || payload.stock === null || payload.stock === '') {
    throw new HttpError(400, 'Stan magazynowy jest wymagany.');
  }
  const stock = Number(payload.stock);
  if (!Number.isFinite(stock) || !Number.isInteger(stock) || stock < 0) {
    throw new HttpError(400, 'Stan magazynowy musi byc liczba calkowita >= 0.');
  }

  const tags = normalizeTags(payload.tags, existing.tags || []);
  const specs = normalizeSpecs(payload.specs, existing.specs || {});

  const thumbnail =
    typeof payload.thumbnail === 'string' && payload.thumbnail.trim()
      ? payload.thumbnail.trim()
      : existing.thumbnail;

  if (!thumbnail) {
    throw new HttpError(400, 'Miniatura produktu jest wymagana.');
  }

  return productRepository.updateProductById(productId, {
    name,
    price,
    stock,
    description,
    tags,
    specs,
    thumbnail,
  });
}

export async function createProduct(payload = {}) {
  const name = normalizeString(payload.name, 'Nazwa', 3, 120);
  const brand = normalizeString(payload.brand, 'Marka', 2, 80);
  const category = normalizeString(payload.category, 'Kategoria', 2, 120);
  const description = normalizeString(payload.description, 'Opis', 10, 4000);

  const price = toNumber(payload.price);
  if (price === null || price < 0) {
    throw new HttpError(400, 'Cena musi byc liczba wieksza lub rowna 0.');
  }

  if (payload.stock === undefined || payload.stock === null || payload.stock === '') {
    throw new HttpError(400, 'Stan magazynowy jest wymagany.');
  }
  const stock = Number(payload.stock);
  if (!Number.isFinite(stock) || !Number.isInteger(stock) || stock < 0) {
    throw new HttpError(400, 'Stan magazynowy musi byc liczba calkowita >= 0.');
  }

  const ratingRaw = toNumber(payload.rating);
  const rating = ratingRaw ?? 0;
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    throw new HttpError(400, 'Ocena musi byc liczba z zakresu 0-5.');
  }

  const categories = await productRepository.getCategories();
  if (!categories.includes(category)) {
    throw new HttpError(400, 'Wybrana kategoria nie istnieje.');
  }

  const tags = normalizeTags(payload.tags, [], { requireNonEmpty: true });
  const specs = normalizeSpecs(payload.specs, {}, { requireNonEmpty: true });

  const thumbnail =
    typeof payload.thumbnail === 'string' && payload.thumbnail.trim()
      ? payload.thumbnail.trim()
      : null;

  if (!thumbnail) {
    throw new HttpError(400, 'Miniatura produktu jest wymagana.');
  }

  let productId = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateProductId();
    const existing = await productRepository.getProductById(candidate);
    if (!existing) {
      productId = candidate;
      break;
    }
  }

  if (!productId) {
    throw new HttpError(500, 'Nie udalo sie wygenerowac ID produktu.');
  }

  return productRepository.createProduct({
    id: productId,
    category,
    name,
    brand,
    price,
    stock,
    rating,
    thumbnail,
    tags,
    specs,
    description,
  });
}
