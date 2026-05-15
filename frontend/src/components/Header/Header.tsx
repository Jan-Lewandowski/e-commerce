'use client'

import SearchInput from "@/components/SearchInput/SearchInput"
import Button from "@/components/ui/Button/Button"
import CartDrawer from "@/components/CartDrawer/CartDrawer"
import FavoritesDrawer from "@/components/FavoritesDrawer/FavoritesDrawer"
import AccountDrawer from "@/components/AccountDrawer.tsx/AccountDrawer"
import { useApp } from "@/context/AppContext"
import Image from "next/image"
import { ShoppingBasket, Heart, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function Header() {
  const { toggleTitle } = useApp();
  const { cart, toggleCart } = useApp()
  const { favorites, toggleFavorites } = useApp()
  const { isCartOpen, isFavoritesOpen, isAccountMenuOpen, toggleAccountMenu } = useApp()

  const cartWrapRef = useRef<HTMLDivElement | null>(null)
  const favoritesWrapRef = useRef<HTMLDivElement | null>(null)
  const accountWrapRef = useRef<HTMLDivElement | null>(null)

  const amountOfProducts = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!isCartOpen && !isFavoritesOpen && !isAccountMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const isInsideCart = cartWrapRef.current?.contains(target);
      const isInsideFavorites = favoritesWrapRef.current?.contains(target);
      const isInsideAccount = accountWrapRef.current?.contains(target);

      if (isInsideCart || isInsideFavorites || isInsideAccount) return;

      if (isCartOpen) toggleCart();
      if (isFavoritesOpen) toggleFavorites();
      if (isAccountMenuOpen) toggleAccountMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isCartOpen, isFavoritesOpen, isAccountMenuOpen, toggleCart, toggleFavorites, toggleAccountMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap">
        <Link href="/" onClick={() => toggleTitle("")} className="flex min-w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
          <Image
            src="/images/shop-icon.png"
            alt="shop-icon"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl border border-orange-100 bg-orange-50 p-2 shadow-sm"
          />
          <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:inline">TechStore</span>
        </Link>
        <div className="order-3 w-full lg:order-none lg:flex-1">
          <SearchInput />
        </div>
        <div className="ml-auto flex items-center justify-end gap-2 sm:gap-3">
          <div className="relative" ref={cartWrapRef}>
            <Button variant="ghost" onClick={toggleCart} className="relative h-11 w-11 rounded-xl border-slate-200 p-0 text-slate-700 hover:bg-orange-50 hover:text-orange-700">
              <ShoppingBasket className="h-6 w-6" />
              {cart.length > 0 && (
                <div className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-orange-500 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white shadow-sm">
                  {amountOfProducts}
                </div>
              )}
            </Button>
            <CartDrawer />
          </div>
          <div className="relative" ref={favoritesWrapRef}>
            <Button variant="ghost" onClick={toggleFavorites} className="relative h-11 w-11 rounded-xl border-slate-200 p-0 text-slate-700 hover:bg-orange-50 hover:text-orange-700">
              <Heart className="h-6 w-6" />
              {favorites.length > 0 && (
                <div className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-orange-500 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white shadow-sm">
                  {favorites.length}
                </div>
              )}
            </Button>
            <FavoritesDrawer />
          </div>
          <div className="relative" ref={accountWrapRef}>
            <Button variant="ghost" onClick={toggleAccountMenu} className="relative h-11 w-11 rounded-xl border-slate-200 p-0 text-slate-700 hover:bg-orange-50 hover:text-orange-700">
              <User className="h-6 w-6" />
            </Button>
            <AccountDrawer />
          </div>
        </div>
      </div>
    </header >
  )
}


