'use client'

import { Product } from "@/types/product";
import { useApp } from "@/context/AppContext";
import { Heart, ShoppingBasket, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";
import Button from "./ui/Button/Button";
import ProductAvailabilityBadge from "./ProductAvailabilityBadge";

export default function ProductNode({ product }: { product: Product }) {

  const { addToCart, addOrRemoveFavorites } = useApp()
  const { favorites } = useApp();

  const isFavorite = favorites.some((fav) => fav.id === product.id);
  const isUnavailable = product.stock <= 0;

  const specsList: { key: string; value: string | number | boolean }[] = [];
  if (product.specs) {
    for (const key in product.specs) {
      const value = product.specs[key];
      if (value === undefined) continue;
      specsList.push({ key, value });
      if (specsList.length >= 4) break;
    }
  }

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUnavailable) return;
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addOrRemoveFavorites(product);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg sm:grid-cols-[180px_1fr_auto] sm:p-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 sm:h-[180px] sm:w-[180px]">
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-orange-700">{product.category}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
            <ProductAvailabilityBadge stock={product.stock} />
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-slate-950">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{product.brand}</p>

          {specsList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {specsList.map(({ key, value }) => (
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600" key={key}>
                  <span className="font-semibold text-slate-900">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:min-w-[170px] sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <p className="m-0 whitespace-nowrap text-2xl font-black text-slate-950">{product.price} zł</p>
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              className="h-11 w-11 p-0"
              aria-label={isUnavailable ? "Produkt niedostępny" : "Dodaj do koszyka"}
              disabled={isUnavailable}
            >
              <ShoppingBasket className="h-6 w-6" />
            </Button>
            <Button variant="outline" onClick={handleToggleFavorite} className="h-11 w-11 p-0" aria-label="Dodaj do ulubionych">
              {isFavorite ? <Heart className="h-6 w-6 fill-orange-500 text-orange-500" /> : <Heart className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
