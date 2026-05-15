

import data from "../../../data.json";
import { notFound } from "next/navigation";
import { ProductsCatalog } from '@/types/productsCatalog';
import Header from "@/components/Header/Header";
import ProductClient from "@/components/ProductClient/ProductClient";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { products } = data as ProductsCatalog;

  const product = products.find((prod) => prod.id === id);


  if (!product) {
    return notFound();
  }

  const correlatedProducts = products.filter((prod) => product.tags.some(tag => prod.tags.includes(tag) && prod.id !== product.id)).slice(0, 5);

  return (
    <>
      <Header />
      <ProductClient product={product} correlatedProducts={correlatedProducts} />
    </>
  );
}