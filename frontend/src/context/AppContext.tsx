"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { OrderDetails } from "@/types/orderDetails";
import { Product } from "@/types/product";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CartItem,
  useCart,
  useClearCart,
  useRemoveFromCart,
  useSetCartQuantity,
} from "@/lib/queries/cart";
import {
  useAddFavorite,
  useClearFavorites,
  useFavorites,
  useRemoveFavorite,
} from "@/lib/queries/favorites";

type AppContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  setQuantity: (product: Product, quantity: number) => void;
  favorites: Product[];
  addOrRemoveFavorites: (product: Product) => void;
  removeFromFavorites: (index: number) => void;
  clearFavorites: () => void;
  isFavoritesOpen: boolean;
  toggleFavorites: () => void;
  isAccountMenuOpen: boolean;
  toggleAccountMenu: () => void;
  isFavorite: (productId: string) => boolean;
  title: string;
  toggleTitle: (newTitle: string) => void;
  setOrderDetails: (details: OrderDetails) => void;
  getOrderDetails: () => OrderDetails;
  clearOrderDetails: () => void;
  cartPopUp: CartPopUpData | null;
  closeCartPopUp: () => void;
};

const MAX_CART_ITEM_QUANTITY = 3;

type CartPopUpData =
  | {
    type: "added";
    message: string;
    product: Product;
    quantity: number;
    lowStockNotice?: boolean;
  }
  | {
    type: "limit";
    message: string;
  };

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  // === Cart (server-backed via product-service) ===
  const cartQuery = useCart(isLoggedIn);
  const setCartQuantityMutation = useSetCartQuantity();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();
  const cart = cartQuery.data ?? [];
  const [cartPopUp, setCartPopUp] = useState<CartPopUpData | null>(null);

  const showCartLimitPopUp = () => {
    setCartPopUp({
      type: "limit",
      message: `Możesz zamówić maksymalnie ${MAX_CART_ITEM_QUANTITY} sztuki tego produktu.`,
    });
  };

  const addToCart = (product: Product, quantity: number) => {
    if (!isLoggedIn || product.stock <= 0 || quantity <= 0) return;
    const existing = cart.find((item) => item.product.id === product.id);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (nextQuantity > MAX_CART_ITEM_QUANTITY) {
      showCartLimitPopUp();
      return;
    }
    if (nextQuantity > product.stock) return;
    const message = existing
      ? `Dodano ${quantity} szt. produktu "${product.name}". Lącznie w koszyku: ${nextQuantity} szt.`
      : `Dodano ${quantity} szt. produktu "${product.name}" do koszyka.`;
    setCartQuantityMutation.mutate(
      { productId: product.id, quantity: nextQuantity },
      {
        onSuccess: () =>
          setCartPopUp({
            type: "added",
            message,
            product,
            quantity,
            lowStockNotice: product.stock > 0 && product.stock <= 5,
          }),
      },
    );
  };

  const removeFromCart = (productId: string) => {
    removeFromCartMutation.mutate(productId);
  };

  const setQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(product.id);
      return;
    }
    if (quantity > MAX_CART_ITEM_QUANTITY) {
      showCartLimitPopUp();
      return;
    }
    setCartQuantityMutation.mutate({ productId: product.id, quantity });
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  // === Favorites (server-backed) ===
  const favoritesQuery = useFavorites(isLoggedIn);
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const clearFavoritesMutation = useClearFavorites();
  const favorites = favoritesQuery.data ?? [];

  const isFavorite = (productId: string) =>
    favorites.some((item) => item.id === productId);

  const addOrRemoveFavorites = (product: Product) => {
    if (!isLoggedIn) return;
    if (isFavorite(product.id)) {
      removeFavoriteMutation.mutate(product.id);
    } else {
      addFavoriteMutation.mutate(product.id);
    }
  };

  const removeFromFavorites = (index: number) => {
    const item = favorites[index];
    if (!item) return;
    removeFavoriteMutation.mutate(item.id);
  };

  const clearFavorites = () => {
    clearFavoritesMutation.mutate();
  };

  // === Drawer / UI state (purely local) ===
  const [cartState, setCartState] = useState<{ isOpen: boolean; path: string }>({
    isOpen: false,
    path: pathname,
  });
  const [accountMenuState, setAccountMenuState] = useState<{ isOpen: boolean; path: string }>({
    isOpen: false,
    path: pathname,
  });
  const [favoritesState, setFavoritesState] = useState<{ isOpen: boolean; path: string }>({
    isOpen: false,
    path: pathname,
  });

  const isCartRoute = pathname.startsWith("/cart");
  const isAccountRoute = pathname.startsWith("/account");

  const isCartOpen = cartState.isOpen && cartState.path === pathname && !isCartRoute;
  const isFavoritesOpen = favoritesState.isOpen && favoritesState.path === pathname;
  const isAccountMenuOpen = accountMenuState.isOpen && accountMenuState.path === pathname && !isAccountRoute;

  const toggleCart = () => {
    if (isCartRoute) return;
    setCartState((prev) => {
      const samePath = prev.path === pathname;
      const newState = samePath ? !prev.isOpen : true;
      if (newState && isFavoritesOpen) {
        setFavoritesState((prevFavs) => ({ ...prevFavs, isOpen: false }));
      }
      if (newState && isAccountMenuOpen) {
        setAccountMenuState((prevMenu) => ({ ...prevMenu, isOpen: false }));
      }
      return { isOpen: newState, path: pathname };
    });
  };

  const toggleFavorites = () => {
    setFavoritesState((prev) => {
      const samePath = prev.path === pathname;
      const newState = samePath ? !prev.isOpen : true;
      if (newState && isCartOpen) setCartState((prevCart) => ({ ...prevCart, isOpen: false }));
      if (newState && isAccountMenuOpen) {
        setAccountMenuState((prevMenu) => ({ ...prevMenu, isOpen: false }));
      }
      return { isOpen: newState, path: pathname };
    });
  };

  const toggleAccountMenu = () => {
    if (isAccountRoute) return;
    setAccountMenuState((prev) => {
      const samePath = prev.path === pathname;
      const newState = samePath ? !prev.isOpen : true;
      if (newState && isCartOpen) setCartState((prevCart) => ({ ...prevCart, isOpen: false }));
      if (newState && isFavoritesOpen) {
        setFavoritesState((prevFavs) => ({ ...prevFavs, isOpen: false }));
      }
      return { isOpen: newState, path: pathname };
    });
  };

  const [title, setTitle] = useState<string>("");

  const toggleTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const closeCartPopUp = () => {
    setCartPopUp(null);
  };

  // === Order details (checkout form draft - still local) ===
  const emptyOrderDetails: OrderDetails = {
    deliveryMethod: "",
    destination: { name: "", street: "", city: "", zipCode: "", phone: "", email: "" },
    shipper: "",
    paymentMethod: "",
  };

  const {
    setItem: setOrderDetails,
    clearItem: clearOrderDetails,
    getItem: getOrderDetails,
  } = useLocalStorage<OrderDetails>("order-details", emptyOrderDetails);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        toggleCart,
        setQuantity,
        favorites,
        addOrRemoveFavorites,
        removeFromFavorites,
        clearFavorites,
        isFavoritesOpen,
        toggleFavorites,
        isAccountMenuOpen,
        toggleAccountMenu,
        isFavorite,
        title,
        toggleTitle,
        setOrderDetails,
        getOrderDetails,
        cartPopUp,
        closeCartPopUp,
        clearOrderDetails,
      }}
    >
      {children}

    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("context error");
  return context;
};
