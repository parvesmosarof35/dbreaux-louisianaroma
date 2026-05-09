import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
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
            {/* Perfume Bottle - Centered and atmospheric */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-40 mix-blend-screen pointer-events-none">

            </div>

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

        {/* The Art of Creation Section */}
        <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-normal text-[#D4AF37] mb-6" style={{ fontFamily: "var(--font-noto-serif)" }}>
                The Art of Creation
              </h2>
              <div className="h-[1px] w-24 bg-[#D4AF37]/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="mb-10 text-[#D4AF37] transform transition-transform duration-500 group-hover:scale-110">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5 20H5.5L10.5 11.5V5H13.5V11.5L18.5 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5 5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-normal mb-6 text-white" style={{ fontFamily: "var(--font-playfair)" }}>Choose fragrances</h3>
                <p className="text-sm leading-relaxed text-white/60 max-w-[280px]">
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
                <h3 className="text-2xl font-normal mb-6 text-white" style={{ fontFamily: "var(--font-playfair)" }}>Customize blend</h3>
                <p className="text-sm leading-relaxed text-white/60 max-w-[280px]">
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
                <h3 className="text-2xl font-normal mb-6 text-white" style={{ fontFamily: "var(--font-playfair)" }}>Receive your scent</h3>
                <p className="text-sm leading-relaxed text-white/60 max-w-[280px]">
                  Your unique formula is hand made with meticulous quality control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Masterpieces Section */}
        <section className="py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-normal text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Masterpieces</h2>
              <p className="text-white/50 text-sm uppercase tracking-[4px]">Our Finest Collections</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="relative aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer">
                  <Image
                    src={`/Masterpieces (${num}).png`}
                    alt={`Masterpiece ${num}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <h4 className="text-white text-xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Collection {num}</h4>
                    <button className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold hover:underline decoration-1 underline-offset-4">Explore Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
