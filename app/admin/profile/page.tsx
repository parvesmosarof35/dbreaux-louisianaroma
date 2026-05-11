"use client";

import { useState } from "react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alexander Vanderbilt",
    email: "alex@louisianaroma.com",
    role: "High Alchemist",
    joined: "Oct 2024",
    avatar: null as string | null
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in duration-700">
      <header className="flex items-center gap-10">
          <div className="relative group">
            <div className="relative w-40 h-40 rounded-[48px] overflow-hidden border-2 border-[#F2CA50]/20 bg-white/5 flex items-center justify-center font-serif text-[#F2CA50] text-6xl shadow-2xl transition-all group-hover:border-[#F2CA50]/50">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile.name.charAt(0)
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <label className="cursor-pointer text-[10px] font-bold tracking-[2px] uppercase text-[#F2CA50]">
                      Change Essence
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                   </label>
                </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#F2CA50] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#121414]">
               <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
               </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-white text-6xl font-serif">{profile.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">{profile.role}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/20 text-[10px] font-bold tracking-[4px] uppercase">Member since {profile.joined}</span>
            </div>
          </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#121414] border border-white/5 rounded-[40px] p-10 space-y-10">
            <div className="flex justify-between items-center">
               <h2 className="text-white text-2xl font-serif">Master Identity</h2>
               <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Public Information</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Full Name</label>
                <input type="text" defaultValue={profile.name} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Channel</label>
                <input type="email" defaultValue={profile.email} disabled className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50" />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Role Assignment</label>
                <input type="text" defaultValue={profile.role} disabled className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50" />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Account Registry</label>
                <input type="text" defaultValue={profile.joined} disabled className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50" />
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex justify-end">
              <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]">Update Identity</button>
            </div>
          </div>
        </div>

        {/* Security / Password */}
        <div className="space-y-8">
           <div className="bg-[#121414] border border-white/5 rounded-[40px] p-10 space-y-10">
              <div className="space-y-2">
                 <h2 className="text-white text-2xl font-serif">Security</h2>
                 <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Account Protection</p>
              </div>
              
              {!isChangingPassword ? (
                <div className="space-y-6">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                         </div>
                         <span className="text-white/60 text-xs">Two-Factor Enabled</span>
                      </div>
                      <p className="text-white/20 text-[9px] leading-relaxed uppercase tracking-widest font-bold">Your account is secured with the highest alchemist standards.</p>
                   </div>
                   <button 
                     onClick={() => setIsChangingPassword(true)}
                     className="w-full border border-[#F2CA50]/20 text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase py-6 rounded-2xl hover:bg-[#F2CA50] hover:text-black transition-all"
                   >
                     Modify Password
                   </button>
                </div>
              ) : (
                <form className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" />
                   </div>
                   <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="flex-1 text-white/20 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                      <button className="flex-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[3px] uppercase py-4 rounded-xl hover:bg-white hover:text-black transition-all">
                        Save Key
                      </button>
                   </div>
                </form>
              )}
           </div>

           <div className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-10 space-y-6">
              <div className="space-y-2">
                 <h2 className="text-red-500 text-xl font-serif">Danger Zone</h2>
                 <p className="text-red-500/40 text-[9px] font-bold tracking-[2px] uppercase leading-relaxed">Deactivating your alchemist identity will remove your access to the Maison forever.</p>
              </div>
              <button className="w-full bg-red-500/10 text-red-500 text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-red-500 hover:text-white transition-all">Deactivate Identity</button>
           </div>
        </div>
      </div>
    </div>
  );
}
