"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans">
      {/* Simple Sidebar */}
      <aside className={`w-64 bg-[#121414] border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 border-b border-white/5">
          <Link href="/admin/dashboard" className="text-[#F2CA50] text-xl font-serif tracking-widest uppercase">Maison</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Products", path: "/admin/products" },
            { name: "Categories", path: "/admin/category" },
            { name: "Users", path: "/admin/users" },
            { name: "Offers", path: "/admin/offers" },
            { name: "Profile", path: "/admin/profile" },
          ].map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`block px-6 py-4 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${pathname === item.path ? "bg-[#F2CA50] text-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/login" className="block px-6 py-4 rounded-xl text-sm font-medium tracking-wider uppercase text-red-500/50 hover:text-red-500 transition-all">Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#121414]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white/40 hover:text-white transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-bold tracking-widest uppercase text-white">Alexander Vanderbilt</p>
                <p className="text-[10px] text-[#F2CA50] font-bold tracking-widest uppercase opacity-60">High Alchemist</p>
             </div>
             <div className="w-12 h-12 bg-[#F2CA50] rounded-xl flex items-center justify-center text-black font-serif text-xl">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
