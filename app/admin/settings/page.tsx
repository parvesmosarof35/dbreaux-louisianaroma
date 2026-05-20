"use client";

import { useState, useEffect } from "react";
import { useGetBrandingSocialsQuery, useUpdateBrandingSocialsMutation } from "@/store/api/settingApi";
import { getBaseUrl } from "@/store/config/envConfig";
import Toast from "@/components/ui/Toast";

type ActiveTab = "assets" | "socials" | "contact";

interface ChannelConfig {
  url: string;
  isActive: boolean;
}

export default function AdminSettingsPage() {
  const { data: brandingResponse, isLoading, refetch } = useGetBrandingSocialsQuery({});
  const [updateBranding, { isLoading: isUpdating }] = useUpdateBrandingSocialsMutation();

  const [activeTab, setActiveTab] = useState<ActiveTab>("assets");

  // Logo Previews
  const [navbarLogoPreview, setNavbarLogoPreview] = useState<string | null>(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(null);

  // Logo Files
  const [navbarLogoFile, setNavbarLogoFile] = useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);

  // Channel configs
  const [channels, setChannels] = useState<Record<string, ChannelConfig>>({
    facebook: { url: "", isActive: false },
    instagram: { url: "", isActive: false },
    twitter: { url: "", isActive: false },
    linkedin: { url: "", isActive: false },
    youtube: { url: "", isActive: false },
    tiktok: { url: "", isActive: false },
    whatsapp: { url: "", isActive: false },
    telegram: { url: "", isActive: false },
    snapchat: { url: "", isActive: false },
    address: { url: "", isActive: false },
    phone: { url: "", isActive: false },
    email: { url: "", isActive: false },
    website: { url: "", isActive: false },
    appName: { url: "Maison Louisianaroma", isActive: true },
  });

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
    if (brandingResponse?.data) {
      const data = brandingResponse.data;
      
      const baseUrl = getBaseUrl().replace(/\/api\/v1\/?$/, "");

      if (data.navbarLogo) {
        setNavbarLogoPreview(data.navbarLogo.startsWith("http") ? data.navbarLogo : `${baseUrl}${data.navbarLogo}`);
      }
      if (data.footerLogo) {
        setFooterLogoPreview(data.footerLogo.startsWith("http") ? data.footerLogo : `${baseUrl}${data.footerLogo}`);
      }

      // Read channels
      const updated: Record<string, ChannelConfig> = {};
      Object.keys(channels).forEach((key) => {
        if (data[key]) {
          updated[key] = {
            url: data[key].url || "",
            isActive: typeof data[key].isActive === "boolean" ? data[key].isActive : false,
          };
        } else {
          updated[key] = { url: "", isActive: false };
        }
      });
      setChannels(updated);
    }
  }, [brandingResponse]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "navbar" | "footer") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "navbar") {
          setNavbarLogoFile(file);
          setNavbarLogoPreview(reader.result as string);
        } else {
          setFooterLogoFile(file);
          setFooterLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChannelTextChange = (key: string, value: string) => {
    setChannels((prev) => ({
      ...prev,
      [key]: { ...prev[key], url: value },
    }));
  };

  const handleChannelToggleChange = (key: string, value: boolean) => {
    setChannels((prev) => ({
      ...prev,
      [key]: { ...prev[key], isActive: value },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (navbarLogoFile) {
      formData.append("navbarLogo", navbarLogoFile);
    }
    if (footerLogoFile) {
      formData.append("footerLogo", footerLogoFile);
    }

    formData.append("data", JSON.stringify(channels));

    try {
      await updateBranding(formData).unwrap();
      showToast("System configurations successfully saved.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update configurations.", "error");
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
        <span className="text-[#F2CA50] text-[9px] md:text-[10px] font-bold tracking-[4px] uppercase opacity-60">System Registry</span>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-serif">Branding & Socials</h1>
        <p className="text-white/40 text-xs sm:text-sm font-light tracking-wide max-w-2xl">
          Coordinate official Maison iconography, manage public networks configurations, and update customer touchpoint metadata.
        </p>
      </header>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/5 gap-6 sm:gap-10 pb-2">
        {[
          { id: "assets", label: "Brand Assets" },
          { id: "socials", label: "Social Accounts" },
          { id: "contact", label: "Contact & Metadata" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`pb-4 text-[10px] font-bold tracking-[3px] uppercase transition-all duration-300 relative cursor-pointer ${
              activeTab === tab.id 
                ? "text-[#F2CA50]" 
                : "text-white/30 hover:text-[#F2CA50]/70"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2CA50] animate-in slide-in-from-left duration-300" />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Tab content: Brand Assets */}
        {activeTab === "assets" && (
          <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <h2 className="text-white text-2xl font-serif">Iconography Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Navbar Logo */}
              <div className="space-y-4">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Header Logo (White/Gold SVG)</label>
                <div className="relative group">
                  <div className="w-full h-44 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-6 relative">
                    {navbarLogoPreview ? (
                      <img src={navbarLogoPreview} alt="Navbar Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-white/25 text-xs font-light font-serif">No Asset Selected</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                      <label className="cursor-pointer text-[10px] font-bold tracking-[2px] uppercase text-[#F2CA50] border border-[#F2CA50]/30 px-6 py-3 rounded-full hover:bg-[#F2CA50] hover:text-black transition-all">
                        Upload SVG
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "navbar")} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Logo */}
              <div className="space-y-4">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Footer Signature Logo</label>
                <div className="relative group">
                  <div className="w-full h-44 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-6 relative">
                    {footerLogoPreview ? (
                      <img src={footerLogoPreview} alt="Footer Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-white/25 text-xs font-light font-serif">No Asset Selected</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                      <label className="cursor-pointer text-[10px] font-bold tracking-[2px] uppercase text-[#F2CA50] border border-[#F2CA50]/30 px-6 py-3 rounded-full hover:bg-[#F2CA50] hover:text-black transition-all">
                        Upload SVG
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "footer")} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab content: Social Accounts */}
        {activeTab === "socials" && (
          <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <h2 className="text-white text-2xl font-serif">External Media Networks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {[
                { key: "facebook", label: "Facebook Page" },
                { key: "instagram", label: "Instagram Handle" },
                { key: "twitter", label: "Twitter / X Profile" },
                { key: "linkedin", label: "LinkedIn Company" },
                { key: "youtube", label: "YouTube Channel" },
                { key: "tiktok", label: "TikTok Account" },
                { key: "whatsapp", label: "WhatsApp Channel" },
                { key: "telegram", label: "Telegram Support" },
                { key: "snapchat", label: "Snapchat Public" },
              ].map((item) => (
                <div key={item.key} className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">{item.label}</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channels[item.key]?.isActive || false}
                        onChange={(e) => handleChannelToggleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/45 peer-checked:after:bg-[#F2CA50] after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F2CA50]/15" />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={channels[item.key]?.url || ""}
                    onChange={(e) => handleChannelTextChange(item.key, e.target.value)}
                    placeholder={`https://${item.key}.com/yourpage`}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab content: Contact & Metadata */}
        {activeTab === "contact" && (
          <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <h2 className="text-white text-2xl font-serif">Maison Physical & Digital Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* App Name */}
              <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">Application Title</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.appName?.isActive || false}
                      onChange={(e) => handleChannelToggleChange("appName", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/45 peer-checked:after:bg-[#F2CA50] after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F2CA50]/15" />
                  </label>
                </div>
                <input
                  type="text"
                  value={channels.appName?.url || ""}
                  onChange={(e) => handleChannelTextChange("appName", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-xs"
                />
              </div>

              {/* Physical Address */}
              <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">Physical Atelier Address</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.address?.isActive || false}
                      onChange={(e) => handleChannelToggleChange("address", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/45 peer-checked:after:bg-[#F2CA50] after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F2CA50]/15" />
                  </label>
                </div>
                <input
                  type="text"
                  value={channels.address?.url || ""}
                  onChange={(e) => handleChannelTextChange("address", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-xs"
                />
              </div>

              {/* Support Phone */}
              <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">Concierge Telephone</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.phone?.isActive || false}
                      onChange={(e) => handleChannelToggleChange("phone", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/45 peer-checked:after:bg-[#F2CA50] after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F2CA50]/15" />
                  </label>
                </div>
                <input
                  type="text"
                  value={channels.phone?.url || ""}
                  onChange={(e) => handleChannelTextChange("phone", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-xs"
                />
              </div>

              {/* Support Email */}
              <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">Concierge Email Vault</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.email?.isActive || false}
                      onChange={(e) => handleChannelToggleChange("email", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/45 peer-checked:after:bg-[#F2CA50] after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F2CA50]/15" />
                  </label>
                </div>
                <input
                  type="email"
                  value={channels.email?.url || ""}
                  onChange={(e) => handleChannelTextChange("email", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-xs"
                />
              </div>

              {/* Official Website */}
              <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase">Atelier Web Domain</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.website?.isActive || false}
                      onChange={(e) => handleChannelToggleChange("website", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/45 peer-checked:after:bg-[#F2CA50] after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F2CA50]/15" />
                  </label>
                </div>
                <input
                  type="text"
                  value={channels.website?.url || ""}
                  onChange={(e) => handleChannelTextChange("website", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save CTA */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full md:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-5.5 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.15)] disabled:opacity-40 cursor-pointer"
          >
            {isUpdating ? "Saving Atmosphere..." : "Save Settings"}
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
