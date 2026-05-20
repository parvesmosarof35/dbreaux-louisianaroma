"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Toast from "@/components/ui/Toast";
import { getImageUrl } from "@/store/config/envConfig";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/store/api/productApi";

const CATEGORIES = ["Mist", "Oud", "Floral", "Woody", "Citrus", "Amber", "Oriental", "Fresh"];

interface ProductForm {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  isfeatured: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  category: "Mist",
  price: "",
  stock: "",
  description: "",
  isfeatured: false,
};

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const limit = 8;

  const { data: response, isLoading, refetch } = useGetProductsQuery({
    searchTerm: searchTerm || undefined,
    category: filterCategory || undefined,
    page,
    limit,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products: any[] = response?.data?.data || response?.data || [];
  const meta = response?.meta || {};
  const totalPages = meta.totalPage || Math.ceil((meta.total || 1) / limit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "", type: "info", isVisible: false,
  });
  const showToast = (message: string, type: "success" | "error" | "info" = "info") =>
    setToast({ message, type, isVisible: true });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFiles([]);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p._id || p.id);
    setFormData({
      name: p.name || "",
      category: p.category || "Mist",
      price: String(p.price || ""),
      stock: String(p.stock || ""),
      description: p.description || "",
      isfeatured: !!p.isfeatured,
    });
    setImagePreview(getImageUrl(p.images?.[0] || p.image || ""));
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      description: formData.description,
      isfeatured: formData.isfeatured,
    };
    fd.append("data", JSON.stringify(payload));
    imageFiles.forEach((f) => fd.append("images", f));
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct({ id: editingId, formData: buildFormData() }).unwrap();
        showToast("Product updated successfully.", "success");
      } else {
        await createProduct(buildFormData()).unwrap();
        showToast("Product created successfully.", "success");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Operation failed. Please try again.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      showToast("Product dissolved from the registry.", "success");
      setDeleteConfirmId(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete product.", "error");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Inventory Management</span>
          <h1 className="text-white text-5xl md:text-6xl font-serif">Product Atelier</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)] shrink-0"
        >
          + Add New Product
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full bg-[#121414] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:border-[#F2CA50]/50 transition-all placeholder:text-white/20"
          />
          <svg className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="bg-[#121414] border border-white/10 rounded-2xl py-4 px-5 text-white text-xs outline-none focus:border-[#F2CA50]/50 appearance-none pr-10 cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className="w-4 h-4 text-white/20 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <span className="w-10 h-10 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm font-light">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-8">Image</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Product</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Category</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Price</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Stock</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Featured</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-8">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => {
                  const id = p._id || p.id;
                  const imgSrc = getImageUrl(p.images?.[0] || p.image || "");
                  return (
                    <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group">
                      <td className="py-5 px-8">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                          {imgSrc ? (
                            <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-[#F2CA50] text-[8px] opacity-30 uppercase tracking-widest">No Image</div>
                          )}
                        </div>
                      </td>
                      <td className="py-8 text-white text-sm font-medium max-w-[180px]">
                        <p className="font-serif truncate">{p.name}</p>
                        <p className="text-white/30 text-[10px] font-light truncate mt-0.5">{p.description}</p>
                      </td>
                      <td className="py-8">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-[2px] uppercase text-[#F2CA50]">{p.category}</span>
                      </td>
                      <td className="py-8 text-[#F2CA50] text-sm font-light">${p.price}</td>
                      <td className="py-8 text-white/40 text-xs font-light">{p.stock ?? "—"}</td>
                      <td className="py-8">
                        {p.isfeatured ? (
                          <span className="text-[#F2CA50] text-[9px] font-bold tracking-[1px] uppercase">Featured</span>
                        ) : (
                          <span className="text-white/20 text-[9px]">—</span>
                        )}
                      </td>
                      <td className="py-8 text-right px-8 space-x-4">
                        <button onClick={() => handleOpenEdit(p)} className="text-white/20 hover:text-[#F2CA50] transition-colors text-[10px] font-bold tracking-[2px] uppercase">Edit</button>
                        <button onClick={() => setDeleteConfirmId(id)} className="text-white/20 hover:text-red-500 transition-colors text-[10px] font-bold tracking-[2px] uppercase">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <span className="text-xs text-white/40 tracking-[2px] uppercase">Page <span className="text-[#F2CA50] font-semibold">{page}</span> of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-xl w-full p-8 md:p-10 relative space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div>
              <span className="text-[#F2CA50] text-[9px] font-bold tracking-[4px] uppercase opacity-60">Product Atelier</span>
              <h2 className="text-white text-2xl font-serif mt-1">{editingId ? "Refine Masterpiece" : "New Creation"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div
                className="relative w-full h-44 rounded-[24px] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center overflow-hidden hover:border-[#F2CA50]/30 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="text-center space-y-2 pointer-events-none">
                    <svg className="w-8 h-8 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Click to Upload Product Images</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Product Name *</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                  placeholder="e.g. Nocturnal Silk" />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Category *</label>
                <div className="relative">
                  <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 appearance-none cursor-pointer">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#121414]">{c}</option>)}
                  </select>
                  <svg className="w-4 h-4 text-white/20 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Price (USD) *</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="85.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Stock</label>
                  <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="100" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all resize-none"
                  placeholder="A brief description of this creation..." />
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-4 cursor-pointer group">
                <div
                  onClick={() => setFormData({ ...formData, isfeatured: !formData.isfeatured })}
                  className={`w-12 h-6 rounded-full border-2 transition-all duration-300 relative ${formData.isfeatured ? "bg-[#F2CA50] border-[#F2CA50]" : "bg-white/5 border-white/10"}`}
                >
                  <div className={`w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300 ${formData.isfeatured ? "translate-x-6 bg-black" : "translate-x-0.5 bg-white/30"}`} />
                </div>
                <span className="text-white/40 text-[10px] font-bold tracking-[2px] uppercase">Feature this product</span>
              </label>

              <button type="submit" disabled={isCreating || isUpdating}
                className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)] disabled:opacity-40">
                {isCreating || isUpdating ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-md w-full p-8 space-y-6 text-center shadow-2xl">
            <h3 className="text-white text-xl font-serif">Remove Product?</h3>
            <p className="text-white/40 text-xs font-light leading-relaxed">This will permanently remove the product from the Maison's registry. This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleDelete(deleteConfirmId)} disabled={isDeleting}
                className="bg-red-500 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-red-600 transition-all cursor-pointer disabled:opacity-40">
                {isDeleting ? "Removing..." : "Yes, Remove"}
              </button>
              <button onClick={() => setDeleteConfirmId(null)}
                className="bg-white/5 border border-white/10 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />
    </div>
  );
}
