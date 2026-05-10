import Image from "next/image";

export default function BlendHero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/blendbg.png"
          alt="Blend Background"
          fill
          className="object-cover opacity-40 scale-110 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-normal text-white mb-8 tracking-[12px] uppercase drop-shadow-2xl" style={{ fontFamily: "var(--font-noto-serif)" }}>
          The Art of the Blend
        </h1>
        
        <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-14 font-light leading-relaxed tracking-wide">
          Your journey to a unique olfactory signature starts here. Craft a scent that resonates with your soul.
        </p>

        <button className="btn-primary min-w-[320px] h-[64px] rounded-[12px] text-lg tracking-[4px]">
          Begin Your Custom Creation
        </button>
      </div>
    </section>
  );
}
