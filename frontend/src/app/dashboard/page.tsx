"use client";

import { useMemo, useState } from "react";
import { CompletedOrder } from "@/types/completedOrder";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";

import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminOrders } from "@/lib/queries/orders";

function formatMoney(value: number | string) {
  return `${Number(value).toFixed(2)} zł`;
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === "") return "Brak danych";
  return String(value);
}

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const ordersQuery = useAdminOrders(isLoggedIn && user?.role === "admin");
  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
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

  const normalizedOrderId = orderID.trim();
  const matchedOrder = normalizedOrderId
    ? orders.find((order) => order.orderId === normalizedOrderId)
    : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Administracja</p>
          <h1 className="text-3xl font-black text-slate-950">Panel administratora</h1>
          <p className="mt-2 text-sm text-slate-500">Liczba zamówień według godzin</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/products">
            <Button>Zarzadzaj produktami</Button>
          </Link>
          <Link href="/">
            <Button variant="outline"><ChevronLeft className="h-5 w-5" />{" "}Powrot do sklepu</Button>
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {ordersQuery.isLoading ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Ładowanie zamówień...</div>
        ) : ordersQuery.isError ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">Nie udało się załadować zamówień.</div>
        ) : orders.length === 0 ? (
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
                  <span className="text-sm text-slate-500">Łączna kwota: {Number(order.totalAmount).toFixed(2)} zł</span>
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
            {ordersQuery.isLoading ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Ładowanie zamówień...</p>
            ) : ordersQuery.isError ? (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">Nie udało się załadować zamówień.</p>
            ) : !normalizedOrderId ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Wpisz ID zamówienia, aby zobaczyć pełne szczegóły.</p>
            ) : matchedOrder ? (
              <OrderDetailsPanel order={matchedOrder} />
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Nie znaleziono zamówienia o podanym ID.</p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function OrderDetailsPanel({ order }: { order: CompletedOrder }) {
  const destination = order.destination ?? {
    name: "",
    street: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  };

  return (
    <div className="grid gap-4 text-sm text-slate-600">
      <div className="rounded-xl bg-slate-50 p-4">
        <h3 className="break-all font-bold text-slate-950">ID: {order.orderId}</h3>
        <div className="mt-3 grid gap-2">
          <DetailRow label="Status" value={order.status} />
          <DetailRow label="Email klienta" value={order.email} />
          <DetailRow label="Data utworzenia" value={new Date(order.createdAt).toLocaleString()} />
          <DetailRow label="Kwota całkowita" value={formatMoney(order.totalAmount)} strong />
        </div>
      </div>

      <DetailSection title="Płatność i dostawa">
        <DetailRow label="Metoda płatności" value={order.paymentMethod} />
        <DetailRow label="Metoda dostawy" value={order.deliveryMethod} />
        <DetailRow label="Przewoźnik" value={order.shipper} />
      </DetailSection>

      <DetailSection title="Dane odbiorcy">
        <DetailRow label="Imię i nazwisko" value={destination.name} />
        <DetailRow label="Ulica" value={destination.street} />
        <DetailRow label="Miasto" value={destination.city} />
        <DetailRow label="Kod pocztowy" value={destination.zipCode} />
        <DetailRow label="Telefon" value={destination.phone} />
        <DetailRow label="Email" value={destination.email} />
      </DetailSection>

      <DetailSection title="Produkty">
        {order.items.length > 0 ? (
          <ul className="grid gap-3">
            {order.items.map((item) => (
              <li key={`${order.orderId}-${item.productId}`} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="font-bold text-slate-950">{item.name}</div>
                <div className="mt-1 break-all text-xs text-slate-500">ID produktu: {item.productId}</div>
                <div className="mt-3 grid gap-1">
                  <DetailRow label="Ilość" value={`${item.quantity} szt.`} />
                  <DetailRow label="Cena jednostkowa" value={formatMoney(item.unitPrice)} />
                  <DetailRow label="Waluta" value={item.currency} />
                  <DetailRow label="Suma pozycji" value={formatMoney(item.lineTotal)} strong />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Brak produktów w zamówieniu.</p>
        )}
      </DetailSection>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-slate-50 p-4">
      <h3 className="font-bold text-slate-950">{title}</h3>
      <div className="mt-3 grid gap-2">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: unknown;
  strong?: boolean;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{label}</div>
      <div className={`break-words ${strong ? "font-black text-orange-600" : "font-semibold text-slate-700"}`}>
        {formatValue(value)}
      </div>
    </div>
  );
}
