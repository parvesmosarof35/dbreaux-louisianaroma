"use client";

import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 pt-40 pb-32 flex-1 w-full space-y-12">
        <header className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Account Identity</span>
           <h1 className="text-white text-5xl font-serif">Alchemist Profile</h1>
           <p className="text-white/40 text-lg font-light leading-relaxed max-w-lg italic">
             Refine your presence within the Maison. Your identity and preferences guide our artisanal service.
           </p>
        </header>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Section 1: Personal Information */}
          <section className="bg-[#121414] border border-white/5 rounded-[32px] p-12 space-y-10 shadow-2xl">
            <h2 className="text-[#F2CA50] text-3xl font-serif">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Alexander Vanderbilt"
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
                />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="concierge@lessencenoire.com"
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Delivery Address */}
          <section className="bg-[#121414] border border-white/5 rounded-[32px] p-12 space-y-10 shadow-2xl">
            <h2 className="text-[#F2CA50] text-3xl font-serif">Delivery Address</h2>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Shipping Address</label>
                <input 
                  type="text" 
                  placeholder="House number and street name"
                  defaultValue="740 Park Avenue, Apt 12B"
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">City</label>
                  <input type="text" defaultValue="New York" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
                </div>
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Postal Code</label>
                  <input type="text" defaultValue="10021" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
                </div>
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Country</label>
                  <select className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light appearance-none">
                    <option>United States</option>
                    <option>France</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Security & Password */}
          <section className="bg-[#121414] border border-white/5 rounded-[32px] p-12 space-y-10 shadow-2xl">
            <h2 className="text-[#F2CA50] text-3xl font-serif">Security & Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
              </div>
            </div>
            <button className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase hover:text-white transition-all underline underline-offset-8">Request Password Reset</button>
          </section>
        </div>

        {/* Footer Actions */}
        <footer className="flex justify-end items-center gap-12 pt-12 border-t border-white/5">
           <button className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-colors">Discard Changes</button>
           <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]">Save Changes</button>
        </footer>
      </main>
    </div>
  );
}
