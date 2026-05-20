"use client";

import { useState } from "react";
import { 
  useGetInquiriesQuery, 
  useMarkInquiryReadMutation, 
  useDeleteInquiryMutation 
} from "@/store/api/inquiryApi";
import Toast from "@/components/ui/Toast";

export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [isReadFilter, setIsReadFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Deletion confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Expanded message state to support modal or full view
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

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
  const { data: response, isLoading, refetch } = useGetInquiriesQuery({
    searchTerm: searchTerm || undefined,
    inquiryType: inquiryType || undefined,
    isRead: isReadFilter === "" ? undefined : (isReadFilter === "true"),
    page,
    limit,
  });

  const [markRead, { isLoading: isMarkLoading }] = useMarkInquiryReadMutation();
  const [deleteInquiry, { isLoading: isDeleteLoading }] = useDeleteInquiryMutation();

  const inquiries = response?.data?.data || response?.data || [];
  const meta = response?.meta || {};
  const totalPages = meta?.totalPage || Math.ceil((meta?.total || inquiries.length || 1) / limit);

  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case "general": return "General Inquiry";
      case "commission": return "Bespoke Commission";
      case "order": return "Order Status";
      case "discovery": return "Heritage Discovery";
      default: return type;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
      showToast("Inquiry marked as read.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to mark inquiry as read", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiry(id).unwrap();
      showToast("Inquiry permanently dissolved.", "success");
      setDeleteConfirmId(null);
      if (selectedInquiry?.id === id || selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete inquiry", "error");
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <header className="space-y-2">
        <span className="text-[#F2CA50] text-[9px] md:text-[10px] font-bold tracking-[4px] uppercase opacity-60">Customer Vault</span>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif">Inquiry Management</h1>
        <p className="text-white/40 text-xs sm:text-sm font-light tracking-wide max-w-xl">
          Review, analyze, and manage customer inquiries, bespoke commissions, and heritage consultations from global patrons.
        </p>
      </header>

      {/* Control Bar & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#121414] border border-white/5">
        {/* Search */}
        <div className="relative col-span-1 lg:col-span-2">
          <input
            type="text"
            placeholder="Search by name, email, or content..."
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

        {/* Type Filter */}
        <div className="relative">
          <select
            value={inquiryType}
            onChange={(e) => {
              setInquiryType(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#121414] border border-white/10 rounded-2xl py-4 px-4 text-white text-xs outline-none focus:border-[#F2CA50]/50 transition-all font-light appearance-none cursor-pointer"
          >
            <option value="">All Inquiry Types</option>
            <option value="general">General Inquiry</option>
            <option value="commission">Bespoke Commission</option>
            <option value="order">Order Status</option>
            <option value="discovery">Heritage Discovery</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={isReadFilter}
            onChange={(e) => {
              setIsReadFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#121414] border border-white/10 rounded-2xl py-4 px-4 text-white text-xs outline-none focus:border-[#F2CA50]/50 transition-all font-light appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="false">Unread Only</option>
            <option value="true">Read Only</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <span className="w-10 h-10 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 bg-[#121414] border border-dashed border-white/10 rounded-[32px] text-white/30 text-xs font-light">
          No inquiries found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inquiries.map((inquiry: any) => {
            const isRead = inquiry.isRead;
            const currentId = inquiry.id || inquiry._id;
            return (
              <div 
                key={currentId}
                className={`bg-[#121414] border rounded-[30px] p-6 md:p-8 transition-all duration-300 relative group flex flex-col justify-between gap-6 ${
                  isRead ? "border-white/5 opacity-70 hover:opacity-100" : "border-[#F2CA50]/20 hover:border-[#F2CA50]/40 shadow-[0_10px_30px_rgba(242,202,80,0.03)]"
                }`}
              >
                {/* Meta details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Circle initials avatar */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-[#F2CA50]">
                        {getInitials(inquiry.name)}
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-semibold leading-tight tracking-wide">{inquiry.name}</h3>
                        <a 
                          href={`mailto:${inquiry.email}`} 
                          className="text-white/40 text-xs hover:text-[#F2CA50] transition-colors"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                    </div>
                    {/* Read dot status */}
                    {!isRead && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2CA50] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F2CA50]"></span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold tracking-[2px] uppercase text-[#F2CA50]">
                      {getInquiryTypeLabel(inquiry.inquiryType)}
                    </span>
                    <span className="text-[10px] text-white/30 font-light">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric", 
                        year: "numeric" 
                      })}
                    </span>
                  </div>

                  {/* Message body */}
                  <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed tracking-wide line-clamp-3 whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>

                {/* Card CTA & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-4">
                  <button 
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="text-[9px] font-bold tracking-[2px] uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Mark Read */}
                    {!isRead && (
                      <button
                        onClick={() => handleMarkAsRead(currentId)}
                        disabled={isMarkLoading}
                        className="p-2.5 bg-white/5 border border-white/10 text-[#F2CA50] rounded-xl hover:bg-[#F2CA50]/10 hover:border-[#F2CA50]/30 transition-all cursor-pointer"
                        title="Mark as Read"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </button>
                    )}
                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(currentId)}
                      className="p-2.5 bg-white/5 border border-white/10 text-red-500 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
                      title="Dissolve Inquiry"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-xs text-white/40 tracking-[2px] uppercase">
            Page <span className="text-[#F2CA50] font-semibold">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Modal: View Details */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-2xl w-full p-8 md:p-10 relative space-y-6 shadow-2xl">
            <button 
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="space-y-4">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold tracking-[2px] uppercase text-[#F2CA50]">
                {getInquiryTypeLabel(selectedInquiry.inquiryType)}
              </span>
              <h2 className="text-white text-2xl md:text-3xl font-serif leading-tight">{selectedInquiry.name}</h2>
              <div className="flex flex-wrap gap-4 text-xs font-light">
                <span className="text-white/40">Email: <a href={`mailto:${selectedInquiry.email}`} className="text-[#F2CA50] hover:underline">{selectedInquiry.email}</a></span>
                <span className="text-white/40">•</span>
                <span className="text-white/40">
                  Received: {new Date(selectedInquiry.createdAt).toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric", 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
              <p className="text-white/80 text-sm md:text-base font-light leading-relaxed tracking-wide whitespace-pre-wrap">
                {selectedInquiry.message}
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 flex justify-between gap-4">
              {!selectedInquiry.isRead && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedInquiry.id || selectedInquiry._id);
                    setSelectedInquiry((prev: any) => prev ? { ...prev, isRead: true } : null);
                  }}
                  className="bg-[#F2CA50] text-black text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-white transition-all cursor-pointer"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedInquiry(null)}
                className="ml-auto bg-white/5 border border-white/10 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Delete */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121414] border border-white/10 rounded-[36px] max-w-md w-full p-8 relative space-y-6 text-center">
            <h3 className="text-white text-xl font-serif">Dissolve Inquiry Record?</h3>
            <p className="text-white/40 text-xs font-light leading-relaxed">
              This will permanently dissolve the inquiry record from the Maison's registry vaults. This action is irreversible.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleteLoading}
                className="bg-red-500 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-red-600 transition-all cursor-pointer disabled:opacity-40"
              >
                {isDeleteLoading ? "Dissolving..." : "Yes, Dissolve"}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-white/5 border border-white/10 text-white text-[9px] font-bold tracking-[3px] uppercase px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
