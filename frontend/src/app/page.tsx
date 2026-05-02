'use client';

import data from "../data.json";
import "../styles/home.scss";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import FavoritesDrawer from "@/components/FavoritesDrawer/FavoritesDrawer";
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
    return <div>Sprawdzanie logowania...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div>
        <Header />
        <CartDrawer />
        <FavoritesDrawer />
        <Suspense fallback={<div>Ładowanie filtrów</div>}>
          <FilterPanel categories={categories} />
        </Suspense>
        <WallHeader />
        <div className="products-section">
          <Suspense fallback={<div>Ładowanie filtrów</div>}>
            <FiltersAsideForm />
          </Suspense>
          <Suspense fallback={<div>Ładowanie produktów...</div>}>
            <ProductsList productsList={products} />
          </Suspense>
        </div>
      </div>
    </>
  )

}
