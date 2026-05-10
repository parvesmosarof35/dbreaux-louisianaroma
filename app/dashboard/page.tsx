"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const RECENT_ACTIVITY = [
  { id: 1, name: "Nocturnal Silk", category: "Sandalwood & Oud", time: "2 days ago", description: "A deep, resinous composition with top notes of bergamot and a heart of blackened rose.", image: "/product (1).png" },
  { id: 2, name: "Amber Solstice", category: "Warm Resin", time: "5 days ago", description: "The warmth of labdanum caught in the final rays of summer sunlight, balanced by crisp...", image: "/product (4).png" },
  { id: 3, name: "Verdant Mist", category: "Moss & Fern", time: "1 week ago", description: "A crisp, green exploration of wet earth and ancient forest floors after midnight rain.", image: "/product (6).png" }
];

export default function DashboardPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 pt-40 pb-24 flex-1 w-full space-y-32">
        {/* Header Section */}
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Private Member Access</span>
          <h1 className="text-white text-7xl font-serif">Welcome back, Alchemist</h1>
          <p className="text-white/40 text-lg font-light leading-relaxed max-w-2xl mx-auto italic">
            The vault awaits your creative touch. Your signature accords are maturing in the darkness, awaiting the next stage of their olfactory evolution.
          </p>
        </header>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1A1C1C] border border-white/5 rounded-[40px] p-12 space-y-8 hover:border-[#F2CA50]/30 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-2xl bg-[#F2CA50]/5 flex items-center justify-center border border-[#F2CA50]/10">
              <svg className="w-8 h-8 text-[#F2CA50]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-white text-4xl font-serif">Create New Blend</h2>
              <p className="text-white/40 text-lg font-light leading-relaxed">Synthesize a new olfactory masterpiece using our curated library of raw essences and rare extracts.</p>
            </div>
            <Link href="/create-blend" className="inline-block bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.1)]">Begin Formulation</Link>
          </div>

          <div className="bg-[#1A1C1C] border border-white/5 rounded-[40px] p-12 space-y-8 hover:border-[#F2CA50]/30 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-white text-4xl font-serif">Order History</h2>
              <p className="text-white/40 text-lg font-light leading-relaxed">Revisit your archived collection and track the movement of your recent acquisitions.</p>
            </div>
            <Link href="/order-history" className="inline-block border border-white/10 text-white/40 text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-xl hover:bg-white/5 hover:text-[#F2CA50] transition-all duration-500">View Archives</Link>
          </div>
        </div>

        {/* Vault Activity Section */}
        <section className="space-y-12 pb-24">
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-[9px] font-bold tracking-[4px] uppercase opacity-60">Inventory Status</span>
              <h2 className="text-white text-4xl font-serif">Recent Vault Activity</h2>
            </div>
            <Link href="/order-history" className="text-white/40 text-[9px] font-bold tracking-[3px] uppercase hover:text-[#F2CA50] transition-all flex items-center gap-3">All Saved Accords <span className="text-sm">↗</span></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="bg-[#121414] border border-white/5 rounded-[32px] overflow-hidden group hover:border-white/10 transition-all duration-500 flex flex-col h-full shadow-2xl">
                <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                    <span className="text-white/40 text-[8px] font-bold tracking-[2px] uppercase">{item.time}</span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col space-y-6">
                  <div className="space-y-2">
                    <span className="text-[#F2CA50] text-[8px] font-bold tracking-[3px] uppercase opacity-60">{item.category}</span>
                    <h3 className="text-white text-2xl font-serif">{item.name}</h3>
                  </div>
                  <p className="text-white/30 text-sm font-light leading-relaxed italic">{item.description}</p>
                  <div className="pt-8 mt-auto border-t border-white/5 flex gap-8">
                    <button className="text-[#F2CA50] text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all">Re-Order</button>
                    <Link href={`/order-details/${item.id}`} className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all">Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
