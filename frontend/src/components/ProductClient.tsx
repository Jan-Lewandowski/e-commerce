'use client';

import Button from "@/components/ui/Button/Button";
import ProductAvailabilityBadge from "@/components/ProductAvailabilityBadge";
import SuppliedBySection from "@/components/SuppliedBySection";
import { useApp } from '@/context/AppContext';
import { Product } from "@/types/product";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductClient({ product, correlatedProducts }: { product: Product, correlatedProducts?: Product[] }) {
  const { addToCart, addOrRemoveFavorites } = useApp();
  const [quantity, setQuantity] = useState(1);

  const { favorites } = useApp();
  const isFavorite = favorites.some((fav) => fav.id === product.id);
  const isUnavailable = product.stock <= 0;
  const maxSelectableQuantity = Math.min(Math.max(product.stock, 0), 3);
  const selectedQuantity = isUnavailable ? 0 : Math.min(quantity, maxSelectableQuantity);

  const specsList: { key: string; value: string | number | boolean }[] = [];
  if (product.specs) {
    for (const key in product.specs) {
      const value = product.specs[key];
      if (value === undefined) continue;
      specsList.push({ key, value });
    }
  }

  const handleAddToCart = () => {
    if (isUnavailable || selectedQuantity <= 0) return;
    addToCart(product, selectedQuantity);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(320px,520px)_1fr] lg:p-8">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
            <Image src={product.thumbnail} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" priority />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-orange-700">{product.category}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">od: {product.brand}</p>
              </div>
              <Button variant="outline" onClick={() => addOrRemoveFavorites(product)} className="h-11 w-11 shrink-0 rounded-xl p-0">
                {isFavorite ? <Heart className="h-6 w-6 fill-orange-500 text-orange-500" /> : <Heart className="h-6 w-6" />}
              </Button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
              {specsList.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Specyfikacja</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {specsList.map(({ key, value }) => (
                      <div className="rounded-xl bg-white p-3 text-sm" key={key}>
                        <div className="font-semibold text-slate-950">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                        <div className="mt-1 text-slate-500">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                <div className="text-4xl font-black tracking-tight text-slate-950">{product.price} zł</div>
                <div className="mt-4 flex gap-3">
                  <select
                    className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    value={isUnavailable ? 0 : selectedQuantity}
                    onChange={(e) =>
                      setQuantity(Math.min(maxSelectableQuantity, Math.max(1, Number(e.target.value))))
                    }
                    disabled={isUnavailable}
                  >
                    {isUnavailable && <option value={0}>0</option>}
                    {[...Array(maxSelectableQuantity)].map((_, i) => {
                      const value = i + 1;
                      return <option key={value} value={value}>{value}</option>;
                    })}
                  </select>
                  <Button className="flex-1" onClick={handleAddToCart} disabled={isUnavailable}>Dodaj do koszyka</Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <ProductAvailabilityBadge stock={product.stock} />
                  <span>{isUnavailable ? "Produkt chwilowo niedostępny." : ``}</span>
                </div>
                <SuppliedBySection supplier={product.supplier} />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-950">Opis</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-950">Podobne produkty</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {correlatedProducts && correlatedProducts.length > 0 ? (
            correlatedProducts.map((correlatedProduct) => (
              <Link key={correlatedProduct.id} href={`/product/${correlatedProduct.id}`} className="w-52 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <Image src={correlatedProduct.thumbnail} alt={correlatedProduct.name} width={208} height={160} className="h-40 w-full object-cover" />
                <div className="p-3">
                  <div className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-900">{correlatedProduct.name}</div>
                  <div className="mt-2 font-black text-orange-600">{correlatedProduct.price} zł</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">Brak podobnych produktów.</div>
          )}
        </div>
      </section>
    </main>
  )
}
