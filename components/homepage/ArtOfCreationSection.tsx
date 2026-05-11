export default function ArtOfCreationSection() {
  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-normal text-[#D4AF37] mb-6" style={{ fontFamily: "var(--font-noto-serif)" }}>
            The Art of Creation
          </h2>
          <div className="h-[1px] w-24 bg-[#D4AF37]/30 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-10 text-[#D4AF37] transform transition-transform duration-500 group-hover:scale-110">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 20H5.5L10.5 11.5V5H13.5V11.5L18.5 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[28px] font-normal mb-6 text-[#E2E2E2] max-w-[244px] mx-auto" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Choose fragrances</h3>
            <p className="text-base font-normal text-[#D0C5AF] max-w-[309px] mx-auto" style={{ fontFamily: "var(--font-inter)", lineHeight: "24px" }}>
              Select from over 100 rare, artisanal essences sourced from around the globe.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-10 text-[#D4AF37] transform transition-transform duration-500 group-hover:scale-110">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="6" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="18" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="17" cy="17" r="1" fill="currentColor" opacity="0.4"/>
                <circle cx="7" cy="7" r="1" fill="currentColor" opacity="0.4"/>
                <circle cx="17" cy="7" r="1" fill="currentColor" opacity="0.4"/>
                <circle cx="7" cy="17" r="1" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            <h3 className="text-[28px] font-normal mb-6 text-[#E2E2E2] max-w-[244px] mx-auto" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Customize blend</h3>
            <p className="text-base font-normal text-[#D0C5AF] max-w-[309px] mx-auto" style={{ fontFamily: "var(--font-inter)", lineHeight: "24px" }}>
              Adjust the intensity of each scent balancing the formula to your choosing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-10 text-[#D4AF37] transform transition-transform duration-500 group-hover:scale-110">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="currentColor"/>
                <path d="M19 16L20 19.5L23.5 20.5L20 21.5L19 25L18 21.5L14.5 20.5L18 19.5L19 16Z" fill="currentColor" opacity="0.6"/>
                <path d="M5 16L5.5 18L7.5 18.5L5.5 19L5 21L4.5 19L2.5 18.5L4.5 18L5 16Z" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            <h3 className="text-[28px] font-normal mb-6 text-[#E2E2E2] max-w-[244px] mx-auto" style={{ fontFamily: "var(--font-noto-serif)", lineHeight: "36.4px" }}>Receive your scent</h3>
            <p className="text-base font-normal text-[#D0C5AF] max-w-[309px] mx-auto" style={{ fontFamily: "var(--font-inter)", lineHeight: "24px" }}>
              Your unique formula is hand made with meticulous quality control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
