"use client";

export default function SecurityPage() {
  return (
    <div className="space-y-8 md:space-y-12">
      <header className="space-y-4">
         <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Authentication</span>
         <h1 className="text-white text-3xl md:text-5xl font-serif">Security</h1>
         <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-lg italic">
            Protect your alchemist identity. We recommend periodic credential rotation for maximum vault security.
         </p>
      </header>

      <div className="space-y-8 md:space-y-10 max-w-2xl">
        <section className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
            />
          </div>
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
            />
          </div>
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
            />
          </div>
        </section>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
           <button className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-all underline underline-offset-8">Request Password Reset</button>
           <button className="w-full sm:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]">Update Password</button>
        </div>
      </div>
    </div>
  );
}
