"use client";

import { useState } from "react";
import { Modal } from "../components/Modal";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: string;
  image?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: "PRD-101", name: "Nocturnal Silk", price: "$1,690", stock: "12 Units", image: "/product (1).png" },
    { id: "PRD-102", name: "Amber Solstice", price: "$850", stock: "24 Units", image: "/product (2).png" },
    { id: "PRD-103", name: "Verdant Mist", price: "$720", stock: "8 Units", image: "/product (3).png" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", image: "" });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock: "", image: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, stock: product.stock, image: product.image || "" });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this masterpiece?")) {
      setProducts(products.filter((p) => p.id !== id));
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
    if (editingProduct) {
      setProducts(products.map((p) => 
        p.id === editingProduct.id ? { ...p, ...formData } : p
      ));
    } else {
      const newId = `PRD-${Math.floor(100 + Math.random() * 900)}`;
      setProducts([...products, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Inventory Management</span>
           <h1 className="text-white text-6xl font-serif">Product Atelier</h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]"
        >
          Add New Masterpiece
        </button>
      </header>

      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">Art</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">ID</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Essence</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Valuation</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Stock</th>
                        <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-10">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group">
                             <td className="py-6 px-10">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                                   {p.image ? (
                                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                   ) : (
                                      <div className="text-[#F2CA50] text-xs font-serif opacity-30">No Image</div>
                                   )}
                                </div>
                             </td>
                             <td className="py-8 text-white/40 text-xs font-mono">{p.id}</td>
                             <td className="py-8 text-white text-sm font-medium">{p.name}</td>
                             <td className="py-8 text-[#F2CA50] text-sm font-light">{p.price}</td>
                             <td className="py-8 text-white/40 text-xs font-light">{p.stock}</td>
                             <td className="py-8 text-right px-10 space-x-4">
                                <button 
                                  onClick={() => handleOpenEdit(p)}
                                  className="text-white/20 hover:text-[#F2CA50] transition-colors text-[10px] font-bold tracking-[2px] uppercase"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(p.id)}
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
        title={editingProduct ? "Refine Masterpiece" : "New Creation"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Area */}
          <div className="space-y-4">
             <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Visual Representation</label>
             <div className="relative group w-full h-48 rounded-[32px] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center overflow-hidden hover:border-[#F2CA50]/30 transition-all">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="text-center space-y-2">
                     <svg className="w-8 h-8 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <p className="text-white/20 text-[9px] font-bold tracking-[1px] uppercase">Upload Masterpiece Artwork</p>
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
              <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Product Name</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                placeholder="e.g. Nocturnal Silk"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Valuation (Price)</label>
                <input 
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                  placeholder="$1,000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[10px] font-bold tracking-[2px] uppercase">Stock Level</label>
                <input 
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F2CA50]/50 transition-all"
                  placeholder="12 Units"
                />
              </div>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)]"
          >
            {editingProduct ? "Update Essence" : "Manifest Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
