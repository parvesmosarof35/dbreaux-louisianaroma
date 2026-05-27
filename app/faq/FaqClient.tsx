"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

interface FaqItem {
  id?: string;
  _id?: string;
  question?: string;
  title?: string;
  answer?: string;
  content?: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How do I create a custom blend?",
    answer: "The creation of a bespoke fragrance begins with a private consultation with our master perfumer. Over several months, we explore rare essences and accords to craft a scent that reflects your personal narrative."
  },
  {
    question: "What is the maturation process in Grasse?",
    answer: "Our fragrances undergo a rigorous aging process in our Grasse atelier. This maturation allows the complex oils to bind perfectly, resulting in the deep longevity and sillage that defines Louisianaroma."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we provide secure, insured international shipping to most countries. Each shipment is packaged with white-glove precision to ensure the preservation of the delicate olfactory notes."
  },
  {
    question: "Can I gift a custom fragrance commission?",
    answer: "Absolutely. We offer exclusive gift invitations for our bespoke services, allowing the recipient to embark on their own artistic journey with our master perfumers."
  },
  {
    question: "What is the shelf life of an Essence Noire perfume?",
    answer: "When stored away from light and extreme temperatures, our high-concentration extractions maintain their integrity for several years. We recommend keeping them in their original cases."
  }
];

export default function FAQClient({ initialFaqs }: { initialFaqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchedFaqs = initialFaqs || [];

  // Filter FAQs based on the search term. If fetched FAQs are empty, fall back to brand defaults.
  const activeFaqs = Array.isArray(fetchedFaqs) && fetchedFaqs.length > 0
    ? fetchedFaqs.filter((f) => {
        const q = (f.question || f.title || "").toLowerCase();
        const a = (f.answer || f.content || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return !searchTerm || q.includes(term) || a.includes(term);
      })
    : FAQS.filter((f) => {
        const q = (f.question || "").toLowerCase();
        const a = (f.answer || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return !searchTerm || q.includes(term) || a.includes(term);
      });

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/faqpageherobg.png"
              alt="FAQ Hero"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18, 20, 20, 0) 0%, rgba(18, 20, 20, 0.6) 50%, #121414 100%)" }}></div>
          </div>
          
          <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center">
            
            <h1 className="text-3xl md:text-6xl drop-shadow-2xl mb-8 tracking-tight">
              Questions & Concierge
            </h1>
            <p className="text-white/40 text-sm md:text-xl font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
              Our artisans and concierge are dedicated to the preservation of olfactory excellence. Explore our most frequent inquiries regarding commissions, craftsmanship, and shipping.
            </p>
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="max-w-4xl mx-auto px-6 pt-12">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search the FAQ catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white text-xs font-light outline-none focus:border-[#F2CA50]/50 transition-all placeholder:text-white/20"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </section>

        {/* FAQ List Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-6">
          {activeFaqs.length === 0 ? (
            <div className="text-center text-white/30 font-light text-sm py-12">
              No matching olfactory inquiries found.
            </div>
          ) : (
            activeFaqs.map((faq, index) => {
              const q = faq.question || faq.title || "";
              const a = faq.answer || faq.content || "";
              return (
                <div 
                  key={index} 
                  className="bg-[#1A1C1C] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#F2CA50]/30"
                >
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex justify-between items-center p-6 md:p-8 text-left group"
                  >
                    <h3 className="text-white text-lg md:text-xl font-serif tracking-wide group-hover:text-[#F2CA50] transition-colors">
                      {q}
                    </h3>
                    <span className={`text-[#F2CA50] text-xl transition-transform duration-500 ${openIndex === index ? "rotate-180" : ""}`}>
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-8 text-white/40 text-base font-light leading-relaxed tracking-wide">
                      {a}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
