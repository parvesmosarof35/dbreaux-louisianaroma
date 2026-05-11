"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { textPrimary, sidebarbg } from "../theme";

interface MainHeaderProps {
  toggleSidebar: () => void;
}

export default function MainHeader({ toggleSidebar }: MainHeaderProps) {
  const router = useRouter();
  
  // Mock data for frontend-only build
  const profileName = "Alexander Vanderbilt";
  const profileRole = "High Alchemist";
  const profileImage = null;
  
  return (
    <div className="relative w-full px-8 pt-4 pb-2">
      <header className={`${sidebarbg} border border-white/5 rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl`}>
        <div className="flex justify-between items-center px-10 h-[92px]">
          <div className="flex items-center gap-8">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className={`p-3 rounded-xl hover:bg-white/5 transition-all focus:outline-none cursor-pointer ${textPrimary} border border-white/5`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            <Link href="/" className="hidden sm:block">
              <div className="relative w-40 h-10">
                <Image 
                  src="/navbarlogo.png" 
                  alt="Maison Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div
              onClick={() => router.push("/admin/profile")}
              className="flex items-center gap-5 cursor-pointer group"
            >
              <div className="text-right">
                <h3 className="hidden md:block text-white text-[11px] font-bold tracking-[2px] uppercase">
                  {profileName}
                </h3>
                <p className="text-[#F2CA50] text-[10px] font-medium uppercase tracking-[1px] opacity-60">
                  {profileRole}
                </p>
              </div>

              {/* Avatar */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg overflow-hidden border border-white/10 bg-white/5 group-hover:border-[#F2CA50]/50 transition-all`}>
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-[#F2CA50] font-serif">{profileName.charAt(0).toUpperCase()}</span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
