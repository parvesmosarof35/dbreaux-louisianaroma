"use client";

import { use } from "react";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24 flex-1 w-full space-y-24">
        {/* Header Section */}
        <header className="text-center space-y-6">
          <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Transaction Archive</span>
          <h1 className="text-white text-7xl font-serif">Order Details</h1>
          <div className="flex justify-center items-center gap-6 text-white/40 text-sm font-light tracking-widest uppercase">
            <span>#LN-8821</span>
            <span className="w-1.5 h-1.5 bg-[#F2CA50] rounded-full"></span>
            <span>October 24, 2024</span>
          </div>
        </header>

        {/* Timeline Section */}
        <section className="space-y-12">
          <div className="flex justify-between items-baseline">
            <h2 className="text-[#F2CA50] text-3xl font-serif">The Journey</h2>
            <div className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">Estimated Arrival: Nov 02</div>
          </div>
          
          <div className="relative pt-12">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {[
                { name: "Commissioned", date: "Oct 24, 14:20", icon: "✓", active: true },
                { name: "Maturation", date: "Oct 26, 09:15", icon: "⚗", active: true },
                { name: "Bottling", date: "In Progress", icon: "✎", active: true, current: true },
                { name: "Shipped", date: "Pending", icon: "🚚", active: false }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-6 group">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-lg transition-all duration-500 z-10 ${step.active ? "bg-[#0A0A0A] border-[#F2CA50] text-[#F2CA50] shadow-[0_0_20px_rgba(242,202,80,0.3)]" : "bg-[#0A0A0A] border-white/10 text-white/10"}`}>
                    {step.icon}
                  </div>
                  <div className="text-center space-y-1">
                    <p className={`text-[10px] font-bold tracking-[2px] uppercase ${step.active ? "text-white" : "text-white/20"}`}>{step.name}</p>
                    <p className="text-white/20 text-[8px] tracking-[1px] uppercase">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Card: Formulation */}
          <div className="lg:col-span-2 bg-[#121414] border border-white/5 rounded-[40px] p-12 space-y-12 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="relative w-64 aspect-square bg-black/40 rounded-[32px] overflow-hidden shrink-0 border border-white/5">
                <Image src="/bottleofperfume.png" alt="Nocturnal Silk" fill className="object-contain p-8 drop-shadow-2xl" />
              </div>
              <div className="flex-1 space-y-8">
                <div className="space-y-2">
                  <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Bespoke Creation</span>
                  <h3 className="text-white text-5xl font-serif tracking-tight">Nocturnal Silk</h3>
                </div>
                
                <section className="space-y-6">
                  <h4 className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase border-b border-white/5 pb-4">Olfactory Architecture</h4>
                  <div className="space-y-6">
                    {[
                      { name: "Sandalwood", percent: 45 },
                      { name: "Blackened Rose", percent: 35 },
                      { name: "Bergamot", percent: 20 }
                    ].map((note, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-white/60 text-xs font-bold tracking-[2px] uppercase">{note.name}</span>
                          <span className="text-white/40 text-xs font-light">{note.percent}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F2CA50]/60 rounded-full transition-all duration-1000 delay-500" style={{ width: `${note.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="flex justify-between items-end pt-12 border-t border-white/5">
              <div className="space-y-2">
                <span className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">Personalized Etching</span>
                <p className="text-white text-3xl font-serif italic opacity-60">"A. Vanderbilt"</p>
              </div>
              <div className="text-right space-y-2">
                <span className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">Volume</span>
                <p className="text-white text-2xl font-serif opacity-60">100ml / 3.4 fl. oz.</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Delivery & Summary */}
          <aside className="space-y-12">
            <div className="bg-[#1A1C1C] border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <svg className="w-5 h-5 text-[#F2CA50]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <h4 className="text-white/40 text-[9px] font-bold tracking-[3px] uppercase">Concierge Delivery</h4>
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">Recipient</span>
                  <p className="text-white text-base font-serif">Alexander Vanderbilt</p>
                </div>
                <div className="space-y-1">
                  <span className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">Destination</span>
                  <p className="text-white text-base font-serif leading-relaxed">
                    740 Park Avenue, Apt 12B<br />
                    New York, NY 10021, USA
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#121414] border border-white/5 rounded-[40px] p-10 space-y-10">
              <h4 className="text-white/40 text-[9px] font-bold tracking-[3px] uppercase border-b border-white/5 pb-6">Order Summary</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-white/20 text-xs font-light">Bespoke Formulation</span>
                  <span className="text-white text-sm font-light">$1,240.00</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/20 text-xs font-light">Hand-Blown Crystal Vessel</span>
                  <span className="text-white text-sm font-light">$450.00</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/20 text-xs font-light">White-Glove Delivery</span>
                  <span className="text-[#F2CA50] text-xs font-bold tracking-[2px] uppercase italic">Complimentary</span>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-end">
                  <span className="text-white text-2xl font-serif tracking-tight">Total</span>
                  <span className="text-[#F2CA50] text-4xl font-light tracking-tighter">$1,690.00</span>
                </div>
                <button className="w-full flex items-center justify-center gap-4 border border-white/10 py-5 rounded-xl text-[9px] font-bold tracking-[3px] uppercase hover:bg-white/5 hover:text-[#F2CA50] transition-all group">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Download Invoice
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
