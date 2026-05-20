"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductCard from "@/components/shop/ProductCard";
import { useGetProductsQuery } from "@/store/api/productApi";

const LIMIT = 9;

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useGetProductsQuery({
    category: selectedCategory || undefined,
    searchTerm: searchTerm || undefined,
    page,
    limit: LIMIT,
  });

  const products: any[] = response?.data?.data || response?.data || [];
  const meta = response?.meta || {};
  const totalPages = meta.totalPage || Math.ceil((meta.total || products.length) / LIMIT) || 1;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleCollectionChange = (col: string) => {
    setSelectedCollection(col);
    // If the API supports collection filter, add it later. For now filter client-side.
    setPage(1);
  };

  // Client-side collection filter (if backend doesn't support it as a param yet)
  const filteredProducts = selectedCollection
    ? products.filter((p: any) => p.collection === selectedCollection || p.collectionName === selectedCollection)
    : products;

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-[#F2CA50] text-5xl md:text-6xl font-serif mb-6">
            The Fragrance Collection
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light tracking-wide">
            Discover an olfactive journey through our most precious extractions and curated blends.
          </p>

          {/* Search bar */}
          <div className="relative mt-10 w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search fragrances..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all placeholder:text-white/20"
            />
            <svg className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Active filters */}
          {(selectedCategory || selectedCollection) && (
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[2px] uppercase text-black bg-[#F2CA50] px-4 py-1.5 rounded-full">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange("")} className="hover:opacity-60 transition-opacity">✕</button>
                </span>
              )}
              {selectedCollection && (
                <span className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[2px] uppercase text-black bg-[#F2CA50] px-4 py-1.5 rounded-full">
                  {selectedCollection}
                  <button onClick={() => handleCollectionChange("")} className="hover:opacity-60 transition-opacity">✕</button>
                </span>
              )}
              <button
                onClick={() => { handleCategoryChange(""); handleCollectionChange(""); }}
                className="text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white/60 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <ShopSidebar
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionChange}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* Product Grid */}
          <div className="flex-1 space-y-16">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#1A1C1C] rounded-2xl p-6 space-y-4 animate-pulse">
                    <div className="aspect-square bg-white/5 rounded-xl" />
                    <div className="h-4 bg-white/5 rounded-lg w-2/3" />
                    <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <p className="text-white/20 text-2xl font-serif">No fragrances found</p>
                <p className="text-white/10 text-sm font-light">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product: any, index: number) => (
                  <ProductCard
                    key={product._id || product.id}
                    _id={product._id || product.id}
                    category={product.category}
                    name={product.name}
                    description={product.description}
                    notes={product.notes}
                    price={product.price}
                    images={product.images}
                    image={product.image}
                    isfeatured={product.isfeatured}
                    priority={index < 3}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="flex justify-center items-center gap-4 pt-8 border-t border-white/5">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#F2CA50] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`pb-1 text-sm transition-colors ${p === page ? "text-[#F2CA50] font-medium border-b border-[#F2CA50]" : "text-white/40 hover:text-white cursor-pointer"}`}
                    >
                      {String(p).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#F2CA50] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
