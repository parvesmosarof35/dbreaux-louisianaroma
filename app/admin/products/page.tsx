"use client";

export default function AdminProductsPage() {
  const products = [
    { id: "PRD-101", name: "Nocturnal Silk", price: "$1,690", stock: "12 Units" },
    { id: "PRD-102", name: "Amber Solstice", price: "$850", stock: "24 Units" },
    { id: "PRD-103", name: "Verdant Mist", price: "$720", stock: "8 Units" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Inventory Management</span>
           <h1 className="text-white text-6xl font-serif">Product Atelier</h1>
        </div>
        <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]">
          Add New Masterpiece
        </button>
      </header>

      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Essence</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Valuation</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-8 px-10 text-white/40 text-xs font-mono">{p.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{p.name}</td>
                             <td className="py-8 text-[#F2CA50] text-sm font-light">{p.price}</td>
                             <td className="py-8 text-white/40 text-xs font-light">{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
