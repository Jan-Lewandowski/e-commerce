'use client'

import "@/components/Header/header.scss"
import AccountMenu from "@/components/MaterialUI/AccountMenu"
import SearchInput from "@/components/SearchInput/SearchInput"
import Button from "@/components/ui/Button/Button"
import { useApp } from "@/context/AppContext"
import Image from "next/image"
import { ShoppingBasket, Heart } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const { toggleTitle } = useApp();
  const { cart, toggleCart } = useApp()
  const { favorites, toggleFavorites } = useApp()

  const amountOfProducts = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="header">
      <Link href="/" onClick={() => toggleTitle("")} className="header-logo">
        <Image
          src="/images/shop-icon.png"
          alt="shop-icon"
          width={40}
          height={40}
          className="shop-icon"
        />
      </Link>
      <div className="header-search">
        <SearchInput />
      </div>
      <div className="user-tools">
        <div></div>
        <Button onClick={toggleCart} className="tool-button">
          <ShoppingBasket />
          {cart.length > 0 && (
            <div className="quantity">
              {amountOfProducts}
            </div>
          )}
        </Button>
        <Button onClick={toggleFavorites} className="tool-button">
          <Heart />
          {
            favorites.length > 0 && (
              <div className="quantity">
                {favorites.length}
              </div>
            )
          }
        </Button >
        <AccountMenu />


      </div>
    </div >
  )
}


