"use client";

import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useGetProductQuery } from "@/store/api/productApi";
import { getImageUrl } from "@/store/config/envConfig";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: response, isLoading, isError } = useGetProductQuery(id);
  const { refreshCart, showToast } = useCart();

  const product = response?.data || response;

  const addToCart = () => {
    if (!product) return;
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    const imgSrc = getImageUrl(product.images?.[0] || product.image || "");
    const newItem = {
      id: `${product._id || product.id}-${Date.now()}`,
      name: product.name,
      category: product.category,
      price: product.price,
      image: imgSrc,
      description: product.description || "",
      isCustom: false,
    };
    const updatedCart = [...savedCart, newItem];
    localStorage.setItem("louisianaroma-cart", JSON.stringify(updatedCart));
    refreshCart();
    showToast(`${product.name} has been added to your atelier.`, "success");
  };

  if (isLoading) {
    return (
      <div className="bg-[#121414] min-h-screen text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-pulse">
            <div className="aspect-square rounded-3xl bg-white/5" />
            <div className="space-y-6">
              <div className="h-4 bg-white/5 rounded-lg w-1/4" />
              <div className="h-12 bg-white/5 rounded-lg w-3/4" />
              <div className="h-3 bg-white/5 rounded-lg w-full" />
              <div className="h-3 bg-white/5 rounded-lg w-2/3" />
              <div className="h-10 bg-white/5 rounded-xl w-32 mt-6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-[#121414] min-h-screen text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24 text-center space-y-6">
          <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">404</span>
          <h1 className="text-white text-5xl font-serif">Fragrance Not Found</h1>
          <p className="text-white/40 text-lg font-light">This creation may have been moved or is no longer available.</p>
          <Link href="/shop" className="inline-block mt-6 bg-[#F2CA50] text-black text-xs font-bold tracking-[3px] uppercase px-8 py-4 rounded-xl hover:bg-white transition-all">
            Return to the Atelier
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const imgSrc = getImageUrl(product.images?.[0] || product.image || "");
  const extraImages: string[] = (product.images || []).slice(1).map((img: string) => getImageUrl(img));

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/20 text-[10px] font-bold tracking-[2px] uppercase mb-16">
          <Link href="/shop" className="hover:text-[#F2CA50] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white/40">{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Large Image Container */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#1A1C1C] p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
            <div className="relative w-full h-full">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 font-serif text-xl">No Image</div>
              )}
            </div>
            {product.isfeatured && (
              <div className="absolute top-8 left-8 bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-5 py-2 rounded-full shadow-2xl z-10 animate-pulse">
                Featured
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">
                {product.category || "Parfum d'Exception"}
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
              <div className="text-white/30 text-xs font-bold tracking-[2px] uppercase">
                {product.stock ? `${product.stock} units in stock` : "Eau De Parfum"}
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full sm:w-80 flex items-center justify-center bg-[#F2CA50] text-black text-xs font-bold tracking-[3px] uppercase py-6 rounded-xl hover:bg-white transition-all duration-500 transform hover:scale-[1.02] shadow-[0_20px_40px_rgba(242,202,80,0.15)]"
            >
              Add to Atelier →
            </button>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {extraImages.length > 0 && (
          <div className="flex gap-4 mb-32 overflow-x-auto pb-2">
            {[imgSrc, ...extraImages].map((src, i) => (
              <div key={i} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <Image src={src} alt={`${product.name} view ${i + 1}`} width={96} height={96} className="object-cover w-full h-full" unoptimized />
              </div>
            ))}
          </div>
        )}

        {/* Olfactory Architecture */}
        <div className="space-y-20 mb-32">
          <div className="text-center space-y-4">
            <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">Olfactory Architecture</span>
            <h2 className="text-4xl md:text-5xl font-serif">A Symphony of Rare Essences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Top Notes", notes: "Saffron & Cardamom", description: "An immediate, sharp radiance of exotic spices that awakens the senses with a golden glow." },
              { title: "Heart Notes", notes: "Bulgarian Rose & Ambergris", description: "The soul of the fragrance; a velvet floral core intertwined with the mineral saltiness of the sea." },
              { title: "Base Notes", notes: "Agarwood, Leather & Sandalwood", description: "The lingering dark legacy. Deep, smoky oud and worn leather grounded by creaminess." },
            ].map((section, idx) => (
              <div key={idx} className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 text-center space-y-6 hover:border-[#F2CA50]/30 transition-colors duration-500">
                <div className="w-16 h-16 bg-[#F2CA50]/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 border-2 border-[#F2CA50] rounded-sm rotate-45 opacity-60" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase">{section.title}</h4>
                  <p className="text-[#F2CA50] text-lg tracking-wide">{section.notes}</p>
                </div>
                <p className="text-white/30 text-sm font-light italic leading-relaxed px-4">&quot;{section.description}&quot;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">Voice of Distinction</span>
              <h2 className="text-4xl md:text-5xl font-serif">Testimonials of Elegance</h2>
            </div>
            <div className="flex items-center gap-4 text-[#F2CA50]">
              <div className="flex gap-1 text-xl">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
              <span className="text-white/40 text-sm tracking-widest uppercase font-bold">4.9 / 5.0</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { author: "Julian V.", text: "The most complex oud I have ever experienced. It transforms on the skin throughout the day, revealing layers of leather and saffron." },
              { author: "Elena S.", text: "A masterpiece of restraint. It doesn't shout; it whispers power. The longevity is unmatched—it lingers on my silk scarves for days." },
              { author: "Alexander D.", text: "Pure olfactory art. The bottle alone is a sculpture. Every spray feels like entering a private, rain-drenched library in old Florence." },
            ].map((t, idx) => (
              <div key={idx} className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 space-y-8 hover:bg-[#222424] transition-colors duration-500">
                <div className="flex gap-1 text-[#F2CA50] text-sm">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
                <p className="text-white/70 text-lg font-light italic tracking-wide leading-relaxed">&quot;{t.text}&quot;</p>
                <div className="space-y-1">
                  <div className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">{t.author}</div>
                  <div className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Verified Collector</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Shop */}
        <div className="text-center mt-24">
          <Link href="/shop" className="inline-flex items-center gap-3 text-white/40 hover:text-[#F2CA50] transition-colors text-sm font-light tracking-wide group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Return to the Fragrance Collection
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
