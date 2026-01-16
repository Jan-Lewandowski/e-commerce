'use client'

import "@/components/ProductNode/product-node.scss";
import { Product } from "@/types/product";
import { useApp } from "@/context/AppContext";
import { Heart, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";
import Button from "../ui/Button/Button";

export default function ProductNode({ product }: { product: Product }) {

  const { addToCart, addOrRemoveFavorites } = useApp()
  const { favorites } = useApp();

  const isFavorite = favorites.some((fav) => fav.id === product.id);

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
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addOrRemoveFavorites(product);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-card">
        {product.thumbnail && (
          <div className="product-image">
            <Image
              src={product.thumbnail}
              alt={product.name}
              width={200}
              height={200}
              loading="lazy"
            />
          </div>
        )}

        <div className="description">
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="rating">{product.rating}</p>
            {specsList.length > 0 && (
              <div className="specs">
                {specsList.map(({ key, value }) => (
                  <span className="spec-chip" key={key}>
                    <span className="spec-key">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="product-actions">
            <Button onClick={(e) => handleAddToCart(e)} className="add-to-cart-button"><ShoppingBasket /></Button>
            <Button onClick={(e) => handleToggleFavorite(e)} className="favorite">{isFavorite ? <Heart fill="orange" /> : <Heart />}</Button>
          </div>

        </div>
        <p className="price">{product.price} zł</p>

      </div>
    </Link>
  );
}
