"use client";

import { useState } from "react";
import PriceRange from "./PriceRange/PriceRange";
import { useGetAllCollectionsQuery } from "@/store/api/collectionApi";

interface Collection {
  id: string;
  name: string;
}

interface ShopSidebarProps {
  /** ObjectId of the selected collection, or "" for All */
  selectedCollection: string;
  onSelectCollection: (id: string) => void;
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export default function ShopSidebar({
  selectedCollection,
  onSelectCollection,
  selectedCategory,
  onSelectCategory,
}: ShopSidebarProps) {
  const { data: response } = useGetAllCollectionsQuery({});
  const rawCollections: any[] = response?.data?.data || response?.data || [];

  // Normalise to { id, name }
  const collections: Collection[] = rawCollections.map((c: any) => ({
    id: c._id || c.id,
    name: c.name,
  }));

  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedName = collections.find((c) => c.id === selectedCollection)?.name ?? "";

  // ─── SHARED CHIP LIST ───────────────────────────────────────────────────────
  const CollectionChips = ({ compact }: { compact?: boolean }) => (
    <div className={compact ? "flex flex-wrap gap-2" : "space-y-3"}>
      {compact ? (
        <>
          <button
            onClick={() => onSelectCollection("")}
            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[1px] uppercase transition-all ${
              !selectedCollection
                ? "bg-[#F2CA50] border-[#F2CA50] text-black"
                : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
            }`}
          >
            All
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSelectCollection(selectedCollection === col.id ? "" : col.id)}
              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[1px] uppercase transition-all ${
                selectedCollection === col.id
                  ? "bg-[#F2CA50] border-[#F2CA50] text-black"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {col.name}
            </button>
          ))}
        </>
      ) : (
        <>
          <button
            onClick={() => onSelectCollection("")}
            className={`flex w-full items-center gap-2 transition-colors text-sm font-light tracking-wide ${
              !selectedCollection ? "text-[#F2CA50]" : "text-white/60 hover:text-white"
            }`}
          >
            All Collections
            {!selectedCollection && <span className="text-[10px] text-[#F2CA50]/60 ml-auto">✓</span>}
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSelectCollection(selectedCollection === col.id ? "" : col.id)}
              className={`flex w-full justify-between items-center transition-colors text-sm font-light tracking-wide ${
                selectedCollection === col.id ? "text-[#F2CA50]" : "text-white/60 hover:text-white"
              }`}
            >
              <span>{col.name}</span>
              {selectedCollection === col.id && (
                <span className="text-[10px] text-[#F2CA50]/60">✓</span>
              )}
            </button>
          ))}
        </>
      )}
    </div>
  );

  // ─── MOBILE BAR ────────────────────────────────────────────────────────────
  const MobileBar = (
    <div className="lg:hidden w-full">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          aria-expanded={mobileOpen}
          aria-label="Toggle filters"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6M11 16h2" />
          </svg>
          <span className="text-[10px] font-bold tracking-[3px] uppercase">Filter</span>
          {(selectedCollection || selectedCategory) && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2CA50] ml-1" />
          )}
          <svg
            className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {/* Selected label */}
        {selectedName && (
          <span className="text-[9px] font-bold tracking-[2px] uppercase text-[#F2CA50]/70">
            {selectedName}
          </span>
        )}
      </div>

      {/* Collapsible panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1A1C1C] border border-white/5 rounded-2xl p-4 space-y-5">
          {collections.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] font-bold tracking-[3px] uppercase text-white/30">Collections</p>
              <CollectionChips compact />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[9px] font-bold tracking-[3px] uppercase text-white/30">Price Range</p>
            <PriceRange compact />
          </div>

          {(selectedCollection || selectedCategory) && (
            <button
              onClick={() => { onSelectCollection(""); onSelectCategory(""); setMobileOpen(false); }}
              className="w-full py-2 rounded-xl border border-white/10 text-white/40 text-[9px] font-bold tracking-[2px] uppercase hover:text-white/70 hover:border-white/20 transition-all"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ─── DESKTOP SIDEBAR ────────────────────────────────────────────────────────
  const DesktopSidebar = (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col space-y-12">
      {collections.length > 0 && (
        <div className="space-y-4">
          <p className="text-[9px] font-bold tracking-[3px] uppercase text-white/30">Collections</p>
          <CollectionChips />
        </div>
      )}
      <PriceRange />
    </aside>
  );

  return (
    <>
      {MobileBar}
      {DesktopSidebar}
    </>
  );
}
