"use client";

import Button from "@/components/ui/Button/Button";
import ProductNode from "@/components/ProductNode";
import { useSupplier, useSupplierProducts } from "@/lib/queries/suppliers";
import { Building2, Mail, MapPin, Phone, Star, User } from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function SupplierProfile({ supplierId }: { supplierId: string }) {
  const supplierQuery = useSupplier(supplierId);
  const productsQuery = useSupplierProducts(supplierId);

  if (supplierQuery.isLoading || productsQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-6">
        Ładowanie dostawcy...
      </main>
    );
  }

  if (supplierQuery.isError || productsQuery.isError || !supplierQuery.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm text-red-600 shadow-sm">
          Nie udało się załadować profilu dostawcy.
          <div className="mt-4">
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              Spróbuj ponownie
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const supplier = supplierQuery.data;
  const products = productsQuery.data ?? [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/" className="text-sm font-semibold text-slate-600 transition hover:text-orange-600">
        Wróć do katalogu
      </Link>

      <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(260px,360px)_1fr] lg:p-8">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
              <Building2 className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-orange-700">Profil dostawcy</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{supplier.name}</h1>
            {supplier.rating !== undefined && (
              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {supplier.rating}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SupplierInfo icon={<Mail className="h-5 w-5" />} label="Email" value={supplier.email} />
            {supplier.phone && <SupplierInfo icon={<Phone className="h-5 w-5" />} label="Telefon" value={supplier.phone} />}
            {supplier.contactName && <SupplierInfo icon={<User className="h-5 w-5" />} label="Kontakt" value={supplier.contactName} />}
            {supplier.address && <SupplierInfo icon={<MapPin className="h-5 w-5" />} label="Adres" value={supplier.address} />}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Asortyment</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Produkty od tego dostawcy</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">{products.length} produktów</p>
        </div>

        {products.length > 0 ? (
          <div className="mt-4 grid w-full grid-cols-1 gap-4 xl:gap-5">
            {products.map((product) => (
              <ProductNode key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-sm text-slate-500">
            Ten dostawca nie ma jeszcze przypisanych produktów.
          </div>
        )}
      </section>
    </main>
  );
}

function SupplierInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-orange-600">{icon}</div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</div>
          <div className="mt-1 break-words text-sm font-semibold text-slate-950">{value}</div>
        </div>
      </div>
    </div>
  );
}
