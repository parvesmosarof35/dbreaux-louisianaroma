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
    // images is [{ image: url, position }] — extract the URL string
    const firstImg = product.images?.[0];
    const firstImgUrl = typeof firstImg === "object" ? (firstImg?.image || firstImg?.url || "") : (firstImg || "");
    const imgSrc = getImageUrl(firstImgUrl || product.image || "");
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

  // Normalise images — API returns [{ image: url, position }] objects
  const normaliseImg = (img: any): string =>
    typeof img === "object" ? (img?.image || img?.url || "") : (img || "");

  const imgSrc      = getImageUrl(normaliseImg(product.images?.[0]) || product.image || "");
  const extraImages = (product.images || []).slice(1).map((img: any) => getImageUrl(normaliseImg(img))).filter(Boolean);

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

        {/* Sizes, Tags & Product Details */}
        {(product.sizes?.length > 0 || product.tags?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {product.sizes?.length > 0 && (
              <div className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 space-y-6">
                <h3 className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase">Available Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string, i: number) => (
                    <span key={i} className="px-5 py-2.5 border border-[#F2CA50]/30 text-[#F2CA50] text-sm font-light tracking-widest rounded-full hover:bg-[#F2CA50]/10 transition-colors cursor-pointer">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.tags?.length > 0 && (
              <div className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 space-y-6">
                <h3 className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase">Fragrance Profile</h3>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-sm font-light tracking-widest rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQs */}
        {product.faqs?.filter((f: any) => f.isvisible !== false).length > 0 && (
          <div className="space-y-8 mb-32">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">Questions & Answers</span>
              <h2 className="text-4xl md:text-5xl font-serif">Frequently Asked</h2>
            </div>
            <div className="space-y-4">
              {product.faqs
                .filter((f: any) => f.isvisible !== false)
                .map((faq: any, idx: number) => (
                  <div key={idx} className="bg-[#1A1C1C] border border-white/5 rounded-2xl p-8 space-y-3 hover:border-[#F2CA50]/20 transition-colors duration-300">
                    <h4 className="text-white text-lg font-serif">{faq.question}</h4>
                    <p className="text-white/50 text-sm font-light leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-12 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-80">Voice of Distinction</span>
              <h2 className="text-4xl md:text-5xl font-serif">Testimonials</h2>
            </div>
            {product.reviews?.length > 0 && (
              <div className="flex items-center gap-4 text-[#F2CA50]">
                <div className="flex gap-1 text-xl">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
                <span className="text-white/40 text-sm tracking-widest uppercase font-bold">{product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
          {product.reviews?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.reviews.map((r: any, idx: number) => (
                <div key={idx} className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-10 space-y-8 hover:bg-[#222424] transition-colors duration-500">
                  <div className="flex gap-1 text-[#F2CA50] text-sm">
                    {[...Array(r.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-white/70 text-lg font-light italic tracking-wide leading-relaxed">&quot;{r.comment || r.text || r.review}&quot;</p>
                  <div className="space-y-1">
                    <div className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">{r.user?.name || r.author || "Anonymous"}</div>
                    <div className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Verified Collector</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-3xl">
              <p className="text-white/20 font-serif text-xl">No reviews yet</p>
              <p className="text-white/10 text-sm mt-2 font-light">Be the first to share your experience.</p>
            </div>
          )}
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
