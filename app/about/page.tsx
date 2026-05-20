"use client";

import { useGetAboutUsQuery } from "@/store/api/settingApi";
import { getImageUrl } from "@/store/config/envConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const { data: aboutUsResponse, isLoading } = useGetAboutUsQuery({});
  const aboutUsData = aboutUsResponse?.data;

  // Resolve dynamic images securely with fallback
  const aboutUsImageSrc = aboutUsData?.aboutusimage 
    ? getImageUrl(aboutUsData.aboutusimage) 
    : "/aboutpageimage2.png";
    
  const adminImageSrc = aboutUsData?.adminimage 
    ? getImageUrl(aboutUsData.adminimage) 
    : "/aboutpageimage3.png";

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/aboutpageherobg.png"
              alt="Heritage Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18, 20, 20, 0) 0%, rgba(18, 20, 20, 0.6) 50%, #121414 100%)" }}></div>
          </div>
          
          <div className="relative z-10 text-center max-w-5xl px-6">
             <h1 className="text-3xl md:text-6xl lg:text-7xl drop-shadow-2xl mb-8 uppercase tracking-[6px] md:tracking-[10px] leading-tight">
                The Heritage of Scent
             </h1>
             <div className="w-16 md:w-24 h-px bg-[#F2CA50]/40 mx-auto"></div>
          </div>
        </section>

        {/* Bespoke Artistry Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
                  EST. 1924
                </span>
                <h2 className="text-5xl md:text-6xl font-serif text-white leading-tight">
                  Bespoke Artistry
                </h2>
              </div>
              
              {isLoading ? (
                <div className="flex items-center py-10">
                  <span className="w-8 h-8 border-3 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : aboutUsData?.aboutus ? (
                <div className="space-y-6 text-white/40 text-lg font-light leading-relaxed tracking-wide">
                  <style dangerouslySetInnerHTML={{ __html: `
                    .about-rich-content p {
                      margin-bottom: 1.5rem;
                      line-height: 1.85;
                      color: rgba(255, 255, 255, 0.4);
                    }
                    .about-rich-content strong {
                      color: #ffffff;
                      font-weight: 500;
                    }
                  `}} />
                  <div 
                    className="about-rich-content"
                    dangerouslySetInnerHTML={{ __html: aboutUsData.aboutus }}
                  />
                </div>
              ) : (
                <div className="space-y-6 text-white/40 text-lg font-light leading-relaxed tracking-wide">
                  <p>
                    Born from the quiet cobblestone streets of post-war Paris, L'Essence Noire was founded with a singular, uncompromising vision: to capture the ephemeral nature of memory within a crystal flacon. Our origins are rooted in the private commissions of the avant-garde elite, where every scent was a handwritten letter to the senses.
                  </p>
                  <p>
                    For a century, we have remained a family-held secret, preserving the formulas of our ancestors while pushing the boundaries of olfactory science. Our heritage is not just in our past, but in the relentless pursuit of the extraordinary.
                  </p>
                </div>
              )}
            </div>

            <div className="relative aspect-[4/5] bg-[#1A1C1C] p-4 rounded-lg shadow-2xl overflow-hidden group">
               <div className="relative w-full h-full rounded overflow-hidden">
                  <img
                    src={aboutUsImageSrc}
                    alt="Bespoke Bottle"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* The Master Perfumer Section */}
        <section className="bg-[#0D0E0E] py-16 md:py-40">
           <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                 <div className="relative aspect-square order-2 lg:order-1">
                    <div className="absolute inset-0 border border-[#F2CA50]/20 translate-x-6 translate-y-6 rounded-2xl"></div>
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                       <img
                         src={adminImageSrc}
                         alt="Master Alchemist Portrait"
                         className="w-full h-full object-cover"
                       />
                    </div>
                 </div>

                 <div className="space-y-10 order-1 lg:order-2">
                    <div className="space-y-4">
                       <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
                         The Master Perfumer
                       </span>
                       <h2 className="text-5xl md:text-6xl font-serif text-white">
                         Jean-Pierre Valois
                       </h2>
                    </div>

                    <div className="space-y-8">
                       {aboutUsData?.adminmessage ? (
                         <div className="space-y-4">
                           <style dangerouslySetInnerHTML={{ __html: `
                             .alchemist-message-content p {
                               line-height: 1.4;
                               font-family: var(--font-playfair), serif;
                               font-style: italic;
                               color: rgba(255, 255, 255, 0.85);
                               font-size: 1.875rem;
                             }
                             .alchemist-message-content strong {
                               color: #F2CA50;
                               font-weight: 500;
                             }
                           `}} />
                           <div 
                             className="alchemist-message-content"
                             dangerouslySetInnerHTML={{ __html: aboutUsData.adminmessage }}
                           />
                         </div>
                       ) : (
                         <p className="text-white text-3xl font-serif italic tracking-wide leading-snug opacity-80">
                            "A perfume is not a product; it is a ghost. It is the lingering presence of a memory you haven't had yet."
                         </p>
                       )}
                       
                       <p className="text-white/40 text-lg font-light leading-relaxed tracking-wide">
                          With over forty years of expertise, Jean-Pierre is the architect of our contemporary collection. Known as 'The Ghost Maker' in Grasse, he possesses the rare ability to translate abstract emotions into complex chemical symmetries.
                       </p>
                       
                       <Link 
                         href="/shop"
                         className="inline-block bg-[#D4AF37] text-black text-[11px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-lg hover:bg-white transition-all duration-500 shadow-xl text-center"
                       >
                         Explore the Collection
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
