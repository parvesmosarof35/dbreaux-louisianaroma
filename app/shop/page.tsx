"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductCard from "@/components/shop/ProductCard";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useGetAllCollectionsQuery } from "@/store/api/collectionApi";

const LIMIT = 9;

export default function ShopPage() {
  /** ObjectId of the selected collection, or "" for All */
  const [selectedCollection, setSelectedCollection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Resolve collection name for active-filter chip display
  const { data: collectionsResp } = useGetAllCollectionsQuery({});
  const allCollections: any[] = collectionsResp?.data?.data || collectionsResp?.data || [];
  const selectedCollectionName =
    allCollections.find((c: any) => (c._id || c.id) === selectedCollection)?.name ?? "";

  const { data: response, isLoading } = useGetProductsQuery({
    category:   selectedCollection || undefined,
    searchTerm: searchTerm        || undefined,
    page,
    limit: LIMIT,
  });

  const products: any[] = response?.data?.data || response?.data || [];
  const meta       = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || meta.totalPage || Math.ceil((meta.total || products.length) / LIMIT) || 1;

  const handleCollectionChange = (id: string) => {
    setSelectedCollection(id);
    setPage(1);
  };

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">

        {/* ── Active filter chip (mobile + desktop) ── */}
        {selectedCollection && (
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <span className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[2px] uppercase text-black bg-[#F2CA50] px-4 py-1.5 rounded-full">
              {selectedCollectionName || selectedCollection}
              <button
                onClick={() => handleCollectionChange("")}
                className="hover:opacity-60 transition-opacity"
              >
                ✕
              </button>
            </span>
            <button
              onClick={() => handleCollectionChange("")}
              className="text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white/60 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Main layout ── */}
        {/*
          ShopSidebar renders a MOBILE toggle bar (lg:hidden) AND a DESKTOP aside (hidden lg:flex).
          We place ONE instance here inside the flex container so the desktop aside sits beside
          the product grid, while the mobile bar stacks above it naturally.
        */}
        <div className="flex flex-col lg:flex-row gap-16">
          <ShopSidebar
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionChange}
            selectedCategory=""
            onSelectCategory={() => {}}
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
            ) : products.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <p className="text-white/20 text-2xl font-serif">No fragrances found</p>
                <p className="text-white/10 text-sm font-light">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product: any, index: number) => {
                  // API returns images as object array: [{ image: url, position }]
                  // ProductCard expects images?: string[] — extract the URL strings
                  const imageUrls: string[] = Array.isArray(product.images)
                    ? product.images.map((img: any) =>
                        typeof img === "object" ? (img.image || img.url || "") : img
                      ).filter(Boolean)
                    : [];
                  return (
                    <ProductCard
                      key={product._id || product.id}
                      _id={product._id || product.id}
                      category={product.category}
                      name={product.name}
                      description={product.description}
                      notes={product.notes}
                      price={product.price}
                      images={imageUrls}
                      image={product.image}
                      isfeatured={product.isfeatured}
                      priority={index < 3}
                    />
                  );
                })}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`pb-1 text-sm transition-colors ${
                        p === page
                          ? "text-[#F2CA50] font-medium border-b border-[#F2CA50]"
                          : "text-white/40 hover:text-white cursor-pointer"
                      }`}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
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
