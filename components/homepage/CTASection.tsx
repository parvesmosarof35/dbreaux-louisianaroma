import Image from "next/image";

export default function CTASection() {
  return (
    <section className="relative h-[57vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/blendbg.png"
          alt="Blend Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-[40px] font-normal text-white mb-12" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "48px", letterSpacing: "0.4px" }}>
          Start Your Custom Blend Today
        </h2>
        
        <button 
          className="inline-flex items-center justify-center rounded-[12px] transition-all duration-300 hover:brightness-110 active:scale-95 shadow-xl"
          style={{ 
            background: "#D4AF37",
            width: "270px",
            height: "64px",
            padding: "20px 45px",
            color: "#3C2F00",
            fontFamily: "var(--font-inter)",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "24px",
            letterSpacing: "3.2px",
            textTransform: "uppercase"
          }}
        >
          Begin Creation
        </button>
      </div>
    </section>
  );
}
