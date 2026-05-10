import Image from "next/image";
import Link from "next/link";

export default function BlendHero() {
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
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 flex flex-col items-center -mt-24">
        <h1 
          className="uppercase mb-8" 
          style={{ 
            color: "#E2E2E2",
            fontFamily: "var(--font-noto-serif), serif",
            fontWeight: 400,
            fontSize: "64px",
            lineHeight: "70.4px",
            letterSpacing: "6.4px",
            textAlign: "center",
            maxWidth: "700px",
            width: "100%"
          }}
        >
          The Art of the<br />Blend
        </h1>
        
        <p 
          className="mb-14"
          style={{
            color: "#D0C5AF",
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            fontSize: "18px",
            lineHeight: "28.8px",
            letterSpacing: "0.36px",
            textAlign: "center",
            maxWidth: "647px",
            width: "100%"
          }}
        >
          Your journey to a unique olfactory signature starts here. Craft a scent that resonates with your soul.
        </p>

        <Link 
          href="/create-blend"
          className="flex items-center justify-center transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          style={{
            width: "450px",
            height: "58px",
            borderRadius: "12px",
            background: "#D4AF37",
            boxShadow: "0px 0px 20px 0px rgba(212, 175, 55, 0.2)",
            padding: "20px 48px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "12px",
              letterSpacing: "3.6px",
              textTransform: "uppercase",
              color: "#241A00",
            }}
          >
            Begin Your Custom Creation
          </span>
        </Link>
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
