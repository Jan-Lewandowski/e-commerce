'use client';

import { notFound, useParams } from "next/navigation";
import Header from "@/components/Header";
import ProductClient from "@/components/ProductClient";
import { useProduct, useRelatedProducts } from "@/lib/queries/catalog";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const productQuery = useProduct(id);
  const relatedQuery = useRelatedProducts(id, 5);

  if (productQuery.isError) {
    if (productQuery.error instanceof Error && productQuery.error.message.includes("HTTP 404")) {
      return notFound();
    }
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-10 text-sm text-red-600">
          Nie udało się załadować produktu.
        </main>
      </>
    );
  }

  if (productQuery.isLoading || !productQuery.data) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-10 text-sm text-slate-500">
          Ładowanie produktu...
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <ProductClient
        product={productQuery.data}
        correlatedProducts={relatedQuery.data ?? []}
      />
    </>
  );
}
