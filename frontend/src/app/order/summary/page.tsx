'use client';
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import { OrderDetails } from "@/types/orderDetails";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const emptyOrderDetails: OrderDetails = {
  deliveryMethod: "",
  destination: { name: "", street: "", city: "", zipCode: "", phone: "", email: "" },
  paymentMethod: "",
  shipper: "",
};

export default function SummaryPage() {
  const { getOrderDetails, cart } = useApp();
  const orderDetails = getOrderDetails() || emptyOrderDetails;
  const router = useRouter();

  const { deliveryMethod, destination, paymentMethod, shipper } = orderDetails;
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleBuy = () => {
    router.push('/order/summary/payment');
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Podsumowanie</p>
          <h1 className="text-3xl font-black text-slate-950">Sprawdź zamówienie</h1>
        </div>
        <Link href="/order" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-700"><ChevronLeft className="h-5 w-5" />Powrót do zamówienia</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Dostawa</h2>
              <p className="mt-2 font-semibold text-slate-950">{deliveryMethod || "-"}</p>
              <p className="mt-1 text-sm text-slate-500">{shipper || "-"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Adres</h2>
              <div className="mt-2 grid gap-1 text-sm text-slate-600">
                <p className="font-semibold text-slate-950">{destination?.name || "-"}</p>
                <p>{destination?.street}</p>
                <p>{destination?.city}, {destination?.zipCode}</p>
                <p>{destination?.phone}</p>
                <p>{destination?.email}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Płatność</h2>
              <p className="mt-2 font-semibold text-slate-950">{paymentMethod || "-"}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-950">Produkty</h2>
            <div className="grid gap-3">
              {cart.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 p-3 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                  <Image src={item.product.thumbnail} alt={item.product.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <div className="font-semibold text-slate-950">{item.product.name}</div>
                    <div className="text-sm text-slate-500">x{item.quantity}</div>
                  </div>
                  <div className="font-black text-orange-600">{item.product.price * item.quantity} zł</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Do zapłaty</span>
            <span className="text-3xl font-black text-slate-950">{totalPrice} zł</span>
          </div>

          <Button className="mt-5 w-full" onClick={handleBuy}>Kupuję i płacę</Button>
        </aside>
      </div>
    </main>
  )
}
