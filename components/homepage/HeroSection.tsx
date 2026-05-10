import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/herobg.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18, 20, 20, 0) 0%, rgba(18, 20, 20, 0.6) 50%, #121414 100%)" }}></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center px-4 flex flex-col items-center">


        <h1 className="mb-8 drop-shadow-2xl max-w-[900px]">
          Create Your Signature Scent
        </h1>
        
        <p className="text-sm md:text-base text-[#ffffff] max-w-3xl mx-auto mb-14 font-light leading-relaxed opacity-70 tracking-wide">
          Create a fragrance that defines you. A beautiful blend crafted for your unique presence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button className="btn-primary w-full sm:w-auto min-w-[280px]">
            Create Your Fragrance
          </button>
          <button className="btn-outline w-full sm:w-auto min-w-[280px]">
            Shop Pre-made Blends
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
