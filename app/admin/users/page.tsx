"use client";

export default function AdminUsersPage() {
  const users = [
    { id: "USR-9921", name: "Alexander Vanderbilt", email: "alex@vanderbilt.com", status: "Active" },
    { id: "USR-9842", name: "Isabella Dupont", email: "isabella@dupont.fr", status: "Active" },
    { id: "USR-9715", name: "Julian Sterling", email: "julian@sterling.co.uk", status: "Suspended" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Directory Management</span>
           <h1 className="text-white text-6xl font-serif">Alchemist Registry</h1>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search registry..."
            className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 text-sm text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
          />
        </div>
      </header>

      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Alchemist</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Email Channel</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-8 px-10 text-white/40 text-xs font-mono">{u.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{u.name}</td>
                             <td className="py-8 text-white/40 text-xs font-light">{u.email}</td>
                             <td className="py-8">
                                <div className="flex justify-center">
                                  <span className={`text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full ${u.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                    {u.status}
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
