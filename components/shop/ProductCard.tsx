"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { getImageUrl } from "@/store/config/envConfig";

interface ProductCardProps {
  _id?: string;
  id?: string | number;
  category: string;
  name: string;
  description?: string;
  notes?: string;
  price: number;
  images?: string[];
  image?: string;
  priority?: boolean;
  isfeatured?: boolean;
  freeDelivery?: boolean;
  stock?: number;
  isAvailable?: boolean;
}

export default function ProductCard({
  _id,
  id,
  category,
  name,
  description,
  notes,
  price,
  images,
  image,
  priority,
  isfeatured,
  freeDelivery,
  stock,
  isAvailable = true,
}: ProductCardProps) {
  const { refreshCart, showToast } = useCart();
  const productId = _id || String(id || "");
  const imgSrc = getImageUrl(images?.[0] || image || "");
  const notesText = notes || description || "";

  // Out of stock if stock <= 0 or isAvailable is false
  const isOutOfStock = (stock !== undefined && stock <= 0) || isAvailable === false;

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    const savedCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    const newItem = {
      id: `${productId}-${Date.now()}`,
      name,
      category,
      price,
      image: imgSrc,
      description: notesText,
      isCustom: false,
    };
    const updatedCart = [...savedCart, newItem];
    localStorage.setItem("louisianaroma-cart", JSON.stringify(updatedCart));
    refreshCart();
    showToast(`${name} has been added to your atelier.`, "success");
  };

  return (
    <div className="bg-[#1A1C1C] rounded-2xl p-4 sm:p-6 group transition-all duration-500 hover:bg-[#222424] hover:translate-y-[-8px] flex flex-col justify-between h-full border border-white/5 hover:border-white/10 shadow-lg">
      <div>
        {/* Product Image */}
        <div className="relative aspect-square mb-6 sm:mb-8 rounded-xl overflow-hidden bg-black/40">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 text-xs font-serif">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {(freeDelivery || isfeatured) && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#F2CA50] text-black text-[8px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full shadow-lg z-10">
              {isfeatured ? "Featured" : "Free Delivery"}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <h3 className="text-white text-xl sm:text-2xl font-serif tracking-tight leading-tight line-clamp-2">
              {name}
            </h3>
          </div>

          {notesText && (
            <p className="text-white/40 text-[11px] sm:text-xs font-light tracking-wide line-clamp-1">
              {notesText}
            </p>
          )}

          {/* Pricing & Stock Indicator */}
          <div className="flex justify-between items-center pt-1.5">
            <div className="text-[#F2CA50] text-xl sm:text-2xl font-light">${price}</div>
            {isOutOfStock ? (
              <span className="text-red-400/95 text-[8px] sm:text-[9px] font-bold tracking-[1.5px] uppercase bg-red-950/20 border border-red-500/20 px-2 py-0.5 sm:py-1 rounded-md">
                Sold Out
              </span>
            ) : (
              <span className="text-emerald-400/95 text-[8px] sm:text-[9px] font-bold tracking-[1.5px] uppercase bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 sm:py-1 rounded-md">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3 pt-5 sm:pt-6 mt-auto">
        <button
          onClick={addToCart}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center text-[9px] sm:text-[10px] font-bold tracking-[1.5px] sm:tracking-[2px] uppercase py-3 sm:py-4 rounded-lg transition-all duration-300 cursor-pointer outline-none ${
            isOutOfStock
              ? "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
              : "bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <Link
          href={`/shop/${productId}`}
          className="flex-1 flex items-center justify-center border border-white/10 text-white/60 text-[9px] sm:text-[10px] font-bold tracking-[1.5px] sm:tracking-[2px] uppercase py-3 sm:py-4 rounded-lg hover:border-white/40 hover:text-white transition-all duration-300 cursor-pointer"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
