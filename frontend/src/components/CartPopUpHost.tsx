"use client";

import PopUp from "@/components/PopUp";
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPopUpHost() {
  const { cartPopUp, closeCartPopUp } = useApp();
  const isLimitPopUp = cartPopUp?.type === "limit";

  return (
    <PopUp
      open={Boolean(cartPopUp)}
      onClose={closeCartPopUp}
      content={
        <div className="grid gap-4">
          <div>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              {isLimitPopUp ? "Limit produktu" : "Produkt dodany"}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{cartPopUp?.message}</p>
            {cartPopUp?.type === "added" && cartPopUp.lowStockNotice && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
                Ostatnie sztuki!
              </div>
            )}
          </div>
          {cartPopUp?.type === "added" && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <Image
                src={cartPopUp.product.thumbnail}
                alt={cartPopUp.product.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {cartPopUp.product.name}
                </div>
                <div className="text-xs text-slate-500">Ilość: {cartPopUp.quantity}</div>
              </div>
              <div className="text-sm font-bold text-orange-600">
                {cartPopUp.product.price} zł
              </div>
            </div>
          )}
          {isLimitPopUp ? (
            <Button onClick={closeCartPopUp} className="w-full">
              Rozumiem
            </Button>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/cart" onClick={closeCartPopUp} className="w-full">
                <Button className="w-full">Przejdź do koszyka</Button>
              </Link>
              <Button variant="outline" onClick={closeCartPopUp} className="w-full">
                Wróć do zakupów
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
}
