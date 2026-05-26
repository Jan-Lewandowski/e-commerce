"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import AdminProductCreateForm from "@/components/AdminProductCreateForm";
import AdminProductEditForm from "@/components/AdminProductEditForm";
import { useAuth } from "@/context/AuthContext";
import { useProduct, useProducts } from "@/lib/queries/catalog";

export default function AdminProductsPage() {
  const { isLoggedIn, isUserLoading, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const productsQuery = useProducts();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"edit" | "create">("edit");

  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.name, product.brand, product.category, product.description]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, search]);

  const selectedProductId = useMemo(() => {
    if (mode === "create") return null;
    if (selectedId && products.some((product) => product.id === selectedId)) {
      return selectedId;
    }
    return products[0]?.id ?? null;
  }, [mode, products, selectedId]);

  const selectedProductQuery = useProduct(selectedProductId);
  const selectedProduct = selectedProductQuery.data ?? null;

  if (isUserLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
          Ladowanie danych uzytkownika...
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Musisz byc zalogowany, aby edytowac produkty.
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Brak dostepu do panelu administratora.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
            Administracja
          </p>
          <h1 className="text-3xl font-black text-slate-950">Zarzadzanie produktami</h1>
          <p className="mt-2 text-sm text-slate-500">
            Wybierz produkt, edytuj dane lub dodaj nowy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setMode("create");
              setSelectedId(null);
            }}
          >
            Dodaj produkt
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">
              <ChevronLeft className="h-5 w-5" />{" "}Powrot do panelu
            </Button>
          </Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3">
            <input
              type="text"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              placeholder="Wyszukaj produkt"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {productsQuery.isLoading ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Ladowanie produktow...
            </div>
          ) : productsQuery.isError ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              Nie udalo sie zaladowac produktow.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Brak produktow spelniajacych kryteria.
            </div>
          ) : (
            <ul className="grid gap-3">
              {filteredProducts.map((product) => {
                const isActive = product.id === selectedProductId;
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(product.id);
                        setMode("edit");
                      }}
                      className={`flex w-full flex-col gap-1 rounded-xl border p-4 text-left transition ${
                        isActive
                          ? "border-orange-300 bg-orange-50"
                          : "border-slate-200 bg-white hover:border-orange-200"
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-950">
                        {product.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {product.brand} · {product.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Cena: {product.price} zl · Stan: {product.stock}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {selectedProductQuery.isLoading ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Ladowanie danych produktu...
            </div>
          ) : selectedProductQuery.isError ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              Nie udalo sie zaladowac produktu.
            </div>
          ) : mode === "create" ? (
            <AdminProductCreateForm
              onCreated={(product) => {
                setSelectedId(product.id);
                setMode("edit");
              }}
            />
          ) : selectedProduct ? (
            <AdminProductEditForm product={selectedProduct} />
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Wybierz produkt z listy, aby rozpoczec edycje.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
