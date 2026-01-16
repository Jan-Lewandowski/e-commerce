'use client';

import data from "../data.json";
import "../styles/home.scss";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import FavoritesDrawer from "@/components/FavoritesDrawer/FavoritesDrawer";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import FiltersAsideForm from "@/components/FiltersAsideForm/FiltersAsideForm";
import Header from "@/components/Header/Header";
import ProductsList from "@/components/ProductsList/ProductsList";
import WallHeader from "@/components/WallHeader/WallHeader";
import { ProductsCatalog } from '@/types/productsCatalog';
import { Suspense } from "react";

export default function Home() {
  const { categories, products } = data as ProductsCatalog;

  return (
    <AuthGuard>
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
    </AuthGuard>
  )

}
