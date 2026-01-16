'use client';

import "@/components/RecommendedProducts/recommended-products.scss";
import { Product } from "@/types/product";
import ProductNode from "../ProductNode/ProductNode";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function RecommendedProducts({ products }: { products: Product[] }) {

  return (
    <div className="recommended-products">
      {products.map((product) => (
        <div key={product.id}><ProductNode product={product} /></div>
      ))}
    </div>
  )
}