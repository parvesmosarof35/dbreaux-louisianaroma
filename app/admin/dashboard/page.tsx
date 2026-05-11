"use client";

export default function AdminDashboard() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
         <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Operations Control</span>
         <h1 className="text-white text-6xl font-serif">Maison Overview</h1>
      </header>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Alchemists", value: "1,284", trend: "+12%" },
          { label: "Active Vessels", value: "42", trend: "+5%" },
          { label: "Bespoke Orders", value: "892", trend: "+18%" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#121414] border border-white/5 rounded-[32px] p-10 space-y-6 hover:border-[#F2CA50]/30 transition-all duration-500">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <div className="w-6 h-6 bg-[#F2CA50]/20 rounded-full border border-[#F2CA50]/50" />
              </div>
              <span className="text-green-500 text-[10px] font-bold tracking-[2px] uppercase bg-green-500/10 px-3 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-white text-4xl font-serif tracking-tight">{stat.value}</h2>
              <p className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase leading-relaxed">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 flex justify-between items-center">
             <h2 className="text-white text-3xl font-serif">Recent Submissions</h2>
             <button className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-all">View Archive</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">Identifier</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Alchemist</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                      { id: "USR-9921", name: "Alexander Vanderbilt", status: "Validated" },
                      { id: "USR-9842", name: "Isabella Dupont", status: "Pending" },
                      { id: "USR-9715", name: "Julian Sterling", status: "Validated" },
                    ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-8 px-10 text-white/40 text-xs font-mono">{row.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{row.name}</td>
                             <td className="py-8">
                                <div className="flex justify-center">
                                  <span className={`text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full ${row.status === "Validated" ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/20"}`}>
                                    {row.status}
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