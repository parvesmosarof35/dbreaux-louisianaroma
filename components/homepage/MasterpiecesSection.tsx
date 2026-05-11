import Image from "next/image";

const collections = [
  {
    id: 1,
    title: "Midnight Oud",
    price: "$240",
    description: "Deep, Smokey, Enchanting",
    image: "/Masterpieces (1).png"
  },
  {
    id: 2,
    title: "Golden Amber",
    price: "$210",
    description: "Warm, Rich, Mysterious",
    image: "/Masterpieces (2).png"
  },
  {
    id: 3,
    title: "Royal Rose",
    price: "$195",
    description: "Floral, Pure, Majestic",
    image: "/Masterpieces (3).png"
  }
];

export default function MasterpiecesSection() {
  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 border-b border-[#D4AF37]/10 pb-10">
          <div className="mb-6 md:mb-0">
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[3px] uppercase mb-4">Exquisite Collections</p>
            <h2 className="text-3xl md:text-5xl font-normal text-white" style={{ fontFamily: "var(--font-noto-serif)" }}>
              Curated Masterpieces
            </h2>
          </div>
          <a href="/shop" className="text-[#D4AF37] text-sm font-semibold tracking-wider hover:opacity-80 transition-opacity border-b border-[#D4AF37]/40 pb-1 inline-block w-fit">
            View All Collections
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {collections.map((item) => (
            <div key={item.id} className="bg-[#121414] p-5 rounded-[32px] border border-white/5 group hover:border-[#D4AF37]/20 transition-all duration-500">
              {/* Card Image Container */}
              <div className="relative aspect-square overflow-hidden rounded-[24px] mb-8">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Card Info */}
              <div className="px-2">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl md:text-3xl text-white font-normal" style={{ fontFamily: "var(--font-noto-serif)" }}>
                    {item.title}
                  </h3>
                  <span className="text-[#D4AF37] text-xl md:text-2xl font-normal pt-1" style={{ fontFamily: "var(--font-noto-serif)" }}>
                    {item.price}
                  </span>
                </div>
                <p className="text-white/40 text-base font-light tracking-wide">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
