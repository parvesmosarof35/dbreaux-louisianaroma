"use client";

import { useState, useEffect } from "react";
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from "@/store/api/settingApi";
import JoditComponent from "@/components/ui/JoditComponent";
import Toast from "@/components/ui/Toast";

export default function AdminPrivacyPolicyPage() {
  const { data: privacyResponse, isLoading, refetch } = useGetPrivacyQuery({});
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();

  const [privacyPolicy, setPrivacyPolicy] = useState("");

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
    if (privacyResponse?.data) {
      // Backend expects PrivacyPolicy (with uppercase P)
      const content = privacyResponse.data.PrivacyPolicy || privacyResponse.data.privacyPolicy || "";
      setPrivacyPolicy(content);
    }
  }, [privacyResponse]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyPolicy.trim()) {
      showToast("Privacy policy narrative cannot be empty.", "error");
      return;
    }
    try {
      // Must match exactly {"PrivacyPolicy": "..."} expected by the backend
      await updatePrivacy({ PrivacyPolicy: privacyPolicy }).unwrap();
      showToast("The Maison Privacy Policy has been revised.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to refine Privacy Policy.", "error");
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
        <span className="text-[#F2CA50] text-[9px] md:text-[10px] font-bold tracking-[4px] uppercase opacity-60">Legal Secretariat</span>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif">Privacy Policy</h1>
        <p className="text-white/40 text-xs sm:text-sm font-light tracking-wide max-w-2xl">
          Edit and curate the official client data rights and security agreements. The content supports standard paragraph tags.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h2 className="text-white text-2xl font-serif">Editorial Workspace</h2>
            <div className="text-[9px] font-bold tracking-[2px] uppercase text-white/20">
              Word Count: {privacyPolicy ? privacyPolicy.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length : 0} words
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Policy Document Narrative</label>
            <div className="text-black overflow-hidden rounded-2xl border border-white/10">
              <JoditComponent content={privacyPolicy} setContent={setPrivacyPolicy} />
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
