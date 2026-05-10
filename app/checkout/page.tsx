import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
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
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="ALEXANDRE DE L'AUBEPINE" 
                    className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all uppercase"
                  />
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase ml-1">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="12 PLACE VENDÔME" 
                    className="w-full bg-white text-black text-sm font-bold tracking-[1px] px-6 py-5 rounded-xl outline-none focus:ring-2 ring-[#F2CA50]/50 transition-all uppercase"
                  />
                </div>

                {/* City & Country */}
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

                {/* Phone */}
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
              <h2 className="text-white text-xl font-serif tracking-wide uppercase">Your Selection</h2>
              
              {/* Item Summary */}
              <div className="flex gap-6 items-center">
                <div className="relative w-24 h-24 bg-black/40 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="/product (1).png"
                    alt="Selection"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-[#F2CA50] text-[9px] font-bold tracking-[1.5px] uppercase">L'Essence Noire</span>
                    <span className="text-white text-sm font-serif">$295.00</span>
                  </div>
                  <h4 className="text-white text-lg font-serif">Eau de Parfum Intense</h4>
                  <p className="text-white/20 text-[10px] font-bold tracking-[1px] uppercase">100ml / 3.4 fl. oz.</p>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/30">Subtotal</span>
                  <span className="text-white tracking-normal">$295.00</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/30">Shipping</span>
                  <span className="text-[#F2CA50]">Complimentary</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/30">Est. Sales Tax</span>
                  <span className="text-white tracking-normal">$59.00</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-baseline">
                   <h3 className="text-white text-xl font-serif tracking-widest uppercase">Total</h3>
                   <span className="text-[#F2CA50] text-4xl font-serif">$354.00</span>
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

            {/* Gift Message Link */}
            <button className="w-full flex justify-between items-center bg-[#1A1C1C] border border-white/5 rounded-2xl p-6 group hover:border-[#F2CA50]/30 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F2CA50]/10 flex items-center justify-center text-[#F2CA50]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                  </div>
                  <span className="text-white/40 text-[10px] font-bold tracking-[2px] uppercase group-hover:text-white transition-colors">Add a Gift Message</span>
               </div>
               <span className="text-white/20 text-sm group-hover:text-[#F2CA50] transition-colors">→</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
