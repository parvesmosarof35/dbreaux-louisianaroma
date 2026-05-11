"use client";

import { useState } from "react";
import { Modal } from "../components/Modal";

interface Offer {
  id: string;
  title: string;
  discount: string;
  status: string;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([
    { id: "OFF-101", title: "Midnight Solstice", discount: "25% OFF", status: "Active" },
    { id: "OFF-102", title: "Artisan Welcome", discount: "15% OFF", status: "Active" },
    { id: "OFF-103", title: "Autumn Harvest", discount: "10% OFF", status: "Expired" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({ title: "", discount: "", status: "Active" });

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setFormData({ title: "", discount: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({ title: offer.title, discount: offer.discount, status: offer.status });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to terminate this incentive?")) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffer) {
      setOffers(offers.map((o) => 
        o.id === editingOffer.id ? { ...o, ...formData } : o
      ));
    } else {
      const newId = `OFF-${Math.floor(100 + Math.random() * 900)}`;
      setOffers([...offers, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Promotion Architecture</span>
           <h1 className="text-white text-6xl font-serif">Maison Offers</h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]"
        >
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
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-10">Actions</th>
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
                             <td className="py-8 text-right px-10 space-x-4">
                                <button 
                                  onClick={() => handleOpenEdit(o)}
                                  className="text-white/20 hover:text-[#F2CA50] transition-colors text-[10px] font-bold tracking-[2px] uppercase"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(o.id)}
                                  className="text-white/20 hover:text-red-500 transition-colors text-[10px] font-bold tracking-[2px] uppercase"
                                >
                                  Remove
                                </button>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingOffer ? "Refine Incentive" : "New Incentive"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Incentive Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                placeholder="e.g. Midnight Solstice"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Reward (Discount)</label>
                <input 
                  required
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                  placeholder="25% OFF"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]"
          >
            {editingOffer ? "Update Incentive" : "Manifest Incentive"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
