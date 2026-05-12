"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "LOUISIANA10") {
      setDiscount(subtotal * 0.1);
      setPromoError("");
      setIsPromoApplied(true);
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
      setIsPromoApplied(false);
    }
  };

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[#F2CA50] text-6xl font-serif mb-2 tracking-tight">
            Checkout
          </h1>
          <p className="text-white/30 text-[10px] font-bold tracking-[3px] uppercase">
            Secure Transaction • L'Essence Noire Collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Form Section */}
          <div className="flex-1 space-y-12 bg-[#1A1C1C]/30 p-12 rounded-3xl border border-white/5">
            <div className="flex items-baseline gap-4">
              <span className="text-[#F2CA50] text-2xl font-serif italic">01</span>
              <h2 className="text-white text-2xl font-serif tracking-wide uppercase">Shipping Information</h2>
            </div>

            <form className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="ALEXANDRE DE L'AUBEPINE" 
                    className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="12 PLACE VENDÔME" 
                    className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all uppercase"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">City</label>
                    <input 
                      type="text" 
                      placeholder="PARIS" 
                      className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">Country</label>
                    <input 
                      type="text" 
                      placeholder="FRANCE" 
                      className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+33 1 23 45 67 89" 
                    className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar Summary Section */}
          <div className="w-full lg:w-[400px] space-y-6">
            <div className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 space-y-10">
              <h2 className="text-white text-xl font-serif tracking-wide uppercase">Your Selection ({cartItems.length})</h2>
              
              <div className="max-h-[300px] overflow-y-auto space-y-6 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 bg-black/40 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-white text-sm font-serif truncate">{item.name}</h4>
                        <span className="text-[#F2CA50] text-xs font-serif">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-white/20 text-[8px] font-bold tracking-[1px] uppercase truncate">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE" 
                    className="flex-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[2px] px-4 py-3 rounded-lg outline-none focus:border-[#F2CA50]/50 transition-all uppercase"
                  />
                  <button 
                    onClick={applyPromoCode}
                    className="bg-[#F2CA50]/10 border border-[#F2CA50]/30 text-[#F2CA50] text-[10px] font-bold tracking-[2px] px-4 py-3 rounded-lg hover:bg-[#F2CA50] hover:text-black transition-all"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-[8px] font-bold tracking-[1px] uppercase">{promoError}</p>}
                {isPromoApplied && <p className="text-green-500 text-[8px] font-bold tracking-[1px] uppercase">10% discount applied</p>}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/30">Subtotal</span>
                  <span className="text-white tracking-normal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/30">Shipping</span>
                  <span className="text-[#F2CA50]">Complimentary</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase text-green-500">
                    <span>Discount</span>
                    <span className="tracking-normal">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/30">Est. Sales Tax</span>
                  <span className="text-white tracking-normal">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-baseline">
                   <h3 className="text-white text-xl font-serif tracking-widest uppercase">Total</h3>
                   <span className="text-[#F2CA50] text-4xl font-serif">${total.toFixed(2)}</span>
                </div>

                <button className="w-full bg-[#F2CA50] text-black text-xs font-bold tracking-[3px] uppercase py-6 rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.15)]">
                  Place Order
                </button>

                <div className="flex justify-center items-center gap-3 text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                  <svg className="w-4 h-4 text-[#F2CA50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Encrypted Secure Payment
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
