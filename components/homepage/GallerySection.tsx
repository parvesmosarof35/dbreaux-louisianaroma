import Image from "next/image";

export default function GallerySection() {
  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-normal text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Explore Our Scents</h2>
          <div className="h-[1px] w-24 bg-[#D4AF37]/30 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[800px]">
          {/* Oud - Large Vertical */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl aspect-square md:aspect-auto min-h-[350px]">
            <Image
              src="/gallary (4).png"
              alt="Oud"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 md:p-10 flex flex-col justify-end">
                <h3 className="text-2xl md:text-[28px] text-[#E2E2E2] mb-1" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Oud</h3>
                <p className="text-[#D0C5AF] text-sm md:text-base font-normal" style={{ fontFamily: "var(--font-inter)", lineHeight: "24px" }}>The Golden Resins</p>
            </div>
          </div>

          {/* Floral - Top Right */}
          <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl aspect-video md:aspect-auto min-h-[250px]">
            <Image
              src="/gallary (3).png"
              alt="Floral"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 md:p-10 flex flex-col justify-end">
              <h3 className="text-2xl md:text-[28px] text-[#E2E2E2]" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Floral</h3>
            </div>
          </div>

          {/* Citrus - Bottom Middle */}
          <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl aspect-square md:aspect-auto min-h-[250px]">
            <Image
              src="/gallary (2).png"
              alt="Citrus"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 md:p-10 flex flex-col justify-end">
              <h3 className="text-2xl md:text-[28px] text-[#E2E2E2]" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Citrus</h3>
            </div>
          </div>

          {/* Woody - Bottom Right */}
          <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl aspect-square md:aspect-auto min-h-[250px]">
            <Image
              src="/gallary (1).png"
              alt="Woody"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 md:p-10 flex flex-col justify-end">
              <h3 className="text-2xl md:text-[28px] text-[#E2E2E2]" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Woody</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
