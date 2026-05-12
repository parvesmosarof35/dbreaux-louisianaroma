"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartCount: number;
  refreshCart: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false
  });

  const refreshCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    setCartCount(savedCart.length);
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type, isVisible: true });
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
    <CartContext.Provider value={{ cartCount, refreshCart, showToast }}>
      {children}
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </CartContext.Provider>
  );
}

// Simple Toast component internal or import
import Toast from '@/components/ui/Toast';

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
