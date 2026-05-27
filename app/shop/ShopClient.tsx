"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductCard from "@/components/shop/ProductCard";
import PriceRange from "@/components/shop/PriceRange/PriceRange";

interface ShopClientProps {
  initialProducts: any[];
  collections: any[];
  globalMinPrice: number;
  globalMaxPrice: number;
  totalPages: number;
  initialFilters: {
    category: string;
    searchTerm: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
    page: number;
    limit: number;
  };
}

export default function ShopClient({
  initialProducts,
  collections,
  globalMinPrice,
  globalMaxPrice,
  totalPages,
  initialFilters,
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Local interactive filter state
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || globalMinPrice,
    initialFilters.maxPrice || globalMaxPrice,
  ]);
  const [limit, setLimit] = useState(initialFilters.limit);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync state with incoming initialFilters on URL changes
  useEffect(() => {
    setSearchTerm(initialFilters.searchTerm);
    setPriceRange([
      initialFilters.minPrice || globalMinPrice,
      initialFilters.maxPrice || globalMaxPrice,
    ]);
    setLimit(initialFilters.limit);
    setSortBy(initialFilters.sortBy);
  }, [initialFilters, globalMinPrice, globalMaxPrice]);

  // Resolve collection name for active filter chip display
  const selectedCollection = initialFilters.category;
  const selectedCollectionName =
    collections.find((c: any) => c.id === selectedCollection)?.name ?? "";

  // Helper to build URL query parameters and navigate
  const navigateWithFilters = (updates: Record<string, any>) => {
    const params = new URLSearchParams();

    // Merge current filters with updates
    const category = updates.category !== undefined ? updates.category : selectedCollection;
    const search = updates.searchTerm !== undefined ? updates.searchTerm : searchTerm;
    const minP = updates.minPrice !== undefined ? updates.minPrice : priceRange[0];
    const maxP = updates.maxPrice !== undefined ? updates.maxPrice : priceRange[1];
    const sBy = updates.sortBy !== undefined ? updates.sortBy : sortBy;
    const pLimit = updates.limit !== undefined ? updates.limit : limit;
    const pNum = updates.page !== undefined ? updates.page : initialFilters.page;

    if (category) params.set("category", category);
    if (search) params.set("searchTerm", search);
    if (minP !== undefined && minP !== globalMinPrice) params.set("minPrice", String(minP));
    if (maxP !== undefined && maxP !== globalMaxPrice) params.set("maxPrice", String(maxP));
    if (sBy) params.set("sortBy", sBy);
    if (pLimit && pLimit !== 20) params.set("limit", String(pLimit));
    if (pNum && pNum !== 1) params.set("page", String(pNum));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounced search input
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      navigateWithFilters({ searchTerm: value, page: 1 });
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleCollectionChange = (id: string) => {
    navigateWithFilters({
      category: id,
      page: 1,
      // Reset price limits back to full scope on collection changes
      minPrice: globalMinPrice,
      maxPrice: globalMaxPrice,
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    // Immediately navigate to load server data on range releases or input commits
    navigateWithFilters({ minPrice: min, maxPrice: max, page: 1 });
  };

  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 lg:pt-40 pb-24">

        {/* ── Active filter chip ── */}
        {selectedCollection && (
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <span className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[2px] uppercase text-black bg-[#F2CA50] px-4 py-1.5 rounded-full">
              {selectedCollectionName || selectedCollection}
              <button
                onClick={() => handleCollectionChange("")}
                className="hover:opacity-60 transition-opacity cursor-pointer"
              >
                ✕
              </button>
            </span>
            <button
              onClick={() => handleCollectionChange("")}
              className="text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none outline-none"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-16">
          <ShopSidebar
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionChange}
            selectedCategory=""
            onSelectCategory={() => {}}
            minPrice={priceRange[0]}
            maxPrice={priceRange[1]}
            minLimit={globalMinPrice}
            maxLimit={globalMaxPrice}
            onPriceChange={handlePriceRangeChange}
          />

          {/* Product Grid container */}
          <div className="flex-1 space-y-8">
            
            {/* Top control bar: Search, Show limit & Sort By + Mobile Filters */}
            <div className="flex flex-col bg-[#1A1C1C] border border-white/5 rounded-2xl px-4 sm:px-6 py-4 mb-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                
                {/* Search input + Mobile Filter Trigger */}
                <div className="flex items-center gap-3 w-full md:max-w-xs">
                  {/* Mobile-only Filter Button */}
                  <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="lg:hidden flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-[#121414] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium cursor-pointer"
                    aria-expanded={mobileOpen}
                    aria-label="Toggle filters"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6M11 16h2" />
                    </svg>
                    <span className="text-[10px] font-bold tracking-[2px] uppercase">Filter</span>
                    {(selectedCollection || priceRange[0] !== globalMinPrice || priceRange[1] !== globalMaxPrice) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F2CA50]" />
                    )}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dynamic search input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search fragrances..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full bg-[#121414] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white outline-none focus:border-[#F2CA50]/50 transition-all placeholder:text-white/20 font-light"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-4 w-full md:w-auto justify-between sm:justify-end">
                  {/* Show items select */}
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">Show:</span>
                    <select 
                      value={limit} 
                      onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        setLimit(newLimit);
                        navigateWithFilters({ limit: newLimit, page: 1 });
                      }}
                      className="bg-[#121414] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#F2CA50]/50 font-light"
                    >
                      <option value={9}>09</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Sort By select */}
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase font-serif">Sort By:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => {
                        const newSort = e.target.value;
                        setSortBy(newSort);
                        navigateWithFilters({ sortBy: newSort, page: 1 });
                      }}
                      className="bg-[#121414] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#F2CA50]/50 font-light"
                    >
                      <option value="">Default</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Collapsible Mobile filter panel */}
              <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileOpen ? "max-h-[500px] opacity-100 mt-4 pt-4 border-t border-white/5" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-5">
                  {collections.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold tracking-[3px] uppercase text-white/30">Collections</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCollectionChange("")}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[1px] uppercase transition-all cursor-pointer ${
                            !selectedCollection
                              ? "bg-[#F2CA50] border-[#F2CA50] text-black"
                              : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          All
                        </button>
                        {collections.map((col: any) => {
                          const colId = col._id || col.id;
                          return (
                            <button
                              key={colId}
                              onClick={() => handleCollectionChange(selectedCollection === colId ? "" : colId)}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[1px] uppercase transition-all cursor-pointer ${
                                selectedCollection === colId
                                  ? "bg-[#F2CA50] border-[#F2CA50] text-black"
                                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                              }`}
                            >
                              {col.name} ({col.numberOfProducts ?? 0})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-[9px] font-bold tracking-[3px] uppercase text-white/30">Price Range</p>
                    <PriceRange 
                      compact 
                      minPrice={priceRange[0]}
                      maxPrice={priceRange[1]}
                      minLimit={globalMinPrice}
                      maxLimit={globalMaxPrice}
                      onChange={(min, max) => handlePriceRangeChange(min, max)}
                    />
                  </div>

                  {(selectedCollection || priceRange[0] !== globalMinPrice || priceRange[1] !== globalMaxPrice) && (
                    <button
                      onClick={() => {
                        handleCollectionChange("");
                        handlePriceRangeChange(globalMinPrice, globalMaxPrice);
                        setMobileOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl border border-white/10 text-white/40 text-[9px] font-bold tracking-[2px] uppercase hover:text-white/70 hover:border-white/20 transition-all cursor-pointer bg-transparent"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {initialProducts.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <p className="text-white/20 text-2xl font-serif">No fragrances found</p>
                <p className="text-white/10 text-sm font-light">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {initialProducts.map((product: any, index: number) => {
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
                      stock={product.stock}
                      isAvailable={product.isAvailable}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-8 border-t border-white/5">
                <button
                  onClick={() => navigateWithFilters({ page: Math.max(initialFilters.page - 1, 1) })}
                  disabled={initialFilters.page === 1}
                  className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#F2CA50] transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-none outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => navigateWithFilters({ page: p })}
                      className={`pb-1 text-sm transition-colors bg-transparent border-none outline-none ${
                        p === initialFilters.page
                          ? "text-[#F2CA50] font-medium border-b border-[#F2CA50]"
                          : "text-white/40 hover:text-white cursor-pointer"
                      }`}
                    >
                      {String(p).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => navigateWithFilters({ page: Math.min(initialFilters.page + 1, totalPages) })}
                  disabled={initialFilters.page === totalPages}
                  className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#F2CA50] transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-none outline-none"
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
