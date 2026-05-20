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
}

export default function ProductCard({
  _id, id, category, name, description, notes, price, images, image, priority, isfeatured, freeDelivery,
}: ProductCardProps) {
  const { refreshCart, showToast } = useCart();
  const productId = _id || String(id || "");
  const imgSrc = getImageUrl(images?.[0] || image || "");
  const notesText = notes || description || "";

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="bg-[#1A1C1C] rounded-2xl p-6 group transition-all duration-500 hover:bg-[#222424] hover:translate-y-[-8px]">
      {/* Product Image */}
      <div className="relative aspect-square mb-8 rounded-xl overflow-hidden bg-black/40">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-xs font-serif">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {(freeDelivery || isfeatured) && (
          <div className="absolute top-4 right-4 bg-[#F2CA50] text-black text-[8px] font-bold tracking-[2px] uppercase px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse">
            {isfeatured ? "Featured" : "Free Delivery"}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase opacity-70">{category}</span>
          <h3 className="text-white text-3xl font-serif tracking-tight leading-tight">{name}</h3>
        </div>

        {notesText && (
          <p className="text-white/40 text-sm font-light tracking-wide line-clamp-1">{notesText}</p>
        )}

        <div className="text-[#F2CA50] text-2xl font-light pt-2">${price}</div>

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={addToCart}
            className="flex-1 flex items-center justify-center bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold tracking-[2px] uppercase py-4 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            Add to Cart
          </button>
          <Link
            href={`/shop/${productId}`}
            className="flex-1 flex items-center justify-center border border-white/10 text-white/60 text-[11px] font-bold tracking-[2px] uppercase py-4 rounded-lg hover:border-white/40 hover:text-white transition-all duration-300"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
