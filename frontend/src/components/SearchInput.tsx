'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { useProducts } from "@/lib/queries/catalog"

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(handle);
  }, [query]);

  const productsQuery = useProducts(debouncedQuery ? { q: debouncedQuery } : {});

  const filteredProducts =
    debouncedQuery.length === 0
      ? []
      : (productsQuery.data ?? []).slice(0, 5);

  return (
    <div className="relative flex w-full items-center">
      <input
        type="text"
        placeholder="Czego szukasz?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />

      {query.trim() !== "" && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {productsQuery.isLoading ? (
            <div className="px-4 py-2.5 text-sm text-slate-500">Wyszukiwanie...</div>
          ) : filteredProducts.length > 0 ? (
            <ul className="m-0 w-full list-none py-2">
              {filteredProducts.map(product => (
                <li key={product.id}>
                  <Link href={`/product/${product.id}`} className="block overflow-hidden text-ellipsis whitespace-nowrap px-4 py-2.5 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-700">
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="hidden"></div>
          )}
        </div>
      )}
    </div>
  );
}
