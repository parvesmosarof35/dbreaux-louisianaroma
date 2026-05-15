"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { buttonbg, sidebarbg } from "../theme";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard",       path: "/admin/dashboard" },
    { name: "Users",           path: "/admin/users" },
    { name: "Category",        path: "/admin/category" },
    { name: "Offers",          path: "/admin/offers" },
    { name: "Products",        path: "/admin/products" },
    { name: "Faq",             path: "/admin/faq" },
    { name: "Report",          path: "/admin/report" },
    { name: "Reviews",         path: "/admin/review" },
    { name: "Create Admin",    path: "/admin/create-admin" },
    { name: "Settings",        path: "/admin/settings" },
  ];

  return (
    <div
      className={` ${sidebarbg} text-white h-screen overflow-y-auto py-5 md:py-0 z-50 transition-all duration-300 transform overflow-hidden
        w-[80%] sm:w-[70%] md:w-[50%] ${isOpen ? "lg:w-68 xl:w-80" : "lg:w-0"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isOpen ? "lg:translate-x-0" : "lg:-translate-x-full"}
        fixed top-0 left-0 
        lg:static
      `}
    >
      {/* Close Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 lg:hidden text-white bg-white/5 focus:outline-none p-2 rounded-full border border-white/10"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      {/* Logo */}
      <Link href="/">
      <div className="flex justify-center items-center gap-2 px-8 mt-12 mb-8">
        <div className="relative w-full h-16">
             <Image src="/SVG Logo (Louisianaroma) (1).svg" alt="Louisianaroma Logo" fill className="object-contain" />
        </div>
      </div>
      </Link>

      {/* Sidebar Menu */}
      <div className="mt-6 px-6 text-[10px] relative">
          <div className="relative flex flex-col gap-3">
            
            {/* The Glider (Sliding Background) */}
            <div
                className={`absolute left-0 w-full h-14 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] z-0 ${buttonbg}`}
                style={{
                    transform: `translateY(${navItems.findIndex(i => isActive(i.path)) * (56 + 12)}px)`, // 56px height + 12px gap
                    opacity: navItems.some(i => isActive(i.path)) ? 1 : 0
                }}
            />

            {navItems.map((item) => (
            <Link key={item.path} href={item.path} className="block relative z-10">
                <div
                    className={`flex items-center gap-4 px-6 h-14 rounded-2xl cursor-pointer transition-all duration-500 ${
                    isActive(item.path)
                        ? "text-black"
                        : "text-white/40 hover:text-[#F2CA50] hover:bg-white/5"
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${isActive(item.path) ? "bg-black" : "bg-[#F2CA50]/40"}`} />
                    <p className="text-[11px] font-bold tracking-[2px] uppercase">{item.name}</p>
                </div>
            </Link>
            ))}
          </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 mt-12 mb-12">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 h-14 rounded-2xl text-white/20 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500 group border border-white/5"
        >
          <div className="w-2 h-2 rounded-full bg-red-500/40" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase">Logout</span>
        </button>
      </div>
    </div>
  );
}
