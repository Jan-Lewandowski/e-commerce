"use client";

import { useMemo, useState } from "react";
import { CompletedOrder } from "@/types/completedOrder";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button/Button";
import { ChevronLeft } from "lucide-react";

export default function DashboardPage() {
  const { getOrderHistory } = useApp()
  const orders = getOrderHistory();
  const [orderID, setOrderID] = useState<string>("");

  const hourlyData: { hour: string; count: number }[] = useMemo(() => {
    const hoursX = new Array(24).fill(0);
    orders.forEach((order) => {
      if (!order?.createdAt) return;
      const d = new Date(order.createdAt);
      const h = Number.isFinite(d.getHours()) ? d.getHours() : 0;
      hoursX[h] += 1;
    });
    return hoursX.map((count, hour) => ({
      hour: `${String(hour).padStart(1, "0")}:00`,
      count,
    }));
  }, [orders]);

  const matchedOrders = orderID ? orders.filter(order => order.orderId === orderID) : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Administracja</p>
          <h1 className="text-3xl font-black text-slate-950">Panel administratora</h1>
          <p className="mt-2 text-sm text-slate-500">Liczba zamówień według godzin</p>
        </div>
        <Link href="/"><Button variant="outline"><ChevronLeft className="h-5 w-5" />Powrót do sklepu</Button></Link>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {orders.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Brak zamówień</div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}`, "Zamówienia"]} />
                <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Wszystkie zamówienia</h2>
          {orders.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {orders.map((order: CompletedOrder, index: number) => (
                <li key={index} className="grid gap-1 rounded-xl bg-slate-50 p-4">
                  <span className="break-all font-semibold text-slate-950">ID: {order.orderId}</span>
                  <span className="text-sm text-slate-500">Data: {new Date(order.createdAt).toLocaleString()}</span>
                  <span className="text-sm text-slate-500">Łączna kwota: {order.totalAmount.toFixed(2)} zł</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Brak zamówień.</p>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <h2 className="text-xl font-black text-slate-950">Wyszukaj zamówienie</h2>
          <input
            className="mt-4 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            type="text"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            placeholder="Wprowadź ID zamówienia" />
          <div className="mt-4">
            {orderID && (
              matchedOrders.length > 0 ? (
                matchedOrders.map((order, index) => (
                  <div key={index} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    <h3 className="break-all font-bold text-slate-950">ID: {order.orderId}</h3>
                    <p className="mt-2">Data: {new Date(order.createdAt).toLocaleString()}</p>
                    <p>Łączna kwota: {order.totalAmount.toFixed(2)} zł</p>
                    <h4 className="mt-3 font-bold text-slate-950">Produkty</h4>
                    <ul className="mt-1 grid gap-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.name} - Ilość: {item.quantity} szt.</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Nie znaleziono zamówienia o podanym ID.</p>
              )
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
