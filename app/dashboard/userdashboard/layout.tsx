"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const SIDEBAR_LINKS = [
  { name: "Profile", href: "/dashboard/userdashboard/profile", icon: "👤" },
  { name: "My Orders", href: "/dashboard/userdashboard/orders", icon: "📦" },
  { name: "Security", href: "/dashboard/userdashboard/security", icon: "🔒" },
  { name: "Logout", href: "/", icon: "✕" },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-32 px-8 md:px-12 max-w-7xl mx-auto w-full gap-12 pb-24">
        {/* Simple Side Navbar */}
        <aside className="w-64 shrink-0 space-y-12">
          <header className="space-y-2 px-4">
             <span className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase opacity-60">Alchemist Level</span>
             <h2 className="text-white text-xl font-serif">A. Vanderbilt</h2>
          </header>

          <nav className="space-y-2">
            {SIDEBAR_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${pathname === link.href ? "bg-white/5 text-[#F2CA50] border border-white/10" : "text-white/20 hover:text-white hover:bg-white/5"}`}
              >
                <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                <span className="text-[11px] font-bold tracking-[2px] uppercase">{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="bg-[#F2CA50]/5 border border-[#F2CA50]/10 rounded-[32px] p-8 space-y-4">
             <h3 className="text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase">Need Assistance?</h3>
             <p className="text-white/40 text-[10px] font-light leading-relaxed">Our concierge is available 24/7 for our elite members.</p>
             <button className="text-white text-[9px] font-bold tracking-[2px] uppercase border-b border-white/20 pb-1">Contact Support</button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#121414] border border-white/5 rounded-[40px] p-12 shadow-2xl overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
