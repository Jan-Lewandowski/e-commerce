'use client';

import CartDrawer from "@/components/CartDrawer/CartDrawer";
import FavoritesDrawer from "@/components/FavoritesDrawer/FavoritesDrawer";
import Header from "@/components/Header/Header";
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import "@/styles/cart.scss";
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
      <FavoritesDrawer />
      <Header />
      {cart.length <= 0 ? (
        <div className="empty-cart">
          <div className="shopping-cart-icon"><ShoppingBasket /></div>
          <div>Koszyk jest pusty</div>
          <Link href="/">
            <Button className="go-shopping-button">Odwiedź stronę główną</Button>
          </Link>
        </div>

      ) : (
        <div className="main-cart-section">


          <div className="cart-section">
            <div className="cart-with-title">
              <div className="cart-titles">
                <div className="cart-title">{`Koszyk (${amountOfProducts} ${correctLabel})`}</div>
                <Button className="clear-cart-button" variant="destructive" onClick={() => {
                  clearCart();
                }}><Trash2 /> Opróżnij koszyk</Button>
              </div>



              {cart.map((item, index) => (
                <Link href={`/product/${item.product.id}`} key={index} className="product-node-link">
                  <div className="product-info-node">
                    <Image src={item.product.thumbnail} alt={item.product.name} width={100} height={100} className="product-image-cart" />
                    <div className="product-name">{item.product.name}</div>
                    <div className="p-price">{item.product.price} zł</div>
                    <div
                      className="product-change-quantity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                      }}
                    >
                      <Button className="add-one" onClick={() => setQuantity(item.product, item.quantity + 1)}><Plus /></Button>
                      <div className="quantity-number">{item.quantity} szt.</div>
                      <Button className="remove-one" onClick={() => setQuantity(item.product, item.quantity - 1)}><Minus /></Button>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                      }}>
                      <div className="delete-and-favorite">
                        <Button onClick={() => removeFromCart(index)} variant="destructive"><Trash2 /></Button>
                        <Button onClick={() => addOrRemoveFavorites(item.product)}>{isFavorite(item.product.id) ? <Heart fill="orange" /> : <Heart />}</Button>

                      </div>

                    </div>
                  </div>
                </Link>
              ))}


            </div>

            <div className="finalization-window">
              <div className="total-price-section">
                <div>Do zapłaty</div>
                <div className="total-price-number">{totalPrice} zł</div>
              </div>
              <Link href="/order"><Button className="finalize-button">Przejdź do dostawy <ChevronRight /></Button></Link>
              <div className="annotation">Produkty w koszyku nie są rezerwowane!</div>
            </div>
          </div>
        </div >

      )
      }
    </>
  );
}