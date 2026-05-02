'use client';

import Button from "@/components/ui/Button/Button";
import { useApp } from '@/context/AppContext';
import { Product } from "@/types/product";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./product-client.scss";

export default function ProductClient({ product, correlatedProducts }: { product: Product, correlatedProducts?: Product[] }) {
  const { addToCart, addOrRemoveFavorites } = useApp();
  const [quantity, setQuantity] = useState(1);

  const { favorites } = useApp();
  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const specsList: { key: string; value: string | number | boolean }[] = [];
  if (product.specs) {
    for (const key in product.specs) {
      const value = product.specs[key];
      if (value === undefined) continue;
      specsList.push({ key, value });
    }
  }

  return (
    <div className="product-node-container">
      <div className="product-topbar">
        <div className="product-topic">{product.category}</div>
        <Button onClick={() => addOrRemoveFavorites(product)} className="favorite">{isFavorite ? <Heart fill="orange" /> : <Heart />}</Button>
      </div>
      <div className="p-product-layout">

        <Image src={product.thumbnail} alt={product.name} width={600} height={600} />
        <div className="product-details">
          <div className="product-description-header">
            <div className="product-title">{product.name}</div>
            <div className="product-rating">⭐ {product.rating}</div>
            <div className="product-producer">od: {product.brand}</div>
          </div>

          <div>
            <div className="product-description-price-container">
              {specsList.length > 0 && (
                <div className="product-specs">
                  {specsList.map(({ key, value }) => (
                    <div className="product-spec" key={key}>
                      <span className="product-spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      <span className="product-spec-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="product-purchase">

                <div className="product-price">{product.price} zł</div>
                <div className="product-add-cart">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))}
                  >
                    {[...Array(10)].map((_, i) => {
                      const value = i + 1;
                      return <option key={value} value={value}>{value}</option>;
                    })}
                  </select>
                  <Button onClick={() => addToCart(product, quantity)}>Dodaj do koszyka</Button>
                </div>
                <div className="stock">{`Pozostało ${product.stock} szt.`}</div>
              </div>
            </div>
            <div className="product-description">
              <h3>Opis</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>



      <div className="correlated-products">

        <div className="product-topic"> podobne produkty</div>
        <div className="correlated-products-list">
          {
            correlatedProducts && correlatedProducts.length > 0 ? (
              correlatedProducts.map((correlatedProduct) => (
                <div key={correlatedProduct.id}>
                  <Link href={`/product/${correlatedProduct.id}`}>
                    <div className="correlated-product-card">

                      <Image src={correlatedProduct.thumbnail} alt={correlatedProduct.name} width={200} height={200} />
                      <div>{correlatedProduct.name}</div>
                      <div className="correlated-product-price">{correlatedProduct.price} zł</div>
                    </div>
                  </Link>

                </div>

              ))
            ) : (
              <div className="blank-div"></div>
            )
          }
        </div>







      </div>
    </div>
  )
}