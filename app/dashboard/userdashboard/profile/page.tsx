"use client";

export default function ProfilePage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
         <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Account Identity</span>
         <h1 className="text-white text-5xl font-serif">Your Profile</h1>
         <p className="text-white/40 text-lg font-light leading-relaxed max-w-lg italic">
           Refine your presence within the Maison. Your identity and preferences guide our artisanal service.
         </p>
      </header>

      <div className="space-y-12">
        <section className="space-y-10">
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

        <section className="space-y-10">
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Shipping Address</label>
            <input 
              type="text" 
              placeholder="House number and street name"
              defaultValue="740 Park Avenue, Apt 12B"
              className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">City</label>
              <input type="text" defaultValue="New York" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
            </div>
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Postal Code</label>
              <input type="text" defaultValue="10021" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-white/5 flex justify-end">
           <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
