import Image from "next/image";

export default function AnatomyOfScent() {
  return (
    <section className="py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-[#D4AF37] text-2xl md:text-3xl font-normal tracking-[6px] uppercase" style={{ fontFamily: "var(--font-noto-serif)" }}>
            The Anatomy of Scent
          </h2>
          <div className="h-[1px] w-32 bg-[#D4AF37]/30 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative aspect-square flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Image
                src="/bottleofperfume.png"
                alt="Bottle of Perfume"
                width={350}
                height={500}
                className="object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
