'use client';

import data from "../data.json";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import FiltersAsideForm from "@/components/FiltersAsideForm/FiltersAsideForm";
import Header from "@/components/Header/Header";
import ProductsList from "@/components/ProductsList/ProductsList";
import WallHeader from "@/components/WallHeader/WallHeader";
import { useAuth } from "@/context/AuthContext";
import { ProductsCatalog } from '@/types/productsCatalog';
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Home() {
  const { categories, products } = data as ProductsCatalog;

  const { isLoggedIn, isUserLoading } = useAuth();
  const router = useRouter();
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

  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<div className="px-4 py-3 text-sm text-slate-500">Ładowanie filtrów...</div>}>
        <FilterPanel categories={categories} />
      </Suspense>
      <WallHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 pb-12 sm:px-6 lg:flex-row">
        <Suspense fallback={<div className="text-sm text-slate-500">Ładowanie produktów...</div>}>
          <ProductsList productsList={products} />
        </Suspense>
        <Suspense fallback={<div className="text-sm text-slate-500">Ładowanie filtrów...</div>}>
          <FiltersAsideForm />
        </Suspense>
      </main>
    </div>
  )
}
