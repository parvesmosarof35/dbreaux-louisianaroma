"use client";

export default function AdminOffersPage() {
  const offers = [
    { id: "OFF-101", title: "Midnight Solstice", discount: "25% OFF", status: "Active" },
    { id: "OFF-102", title: "Artisan Welcome", discount: "15% OFF", status: "Active" },
    { id: "OFF-103", title: "Autumn Harvest", discount: "10% OFF", status: "Expired" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Promotion Architecture</span>
           <h1 className="text-white text-6xl font-serif">Maison Offers</h1>
        </div>
        <button className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]">
          Create New Incentive
        </button>
      </header>

      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Incentive</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Reward</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {offers.map((o, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-8 px-10 text-white/40 text-xs font-mono">{o.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{o.title}</td>
                             <td className="py-8 text-[#F2CA50] text-sm font-light">{o.discount}</td>
                             <td className="py-8">
                                <div className="flex justify-center">
                                  <span className={`text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full ${o.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/20"}`}>
                                    {o.status}
                                  </span>
                                </div>
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
