"use client";

export default function AdminStubPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000">
      <div className="w-24 h-24 rounded-[32px] border border-[#F2CA50]/20 bg-white/5 flex items-center justify-center">
         <div className="w-8 h-8 bg-[#F2CA50]/40 rounded-full animate-pulse" />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-white text-4xl font-serif">Arriving Soon</h1>
        <p className="text-white/20 text-[10px] font-bold tracking-[4px] uppercase max-w-xs mx-auto leading-loose">
          This chamber of the Maison is currently being prepared for the High Alchemists.
        </p>
      </div>
    </div>
  );
}
