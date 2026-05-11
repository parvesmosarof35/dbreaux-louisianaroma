"use client";

import { AnalyticsCharts } from "../components/AnalyticsCharts";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-10">
      <header className="space-y-2 md:space-y-4">
         <span className="text-[#F2CA50] text-[8px] md:text-[10px] font-bold tracking-[3px] md:tracking-[4px] uppercase opacity-60">Operations Control</span>
         <h1 className="text-white text-4xl md:text-6xl font-serif">Maison Overview</h1>
      </header>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Alchemists", value: "1,284", trend: "+12%" },
          { label: "Unique Visitors", value: "14,284", trend: "+24%" },
          { label: "Site Visits", value: "82,410", trend: "+18%" },
          { label: "Active Vessels", value: "42", trend: "+5%" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#121414] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 space-y-4 md:space-y-6 hover:border-[#F2CA50]/30 transition-all duration-500">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#F2CA50]/20 rounded-full border border-[#F2CA50]/50" />
              </div>
              <span className="text-green-500 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase bg-green-500/10 px-2 md:px-3 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-white text-2xl md:text-3xl font-serif tracking-tight">{stat.value}</h2>
              <p className="text-white/20 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase leading-relaxed">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Activity Table */}
      <div className="bg-[#121414] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center">
             <h2 className="text-white text-2xl md:text-3xl font-serif">Recent Submissions</h2>
             <button className="text-[#F2CA50] text-[8px] md:text-[10px] font-bold tracking-[2px] md:tracking-[3px] uppercase hover:text-white transition-all">View Archive</button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[600px]">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase py-6 md:py-8 px-6 md:px-10">Identifier</th>
                        <th className="text-white/20 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase py-6 md:py-8">Alchemist</th>
                        <th className="text-white/20 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase py-6 md:py-8 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                      { id: "USR-9921", name: "Alexander Vanderbilt", status: "Validated" },
                      { id: "USR-9842", name: "Isabella Dupont", status: "Pending" },
                      { id: "USR-9715", name: "Julian Sterling", status: "Validated" },
                    ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-6 md:py-8 px-6 md:px-10 text-white/40 text-[10px] md:text-xs font-mono">{row.id}</td>
                             <td className="py-6 md:py-8 text-white text-xs md:text-sm font-medium">{row.name}</td>
                             <td className="py-6 md:py-8">
                                <div className="flex justify-center">
                                  <span className={`text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full ${row.status === "Validated" ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/20"}`}>
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