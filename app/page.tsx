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
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            {/* Perfume Bottle Image (Floating) */}
            <div className="mb-12 animate-float">
              <Image
                src="/bottleofperfume.png"
                alt="Signature Perfume"
                width={300}
                height={400}
                className="mx-auto drop-shadow-[0_0_50px_rgba(235,193,84,0.3)]"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[var(--primary)] mb-6 drop-shadow-sm">
              Create Your Signature Scent
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Create a fragrance that defines you. A beautiful blend crafted for your unique presence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-primary w-full sm:w-auto">
                Create Your Fragrance
              </button>
              <button className="btn-outline w-full sm:w-auto">
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

        {/* Feature Section */}
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">The Art of Blending</h2>
              <div className="h-1 w-20 bg-[var(--primary)] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-[var(--primary)] text-2xl">01</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Your Base</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Select from our curated collection of base notes that form the foundation of your scent.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-[var(--primary)] text-2xl">02</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Add Heart Notes</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Layer floral, spicy, or woody middle notes to give your fragrance its true character.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-[var(--primary)] text-2xl">03</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Finish with Top Notes</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Add light, refreshing top notes for that perfect first impression that lingers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
