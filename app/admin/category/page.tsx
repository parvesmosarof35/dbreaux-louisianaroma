"use client";

import { useState, useRef } from "react";
import Toast from "@/components/ui/Toast";
import { getImageUrl } from "@/store/config/envConfig";
import {
  useGetAllCollectionsQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} from "@/store/api/collectionApi";

export default function AdminCategoryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, refetch } = useGetAllCollectionsQuery({ page, limit });
  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
  const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();

  const collections: any[] = response?.data?.data || response?.data || [];
  const meta = response?.meta || {};
  const totalPages = meta.totalPage || Math.ceil((meta.total || 1) / limit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "", type: "info", isVisible: false,
  });
  const showToast = (message: string, type: "success" | "error" | "info" = "info") =>
    setToast({ message, type, isVisible: true });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingId(c._id || c.id);
    setName(c.name || "");
    setImagePreview(getImageUrl(c.image || ""));
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.append("data", JSON.stringify({ name }));
    if (imageFile) fd.append("image", imageFile);
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        await updateCollection({ id: editingId, formData: buildFormData() }).unwrap();
        showToast("Collection updated successfully.", "success");
      } else {
        await createCollection(buildFormData()).unwrap();
        showToast("Collection created successfully.", "success");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Operation failed. Please try again.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id).unwrap();
      showToast("Collection dissolved from the registry.", "success");
      setDeleteConfirmId(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete collection.", "error");
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <h1 className="text-white text-5xl md:text-6xl font-serif">Collections</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)] shrink-0"
        >
          + New Collection
        </button>
      </header>

      {/* Table */}
      <div className="bg-[#121414] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <span className="w-10 h-10 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm font-light">No collections found. Create your first one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 px-10">Cover</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">ID</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Collection Name</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Created</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-10">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((c: any) => {
                  const id = c._id || c.id;
                  const imgSrc = getImageUrl(c.image || "");
                  const createdAt = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
                  return (
                    <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300">
                      <td className="py-6 px-10">
                        <div className="w-16 h-16 rounded-[24px] overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                          {imgSrc ? (
                            <img src={imgSrc} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-[#F2CA50] text-[8px] opacity-30 uppercase tracking-widest">No Image</div>
                          )}
                        </div>
                      </td>
                      <td className="py-8 text-white/30 text-[10px] font-mono">{id?.slice(0, 10)}...</td>
                      <td className="py-8 text-white text-sm font-serif font-medium">{c.name}</td>
                      <td className="py-8 text-white/30 text-xs font-light">{createdAt}</td>
                      <td className="py-8 text-right px-10 space-x-4">
                        <button onClick={() => handleOpenEdit(c)} className="text-white/20 hover:text-[#F2CA50] transition-colors text-[10px] font-bold tracking-[2px] uppercase">Edit</button>
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
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-xs text-white/40 tracking-[2px] uppercase">
            Page <span className="text-[#F2CA50] font-semibold">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-lg w-full p-8 md:p-10 relative space-y-6 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div>
              <span className="text-[#F2CA50] text-[9px] font-bold tracking-[4px] uppercase opacity-60">Registry</span>
              <h2 className="text-white text-2xl font-serif mt-1">{editingId ? "Edit Collection" : "New Collection"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div
                className="relative w-full h-40 rounded-[24px] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center overflow-hidden hover:border-[#F2CA50]/30 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="text-center space-y-2 pointer-events-none">
                    <svg className="w-8 h-8 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Upload Collection Cover</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Collection Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                  placeholder="e.g. Summer Olfactory Collection" />
              </div>

              <button type="submit" disabled={isCreating || isUpdating}
                className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)] disabled:opacity-40">
                {isCreating || isUpdating ? "Saving..." : editingId ? "Update Collection" : "Create Collection"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-md w-full p-8 space-y-6 text-center shadow-2xl">
            <h3 className="text-white text-xl font-serif">Dissolve Collection?</h3>
            <p className="text-white/40 text-xs font-light leading-relaxed">This will permanently remove this collection from the registry. This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleDelete(deleteConfirmId)} disabled={isDeleting}
                className="bg-red-500 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-red-600 transition-all cursor-pointer disabled:opacity-40">
                {isDeleting ? "Removing..." : "Yes, Dissolve"}
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
