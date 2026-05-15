'use client';

import { useApp } from '@/context/AppContext';

export default function WallHeader() {
  const { title } = useApp();

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Katalog</p>
        <h1 className="truncate text-2xl font-bold text-slate-950 sm:text-3xl">{title || "Polecane produkty"}</h1>
      </div>
    </div>
  );
}
