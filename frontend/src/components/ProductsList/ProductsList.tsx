'use client'

import ProductNode from "../ProductNode/ProductNode"
import RecommendedProducts from "../RecommendedProducts/RecommendedProducts";
import { Product } from "@/types/product"
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import "@/components/ProductsList/products-list.scss";

export default function ProductsList({ productsList }: { productsList: Product[] }) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const [localQuery, setLocalQuery] = useState("");

  const filteredProducts = productsList.filter(product => {

    const matchesCategory = category ? product.category === category : true

    const matchesFilter = (
      (searchParams.get('priceFrom') ? product.price >= Number(searchParams.get('priceFrom')) : true) &&
      (searchParams.get('priceTo') ? product.price <= Number(searchParams.get('priceTo')) : true) &&
      (searchParams.get('producer') ? product.brand.toLowerCase().includes((searchParams.get('producer') ?? '').toLowerCase()) : true) &&
      (searchParams.get('ratingFrom') ? product.rating >= Number(searchParams.get('ratingFrom')) : true) &&
      (searchParams.get('ratingTo') ? product.rating <= Number(searchParams.get('ratingTo')) : true)
    )


    return matchesCategory && matchesFilter;
  }).filter(product =>
    product.name.toLowerCase().includes(localQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(localQuery.toLowerCase())
  );



  const locallyFiltered = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(localQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(localQuery.toLowerCase())
  );

  const isCategorized = !!(
    searchParams.get('priceFrom') ||
    searchParams.get('priceTo') ||
    searchParams.get('producer') ||
    searchParams.get('ratingFrom') ||
    searchParams.get('ratingTo') ||
    searchParams.get('category')
  );


  const recommendedProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(localQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(localQuery.toLowerCase())
  ).sort((a, b) => b.stock - a.stock).slice(0, 10);

  return (
    <div className="input-and-list-section">
      <input
        type="text"
        className="filtered-products-search"
        placeholder="Wyszukaj produkt"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
      <div className="products-list">
        {isCategorized ? locallyFiltered.map((product, index) => (
          <div key={index}><ProductNode product={product} /></div>
        )) : <RecommendedProducts products={recommendedProducts} />}
      </div>
    </div>

  );
}