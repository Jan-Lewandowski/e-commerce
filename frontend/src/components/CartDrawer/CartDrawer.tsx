'use client'

import { useApp } from "@/context/AppContext";
import Button from "../ui/Button/Button";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, clearCart, isCartOpen, toggleCart } = useApp()

  if (!isCartOpen) return null;

  return (
    <div className="pointer-events-auto absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:w-96">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-lg font-bold">Twój koszyk</h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={clearCart} className="h-9 min-h-9 w-9 p-0 text-slate-500">
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" onClick={toggleCart} className="h-9 min-h-9 w-9 p-0 text-slate-500">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {cart.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">Koszyk jest pusty</p>
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0">
            {cart.map((item, index) => (
              <li key={index} className="flex items-center gap-3 py-3">
                <Image src={item.product.thumbnail} alt={item.product.name} width={54} height={54} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">{item.product.name}</div>
                  <div className="text-xs text-slate-500">{item.quantity} szt.</div>
                </div>
                <div className="text-sm font-bold text-orange-600">
                  {item.product.price * item.quantity} zł
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/cart" className="block border-t border-slate-200 p-4">
        <Button className="w-full" onClick={toggleCart}>Przejdź do koszyka</Button>
      </Link>
    </div>
  )
}
