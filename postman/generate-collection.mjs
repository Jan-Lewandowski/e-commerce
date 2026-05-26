import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COLLECTION_ID = '7f3a9c2e-1b4d-4e6a-9f8c-2d5e6a7b8c9d';
const ENVIRONMENT_ID = '8e4b0d3f-2c5e-4f7b-0a9d-3e6f7b8c9d0e';

const bearerAuth = {
  type: 'bearer',
  bearer: [{ key: 'token', value: '{{authToken}}', type: 'string' }],
};

function makeUrl(rawPath, query = []) {
  const active = query.filter((q) => !q.disabled);
  const qs = active
    .map((q) => `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`)
    .join('&');
  return `{{baseUrl}}${rawPath}${qs ? `?${qs}` : ''}`;
}

function req(name, method, urlPath, options = {}) {
  const request = {
    method,
    header: [],
    url: makeUrl(urlPath, options.query || []),
  };

  if (options.body && !options.formdata) {
    request.header.push({ key: 'Content-Type', value: 'application/json' });
    request.body = {
      mode: 'raw',
      raw:
        typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body, null, 2),
      options: { raw: { language: 'json' } },
    };
  }

  if (options.formdata) {
    request.body = { mode: 'formdata', formdata: options.formdata };
  }

  if (options.description) {
    request.description = options.description;
  }

  const item = {
    name,
    request,
    response: [],
  };

  if (options.auth) {
    item.auth = bearerAuth;
  }

  if (options.tests) {
    item.event = [
      {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: options.tests,
        },
      },
    ];
  }

  return item;
}

function group(name, items, withAuth = false) {
  const folder = { name, item: items };
  if (withAuth) folder.auth = bearerAuth;
  return folder;
}

const collection = {
  info: {
    _postman_id: COLLECTION_ID,
    name: 'E-commerce API (Docker Compose)',
    description:
      '39 endpointow API przez NGINX (docker compose up --build). Najpierw: 00 Setup > Login (admin).',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [
    group('00 - Setup', [
      req('Login (admin)', 'POST', '/api/auth/login', {
        body: { email: 'admin@example.com', password: 'password' },
        tests: [
          'pm.test("Status 200", function () { pm.response.to.have.status(200); });',
          'var json = pm.response.json();',
          'if (json.token) { pm.environment.set("authToken", json.token); }',
        ],
        description: 'Knex + PostgreSQL. Zapisuje authToken do environment.',
      }),
      req('Me (sprawdz sesje)', 'GET', '/api/auth/me', { auth: true }),
    ]),

    group(
      '01 - Auth [Knex + PostgreSQL]',
      [
        req('Register', 'POST', '/api/auth/register', {
          body: { email: 'jan.kowalski@example.com', password: 'haslo123' },
        }),
        req('Login', 'POST', '/api/auth/login', {
          body: { email: 'admin@example.com', password: 'password' },
          tests: [
            'var j = pm.response.json();',
            'if (j.token) { pm.environment.set("authToken", j.token); }',
          ],
        }),
        req('Me', 'GET', '/api/auth/me', { auth: true }),
        req('Update profile', 'PATCH', '/api/users/me/profile', {
          body: {
            name: 'Jan Kowalski',
            phone: '+48 600 100 200',
            street: 'ul. Testowa 5',
            city: 'Warszawa',
            zipCode: '00-001',
          },
        }),
        req('Logout', 'POST', '/api/auth/logout', { auth: true }),
      ],
      true,
    ),

    group(
      '02 - Katalog [Knex]',
      [
        req('GET Categories', 'GET', '/api/categories'),
        req('GET Products (filtry)', 'GET', '/api/products', {
          query: [
            { key: 'category', value: 'Laptopy' },
            { key: 'priceFrom', value: '3000' },
            { key: 'ratingFrom', value: '4' },
            { key: 'q', value: 'lenovo' },
          ],
        }),
        req('GET Product by ID', 'GET', '/api/products/{{productId}}'),
        req('GET Related products', 'GET', '/api/products/{{productId}}/related', {
          query: [{ key: 'limit', value: '3' }],
        }),
        req('POST Create product (JSON)', 'POST', '/api/products', {
          body: {
            category: 'Laptopy',
            brand: 'TestBrand',
            name: 'Laptop testowy demo',
            price: 2499,
            stock: 15,
            rating: 4.2,
            description: 'Opis testowego laptopa do prezentacji projektu.',
            tags: ['laptop', 'demo', 'test'],
            specs: { procesor: 'Intel Core i5', ram: '16 GB', dysk: '512 GB SSD' },
            thumbnail: '/images/products/lenovo-ideapad-5.jpg',
          },
        }),
        req('POST Create product (form-data)', 'POST', '/api/products', {
          formdata: [
            { key: 'category', value: 'Laptopy', type: 'text' },
            { key: 'brand', value: 'TestBrand', type: 'text' },
            { key: 'name', value: 'Laptop z uploadem zdjecia', type: 'text' },
            { key: 'price', value: '2799', type: 'text' },
            { key: 'stock', value: '10', type: 'text' },
            { key: 'rating', value: '4.5', type: 'text' },
            { key: 'description', value: 'Produkt testowy z uploadem miniatury.', type: 'text' },
            { key: 'tags', value: '["laptop","upload","demo"]', type: 'text' },
            { key: 'specs', value: '{"procesor":"AMD Ryzen 5","ram":"32 GB"}', type: 'text' },
            { key: 'thumbnail', value: '/images/products/lenovo-ideapad-5.jpg', type: 'text' },
          ],
          description:
            'Opcjonalnie zmien pole thumbnail na typ File i wybierz PNG/JPG (max 5 MB).',
        }),
        req('PUT Update product', 'PUT', '/api/products/{{productId}}', {
          body: {
            name: 'Laptop Lenovo IdeaPad 5 15 (edycja)',
            price: 3199,
            stock: 5,
            description: 'Zaktualizowany opis produktu Lenovo IdeaPad 5.',
            tags: ['laptop', 'office', 'promocja'],
            specs: { procesor: 'Intel Core i5-12450H', ram: '16 GB DDR4' },
            thumbnail: '/images/products/lenovo-ideapad-5.jpg',
          },
        }),
      ],
      true,
    ),

    group(
      '03 - Koszyk [Knex]',
      [
        req('GET Cart', 'GET', '/api/cart'),
        req('PUT Set quantity', 'PUT', '/api/cart/{{productId}}', {
          body: { quantity: 2 },
        }),
        req('DELETE Remove item', 'DELETE', '/api/cart/{{productId}}'),
        req('DELETE Clear cart', 'DELETE', '/api/cart'),
      ],
      true,
    ),

    group(
      '04 - Ulubione [Knex]',
      [
        req('GET Favorites', 'GET', '/api/favorites'),
        req('POST Add favorite', 'POST', '/api/favorites/SMART-001'),
        req('DELETE Remove favorite', 'DELETE', '/api/favorites/SMART-001'),
        req('DELETE Clear favorites', 'DELETE', '/api/favorites'),
      ],
      true,
    ),

    group(
      '05 - Zamowienia [Knex + pg native]',
      [
        req('POST Create order', 'POST', '/api/orders', {
          body: {
            items: [{ productId: '{{productId2}}', quantity: 1 }],
            destination: {
              name: 'Jan Kowalski',
              street: 'ul. Marszalkowska 10',
              city: 'Warszawa',
              zipCode: '00-001',
              phone: '+48 600 111 222',
              email: 'admin@example.com',
            },
            paymentMethod: 'karta',
            deliveryMethod: 'kurier',
            shipper: 'DHL',
          },
          tests: [
            'var j = pm.response.json();',
            'if (j.orderId) { pm.environment.set("orderId", j.orderId); }',
          ],
        }),
        req('GET My orders', 'GET', '/api/orders/me'),
        req('GET Order by ID', 'GET', '/api/orders/{{orderId}}'),
        req('GET Admin - all orders', 'GET', '/api/admin/orders'),
      ],
      true,
    ),

    group('06 - Dostawcy [Sequelize]', [
      req('GET List suppliers', 'GET', '/api/suppliers'),
      req('GET Supplier by ID', 'GET', '/api/suppliers/{{supplierId}}'),
      req('GET Supplier products', 'GET', '/api/suppliers/{{supplierId}}/products'),
      req('POST Create supplier', 'POST', '/api/suppliers', {
        body: {
          name: 'Nowy Dostawca Demo',
          email: 'kontakt@nowydostawca.pl',
          rating: 4.5,
          contactName: 'Adam Nowak',
          phone: '+48 500 600 700',
          address: 'ul. Fabryczna 1, 00-100 Warszawa',
          productIds: ['LAP-001', 'LAP-002'],
          leadDays: 5,
        },
      }),
    ]),

    group('07 - Promocje [Prisma]', [
      req('GET All promotions', 'GET', '/api/promotions'),
      req('GET Active promotions', 'GET', '/api/promotions/active', {
        query: [{ key: 'date', value: '2026-05-26T12:00:00.000Z', disabled: true }],
      }),
      req('POST Create promotion', 'POST', '/api/promotions', {
        body: {
          code: 'DEMO10',
          description: 'Promocja demo 10% na laptopy',
          percentOff: 10,
          startsAt: '2026-01-01T00:00:00.000Z',
          endsAt: '2026-12-31T23:59:59.000Z',
          productIds: ['LAP-001', 'LAP-002'],
        },
        tests: [
          'var j = pm.response.json();',
          'if (j.id) { pm.environment.set("promotionId", String(j.id)); }',
        ],
      }),
      req('GET Promotion by ID', 'GET', '/api/promotions/{{promotionId}}'),
      req('DELETE Promotion', 'DELETE', '/api/promotions/{{promotionId}}'),
    ]),

    group('08 - Recenzje native [MongoDB driver]', [
      req('GET Reviews (zapisz ID)', 'GET', '/api/reviews', {
        query: [{ key: 'productId', value: 'LAP-001' }],
        tests: [
          'var reviews = pm.response.json();',
          'if (Array.isArray(reviews) && reviews.length > 0) {',
          '  pm.environment.set("reviewId", reviews[0].id);',
          '  pm.environment.set("reviewerProfileId", reviews[0].reviewerProfileId);',
          '}',
        ],
      }),
      req('POST Create review', 'POST', '/api/reviews', {
        body: {
          productId: 'LAP-001',
          authorEmail: 'ewa.wojcik@example.com',
          reviewerProfileId: '{{reviewerProfileId}}',
          rating: 4,
          title: 'Dobra jakosc w tej cenie',
          body: 'Laptop spelnia oczekiwania do pracy biurowej i przegladania internetu.',
          tags: ['quality', 'value'],
        },
      }),
      req('PUT Update review', 'PUT', '/api/reviews/{{reviewId}}', {
        body: {
          title: 'Zaktualizowany tytul recenzji',
          body: 'Zaktualizowana tresc recenzji po edycji w Postmanie.',
          rating: 5,
          tags: ['quality', 'updated'],
        },
      }),
      req('DELETE Review', 'DELETE', '/api/reviews/{{reviewId}}'),
    ]),

    group('09 - Recenzje Mongoose [Mongoose]', [
      req('POST Create review (mongoose)', 'POST', '/api/reviews/mongoose', {
        body: {
          productId: 'SMART-001',
          authorEmail: 'jakub.kaminski@example.com',
          reviewerProfileId: '{{reviewerProfileId}}',
          rating: 5,
          title: 'Swietny smartfon',
          body: 'Samsung Galaxy S23 dziala plynnie i ma doskonaly aparat.',
          tags: ['smartphone', 'camera'],
        },
      }),
      req('GET Review detail (populate)', 'GET', '/api/reviews/{{reviewId}}/detail'),
    ]),

    group('10 - Analityka [Aggregation Pipeline]', [
      req('GET Product review stats', 'GET', '/api/analytics/products/{{productId}}/review-stats'),
    ]),
  ],
};

const environment = {
  id: ENVIRONMENT_ID,
  name: 'E-commerce Docker',
  values: [
    { key: 'baseUrl', value: 'http://localhost', type: 'default', enabled: true },
    { key: 'authToken', value: '', type: 'secret', enabled: true },
    { key: 'productId', value: 'LAP-001', type: 'default', enabled: true },
    { key: 'productId2', value: 'LAP-002', type: 'default', enabled: true },
    { key: 'supplierId', value: '1', type: 'default', enabled: true },
    { key: 'promotionId', value: '1', type: 'default', enabled: true },
    { key: 'orderId', value: '', type: 'default', enabled: true },
    { key: 'reviewId', value: '', type: 'default', enabled: true },
    { key: 'reviewerProfileId', value: '', type: 'default', enabled: true },
  ],
  _postman_variable_scope: 'environment',
  _postman_exported_at: new Date().toISOString(),
  _postman_exported_using: 'Postman/10',
};

function addIds(node) {
  if (Array.isArray(node)) {
    node.forEach(addIds);
    return;
  }
  if (node && typeof node === 'object') {
    if (node.name && (node.item || node.request)) {
      node.id = randomUUID();
    }
    if (node.item) addIds(node.item);
  }
}

addIds(collection.item);

const collectionPath = path.join(__dirname, 'e-commerce-api.postman_collection.json');
const environmentPath = path.join(__dirname, 'e-commerce-docker.postman_environment.json');

fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2), 'utf8');
fs.writeFileSync(environmentPath, JSON.stringify(environment, null, 2), 'utf8');

JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
console.log('Generated:', collectionPath);
