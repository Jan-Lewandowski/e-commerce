'use client'

import "@/components/SearchInput/search-input.scss"
import { Product } from "@/types/product"
import Link from "next/link"
import { useState } from "react"
import productsData from "../../data.json"


export default function SearchInput() {
  const [query, setQuery] = useState("")
  const { products } = productsData as { products: Product[] }

  const filteredProducts =
    query.trim().length === 0
      ? []
      : products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Czego szukasz?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() !== "" && (
        <div className="search-results">
          {filteredProducts.length > 0 ? (
            <ul>
              {filteredProducts.map(product => (
                <li key={product.id}>
                  <Link href={`/product/${product.id}`}><h3 className="product-name">{product.name}</h3></Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="not-found"></div>
          )}
        </div>
      )}
    </div>
  );
}
