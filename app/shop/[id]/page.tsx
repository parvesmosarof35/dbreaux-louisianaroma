"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

const PRODUCTS = [
  { id: 1, category: "Private Reserve", name: "Noire d'Oud", description: "A magnetic depth that captures the essence of midnight in the desert. Intense, sophisticated, and eternally lingering.", notes: "Agarwood, Bulgarian Rose, Ambergris", price: 450, image: "/product (1).png", freeDelivery: true },
  { id: 2, category: "Les Ephemeres", name: "Iris de Minuit", description: "A delicate whisper of the night, where iris and bergamot dance in the moonlit air.", notes: "Iris Pallida, White Musk, Bergamot", price: 320, image: "/product (2).png" },
  { id: 3, category: "L'Heritage", name: "Cuir d'Or", description: "The scent of timeless luxury, blending the richness of fine leather with the warmth of vanilla.", notes: "Russian Leather, Tobacco, Vanilla", price: 280, image: "/product (3).png", freeDelivery: true },
  { id: 4, category: "Private Reserve", name: "Santal Sacré", description: "An olfactory temple of sandalwood and amber, grounding the soul in sacred peace.", notes: "Mysore Sandalwood, Cardamom, Amber", price: 580, image: "/product (4).png" },
  { id: 5, category: "L'Heritage", name: "Ambre Royal", notes: "Fossil Amber, Labdanum, Tonka Bean", price: 295, image: "/product (5).png", freeDelivery: true },
  { id: 6, category: "Les Ephemeres", name: "Vétiver Nuit", notes: "Haitian Vetiver, Black Pepper, Cedar", price: 340, image: "/product (6).png" },
];

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === parseInt(params.id)) || PRODUCTS[0];
  const { refreshCart, showToast } = useCart();

  const addToCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    const newItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description || product.notes,
      isCustom: false
    };
    const updatedCart = [...savedCart, newItem];
    localStorage.setItem("louisianaroma-cart", JSON.stringify(updatedCart));
    refreshCart();
    showToast(`${product.name} has been added to your atelier.`, "success");
  };

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Large Image Container */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#1A1C1C] p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent"></div>
            <div className="relative w-full h-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
              />
            </div>
            {(product as any).freeDelivery && (
              <div className="absolute top-8 left-8 bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-5 py-2 rounded-full shadow-2xl z-10 animate-pulse">
                Free Delivery
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
                Parfum d'Exception
              </span>
              <h1 className="text-white text-6xl md:text-7xl font-serif tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-white/60 text-xl font-light tracking-wide leading-relaxed max-w-xl">
                {product.description || "An olfactory journey of rare essences and precious extractions."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[#F2CA50] text-4xl font-light">${product.price}</div>
              <div className="text-white/30 text-xs font-bold tracking-[2px] uppercase">100ML EAU DE PARFUM</div>
            </div>

            <button 
              onClick={addToCart}
              className="w-full sm:w-80 flex items-center justify-center bg-[#F2CA50] text-black text-xs font-bold tracking-[3px] uppercase py-6 rounded-xl hover:bg-white transition-all duration-500 transform hover:scale-[1.02] shadow-[0_20px_40px_rgba(242,202,80,0.15)]"
            >
              Add to Cart →
            </button>
          </div>
        </div>

        {/* Olfactory Architecture (Notes) */}
        <div className="space-y-20 mb-32">
          <div className="text-center space-y-4">
            <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
              Olfactory Architecture
            </span>
            <h2 className="text-4xl md:text-5xl font-serif">A Symphony of Rare Essences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Top Notes", 
                notes: "Saffron & Cardamom", 
                description: "An immediate, sharp radiance of exotic spices that awakens the senses with a golden glow.",
                icon: "sparkles" 
              },
              { 
                title: "Heart Notes", 
                notes: "Bulgarian Rose & Ambergris", 
                description: "The soul of the fragrance; a velvet floral core intertwined with the mineral saltiness of the sea.",
                icon: "brain" 
              },
              { 
                title: "Base Notes", 
                notes: "Agarwood, Leather & Sandalwood", 
                description: "The lingering dark legacy. Deep, smoky oud and worn leather grounded by creaminess.",
                icon: "tree" 
              }
            ].map((section, idx) => (
              <div key={idx} className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 text-center space-y-6 hover:border-[#F2CA50]/30 transition-colors duration-500">
                <div className="w-16 h-16 bg-[#F2CA50]/10 rounded-full flex items-center justify-center mx-auto">
                   <div className="w-6 h-6 border-2 border-[#F2CA50] rounded-sm rotate-45 opacity-60"></div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase">{section.title}</h4>
                  <p className="text-[#F2CA50] text-lg tracking-wide">{section.notes}</p>
                </div>
                <p className="text-white/30 text-sm font-light italic leading-relaxed px-4">
                  "{section.description}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
                Voice of Distinction
              </span>
              <h2 className="text-4xl md:text-5xl font-serif">Testimonials of Elegance</h2>
            </div>
            <div className="flex items-center gap-4 text-[#F2CA50]">
              <div className="flex gap-1 text-xl">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <span className="text-white/40 text-sm tracking-widest uppercase font-bold">4.9 / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                author: "Julian V.", 
                text: "The most complex oud I have ever experienced. It transforms on the skin throughout the day, revealing layers of leather and saffron I didn't notice initially." 
              },
              { 
                author: "Elena S.", 
                text: "A masterpiece of restraint. It doesn't shout; it whispers power. The longevity is unmatched—it lingers on my silk scarves for days." 
              },
              { 
                author: "Alexander D.", 
                text: "Pure olfactory art. The bottle alone is a sculpture. Every spray feels like entering a private, rain-drenched library in old Florence." 
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 space-y-8 hover:bg-[#222424] transition-colors duration-500">
                <div className="flex gap-1 text-[#F2CA50] text-sm">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-white/70 text-lg font-light italic tracking-wide leading-relaxed">
                  "{t.text}"
                </p>
                <div className="space-y-1">
                  <div className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">{t.author}</div>
                  <div className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Verified Collector</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* FAQ Section */}
        <div className="space-y-20 mt-32">
          <div className="text-center space-y-4">
            <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
              Olfactive Inquiries
            </span>
            <h2 className="text-4xl md:text-5xl font-serif">Frequently Asked</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { 
                q: "What is the concentration of this fragrance?", 
                a: "This creation is an Eau de Parfum Intense, featuring a 20-25% concentration of rare essential oils and absolutes for exceptional depth and sillage." 
              },
              { 
                q: "How long will the scent linger on my skin?", 
                a: "Due to the high quality of our raw materials, you can expect the fragrance to last between 10 to 14 hours. The base notes often remain detectable on skin for over 24 hours." 
              },
              { 
                q: "How should I preserve the integrity of the essence?", 
                a: "To maintain the olfactory profile, store your bottle in a cool, dark environment away from direct sunlight and significant temperature shifts." 
              },
              { 
                q: "What is the best way to experience the full pyramid?", 
                a: "Apply to clean, hydrated pulse points. Avoid rubbing your wrists together, as this can break down the delicate top note molecules and alter the progression." 
              },
              { 
                q: "Is this scent suitable for layering?", 
                a: "While complete on its own, its balanced architecture allows for layering with our 'L'Heritage' collection to create a truly bespoke signature." 
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-[#1A1C1C] border border-white/5 rounded-2xl overflow-hidden hover:border-[#F2CA50]/20 transition-all duration-500">
                <summary className="flex justify-between items-center p-8 cursor-pointer list-none">
                  <h3 className="text-white text-lg font-light tracking-wide">{faq.q}</h3>
                  <div className="relative w-6 h-6 shrink-0">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-[#F2CA50] opacity-40"></div>
                    <div className="absolute top-0 left-1/2 h-full w-px bg-[#F2CA50] opacity-40 group-open:rotate-90 transition-transform duration-500"></div>
                  </div>
                </summary>
                <div className="px-8 pb-8">
                  <p className="text-white/40 text-sm font-light leading-relaxed max-w-2xl border-t border-white/5 pt-6 italic">
                    "{faq.a}"
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
