import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

const CART_ITEMS = [
  {
    id: "custom-1",
    name: "The Alchemist's Secret",
    price: 485.00,
    category: "Custom Formulation",
    subCategory: "Extrait de Parfum",
    image: "/product (4).png",
    details: [
      { label: "Oud", value: "45%" },
      { label: "Rose", value: "35%" },
      { label: "Sandalwood", value: "20%" },
    ],
    isCustom: true
  },
  {
    id: "prod-1",
    name: "Noire d'Oud",
    price: 320.00,
    category: "Collection Noire",
    subCategory: "100ML",
    image: "/product (1).png",
    description: "A magnetic interplay of Cambodian Oud and charred leather, softened by the whisper of midnight jasmine.",
    isCustom: false
  }
];

export default function CartPage() {
  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-white text-6xl font-serif mb-4 uppercase tracking-tight">
            Shopping Atelier
          </h1>
          <p className="text-white/40 max-w-xl text-lg font-light leading-relaxed">
            Refining your personal collection of olfactive signatures. Each selection is prepared with artisanal precision.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {CART_ITEMS.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#2A2B1D]/40 border border-[#D4AF37]/10 rounded-2xl p-8 flex flex-col md:flex-row gap-10 hover:border-[#D4AF37]/30 transition-all duration-500"
              >
                {/* Item Image */}
                <div className="relative w-48 aspect-square bg-black/40 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-[#F2CA50] text-3xl font-serif">{item.name}</h3>
                        <p className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">
                          {item.category} • {item.subCategory}
                        </p>
                      </div>
                      <div className="text-white text-3xl font-light">${item.price.toFixed(2)}</div>
                    </div>

                    {item.isCustom ? (
                      <div className="grid grid-cols-3 gap-8">
                        {item.details?.map((detail, idx) => (
                          <div key={idx} className="space-y-1 border-l border-[#D4AF37]/20 pl-4">
                            <div className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">{detail.label}</div>
                            <div className="text-[#F2CA50] text-xl font-light">{detail.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm font-light leading-relaxed max-w-md italic">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-8 pt-8 border-t border-white/5">
                    {item.isCustom && (
                      <button className="flex items-center gap-2 text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase hover:text-white transition-colors">
                        <span className="text-sm">✎</span> Edit Formula
                      </button>
                    )}
                    <button className="flex items-center gap-2 text-white/20 text-[10px] font-bold tracking-[2px] uppercase hover:text-red-400 transition-colors">
                      <span className="text-sm">✕</span> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#2A2B1D] border border-[#D4AF37]/20 rounded-2xl p-10 space-y-10 sticky top-40">
              <h2 className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase border-b border-white/5 pb-6">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-2 group">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE" 
                    className="bg-transparent text-sm font-bold tracking-[2px] outline-none placeholder:text-white/10 w-full"
                  />
                  <button className="text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase hover:text-white transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-6">
                <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white tracking-normal text-sm">$805.00</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-[#F2CA50]">Complimentary</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-[2px] uppercase">
                  <span className="text-white/40">Estimated Tax</span>
                  <span className="text-white tracking-normal text-sm">$64.40</span>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">Total Price</div>
                  </div>
                  <div className="text-[#F2CA50] text-5xl tracking-tighter">$869.40</div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full flex items-center justify-center bg-[#F2CA50] text-black text-xs font-bold tracking-[3px] uppercase py-6 rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)]"
                >
                  Proceed to Checkout
                </Link>

                {/* Badges */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-white/20 text-[9px] font-bold tracking-[1px] uppercase">
                    <svg className="w-4 h-4 text-[#F2CA50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Certificate of authenticity included
                  </div>
                  <div className="flex items-center gap-3 text-white/20 text-[9px] font-bold tracking-[1px] uppercase">
                    <svg className="w-4 h-4 text-[#F2CA50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Secure encrypted transaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
