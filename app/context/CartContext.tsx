"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    setCartCount(savedCart.length);
  };

  useEffect(() => {
    refreshCart();
    
    // Listen for storage changes (for multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "louisianaroma-cart") {
        refreshCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", refreshCart);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", refreshCart);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
