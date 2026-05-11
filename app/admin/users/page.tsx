"use client";

import { useState } from "react";
import { Modal } from "../components/Modal";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  totalOrders: number;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: "USR-9921", name: "Alexander Vanderbilt", email: "alex@vanderbilt.com", status: "Active", joinDate: "Oct 12, 2025", totalOrders: 12, avatar: "/person (1).png" },
    { id: "USR-9842", name: "Isabella Dupont", email: "isabella@dupont.fr", status: "Active", joinDate: "Nov 05, 2025", totalOrders: 8, avatar: "/person (2).png" },
    { id: "USR-9715", name: "Julian Sterling", email: "julian@sterling.co.uk", status: "Suspended", joinDate: "Jan 18, 2026", totalOrders: 3, avatar: "/person (1).png" },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to purge this alchemist from the registry?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleBlock = (user: User) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    setUsers(users.map((u) => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

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
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">Portrait</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Alchemist</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Email Channel</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-center">Status</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-10">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group">
                             <td className="py-6 px-10">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center font-serif text-[#F2CA50] text-lg">
                                   {u.avatar ? (
                                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                   ) : (
                                      u.name.charAt(0)
                                   )}
                                </div>
                             </td>
                             <td className="py-8 text-white/40 text-xs font-mono">{u.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{u.name}</td>
                             <td className="py-8 text-white/40 text-xs font-light">{u.email}</td>
                             <td className="py-8">
                                <div className="flex justify-center">
                                  <span className={`text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full ${u.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                    {u.status}
                                  </span>
                                </div>
                             </td>
                             <td className="py-8 text-right px-10 space-x-4">
                                <button 
                                  onClick={() => handleViewDetails(u)}
                                  className="text-[#F2CA50] hover:text-white transition-colors text-[9px] font-bold tracking-[2px] uppercase"
                                >
                                  Details
                                </button>
                                <button 
                                  onClick={() => handleToggleBlock(u)}
                                  className="text-white/20 hover:text-orange-500 transition-colors text-[9px] font-bold tracking-[2px] uppercase"
                                >
                                  {u.status === "Active" ? "Block" : "Unblock"}
                                </button>
                                <button 
                                  onClick={() => handleDelete(u.id)}
                                  className="text-white/20 hover:text-red-500 transition-colors text-[9px] font-bold tracking-[2px] uppercase"
                                >
                                  Purge
                                </button>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Alchemist Profile"
      >
        {selectedUser && (
          <div className="space-y-12">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 bg-white/5 rounded-[32px] border border-white/10 overflow-hidden flex items-center justify-center text-4xl text-[#F2CA50] font-serif">
                 {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                 ) : (
                    selectedUser.name.charAt(0)
                 )}
               </div>
               <div className="space-y-2">
                 <h3 className="text-white text-4xl font-serif">{selectedUser.name}</h3>
                 <p className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">{selectedUser.id}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                  <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Channel</p>
                  <p className="text-white text-lg font-light">{selectedUser.email}</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                  <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Registry Date</p>
                  <p className="text-white text-lg font-light">{selectedUser.joinDate}</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                  <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Total Masterpieces</p>
                  <p className="text-white text-lg font-light">{selectedUser.totalOrders} Orders</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                  <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Current Standing</p>
                  <p className={`text-lg font-bold tracking-[2px] uppercase ${selectedUser.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                    {selectedUser.status}
                  </p>
               </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
               <button 
                 onClick={() => { handleToggleBlock(selectedUser); setIsDetailModalOpen(false); }}
                 className="flex-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white hover:text-black transition-all"
               >
                 {selectedUser.status === "Active" ? "Restrict Access" : "Restore Access"}
               </button>
               <button 
                 className="flex-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white hover:text-black transition-all"
               >
                 View Orders
               </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
