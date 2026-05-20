"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthState, useAuthActions } from "@/store/hooks";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, user } = useAuthState();
  const { logout } = useAuthActions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Auto-open sidebar on desktop
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // Authorization routing guard
  useEffect(() => {
    if (isClient && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [isClient, isAuthenticated, isAdmin, router]);

  if (!isClient) return null;

  // Render a loading state to prevent flash of content during redirect
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Simple Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#121414] border-r border-white/5 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-7 border-b border-white/5 flex justify-between items-center">
          <Link href="/">
            <Image
              src="/Louisianaroma header white logo.svg"
              alt="Louisianaroma Logo"
              width={180}
              height={50}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Products", path: "/admin/products" },
            { name: "Categories", path: "/admin/category" },
            { name: "Users", path: "/admin/users" },
            { name: "Offers", path: "/admin/offers" },
            { name: "Profile", path: "/admin/profile" },
            { name: "FAQ Management", path: "/admin/faq" },
            { name: "About Us", path: "/admin/about-us" },
            { name: "Privacy Policy", path: "/admin/privacy-policy" },
            { name: "Terms & Conditions", path: "/admin/terms-and-condition" },
            { name: "System Settings", path: "/admin/settings" },
          ].map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl text-[10px] font-bold tracking-[3px] uppercase transition-all duration-300 ${pathname === item.path ? "bg-[#F2CA50] text-black shadow-[0_10px_20px_rgba(242,202,80,0.1)]" : "text-white/30 hover:text-[#F2CA50] hover:bg-white/5"}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${pathname === item.path ? "bg-black" : "bg-[#F2CA50]/20"}`} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold tracking-[3px] uppercase text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer text-left"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
             Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 bg-[#121414]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-10 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden p-3 rounded-xl bg-white/5 text-[#F2CA50] border border-white/10 hover:bg-white/10 transition-all ${isSidebarOpen ? "opacity-0" : "opacity-100"}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="hidden sm:block">
               <span className="text-white/20 text-[10px] font-bold tracking-[4px] uppercase">Management Console</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden xs:block">
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-white">
                  {user?.fullname || "Alexander Vanderbilt"}
                </p>
                <p className="text-[9px] text-[#F2CA50] font-bold tracking-[1px] uppercase opacity-60">
                  {user?.role === "superadmin" ? "High Alchemist (Super)" : "Maison Administrator"}
                </p>
             </div>
             <Link href="/admin/profile" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#F2CA50] font-serif text-xl hover:border-[#F2CA50]/50 transition-all uppercase">
               {(user?.fullname || "A").slice(0, 1)}
             </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#0A0A0A] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
