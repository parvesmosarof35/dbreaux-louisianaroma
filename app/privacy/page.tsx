"use client";

import { useGetPrivacyQuery } from "@/store/api/settingApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const { data: privacyResponse, isLoading } = useGetPrivacyQuery({});
  
  const privacyPolicy = privacyResponse?.data?.PrivacyPolicy || privacyResponse?.data?.privacyPolicy || "";

  const sections = [
    {
      title: "I. Collection of Essences (Data Collection)",
      content: "When you engage with our digital atelier, we collect information necessary to fulfill your artisanal requests. This includes identity details, delivery coordinates, and the olfactory preferences used to curate your personal collection."
    },
    {
      title: "II. Preservation of Secrets (Data Security)",
      content: "The sanctity of your data is of paramount importance. We utilize enterprise-grade encryption to ensure that your private commissions and personal narratives remain confidential, protected by modern digital fortifications."
    },
    {
      title: "III. Olfactory Profiling (Cookies & Tracking)",
      content: "Our house utilizes subtle digital markers to remember your preferences and guide your journey through our collections. These cookies allow us to personalize your experience, ensuring the Maison feels like your private sanctuary."
    },
    {
      title: "IV. Third-Party Artisans",
      content: "We only share your information with trusted partners who assist in the materialization of your scents—such as our master perfumers in Grasse and our global logistics couriers. They are bound by the same strict codes of discretion as our own house."
    },
    {
      title: "V. The Alchemist's Rights",
      content: "You retain full control over your digital legacy. At any moment, you may request to view, modify, or purge your records from our archives, invoking your right to be forgotten within the annals of our history."
    },
    {
      title: "VI. Contact the Conservator",
      content: "For all inquiries regarding the stewardship of your data, our dedicated Data Privacy Conservator is available to provide detailed insights into our preservation practices."
    }
  ];

  return (
    <div className="bg-[#121414] min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-48 pb-32 w-full space-y-24">
        {/* Header Section */}
        <header className="space-y-6 text-center">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Data Stewardship</span>
           <h1 className="text-white text-6xl md:text-7xl font-serif tracking-tight leading-tight uppercase">Privacy Policy</h1>
           <div className="w-24 h-px bg-[#F2CA50]/30 mx-auto"></div>
           <p className="text-white/40 text-lg font-light italic leading-relaxed max-w-xl mx-auto">
             How Maison Louisianaroma honors and protects the digital identity of our esteemed collectors.
           </p>
        </header>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : privacyPolicy ? (
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
                 dangerouslySetInnerHTML={{ __html: privacyPolicy }}
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
             Your trust is our most precious extraction. We remain committed to the absolute transparency of our data governance.
           </p>
           <a 
             href="/contact" 
             className="inline-block text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase border-b border-[#F2CA50]/40 pb-1 hover:text-white hover:border-white transition-all"
           >
             Privacy Inquiry
           </a>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
