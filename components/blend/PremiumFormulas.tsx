import Image from "next/image";

const formulas = [
  {
    id: 1,
    category: "Resinous",
    title: "Royal Oud",
    image: "/royal_oud.png"
  },
  {
    id: 2,
    category: "Floral",
    title: "Damask Rose",
    image: "/damask_rose.png"
  },
  {
    id: 3,
    category: "Citrus",
    title: "Calabrian Bergamot",
    image: "/calabrian_bergamot.png"
  }
];

export default function PremiumFormulas() {
  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <h2 className="text-5xl font-normal text-white mb-6 tracking-wider uppercase" style={{ fontFamily: "var(--font-noto-serif)" }}>
              Premium Formulas
            </h2>
            <p className="text-white/40 text-lg font-light tracking-wide">
              Sourced from some of the world's most exclusive estates.
            </p>
          </div>
          <a href="/formulas" className="text-[#D4AF37] text-sm font-semibold tracking-wider hover:opacity-80 transition-opacity border-b border-[#D4AF37]/40 pb-1 mt-8 md:mt-0">
            View All Formulas
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {formulas.map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-[4px] group cursor-pointer shadow-2xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
                <span className="text-[#D4AF37] text-xs font-bold tracking-[3px] uppercase mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {item.category}
                </span>
                <h3 className="text-3xl text-white font-normal uppercase tracking-widest" style={{ fontFamily: "var(--font-noto-serif)" }}>
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
