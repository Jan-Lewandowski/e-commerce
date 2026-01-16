'use client'

import "@/components/CartDrawer/cart-drawer.scss";
import { useApp } from "@/context/AppContext";
import Button from "../ui/Button/Button";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, clearCart, isCartOpen, toggleCart } = useApp()

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer">
      <div className="cart-header">
        <h2>Twój koszyk</h2>

        <Button onClick={clearCart}><Trash2 /></Button>
        <Button onClick={toggleCart} variant="destructive"><X /></Button>
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <p>Koszyk jest pusty</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <div className="cart-content">
                  <Image src={item.product.thumbnail} alt={item.product.name} width={50} height={50} className="product-image" />
                  <div className="cart-text">
                    <div className="cart-item">
                      <span>{item.product.name}</span>
                    </div>
                    <div>
                      <span className="item-quantity">{item.quantity} szt.</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link href="/cart">
        <Button variant="outline" className="go-to-cart-button" onClick={toggleCart}>Przejdź do koszyka</Button>
      </Link>
    </div>
  )
}