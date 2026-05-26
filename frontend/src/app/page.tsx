'use client';

import FilterPanel from "@/components/FilterPanel";
import FiltersAsideForm from "@/components/FiltersAsideForm";
import Header from "@/components/Header";
import ProductsList from "@/components/ProductsList";
import WallHeader from "@/components/WallHeader";
import { useAuth } from "@/context/AuthContext";
import { useCategories, useProducts } from "@/lib/queries/catalog";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Home() {
  const { isLoggedIn, isUserLoading } = useAuth();
  const router = useRouter();

  const categoriesQuery = useCategories();
  const productsQuery = useProducts();

  useEffect(() => {
    if (isUserLoading) return;
    if (!isLoggedIn) {
      router.replace("/signup");
    }
  }, [isUserLoading, isLoggedIn, router]);

  if (isUserLoading) {
    return <div className="grid min-h-[60vh] place-items-center text-sm font-semibold text-slate-500">Sprawdzanie logowania...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data ?? [];

  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<div className="px-4 py-3 text-sm text-slate-500">Ładowanie filtrów...</div>}>
        <FilterPanel categories={categories} />
      </Suspense>
      <WallHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 pb-12 sm:px-6 lg:flex-row">
        <Suspense fallback={<div className="text-sm text-slate-500">Ładowanie produktów...</div>}>
          {productsQuery.isLoading ? (
            <div className="text-sm text-slate-500">Ładowanie produktów...</div>
          ) : productsQuery.isError ? (
            <div className="text-sm text-red-600">Nie udało się załadować produktów.</div>
          ) : (
            <ProductsList productsList={products} />
          )}
        </Suspense>
        <Suspense fallback={<div className="text-sm text-slate-500">Ładowanie filtrów...</div>}>
          <FiltersAsideForm />
        </Suspense>
      </main>
    </div>
  )
}
