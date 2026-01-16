"use client";

import { useEffect, useMemo, useState } from "react";
import { CompletedOrder } from "@/types/completedOrder";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";

import "@/styles/dashboard.scss";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

export default function DashboardPage() {
  const { getOrderHistory } = useApp()
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [orderID, setOrderID] = useState<string>("");

  useEffect(() => {
    setOrders(getOrderHistory());
  }, [getOrderHistory]);

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

  return (
    <div className="dashboard-page">
      <Link href="/"><Image src="/images/shop-icon.png" alt="BackToHome" width={100} height={100} className="back-to-home-icon" /></Link>
      <h1 className="dashboard-title">Panel administratora</h1>
      <p className="dashboard-subtitle">
        Liczba zamówień według godzin
      </p>
      <div className="dashboard-card">
        {orders.length === 0 ? (
          <div className="dashboard-empty">Brak zamówień</div>
        ) : (
          <div className="dashboard-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="grey" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}`, "Zamówienia"]} />
                <Bar dataKey="count" fill="blue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="all-orders">
        {orders.length > 0 ? (
          <>
            <h2>Wszystkie zamówienia</h2>
            <ul>
              {orders.map((order: CompletedOrder, index: number) => (
                <li key={index} className="order-item">
                  <span className="order-id">ID: {order.orderId}</span>
                  <span className="order-date">Data: {new Date(order.createdAt).toLocaleString()}</span>
                  <span className="order-total">Łączna kwota: {order.totalAmount.toFixed(2)} zł</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div></div>
        )}
      </div>
      <div className="search-order">
        <h2>Wyszukaj zamówienie</h2>
        <input
          type="text"
          value={orderID}
          onChange={(e) => setOrderID(e.target.value)}
          placeholder="Wprowadź ID zamówienia" />
        <div className="search-result">
          {orderID && (
            <>
              {orders.filter(order => order.orderId === orderID).length > 0 ? (
                orders.filter(order => order.orderId === orderID).map((order, index) => (
                  <div key={index}>
                    <h3>Szczegóły zamówienia ID: {order.orderId}</h3>
                    <p>Data zamówienia: {new Date(order.createdAt).toLocaleString()}</p>
                    <p>Łączna kwota: {order.totalAmount.toFixed(2)} zł</p>
                    <h4>Produkty:</h4>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} - Ilość: {item.quantity} szt. - Cena jednostkowa: {item.unitPrice.toFixed(2)} zł
                        </li>
                      ))}
                    </ul>
                    <h3>Adres dostawy:</h3>
                    <p>Ulica: {order.destination.street}</p>
                    <p>Miasto: {order.destination.city}</p>
                    <p>Kod pocztowy: {order.destination.zipCode}</p>
                    <h3>Dane osobowe:</h3>
                    <p>Imię i nazwisko: {order.destination.name}</p>
                    <p>Telefon: {order.destination.phone}</p>
                    <p>Email: {order.destination.email}</p>
                  </div>
                ))
              ) : (
                <p>Nie znaleziono zamówienia o podanym ID.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

