"use client";

import CartNotificationPortal from "@/components/CartNotificationPortal/CartNotificationPortal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CompletedOrder } from "@/types/completedOrder";
import { OrderDetails } from "@/types/orderDetails";
import { Product } from "@/types/product";
import { User } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
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
  isFavorite: (productId: string) => boolean;

  title: string;
  toggleTitle: (newTitle: string) => void;

  user: User | null;
  signup: (username: string, email: string, role: string) => void;
  updateUser: (username: string, email: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  authReady: boolean;

  setOrderDetails: (details: OrderDetails) => void;
  getOrderDetails: () => OrderDetails;
  clearOrderDetails: () => void;
  addToOrderHistory: (order: CompletedOrder[]) => void;
  getOrderHistory: () => CompletedOrder[];

  isFiltersVisible: boolean;
  toggleIsFiltersVisible: () => void;

  showCartNoti: (message: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    storedValue: cart,
    setItem: setCart,
    clearItem: clearCart,
    getItem: getProducts,
  } = useLocalStorage<{ product: Product; quantity: number }[]>("cart", []);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => {
      const newState = !prev;
      if (newState && isFavoritesOpen) setIsFavoritesOpen(false);
      return newState;
    });
  };

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


  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);


  const toggleFavorites = () => {
    setIsFavoritesOpen((prev) => {
      const newState = !prev;
      if (newState && isCartOpen) setIsCartOpen(false);
      return newState;
    });
  };

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





  const [title, setTitle] = useState<string>("");

  const toggleTitle = (newTitle: string) => {
    setTitle(newTitle);
  };




  const {
    storedValue: storedUser,
    setItem: setUserStorage,
    clearItem: clearUserStorage,
    ready: userReady,
  } = useLocalStorage<User | null>("user", null);

  const [user, setUser] = useState<User | null>(storedUser);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (userReady) {

      setUser(storedUser);
      setAuthReady(true);

      if (!storedUser && pathname !== "/signup") {
        router.push("/signup");
      }
    }
  }, [storedUser, pathname, userReady]);

  const isLoggedIn = !!user;

  const signup = (username: string, email: string, role: string) => {
    const newUser: User = { username, email, role };
    setUserStorage(newUser);
    setUser(newUser);
  };

  const updateUser = (username: string, email: string) => {
    if (!user) return;
    const updatedUser: User = { ...user, username, email };
    setUserStorage(updatedUser);
    setUser(updatedUser);
  };

  const logout = () => {
    clearUserStorage();
    setUser(null);
    setAuthReady(false);
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
      setCartNoti(null);
      return;
    }
  }, [pathname]);

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

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const toggleIsFiltersVisible = () => {
    setIsFiltersVisible((prev) => !prev);
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
        isFavorite,
        title,
        toggleTitle,
        user,
        isLoggedIn,
        signup,
        updateUser,
        logout,
        authReady,
        setOrderDetails,
        getOrderDetails,
        clearOrderDetails,
        addToOrderHistory,
        getOrderHistory,
        isFiltersVisible,
        toggleIsFiltersVisible,
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
