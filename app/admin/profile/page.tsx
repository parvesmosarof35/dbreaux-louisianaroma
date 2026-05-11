"use client";

export default function AdminProfilePage() {
  const profile = {
    name: "Alexander Vanderbilt",
    email: "alex@louisianaroma.com",
    role: "High Alchemist",
    joined: "Oct 2024"
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto rounded-3xl overflow-hidden border border-[#F2CA50]/20 bg-white/5 flex items-center justify-center font-serif text-[#F2CA50] text-5xl shadow-2xl">
              {profile.name.charAt(0)}
          </div>
          <div className="space-y-2">
            <h1 className="text-white text-5xl font-serif">{profile.name}</h1>
            <p className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">{profile.role}</p>
          </div>
      </header>
      
      <div className="bg-[#121414] border border-white/5 rounded-[40px] p-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Master Identity</label>
            <input type="text" defaultValue={profile.name} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
          </div>
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Channel</label>
            <input type="email" defaultValue={profile.email} disabled className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50" />
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex justify-end">
          <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]">Update Identity</button>
        </div>
      </div>
    </div>
  );
}
