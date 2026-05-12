import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductCard from "@/components/shop/ProductCard";

const PRODUCTS = [
  { id: 1, category: "Private Reserve", name: "Noire d'Oud", notes: "Agarwood, Bulgarian Rose, Ambergris", price: 450, image: "/product (1).png", freeDelivery: true },
  { id: 2, category: "Les Ephemeres", name: "Iris de Minuit", notes: "Iris Pallida, White Musk, Bergamot", price: 320, image: "/product (2).png" },
  { id: 3, category: "L'Heritage", name: "Cuir d'Or", notes: "Russian Leather, Tobacco, Vanilla", price: 280, image: "/product (3).png", freeDelivery: true },
  { id: 4, category: "Private Reserve", name: "Santal Sacré", notes: "Mysore Sandalwood, Cardamom, Amber", price: 580, image: "/product (4).png" },
  { id: 5, category: "L'Heritage", name: "Ambre Royal", notes: "Fossil Amber, Labdanum, Tonka Bean", price: 295, image: "/product (5).png", freeDelivery: true },
  { id: 6, category: "Les Ephemeres", name: "Vétiver Nuit", notes: "Haitian Vetiver, Black Pepper, Cedar", price: 340, image: "/product (6).png" },
];

export const metadata = {
  title: "Fragrance Collection | Louisianaroma",
  description: "Discover an olfactive journey through our most precious extractions and curated blends.",
};

export default function ShopPage() {
  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <h1 className="text-[#F2CA50] text-5xl md:text-6xl font-serif mb-6">
            The Fragrance Collection
          </h1>
          <p className="text-white/40 max-w-2xl text-lg font-light tracking-wide">
            Discover an olfactive journey through our most precious extractions and curated blends.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <ShopSidebar />

          {/* Product Grid */}
          <div className="flex-1 space-y-24">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {PRODUCTS.map((product, index) => (
                <ProductCard key={product.id} {...product} priority={index < 3} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 pt-8 border-t border-white/5">
              <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#F2CA50] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex items-center gap-6">
                <span className="text-[#F2CA50] font-medium border-b border-[#F2CA50] pb-1">01</span>
                <span className="text-white/40 hover:text-white cursor-pointer transition-colors pb-1">02</span>
                <span className="text-white/40 hover:text-white cursor-pointer transition-colors pb-1">03</span>
                <span className="text-white/20 pb-1">...</span>
                <span className="text-white/40 hover:text-white cursor-pointer transition-colors pb-1">12</span>
              </div>
              <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#F2CA50] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
