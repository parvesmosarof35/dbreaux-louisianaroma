"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { refreshCart } = useCart();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("louisianaroma-cart", JSON.stringify(updated));
    refreshCart();
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-white text-6xl font-serif mb-4 uppercase tracking-tight">
            Shopping Atelier
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-light leading-relaxed">
            Refining your personal collection of olfactive signatures. Each selection is prepared with artisanal precision.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-24 space-y-6">
                <p className="text-white/20 text-2xl font-serif">Your atelier is currently empty.</p>
                <Link href="/create-blend" className="inline-block text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase border-b border-[#F2CA50] pb-1">Start a Creation</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#2A2B1D]/40 border border-[#D4AF37]/10 rounded-2xl p-8 flex flex-col md:flex-row gap-10 hover:border-[#D4AF37]/30 transition-all duration-500"
                >
                  <div className="relative w-48 aspect-square bg-black/40 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-[#F2CA50] text-3xl font-serif">{item.name}</h3>
                          <p className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">{item.category} • {item.subCategory}</p>
                        </div>
                        <div className="text-white text-3xl font-light">${item.price.toFixed(2)}</div>
                      </div>
                      {item.isCustom ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {item.details?.map((detail: any, idx: number) => (
                            <div key={idx} className="space-y-1 border-l border-[#D4AF37]/20 pl-4">
                              <div className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">{detail.label}</div>
                              <div className="text-[#F2CA50] text-xl font-light">{detail.value}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/40 text-sm font-light leading-relaxed max-w-md italic">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-8 pt-8 border-t border-white/5">
                      {item.isCustom && (
                        <button className="flex items-center gap-2 text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase hover:text-white transition-colors">
                          <span className="text-sm">✎</span> Edit Formula
                        </button>
                      )}
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-2 text-white/20 text-[10px] font-bold tracking-[2px] uppercase hover:text-red-400 transition-colors">
                        <span className="text-sm">✕</span> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-[#2A2B1D] border border-[#D4AF37]/20 rounded-2xl p-10 space-y-10 sticky top-40">
              <h2 className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase border-b border-white/5 pb-6">Order Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white tracking-normal text-sm">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-[#F2CA50]">Complimentary</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/40">Estimated Tax</span>
                  <span className="text-white tracking-normal text-sm">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-10 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">Total Price</div>
                  <div className="text-[#F2CA50] text-5xl tracking-tighter">${total.toFixed(2)}</div>
                </div>
                <Link href="/checkout" className={`w-full flex items-center justify-center bg-[#F2CA50] text-black text-xs font-bold tracking-[3px] uppercase py-6 rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] ${cartItems.length === 0 ? "opacity-20 cursor-not-allowed grayscale pointer-events-none" : ""}`}>Proceed to Checkout</Link>


                {/* Badges */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-white/20 text-[9px] font-bold tracking-[1px] uppercase">
                    <svg className="w-4 h-4 text-[#F2CA50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Certificate of authenticity included
                  </div>
                  <div className="flex items-center gap-3 text-white/20 text-[9px] font-bold tracking-[1px] uppercase">
                    <svg className="w-4 h-4 text-[#F2CA50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Secure encrypted transaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
