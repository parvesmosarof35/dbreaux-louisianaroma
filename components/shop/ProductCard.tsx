import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  category: string;
  name: string;
  notes: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, category, name, notes, price, image }: ProductCardProps) {
  return (
    <div className="bg-[#1A1C1C] rounded-2xl p-6 group transition-all duration-500 hover:bg-[#222424] hover:translate-y-[-8px]">
      {/* Product Image */}
      <div className="relative aspect-square mb-8 rounded-xl overflow-hidden bg-black/40">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase opacity-70">
            {category}
          </span>
          <h3 className="text-white text-3xl font-serif tracking-tight leading-tight">
            {name}
          </h3>
        </div>
        
        <p className="text-white/40 text-sm font-light tracking-wide line-clamp-1">
          {notes}
        </p>

        <div className="text-[#F2CA50] text-2xl font-light pt-2">
          ${price}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          <Link 
            href="/cart"
            className="flex-1 flex items-center justify-center bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold tracking-[2px] uppercase py-4 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            Add to Cart
          </Link>
          <Link 
            href={`/shop/${id}`}
            className="flex-1 flex items-center justify-center border border-white/10 text-white/60 text-[11px] font-bold tracking-[2px] uppercase py-4 rounded-lg hover:border-white/40 hover:text-white transition-all duration-300"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
