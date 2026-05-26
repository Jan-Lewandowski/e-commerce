'use client';

import Header from "@/components/Header";
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, Heart, ChevronRight } from "lucide-react";

export default function CartPage() {
  const { cart, setQuantity, removeFromCart, addOrRemoveFavorites, isFavorite, clearCart } = useApp();

  const amountOfProducts = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const correctLabel = amountOfProducts === 1 ? "produkt" : amountOfProducts >= 2 && amountOfProducts <= 4 ? "produkty" : "produktów";

  return (
    <>
      <Header />
      {cart.length <= 0 ? (
        <main className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ShoppingBasket className="h-9 w-9" /></div>
            <h1 className="text-2xl font-black text-slate-950">Koszyk jest pusty</h1>
            <p className="mt-2 text-sm text-slate-500">Dodaj produkty i wróć tutaj, gdy będziesz gotowy do zamówienia.</p>
            <Link href="/" className="mt-6 inline-block">
              <Button>Odwiedź stronę główną</Button>
            </Link>
          </div>
        </main>
      ) : (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Koszyk</p>
              <h1 className="text-3xl font-black text-slate-950">{`Koszyk (${amountOfProducts} ${correctLabel})`}</h1>
            </div>
            <Button variant="destructive" onClick={clearCart}><Trash2 className="h-5 w-5" /> Opróżnij koszyk</Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-3">
              {cart.map((item) => (
                <Link href={`/product/${item.product.id}`} key={item.product.id} className="block">
                  <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:grid-cols-[96px_1fr_auto] sm:items-center">
                    <Image src={item.product.thumbnail} alt={item.product.name} width={96} height={96} className="h-24 w-24 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 font-bold text-slate-950">{item.product.name}</h2>
                      <div className="mt-1 text-sm text-slate-500">{item.product.price} zł / szt.</div>
                      <div
                        className="mt-4 flex w-fit items-center rounded-xl border border-slate-200 bg-slate-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation()
                        }}
                      >
                        <Button variant="ghost" className="h-10 min-h-10 w-10 rounded-xl p-0" onClick={() => setQuantity(item.product, item.quantity + 1)}><Plus className="h-5 w-5" /></Button>
                        <div className="min-w-16 px-2 text-center text-sm font-bold">{item.quantity} szt.</div>
                        <Button variant="ghost" className="h-10 min-h-10 w-10 rounded-xl p-0" onClick={() => setQuantity(item.product, item.quantity - 1)}><Minus className="h-5 w-5" /></Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="text-xl font-black text-slate-950">{item.product.price * item.quantity} zł</div>
                      <div
                        className="flex gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation()
                        }}>
                        <Button variant="destructive" className="h-10 min-h-10 w-10 p-0" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-5 w-5" /></Button>
                        <Button variant="outline" className="h-10 min-h-10 w-10 p-0" onClick={() => addOrRemoveFavorites(item.product)}>
                          {isFavorite(item.product.id) ? <Heart className="h-5 w-5 fill-orange-500 text-orange-500" /> : <Heart className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-sm text-slate-500">
                <span>Do zapłaty</span>
                <span className="text-3xl font-black text-slate-950">{totalPrice} zł</span>
              </div>
              <Link href="/order" className="mt-5 block"><Button className="w-full">Przejdź do dostawy <ChevronRight className="h-5 w-5" /></Button></Link>
              <div className="mt-4 rounded-xl bg-orange-50 p-3 text-xs font-medium text-orange-700">Produkty w koszyku nie są rezerwowane.</div>
            </aside>
          </div>
        </main >
      )}
    </>
  );
}
