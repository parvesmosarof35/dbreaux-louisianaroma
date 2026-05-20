"use client";

import { useState } from "react";
import { 
  useGetAllFaqQuery, 
  useCreateFaqMutation, 
  useUpdateFaqMutation, 
  useDeleteFaqMutation 
} from "@/store/api/faqApi";
import Toast from "@/components/ui/Toast";

export default function AdminFAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<{ id?: string; _id?: string; question: string; answer: string; category?: string } | null>(null);

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");

  // Deletion confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Toast status
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type, isVisible: true });
  };

  // Queries & Mutations
  const { data: faqResponse, isLoading, refetch } = useGetAllFaqQuery({
    searchTerm: searchTerm || undefined,
    page,
    limit,
  });

  const [createFaq, { isLoading: isCreateLoading }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdateLoading }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleteLoading }] = useDeleteFaqMutation();

  const faqs = faqResponse?.data?.data || faqResponse?.data || [];
  const meta = faqResponse?.data?.meta || {};
  const totalPages = meta?.totalPage || Math.ceil((meta?.total || faqs.length || 1) / limit);

  // Actions
  const handleOpenAdd = () => {
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setCurrentFaq(faq);
    setQuestion(faq.question || faq.title || "");
    setAnswer(faq.answer || faq.content || "");
    setCategory(faq.category || "General");
    setIsEditOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast("Please fill in both the inquiry and explanation.", "error");
      return;
    }
    try {
      await createFaq({ question, answer, category }).unwrap();
      showToast("A new olfactory inquiry has been archived.", "success");
      setIsAddOpen(false);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create FAQ", "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFaq) return;
    if (!question.trim() || !answer.trim()) {
      showToast("Fields cannot be empty.", "error");
      return;
    }
    try {
      await updateFaq({ 
        id: currentFaq.id || currentFaq._id, 
        data: { question, answer, category } 
      }).unwrap();
      showToast("The inquiry catalog has been revised.", "success");
      setIsEditOpen(false);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update FAQ", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq(id).unwrap();
      showToast("Olfactory inquiry permanently dissolved.", "success");
      setDeleteConfirmId(null);
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to dissolve FAQ", "error");
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[#F2CA50] text-[9px] md:text-[10px] font-bold tracking-[4px] uppercase opacity-60">Knowledge Chamber</span>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif">FAQ Administration</h1>
          <p className="text-white/40 text-xs sm:text-sm font-light tracking-wide max-w-xl">
            Curate and refine instructions regarding formulations, maturation times, shipping vaults, and bespoke olfactory commissions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-8 py-4.5 rounded-2xl hover:bg-white transition-all duration-300 shadow-[0_15px_30px_rgba(242,202,80,0.15)] flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add FAQ
        </button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 rounded-3xl bg-[#121414] border border-white/5">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Filter catalog..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:border-[#F2CA50]/50 transition-all font-light placeholder:text-white/20"
          />
          <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/40">
          Total Records: {meta?.total || faqs.length}
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <span className="w-10 h-10 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-20 bg-[#121414] border border-dashed border-white/10 rounded-[32px] text-white/30 text-xs font-light">
          No olfactory inquiries found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq: any) => {
            const q = faq.question || faq.title || "";
            const a = faq.answer || faq.content || "";
            return (
              <div 
                key={faq.id || faq._id}
                className="bg-[#121414] border border-white/5 hover:border-[#F2CA50]/30 rounded-[30px] p-6 md:p-8 transition-all duration-300 relative group flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-[2px] uppercase text-[#F2CA50]">
                      {faq.category || "General"}
                    </span>
                  </div>
                  <h3 className="text-white text-lg md:text-xl font-serif tracking-wide">{q}</h3>
                  <p className="text-white/40 text-xs sm:text-sm font-light leading-relaxed tracking-wide whitespace-pre-wrap">{a}</p>
                </div>
                
                {/* Actions */}
                <div className="flex md:flex-col items-center justify-end gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-3 bg-white/5 border border-white/10 text-white/60 rounded-xl hover:border-[#F2CA50]/40 hover:text-[#F2CA50] transition-all"
                    title="Edit Inquiry"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(faq.id || faq._id)}
                    className="p-3 bg-red-500/5 border border-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    title="Dissolve Inquiry"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center gap-3 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="px-5 py-3 border border-white/10 rounded-xl bg-white/5 text-[10px] tracking-[2px] uppercase font-bold text-white hover:border-[#F2CA50]/50 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            Previous
          </button>
          <span className="flex items-center text-[10px] tracking-[2px] uppercase text-white/50 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="px-5 py-3 border border-white/10 rounded-xl bg-white/5 text-[10px] tracking-[2px] uppercase font-bold text-white hover:border-[#F2CA50]/50 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddOpen(false)} />
          <div className="bg-[#121414] border border-[#F2CA50]/20 rounded-[32px] p-8 max-w-2xl w-full z-10 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300">
            <h2 className="text-white text-2xl font-serif">Archive Olfactory Inquiry</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
                >
                  <option value="General" className="bg-[#121414]">General</option>
                  <option value="Atelier" className="bg-[#121414]">Atelier</option>
                  <option value="Shipping" className="bg-[#121414]">Shipping</option>
                  <option value="Bespoke" className="bg-[#121414]">Bespoke</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Inquiry (Question)</label>
                <input
                  type="text"
                  placeholder="e.g. How long is the maturation cycle?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Explanation (Answer)</label>
                <textarea
                  placeholder="Provide precise details..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm resize-none"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreateLoading}
                  className="flex-1 bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-4 rounded-xl hover:bg-white transition-all disabled:opacity-40"
                >
                  {isCreateLoading ? "Archiving..." : "Archive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditOpen(false)} />
          <div className="bg-[#121414] border border-[#F2CA50]/20 rounded-[32px] p-8 max-w-2xl w-full z-10 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300">
            <h2 className="text-white text-2xl font-serif">Revise Olfactory Inquiry</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light"
                >
                  <option value="General" className="bg-[#121414]">General</option>
                  <option value="Atelier" className="bg-[#121414]">Atelier</option>
                  <option value="Shipping" className="bg-[#121414]">Shipping</option>
                  <option value="Bespoke" className="bg-[#121414]">Bespoke</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Inquiry (Question)</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Explanation (Answer)</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm resize-none"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdateLoading}
                  className="flex-1 bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-4 rounded-xl hover:bg-white transition-all disabled:opacity-40"
                >
                  {isUpdateLoading ? "Revising..." : "Revise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="bg-[#121414] border border-red-500/20 rounded-[32px] p-8 max-w-md w-full z-10 space-y-6 relative animate-in zoom-in duration-300">
            <h2 className="text-red-500 text-xl font-serif">Dissolve Inquiry?</h2>
            <p className="text-white/40 text-xs font-light leading-relaxed">
              Are you sure you want to permanently remove this inquiry from our global catalog? This action is irreversible.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all"
              >
                Keep Inquiry
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleteLoading}
                className="flex-1 bg-red-500 text-white text-[10px] font-bold tracking-[3px] uppercase py-4 rounded-xl hover:bg-red-600 transition-all disabled:opacity-40"
              >
                {isDeleteLoading ? "Dissolving..." : "Dissolve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
