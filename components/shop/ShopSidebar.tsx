"use client";

import { useState } from "react";
import PriceRange from "./PriceRange/PriceRange";
import { useGetAllCollectionsQuery } from "@/store/api/collectionApi";

interface Collection {
  id: string;
  name: string;
  numberOfProducts?: number;
}

interface ShopSidebarProps {
  /** ObjectId of the selected collection, or "" for All */
  selectedCollection: string;
  onSelectCollection: (id: string) => void;
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  minPrice: number;
  maxPrice: number;
  minLimit: number;
  maxLimit: number;
  onPriceChange: (min: number, max: number) => void;
}

export default function ShopSidebar({
  selectedCollection,
  onSelectCollection,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  minLimit,
  maxLimit,
  onPriceChange,
}: ShopSidebarProps) {
  const { data: response } = useGetAllCollectionsQuery({});
  const rawCollections: any[] = response?.data?.data || response?.data || [];

  // Normalise to { id, name, numberOfProducts }
  const collections: Collection[] = rawCollections.map((c: any) => ({
    id: c._id || c.id,
    name: c.name,
    numberOfProducts: c.numberOfProducts ?? 0,
  }));

  const CollectionChips = () => (
    <div className="space-y-3">
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
          <span>
            {col.name} ({col.numberOfProducts})
          </span>
          {selectedCollection === col.id && (
            <span className="text-[10px] text-[#F2CA50]/60">✓</span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col space-y-12">
      {collections.length > 0 && (
        <div className="space-y-4">
          <p className="text-[9px] font-bold tracking-[3px] uppercase text-white/30">
            Collections
          </p>
          <CollectionChips />
        </div>
      )}
      <PriceRange
        minPrice={minPrice}
        maxPrice={maxPrice}
        minLimit={minLimit}
        maxLimit={maxLimit}
        onChange={onPriceChange}
      />
    </aside>
  );
}
