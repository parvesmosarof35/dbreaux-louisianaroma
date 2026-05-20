"use client";

import { useState, useEffect } from "react";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "@/store/api/authApi";
import Toast from "@/components/ui/Toast";

export default function ProfilePage() {
  const { data: profileResponse, isLoading, refetch } = useGetMyProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  
  // Shipping details
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

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
    if (profileResponse?.data) {
      const data = profileResponse.data;
      setFullname(data.fullname || data.name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setCity(data.city || "");
      setPostalCode(data.postalCode || "");
    }
  }, [profileResponse]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim()) {
      showToast("Full Name is required to preserve your presence.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("postalCode", postalCode);

    try {
      await updateProfile(formData).unwrap();
      showToast("Your alchemist presence has been refined.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to refine your presence.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-2 border-[#F2CA50] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <header className="space-y-4">
        <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Account Identity</span>
        <h1 className="text-white text-3xl md:text-5xl font-serif">Your Profile</h1>
        <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-lg italic">
          Refine your presence within the Maison. Your identity and preferences guide our artisanal service.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-8 md:space-y-12">
        <section className="space-y-8 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Full Name</label>
              <input 
                type="text" 
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Address</label>
              <input 
                type="email" 
                value={email}
                disabled
                className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white/45 outline-none font-light text-sm cursor-not-allowed opacity-50"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8 md:space-y-10">
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Shipping Address</label>
            <input 
              type="text" 
              placeholder="House number and street name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">City</label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Postal Code</label>
              <input 
                type="text" 
                value={postalCode} 
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm" 
              />
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-white/5 flex justify-end">
          <button 
            type="submit"
            disabled={isUpdating}
            className="w-full md:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] disabled:opacity-45 cursor-pointer"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
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
