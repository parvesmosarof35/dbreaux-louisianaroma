"use client";

import { useState, useEffect } from "react";
import { useGetAboutUsQuery, useUpdateAboutUsMutation } from "@/store/api/settingApi";
import { getBaseUrl } from "@/store/config/envConfig";
import JoditComponent from "@/components/ui/JoditComponent";
import Toast from "@/components/ui/Toast";

export default function AdminAboutUsPage() {
  const { data: aboutUsResponse, isLoading, refetch } = useGetAboutUsQuery({});
  const [updateAboutUs, { isLoading: isUpdating }] = useUpdateAboutUsMutation();

  const [aboutUsText, setAboutUsText] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  // Files
  const [aboutUsImageFile, setAboutUsImageFile] = useState<File | null>(null);
  const [adminImageFile, setAdminImageFile] = useState<File | null>(null);

  // Previews
  const [aboutUsImagePreview, setAboutUsImagePreview] = useState<string | null>(null);
  const [adminImagePreview, setAdminImagePreview] = useState<string | null>(null);

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
    if (aboutUsResponse?.data) {
      const data = aboutUsResponse.data;
      setAboutUsText(data.aboutus || "");
      setAdminMessage(data.adminmessage || "");

      // Handle image URLs returned by backend
      const baseUrl = getBaseUrl().replace(/\/api\/v1\/?$/, "");
      
      if (data.aboutusimage) {
        const fullUrl = data.aboutusimage.startsWith("http") 
          ? data.aboutusimage 
          : `${baseUrl}${data.aboutusimage}`;
        setAboutUsImagePreview(fullUrl);
      }
      if (data.adminimage) {
        const fullUrl = data.adminimage.startsWith("http") 
          ? data.adminimage 
          : `${baseUrl}${data.adminimage}`;
        setAdminImagePreview(fullUrl);
      }
    }
  }, [aboutUsResponse]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "aboutus" | "admin") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "aboutus") {
          setAboutUsImageFile(file);
          setAboutUsImagePreview(reader.result as string);
        } else {
          setAdminImageFile(file);
          setAdminImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (aboutUsImageFile) {
      formData.append("aboutusimage", aboutUsImageFile);
    }
    if (adminImageFile) {
      formData.append("adminimage", adminImageFile);
    }

    const payload = {
      aboutus: aboutUsText,
      adminmessage: adminMessage,
    };

    formData.append("data", JSON.stringify(payload));

    try {
      await updateAboutUs(formData).unwrap();
      showToast("Maison About Us configuration has been refined.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to refine configuration.", "error");
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
        <span className="text-[#F2CA50] text-[9px] md:text-[10px] font-bold tracking-[4px] uppercase opacity-60">Chronicles of the House</span>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif">About Us & Legacy</h1>
        <p className="text-white/40 text-xs sm:text-sm font-light tracking-wide max-w-2xl">
          Craft the narrative, design philosophy, and master alchemist quotes displayed over the Maison's official portal.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Narratives Section */}
        <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8">
        
          
          <div className="space-y-6">
            {/* About Us Narrative */}
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Narrative Description</label>
              <div className="text-black overflow-hidden rounded-2xl border border-white/10">
                <JoditComponent content={aboutUsText} setContent={setAboutUsText} />
              </div>
            </div>

            {/* Admin Message */}
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Alchemist Message</label>
              <div className="text-black overflow-hidden rounded-2xl border border-white/10">
                <JoditComponent content={adminMessage} setContent={setAdminMessage} />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8">
          <h2 className="text-white text-2xl font-serif">Visual Tapestry</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* About Us Image */}
            <div className="space-y-4">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">About Us Narrative Image</label>
              <div className="relative group">
                <div className="w-full h-64 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center relative">
                  {aboutUsImagePreview ? (
                    <img src={aboutUsImagePreview} alt="About Us Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                  ) : (
                    <span className="text-white/25 text-xs font-light font-serif">No Essence Selected</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                    <label className="cursor-pointer text-[10px] font-bold tracking-[2px] uppercase text-[#F2CA50] border border-[#F2CA50]/30 px-6 py-3 rounded-full hover:bg-[#F2CA50] hover:text-black transition-all">
                      Select Photo
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "aboutus")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Image */}
            <div className="space-y-4">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Master Alchemist Portrait</label>
              <div className="relative group">
                <div className="w-full h-64 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center relative">
                  {adminImagePreview ? (
                    <img src={adminImagePreview} alt="Admin Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                  ) : (
                    <span className="text-white/25 text-xs font-light font-serif">No Essence Selected</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                    <label className="cursor-pointer text-[10px] font-bold tracking-[2px] uppercase text-[#F2CA50] border border-[#F2CA50]/30 px-6 py-3 rounded-full hover:bg-[#F2CA50] hover:text-black transition-all">
                      Select Photo
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "admin")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full md:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-5.5 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.15)] disabled:opacity-40 cursor-pointer"
          >
            {isUpdating ? "Refining Chronicles..." : "Refine Chronicles"}
          </button>
        </div>
      </form>

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
