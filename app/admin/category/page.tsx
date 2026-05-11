"use client";

export default function AdminCategoryPage() {
  const categories = [
    { id: "CAT-01", name: "Oud & Wood", count: "12 Products" },
    { id: "CAT-02", name: "Floral Masterpieces", count: "8 Products" },
    { id: "CAT-03", name: "Amber & Musk", count: "15 Products" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Classification Registry</span>
           <h1 className="text-white text-6xl font-serif">Scent Categories</h1>
        </div>
        <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]">
          Add New Classification
        </button>
      </header>

      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Classification</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-center">Collection Size</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-8 px-10 text-white/40 text-xs font-mono">{c.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{c.name}</td>
                             <td className="py-8 text-center">
                                <span className="text-[#F2CA50] text-xs font-light">{c.count}</span>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
