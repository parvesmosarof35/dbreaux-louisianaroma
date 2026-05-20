"use client";

import { useState, useEffect } from "react";
import { useGetTermsAndConditionsQuery, useUpdateTermsAndConditionsMutation } from "@/store/api/settingApi";
import JoditComponent from "@/components/ui/JoditComponent";
import Toast from "@/components/ui/Toast";

export default function AdminTermsAndConditionsPage() {
  const { data: termsResponse, isLoading, refetch } = useGetTermsAndConditionsQuery({});
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsAndConditionsMutation();

  const [termsConditions, setTermsConditions] = useState("");

  // Toast status
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (termsResponse?.data) {
      // Backend expects TermsConditions (with uppercase T and C)
      const content = termsResponse.data.TermsConditions || termsResponse.data.termsConditions || "";
      setTermsConditions(content);
    }
  }, [termsResponse]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsConditions.trim()) {
      showToast("Terms narrative cannot be empty.", "error");
      return;
    }
    try {
      // Must match exactly {"TermsConditions": "..."} expected by the backend
      await updateTerms({ TermsConditions: termsConditions }).unwrap();
      showToast("The Maison Terms & Conditions have been revised.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to refine Terms & Conditions.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <span className="w-10 h-10 border-4 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
      {/* Header */}
      <header className="space-y-2">
       
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif">Terms & Conditions</h1>
      
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h2 className="text-white text-2xl font-serif">Editorial Workspace</h2>
            <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/20">
              Word Count: {termsConditions ? termsConditions.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length : 0} words
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Terms Document Narrative</label>
            <div className="text-black overflow-hidden rounded-2xl border border-white/10">
              <JoditComponent content={termsConditions} setContent={setTermsConditions} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full md:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-5.5 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.15)] disabled:opacity-40 cursor-pointer"
          >
            {isUpdating ? "Refining Document..." : "Refine Document"}
          </button>
        </div>
      </form>

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
