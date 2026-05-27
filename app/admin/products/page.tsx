"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Toast from "@/components/ui/Toast";
import { getImageUrl } from "@/store/config/envConfig";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/store/api/productApi";
import { useGetAllCollectionsQuery } from "@/store/api/collectionApi";
import { useAuthState } from "@/store/hooks";
import { uploadCardImage } from "@/utils/uploadCardImage";
import { revalidateProducts } from "@/app/actions/products";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Collection { id: string; name: string; }

interface FaqItem { question: string; answer: string; isvisible: boolean; }

interface SectionTwoCard {
  /** Raw File selected by the user — not sent to API */
  imageFile: File | null;
  /** Resolved Cloudinary URL — this is what goes into the API payload */
  imageUrl: string;
  /** Upload state for this card's image */
  uploadState: "idle" | "uploading" | "done" | "error";
  slogan: string;
  title: string;
  description: string;
}

interface SectionTwo {
  show: boolean;
  title: string;
  description: string;
  cards: SectionTwoCard[];
}

interface ProductForm {
  name: string;
  label: string;
  /** MongoDB ObjectId of the Collection */
  category: string;
  price: string;
  stock: string;
  description: string;
  isfeatured: boolean;
  isAvailable: boolean;
  hasfreedelivery: boolean;
  sizes: string[];
  tags: string[];
  faqs: FaqItem[];
  /** Existing image URLs (for edit mode) */
  existingImages: { image: string; position: number }[];
  sectiontwo: SectionTwo | null;
}

const emptySectionTwo: SectionTwo = {
  show: true, title: "", description: "", cards: [],
};

const emptySectionTwoCard: SectionTwoCard = {
  imageFile: null, imageUrl: "", uploadState: "idle",
  slogan: "", title: "", description: "",
};

const emptyForm: ProductForm = {
  name: "", label: "", category: "", price: "", stock: "",
  description: "", isfeatured: false, isAvailable: true,
  hasfreedelivery: false, sizes: [], tags: [], faqs: [], existingImages: [],
  sectiontwo: null,
};

const emptyFaq: FaqItem = { question: "", answer: "", isvisible: true };

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer">
      <div onClick={onChange} className={`w-12 h-6 rounded-full border-2 transition-all duration-300 relative ${value ? "bg-[#F2CA50] border-[#F2CA50]" : "bg-white/5 border-white/10"}`}>
        <div className={`w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300 ${value ? "translate-x-6 bg-black" : "translate-x-0.5 bg-white/30"}`} />
      </div>
      <span className="text-white/40 text-[10px] font-bold tracking-[2px] uppercase">{label}</span>
    </label>
  );
}

// ── TagInput component ────────────────────────────────────────────────────────
function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2CA50]/10 border border-[#F2CA50]/30 rounded-full text-[10px] font-bold tracking-[1px] uppercase text-[#F2CA50]">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="hover:opacity-60 transition-opacity leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
          placeholder={placeholder || "Type and press Enter"}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all placeholder:text-white/20"
        />
        <button type="button" onClick={add} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-[#F2CA50] hover:border-[#F2CA50]/30 transition-all text-[10px] font-bold tracking-[2px] uppercase">Add</button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [page, setPage]                     = useState(1);
  const [searchTerm, setSearchTerm]         = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const limit = 8;

  // Admin JWT token — required to authenticate the card-image upload endpoint
  const { token } = useAuthState();

  const { data: collectionsResponse } = useGetAllCollectionsQuery({});
  const collections: Collection[] = (collectionsResponse?.data?.data || collectionsResponse?.data || [])
    .map((c: any) => ({ id: c._id || c.id, name: c.name as string }));
  const collectionById = (id: string) => collections.find((c) => c.id === id)?.name ?? id;

  const { data: response, isLoading, refetch } = useGetProductsQuery({
    searchTerm: searchTerm || undefined,
    category: filterCategory || undefined,
    page, limit,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products: any[]  = response?.data || [];
  const meta             = response?.meta || {};
  const totalPages       = meta.totalPages || meta.totalPage || Math.ceil((meta.total || 1) / limit);

  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [editingId, setEditingId]               = useState<string | null>(null);
  const [formData, setFormData]                 = useState<ProductForm>(emptyForm);
  const [imageFiles, setImageFiles]             = useState<File[]>([]);
  const [imagePreview, setImagePreview]         = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId]   = useState<string | null>(null);
  const fileInputRef                            = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "", type: "info", isVisible: false,
  });
  const showToast = (message: string, type: "success" | "error" | "info" = "info") =>
    setToast({ message, type, isVisible: true });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenAdd = () => {
    setEditingId(null); setFormData(emptyForm);
    setImageFiles([]); setImagePreview(""); setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p._id || p.id);
    // Normalise existing images into { image, position } array
    const existingImages: { image: string; position: number }[] =
      Array.isArray(p.images)
        ? p.images.map((img: any, idx: number) =>
            typeof img === "object"
              ? { image: img.image || img.url || "", position: img.position ?? idx }
              : { image: img, position: idx }
          )
        : p.image
        ? [{ image: p.image, position: 0 }]
        : [];
    const rawS2 = p.sectiontwo;
    const sectiontwo: SectionTwo | null = rawS2
      ? {
          show:        rawS2.show !== false,
          title:       rawS2.title       || "",
          description: rawS2.description || "",
          cards: Array.isArray(rawS2.cards)
            ? rawS2.cards.map((c: any) => ({
                imageFile:   null,
                imageUrl:    c.image       || "",
                uploadState: (c.image ? "done" : "idle") as SectionTwoCard["uploadState"],
                slogan:      c.slogan      || "",
                title:       c.title       || "",
                description: c.description || "",
              }))
            : [],
        }
      : null;
    setFormData({
      name:            p.name            || "",
      label:           p.label           || p.name || "",
      category:        p.category        || "",
      price:           String(p.price    || ""),
      stock:           String(p.stock    || ""),
      description:     p.description     || "",
      isfeatured:      !!p.isfeatured,
      isAvailable:     p.isAvailable     !== false,
      hasfreedelivery: !!p.hasfreedelivery,
      sizes:           Array.isArray(p.sizes) ? p.sizes : [],
      tags:            Array.isArray(p.tags)  ? p.tags  : [],
      faqs:            Array.isArray(p.faqs)  ? p.faqs.map((f: any) => ({
        question: f.question || "", answer: f.answer || "", isvisible: f.isvisible !== false,
      })) : [],
      existingImages,
      sectiontwo,
    });
    const firstImg = existingImages[0];
    setImagePreview(getImageUrl(firstImg?.image || ""));
    setImageFiles([]); setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) { setImageFiles(files); setImagePreview(URL.createObjectURL(files[0])); }
  };

  /**
   * Build a FormData payload matching the backend's multipart/form-data expectation.
   * - JSON fields (including existingImages) are stringified into body.data
   * - New image files are appended as individual file entries
   * The backend reads body.data (JSON string) and merges uploaded files as images.
   */
  const buildFormData = (): FormData => {
    const fd = new FormData();

    // JSON body — existingImages carry over in edit mode
    const jsonPayload: Record<string, any> = {
      name:            formData.name,
      label:           formData.label || formData.name,
      category:        formData.category,
      price:           parseFloat(formData.price),
      description:     formData.description || undefined,
      isfeatured:      formData.isfeatured,
      isAvailable:     formData.isAvailable,
      hasfreedelivery: formData.hasfreedelivery,
      sizes:           formData.sizes.length  > 0 ? formData.sizes  : undefined,
      tags:            formData.tags.length   > 0 ? formData.tags   : undefined,
      faqs:            formData.faqs.length   > 0 ? formData.faqs   : undefined,
      // Keep existing images (already uploaded URLs) when editing
      images:          formData.existingImages.length > 0 ? formData.existingImages : undefined,
      sectiontwo: formData.sectiontwo
        ? {
            show:        formData.sectiontwo.show,
            title:       formData.sectiontwo.title,
            description: formData.sectiontwo.description,
            cards: formData.sectiontwo.cards.map((c) => ({
              image:       c.imageUrl || "",
              slogan:      c.slogan,
              title:       c.title,
              description: c.description,
            })),
          }
        : undefined,
    };
    if (formData.stock !== "") jsonPayload.stock = parseInt(formData.stock, 10);

    fd.append("data", JSON.stringify(jsonPayload));

    // Append new image files — backend replaces images array with Cloudinary URLs
    imageFiles.forEach((file) => fd.append("files", file));

    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) { showToast("Please select a collection.", "error"); return; }
    try {
      const fd = buildFormData();
      if (editingId) {
        await updateProduct({ id: editingId, formData: fd }).unwrap();
        await revalidateProducts();
        showToast("Product updated successfully.", "success");
      } else {
        await createProduct(fd).unwrap();
        await revalidateProducts();
        showToast("Product created successfully.", "success");
      }
      setIsModalOpen(false); refetch();
    } catch (err: any) {
      showToast(err?.data?.message || err?.data?.error?.message || "Operation failed.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      await revalidateProducts();
      showToast("Product dissolved from the registry.", "success");
      setDeleteConfirmId(null); refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete product.", "error");
    }
  };

  // FAQ helpers
  const setFaq = (i: number, patch: Partial<FaqItem>) =>
    setFormData((f) => { const faqs = [...f.faqs]; faqs[i] = { ...faqs[i], ...patch }; return { ...f, faqs }; });
  const addFaq    = () => setFormData((f) => ({ ...f, faqs: [...f.faqs, { ...emptyFaq }] }));
  const removeFaq = (i: number) => setFormData((f) => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));

  // Section Two helpers
  const setS2 = (patch: Partial<SectionTwo>) =>
    setFormData((f) => ({ ...f, sectiontwo: f.sectiontwo ? { ...f.sectiontwo, ...patch } : { ...emptySectionTwo, ...patch } }));
  const setS2Card = (i: number, patch: Partial<SectionTwoCard>) =>
    setFormData((f) => {
      if (!f.sectiontwo) return f;
      const cards = [...f.sectiontwo.cards];
      cards[i] = { ...cards[i], ...patch };
      return { ...f, sectiontwo: { ...f.sectiontwo, cards } };
    });
  const addS2Card    = () => setFormData((f) => ({
    ...f,
    sectiontwo: f.sectiontwo
      ? { ...f.sectiontwo, cards: [...f.sectiontwo.cards, { ...emptySectionTwoCard }] }
      : { ...emptySectionTwo, cards: [{ ...emptySectionTwoCard }] },
  }));
  const removeS2Card = (i: number) => setFormData((f) => ({
    ...f,
    sectiontwo: f.sectiontwo
      ? { ...f.sectiontwo, cards: f.sectiontwo.cards.filter((_, idx) => idx !== i) }
      : null,
  }));
  const enableSectionTwo  = () => setFormData((f) => ({ ...f, sectiontwo: { ...emptySectionTwo } }));
  const disableSectionTwo = () => setFormData((f) => ({ ...f, sectiontwo: null }));

  /**
   * Upload a card image to Cloudinary via the backend admin endpoint.
   * Updates the card's uploadState and resolves imageUrl on success.
   */
  const handleCardImageUpload = async (cardIndex: number, file: File) => {
    // Immediately store the file and mark as uploading
    setS2Card(cardIndex, { imageFile: file, uploadState: "uploading", imageUrl: "" });
    try {
      const url = await uploadCardImage(file, token || "");
      setS2Card(cardIndex, { imageUrl: url, uploadState: "done" });
      showToast(`Card ${cardIndex + 1} image uploaded.`, "success");
    } catch (err: any) {
      setS2Card(cardIndex, { uploadState: "error" });
      showToast(err.message || "Card image upload failed.", "error");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-10 animate-in fade-in duration-700">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <h1 className="text-white text-5xl md:text-6xl font-serif">Our Products</h1>
        <button onClick={handleOpenAdd} className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)] shrink-0">
          + Add New Product
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input type="text" placeholder="Search products..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full bg-[#121414] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:border-[#F2CA50]/50 transition-all placeholder:text-white/20"
          />
          <svg className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="relative">
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="bg-[#121414] border border-white/10 rounded-2xl py-4 px-5 text-white text-xs outline-none focus:border-[#F2CA50]/50 appearance-none pr-10 cursor-pointer"
          >
            <option value="">All Collections</option>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Collection</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Price</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Stock</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8">Featured</th>
                  <th className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase py-8 text-right px-8">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => {
                  const id       = p._id || p.id;
                  const firstImg = p.images?.[0];
                  const imgPath  = typeof firstImg === "object" ? firstImg?.image : firstImg;
                  const imgSrc   = getImageUrl(imgPath || p.image || "");
                  return (
                    <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group">
                      <td className="py-5 px-8">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                          {imgSrc ? <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="text-[#F2CA50] text-[8px] opacity-30 uppercase tracking-widest">No Image</div>}
                        </div>
                      </td>
                      <td className="py-8 text-white text-sm font-medium max-w-[180px]">
                        <p className="font-serif truncate">{p.name}</p>
                        <p className="text-white/30 text-[10px] font-light truncate mt-0.5">{p.description}</p>
                      </td>
                      <td className="py-8">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-[2px] uppercase text-[#F2CA50]">
                          {collectionById(p.category)}
                        </span>
                      </td>
                      <td className="py-8 text-[#F2CA50] text-sm font-light">${p.price}</td>
                      <td className="py-8 text-white/40 text-xs font-light">{p.stock ?? "—"}</td>
                      <td className="py-8">
                        {p.isfeatured
                          ? <span className="text-[#F2CA50] text-[9px] font-bold tracking-[1px] uppercase">Featured</span>
                          : <span className="text-white/20 text-[9px]">—</span>}
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

      {/* ── Add / Edit Modal ──────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-2xl w-full p-8 md:p-10 relative space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div>
              <span className="text-[#F2CA50] text-[9px] font-bold tracking-[4px] uppercase opacity-60">Product Atelier</span>
              <h2 className="text-white text-2xl font-serif mt-1">{editingId ? "Refine Masterpiece" : "New Creation"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Image Upload ── */}
              <div
                className="relative w-full h-44 rounded-[24px] border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center overflow-hidden hover:border-[#F2CA50]/30 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                  : (
                    <div className="text-center space-y-2 pointer-events-none">
                      <svg className="w-8 h-8 text-white/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Click to Upload Product Images</p>
                    </div>
                  )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </div>

              {/* ── Product Name + Label ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Product Name *</label>
                  <input required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                    placeholder="e.g. Nocturnal Silk"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Label *</label>
                  <input required value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                    placeholder="e.g. Chateau Rose Mist"
                  />
                </div>
              </div>

              {/* ── Collection ── */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Collection *</label>
                <div className="relative">
                  <select required value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#121414]">Select a collection</option>
                    {collections.map((c) => <option key={c.id} value={c.id} className="bg-[#121414]">{c.name}</option>)}
                  </select>
                  <svg className="w-4 h-4 text-white/20 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* ── Price & Stock ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Price (USD) *</label>
                  <input required type="number" min="0" step="0.01" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="85.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Stock</label>
                  <input type="number" min="0" value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* ── Sizes ── */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Sizes</label>
                <TagInput
                  values={formData.sizes}
                  onChange={(v) => setFormData({ ...formData, sizes: v })}
                  placeholder='e.g. 30ml — press Enter to add'
                />
              </div>

              {/* ── Tags ── */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Tags</label>
                <TagInput
                  values={formData.tags}
                  onChange={(v) => setFormData({ ...formData, tags: v })}
                  placeholder='e.g. floral — press Enter to add'
                />
              </div>

              {/* ── Description ── */}
              <div className="space-y-2">
                <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Description</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all resize-none"
                  placeholder="A brief description of this creation..."
                />
              </div>

              {/* ── Toggles row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                <Toggle value={formData.isfeatured}      onChange={() => setFormData((f) => ({ ...f, isfeatured:      !f.isfeatured }))}      label="Featured" />
                <Toggle value={formData.isAvailable}     onChange={() => setFormData((f) => ({ ...f, isAvailable:     !f.isAvailable }))}     label="Available" />
                <Toggle value={formData.hasfreedelivery} onChange={() => setFormData((f) => ({ ...f, hasfreedelivery: !f.hasfreedelivery }))} label="Free Delivery" />
              </div>

              {/* ── FAQs ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">FAQs</label>
                  <button type="button" onClick={addFaq}
                    className="text-[#F2CA50] text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-colors flex items-center gap-1"
                  >
                    + Add FAQ
                  </button>
                </div>

                {formData.faqs.length === 0 && (
                  <p className="text-white/20 text-xs font-light">No FAQs added yet. Click "Add FAQ" to create one.</p>
                )}

                {formData.faqs.map((faq, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 relative">
                    <button type="button" onClick={() => removeFaq(i)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors text-xs"
                    >
                      ✕
                    </button>
                    <div className="space-y-1">
                      <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Question</label>
                      <input value={faq.question} onChange={(e) => setFaq(i, { question: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                        placeholder="e.g. What is the longevity?"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Answer</label>
                      <textarea value={faq.answer} onChange={(e) => setFaq(i, { answer: e.target.value })}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all resize-none"
                        placeholder="e.g. Typically 4–6 hours depending on skin type."
                      />
                    </div>
                    <Toggle value={faq.isvisible} onChange={() => setFaq(i, { isvisible: !faq.isvisible })} label="Visible to customers" />
                  </div>
                ))}
              </div>

              {/* ── Section Two ── */}
              <div className="space-y-4 border border-white/10 rounded-2xl p-5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/30 text-[10px] font-bold tracking-[2px] uppercase">Section Two</p>
                    <p className="text-white/20 text-[9px] font-light mt-0.5">Feature section shown on the product page</p>
                  </div>
                  {formData.sectiontwo === null ? (
                    <button type="button" onClick={enableSectionTwo}
                      className="text-[#F2CA50] text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-colors border border-[#F2CA50]/30 px-4 py-2 rounded-xl hover:border-white/30"
                    >
                      + Enable
                    </button>
                  ) : (
                    <button type="button" onClick={disableSectionTwo}
                      className="text-red-400 text-[9px] font-bold tracking-[2px] uppercase hover:text-red-300 transition-colors border border-red-400/30 px-4 py-2 rounded-xl"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {formData.sectiontwo !== null && (
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    {/* Show toggle */}
                    <Toggle
                      value={formData.sectiontwo.show}
                      onChange={() => setS2({ show: !formData.sectiontwo!.show })}
                      label="Show this section"
                    />

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Section Title</label>
                      <input
                        value={formData.sectiontwo.title}
                        onChange={(e) => setS2({ title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                        placeholder="e.g. The Essence of Rose"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Section Description</label>
                      <textarea
                        value={formData.sectiontwo.description}
                        onChange={(e) => setS2({ description: e.target.value })}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all resize-none"
                        placeholder="A short paragraph introducing this section..."
                      />
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Cards</label>
                        <button type="button" onClick={addS2Card}
                          className="text-[#F2CA50] text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-colors flex items-center gap-1"
                        >
                          + Add Card
                        </button>
                      </div>

                      {formData.sectiontwo.cards.length === 0 && (
                        <p className="text-white/20 text-xs font-light">No cards yet. Click "Add Card" to create one.</p>
                      )}

                      {formData.sectiontwo.cards.map((card, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 relative">
                          <button type="button" onClick={() => removeS2Card(i)}
                            className="absolute top-3 right-3 text-white/20 hover:text-red-400 transition-colors text-xs"
                          >
                            ✕
                          </button>
                          <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Card {i + 1}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">Slogan</label>
                              <input
                                value={card.slogan}
                                onChange={(e) => setS2Card(i, { slogan: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                                placeholder="e.g. Pure Elegance"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">Title</label>
                              <input
                                value={card.title}
                                onChange={(e) => setS2Card(i, { title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all"
                                placeholder="e.g. Morning Bloom"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">Description</label>
                            <textarea
                              value={card.description}
                              onChange={(e) => setS2Card(i, { description: e.target.value })}
                              rows={2}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#F2CA50]/50 transition-all resize-none"
                              placeholder="Card body text..."
                            />
                          </div>

                          {/* Card Image — must be uploaded to Cloudinary before submitting */}
                          <div className="space-y-2">
                            <label className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">
                              Card Image
                              {card.uploadState === "done" && (
                                <span className="ml-2 text-emerald-400">✓ Uploaded</span>
                              )}
                              {card.uploadState === "error" && (
                                <span className="ml-2 text-red-400">✗ Failed — try again</span>
                              )}
                            </label>

                            {/* Preview if already uploaded */}
                            {card.imageUrl && card.uploadState === "done" && (
                              <div className="relative w-full h-24 rounded-lg overflow-hidden border border-emerald-500/30 bg-white/5">
                                <img
                                  src={card.imageUrl}
                                  alt={`Card ${i + 1} preview`}
                                  className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute bottom-1 right-1">
                                  <span className="text-[8px] font-bold bg-black/60 text-emerald-400 px-2 py-0.5 rounded-full tracking-widest uppercase">
                                    Live URL
                                  </span>
                                </div>
                              </div>
                            )}

                            <label className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
                              card.uploadState === "uploading"
                                ? "border-[#F2CA50]/40 bg-[#F2CA50]/5 pointer-events-none"
                                : card.uploadState === "done"
                                ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400/50"
                                : card.uploadState === "error"
                                ? "border-red-400/30 bg-red-400/5 hover:border-red-400/50"
                                : "border-white/10 bg-white/5 hover:border-[#F2CA50]/30"
                            }`}>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleCardImageUpload(i, file);
                                  e.target.value = ""; // allow re-selecting same file
                                }}
                              />
                              {card.uploadState === "uploading" ? (
                                <>
                                  <span className="w-3.5 h-3.5 border-2 border-[#F2CA50] border-t-transparent rounded-full animate-spin shrink-0" />
                                  <span className="text-[#F2CA50] text-[9px] font-bold tracking-[2px] uppercase">Uploading…</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className={`text-[9px] font-bold tracking-[2px] uppercase ${
                                    card.uploadState === "done" ? "text-emerald-400" : card.uploadState === "error" ? "text-red-400" : "text-white/30"
                                  }`}>
                                    {card.uploadState === "done" ? "Replace Image" : "Choose & Upload Image"}
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Submit ── */}
              <button type="submit" disabled={isCreating || isUpdating}
                className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(242,202,80,0.1)] disabled:opacity-40"
              >
                {isCreating || isUpdating ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ───────────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-md w-full p-8 space-y-6 text-center shadow-2xl">
            <h3 className="text-white text-xl font-serif">Remove Product?</h3>
            <p className="text-white/40 text-xs font-light leading-relaxed">This will permanently remove the product from the Maison's registry. This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleDelete(deleteConfirmId)} disabled={isDeleting}
                className="bg-red-500 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-red-600 transition-all cursor-pointer disabled:opacity-40"
              >
                {isDeleting ? "Removing..." : "Yes, Remove"}
              </button>
              <button onClick={() => setDeleteConfirmId(null)}
                className="bg-white/5 border border-white/10 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible}
        onClose={() => setToast((p) => ({ ...p, isVisible: false }))}
      />
    </div>
  );
}
