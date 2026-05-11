"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to the specific profile page requested
    router.push("/dashboard/userdashboard/profile");
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/bottleofperfume.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-30 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>
      </div>

      <main className="flex-1 flex items-center justify-center pt-24 px-4 z-10">
        <div className="w-full max-w-[500px] bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 p-12 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          
          {/* Tabs */}
          <div className="flex justify-center gap-12 border-b border-white/5 pb-8">
            <button 
              onClick={() => setActiveTab("login")}
              className={`text-[10px] font-bold tracking-[4px] uppercase transition-all ${activeTab === "login" ? "text-[#F2CA50] border-b border-[#F2CA50] pb-2" : "text-white/20 hover:text-white"}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab("signup")}
              className={`text-[10px] font-bold tracking-[4px] uppercase transition-all ${activeTab === "signup" ? "text-[#F2CA50] border-b border-[#F2CA50] pb-2" : "text-white/20 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <header className="text-center space-y-4">
            <h1 className="text-white text-3xl font-serif">Welcome back</h1>
            <p className="text-white/40 text-sm font-light leading-relaxed">Enter your credentials to access the Maison.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Address</label>
              <input 
                type="email" 
                placeholder="concierge@lessencenoire.com"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light"
                required
              />
            </div>

            <div className="flex justify-between items-center text-[9px] font-bold tracking-[2px] uppercase">
              <label className="flex items-center gap-3 cursor-pointer group text-white/40 hover:text-white transition-colors">
                <input type="checkbox" className="hidden" />
                <div className="w-4 h-4 border border-white/10 rounded group-hover:border-[#F2CA50] transition-colors"></div>
                Remember Me
              </label>
              <button type="button" className="text-white/20 hover:text-[#F2CA50] transition-colors">Forgot Password?</button>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]"
            >
              Enter the Maison
            </button>
          </form>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[9px] font-bold tracking-[2px] uppercase"><span className="bg-[#0A0A0A]/40 backdrop-blur px-6 text-white/20">Or Continue With</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-xl hover:bg-white/10 transition-all group">
              <svg className="w-4 h-4 text-white group-hover:text-[#F2CA50] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.548 0-1.711-.516-1.711-2.06 0-1.546 1.163-2.06 1.711-2.06.547 0 1.712.515 1.712 2.06 0 1.545-1.165 2.06-1.712 2.06zm-.324 1.258c-.147.016-.302.024-.461.024-1.372 0-2.58-.87-2.58-2.61 0-1.741 1.208-2.611 2.58-2.611.159 0 .314.008.461.024v5.173zm-2.016 1.545c0-.623.468-1.092 1.092-1.092.623 0 1.091.469 1.091 1.092v6.621c0 .623-.468 1.091-1.091 1.091-.624 0-1.092-.468-1.092-1.091v-6.621zm4.721 0c0-.623.468-1.092 1.091-1.092.624 0 1.092.469 1.092 1.092v6.621c0 .623-.468 1.091-1.092 1.091-.623 0-1.091-.468-1.091-1.091v-6.621z"/></svg>
              <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/40 group-hover:text-white transition-colors">Apple</span>
            </button>
            <button className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-xl hover:bg-white/10 transition-all group">
              <svg className="w-4 h-4 text-white group-hover:text-[#F2CA50] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/40 group-hover:text-white transition-colors">Google</span>
            </button>
          </div> */}
        </div>
      </main>

      <footer className="py-12 text-center z-10 space-y-6">
        <Link href="/admin/dashboard" className="inline-block text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-all border-b border-[#F2CA50]/20 pb-1">Admin Login</Link>
        <p className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">Part of the Louisianaroma Artisanal Group</p>
      </footer>
    </div>
  );
}
