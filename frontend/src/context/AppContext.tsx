"use client";

import CartNotificationPortal from "@/components/CartNotificationPortal/CartNotificationPortal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CompletedOrder } from "@/types/completedOrder";
import { OrderDetails } from "@/types/orderDetails";
import { Product } from "@/types/product";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AppContextType = {
  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (index: number) => void;
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
  addToOrderHistory: (order: CompletedOrder[]) => void;
  getOrderHistory: () => CompletedOrder[];
  showCartNoti: (message: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const {
    storedValue: cart,
    setItem: setCart,
    clearItem: clearCart,
    getItem: getProducts,
  } = useLocalStorage<{ product: Product; quantity: number }[]>("cart", []);



  const addToCart = (product: Product, quantity: number) => {
    const current = getProducts();

    if (current.find((item) => item.product.id === product.id)) {
      const newQuantity = current.find((item) => item.product.id === product.id)!.quantity + quantity;
      const updatedCart = current.map((item) =>
        item.product.id === product.id ? { ...item, quantity: newQuantity } : item
      );
      showCartNoti(`Dodano ${quantity} szt. produktu "${product.name}" do koszyka. Lącznie w koszyku: ${newQuantity} szt.`);
      setCart(updatedCart);
    } else {
      setCart([...current, { product, quantity }]);
      showCartNoti(`Dodano ${quantity} szt. produktu "${product.name}" do koszyka.`);
    }

  };

  const removeFromCart = (index: number) => {
    const current = getProducts();
    const updated = current.filter((_, i) => i !== index);
    setCart(updated);
  };

  const setQuantity = (product: Product, quantity: number) => {
    const current = getProducts();


    const updatedCart = current.map((item) => {

      if (item.product.id === product.id && quantity > 0 && item.quantity + 1 >= item.quantity - quantity) {
        if (quantity < item.quantity) {
          showCartNoti(`Zmniejszono ilość produktu "${product.name}" do ${quantity} szt. w koszyku.`);
        }
        if (quantity > item.quantity) {
          showCartNoti(`Zwiększono ilość produktu "${product.name}" do ${quantity} szt. w koszyku.`);
        }
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const {
    storedValue: favorites,
    setItem: setFavorites,
    clearItem: clearFavorites,
    getItem: getFavorite,
  } = useLocalStorage<Product[]>("favorites", []);


  const addOrRemoveFavorites = (product: Product) => {
    const current = getFavorite();

    if (current.find((item) => item.id === product.id)) {
      removeFromFavorites(current.findIndex((item) => item.id === product.id));
      return;
    };
    setFavorites([...current, product]);
  };

  const removeFromFavorites = (index: number) => {
    const current = getFavorite();
    const updated = current.filter((_, i) => i !== index);
    setFavorites(updated);
  };

  const isFavorite = (productId: string) => {
    const current = getFavorite();
    return current.some((item) => item.id === productId);
  }

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


  const [cartNoti, setCartNoti] = useState<string | null>(null);

  const showCartNoti = (message: string) => {
    setCartNoti(message);
  };

  useEffect(() => {
    if (cartNoti) {
      const timer = setTimeout(() => {
        setCartNoti(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [cartNoti]);

  useEffect(() => {
    if (cartNoti) {
      queueMicrotask(() => setCartNoti(null));
      return;
    }
  }, [cartNoti, pathname]);


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

  const {
    setItem: setOrderHistory,
    getItem: getOrderHistory,
  } = useLocalStorage<CompletedOrder[]>("order-history", []);

  const addToOrderHistory = (order: CompletedOrder[]) => {
    const current = getOrderHistory();
    setOrderHistory([...current, ...order]);
  }

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
        clearOrderDetails,
        addToOrderHistory,
        getOrderHistory,
        showCartNoti,
      }}
    >
      {children}

      {cartNoti && (
        <CartNotificationPortal
          message={cartNoti}
          onClose={() => setCartNoti(null)}
        />
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("context error");
  return context;
};
