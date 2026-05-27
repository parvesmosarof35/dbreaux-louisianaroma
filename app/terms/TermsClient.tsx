"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TermsClientProps {
  initialTerms: string;
}

export default function TermsClient({ initialTerms }: TermsClientProps) {
  const termsConditions = initialTerms || "";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By entering the digital atelier of Louisianaroma, you acknowledge that you are bound by these terms of service. Our house preserves the right to modify these conditions at any time, reflecting the evolution of our artisanal practices."
    },
    {
      title: "2. Artisanal Commissions",
      content: "Every custom blend created through our 'Art of the Blend' service is a unique olfactory commission. Due to the bespoke nature of these formulations, all custom sales are final and cannot be returned once the maturation process has begun in our Grasse laboratory."
    },
    {
      title: "3. Intellectual Property",
      content: "The 'Louisianaroma' name, our signature bottle designs, and all olfactory formulas are the exclusive intellectual property of our house. Reproduction or imitation of our artistic signatures is strictly prohibited."
    },
    {
      title: "4. Global Concierge & Shipping",
      content: "We provide white-glove international shipping. While we ensure meticulous packaging, Louisianaroma is not responsible for delays caused by international customs or regional postal constraints beyond our control."
    },
    {
      title: "5. Privacy of the Alchemist",
      content: "Your data is treated with the same discretion as our secret formulas. We never share your personal information with external parties, preserving the exclusivity of your relationship with our house."
    },
    {
      title: "6. Limitation of Liability",
      content: "Louisianaroma shall not be held liable for any sensory expectations not met, as fragrance is a subjective art form. We strive for excellence in every extraction, but memory and scent remain personal experiences."
    }
  ];

  return (
    <div className="bg-[#121414] min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-48 pb-32 w-full space-y-24">
        {/* Header Section */}
        <header className="space-y-6 text-center">
           <h1 className="text-white text-6xl md:text-7xl font-serif tracking-tight leading-tight uppercase">Terms & Conditions</h1>
        </header>

        {/* Content Section */}
        {termsConditions ? (
          <section className="space-y-6 group">
             <div className="pl-6 md:pl-12 border-l border-white/5 group-hover:border-[#F2CA50]/20 transition-colors">
               <style dangerouslySetInnerHTML={{ __html: `
                 .rich-text-content p {
                   margin-bottom: 1.5rem;
                   line-height: 1.85;
                   color: rgba(255, 255, 255, 0.6);
                   font-size: 1.125rem;
                   font-weight: 300;
                 }
                 .rich-text-content strong {
                   color: #ffffff;
                   font-weight: 600;
                 }
                 .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
                   color: #ffffff;
                   font-family: var(--font-playfair), serif;
                   margin-top: 2.5rem;
                   margin-bottom: 1.25rem;
                   font-weight: 500;
                   letter-spacing: 0.05em;
                 }
                 .rich-text-content h1 { font-size: 2.25rem; }
                 .rich-text-content h2 { font-size: 1.75rem; }
                 .rich-text-content h3 { font-size: 1.5rem; }
                 .rich-text-content ul, .rich-text-content ol {
                   margin-bottom: 1.5rem;
                   padding-left: 2rem;
                   color: rgba(255, 255, 255, 0.6);
                   font-size: 1.125rem;
                   font-weight: 300;
                 }
                 .rich-text-content ul { list-style-type: disc; }
                 .rich-text-content ol { list-style-type: decimal; }
                 .rich-text-content li { margin-bottom: 0.5rem; }
                 .rich-text-content a {
                   color: #F2CA50;
                   text-decoration: underline;
                   transition: color 0.3s;
                 }
                 .rich-text-content a:hover { color: #ffffff; }
               `}} />
               <div 
                 className="rich-text-content text-white/60 text-base md:text-lg font-light leading-relaxed tracking-wide space-y-6"
                 dangerouslySetInnerHTML={{ __html: termsConditions }}
               />
             </div>
          </section>
        ) : (
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <section key={idx} className="space-y-6 group">
                 <div className="flex items-center gap-6">
                    <div className="text-[#F2CA50] text-sm font-serif opacity-40 group-hover:opacity-100 transition-opacity">0{idx + 1}</div>
                    <h2 className="text-white text-2xl font-serif tracking-wide">{section.title}</h2>
                 </div>
                 <div className="pl-12 border-l border-white/5 group-hover:border-[#F2CA50]/20 transition-colors">
                   <p className="text-white/40 text-base md:text-lg font-light leading-relaxed tracking-wide">
                     {section.content}
                   </p>
                 </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <footer className="pt-24 border-t border-white/5 text-center space-y-8">
           <p className="text-white/20 text-sm font-light italic leading-relaxed max-w-lg mx-auto">
             If you require further clarification regarding our artisanal codes, please reach out to our private concierge.
           </p>
           <a 
             href="/contact" 
             className="inline-block text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase border-b border-[#F2CA50]/40 pb-1 hover:text-white hover:border-white transition-all"
           >
             Contact Concierge
           </a>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
