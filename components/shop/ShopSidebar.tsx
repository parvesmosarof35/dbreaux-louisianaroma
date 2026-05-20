"use client";

import PriceRange from "./PriceRange/PriceRange";
import { useGetAllCollectionsQuery } from "@/store/api/collectionApi";

interface ShopSidebarProps {
  selectedCollection: string;
  onSelectCollection: (name: string) => void;
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

const OLFACTORY_CATEGORIES = ["Mist", "Oud", "Floral", "Woody", "Citrus", "Amber", "Oriental", "Fresh"];

export default function ShopSidebar({
  selectedCollection,
  onSelectCollection,
  selectedCategory,
  onSelectCategory,
}: ShopSidebarProps) {
  const { data: response } = useGetAllCollectionsQuery({});
  const collections: any[] = response?.data?.data || response?.data || [];

  return (
    <aside className="w-full lg:w-64 space-y-12 shrink-0">
      {/* Olfactory Families / Categories */}
      <div className="space-y-6">
        <h3 className="text-[#F2CA50] text-xs font-bold tracking-[3px] uppercase">
          Olfactory Families
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => onSelectCategory("")}
            className={`flex w-full justify-between items-center group transition-colors ${!selectedCategory ? "text-[#F2CA50]" : "text-white/60 hover:text-white"}`}
          >
            <span className="text-lg font-light tracking-wide">All</span>
            <span className={`text-xs ${!selectedCategory ? "text-[#F2CA50]/60" : "text-white/20"}`}>all</span>
          </button>
          {OLFACTORY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(selectedCategory === cat ? "" : cat)}
              className={`flex w-full justify-between items-center group transition-colors ${selectedCategory === cat ? "text-[#F2CA50]" : "text-white/60 hover:text-white"}`}
            >
              <span className="text-lg font-light tracking-wide">{cat}</span>
              {selectedCategory === cat && (
                <span className="text-[10px] text-[#F2CA50]/60">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Collections from API */}
      {collections.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[#F2CA50] text-xs font-bold tracking-[3px] uppercase">
            Collections
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => onSelectCollection("")}
              className={`flex w-full justify-between items-center transition-colors ${!selectedCollection ? "text-[#F2CA50]" : "text-white/60 hover:text-white"}`}
            >
              <span className="text-base font-light tracking-wide">All Collections</span>
            </button>
            {collections.map((col: any) => (
              <button
                key={col._id || col.id}
                onClick={() => onSelectCollection(selectedCollection === col.name ? "" : col.name)}
                className={`flex w-full justify-between items-center transition-colors ${selectedCollection === col.name ? "text-[#F2CA50]" : "text-white/60 hover:text-white"}`}
              >
                <span className="text-base font-light tracking-wide">{col.name}</span>
                {selectedCollection === col.name && (
                  <span className="text-[10px] text-[#F2CA50]/60">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Component */}
      <PriceRange />
    </aside>
  );
}
