"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlendHero() {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/blendhero.png"
          alt="Blend Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18, 20, 20, 0) 0%, rgba(18, 20, 20, 0.6) 50%, #121414 100%)" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6 flex flex-col items-center -mt-10 md:-mt-24">
        <h1 className="uppercase mb-8 text-4xl md:text-6xl lg:text-[64px] leading-tight md:leading-[70.4px] tracking-[4px] md:tracking-[6.4px] text-[#E2E2E2] font-serif max-w-[800px]">
          The Art of the<br className="hidden md:block" /> Blend
        </h1>
        
        <p className="mb-10 md:mb-14 text-sm md:text-lg leading-relaxed md:leading-[28.8px] tracking-[0.36px] text-[#D0C5AF] font-light max-w-[647px]">
          Your journey to a unique olfactory signature starts here. Craft a scent that resonates with your soul.
        </p>

        <Link 
          href="/create-blend"
          className="flex items-center justify-center w-full sm:w-[450px] h-[58px] rounded-xl bg-[#D4AF37] shadow-[0px_0px_20px_0px_rgba(212,175,55,0.2)] transition-all duration-300 hover:brightness-110 active:scale-[0.98] px-6"
        >
          <span className="font-semibold text-[10px] md:text-[12px] tracking-[2px] md:tracking-[3.6px] uppercase text-[#241A00]">
            Begin Your Custom Creation
          </span>
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={scrollToNextSection}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 cursor-pointer hover:opacity-100 transition-opacity z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
