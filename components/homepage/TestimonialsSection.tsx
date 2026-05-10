import Image from "next/image";

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <p className="text-[#D4AF37] text-[10px] font-normal tracking-[1px] uppercase mb-4" style={{ fontFamily: "var(--font-inter)" }}>
            The Experience
          </p>
          <h2 className="text-5xl font-normal text-white" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "48px", letterSpacing: "0.4px" }}>
            Voices of Distinction
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Testimonial 1 */}
          <div className="relative pl-12 border-l border-[#D4AF37]/20">
            <blockquote className="text-[#ffffff] text-base font-normal italic mb-10 leading-[24px]" style={{ fontFamily: "var(--font-inter)" }}>
              "Louisianaroma has transformed my relationship with fragrance. My custom blend isn't just a scent; it's a second skin that people now associate solely with my presence."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image
                  src="/person (1).png"
                  alt="Eleanor V."
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white text-base font-normal" style={{ fontFamily: "var(--font-inter)" }}>Eleanor V.</p>
                <p className="text-[#D4AF37] text-[10px] font-normal tracking-[1px] uppercase" style={{ fontFamily: "var(--font-inter)" }}>Fashion Director</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="relative pl-12 border-l border-[#D4AF37]/20">
            <blockquote className="text-[#ffffff] text-base font-normal italic mb-10 leading-[24px]" style={{ fontFamily: "var(--font-inter)" }}>
              "The blending process was an olfactory journey. The result is a sophisticated, woody profile that lasts all day and commands respect in every room I enter."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image
                  src="/person (2).png"
                  alt="Julian M."
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white text-base font-normal" style={{ fontFamily: "var(--font-inter)" }}>Julian M.</p>
                <p className="text-[#D4AF37] text-[10px] font-normal tracking-[1px] uppercase" style={{ fontFamily: "var(--font-inter)" }}>Wine Negotiant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
