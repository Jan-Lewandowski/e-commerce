'use client';

import { Product } from "@/types/product";
import ProductNode from "../ProductNode/ProductNode";

export default function RecommendedProducts({ products }: { products: Product[] }) {

  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:gap-5">
      {products.map((product) => (
        <div key={product.id}><ProductNode product={product} /></div>
      ))}
    </div>
  )
}
