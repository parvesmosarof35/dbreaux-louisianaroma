"use client";

import { useState } from "react";
import { Modal } from "../components/Modal";

interface Category {
  id: string;
  name: string;
  count: string;
  image?: string;
}

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "CAT-01", name: "Oud & Wood", count: "12 Products", image: "/product (1).png" },
    { id: "CAT-02", name: "Floral Masterpieces", count: "8 Products", image: "/product (2).png" },
    { id: "CAT-03", name: "Amber & Musk", count: "15 Products", image: "/product (3).png" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", count: "", image: "" });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", count: "0 Products", image: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, count: category.count, image: category.image || "" });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map((c) => 
        c.id === editingCategory.id ? { ...c, ...formData } : c
      ));
    } else {
      const newId = `CAT-${String(categories.length + 1).padStart(2, '0')}`;
      setCategories([...categories, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Classification Registry</span>
           <h1 className="text-white text-6xl font-serif">Scent Categories</h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]"
        >
          Add New Classification
        </button>
      </header>

      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">Iconography</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Classification</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-center">Collection Size</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-10">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                             <td className="py-6 px-10">
                                <div className="w-16 h-16 rounded-[24px] overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                                   {c.image ? (
                                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                   ) : (
                                      <div className="text-[#F2CA50] text-[8px] font-serif opacity-30 uppercase tracking-widest text-center">No Icon</div>
                                   )}
                                </div>
                             </td>
                             <td className="py-8 text-white/40 text-xs font-mono">{c.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{c.name}</td>
                             <td className="py-8 text-center">
                                <span className="text-[#F2CA50] text-xs font-light">{c.count}</span>
                             </td>
                             <td className="py-8 text-right px-10 space-x-4">
                                <button 
                                  onClick={() => handleOpenEdit(c)}
                                  className="text-white/20 hover:text-[#F2CA50] transition-colors text-[10px] font-bold tracking-[2px] uppercase"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(c.id)}
                                  className="text-white/20 hover:text-red-500 transition-colors text-[10px] font-bold tracking-[2px] uppercase"
                                >
                                  Delete
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
        title={editingCategory ? "Modify classification" : "New category"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
             <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Category Icon</label>
             <div className="relative group w-full h-40 rounded-[32px] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center overflow-hidden hover:border-[#F2CA50]/30 transition-all">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="text-center space-y-2">
                     <svg className="w-8 h-8 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <p className="text-white/20 text-[9px] font-bold tracking-[1px] uppercase">Upload Category Visual</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Category Name</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                placeholder="e.g. Oud & Wood"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Initial Count</label>
              <input 
                required
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                placeholder="0 Products"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]"
          >
            {editingCategory ? "Update Classification" : "Create Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
