"use client";

import { useState } from "react";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { useAuthActions } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

export default function SecurityPage() {
  const router = useRouter();
  const { logout } = useAuthActions();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast status
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info"; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast("Please enter a new password.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Confirm Password must match New Password.", "error");
      return;
    }
    
    try {
      // Direct reset password call matching the backend's user/reset_password payload {"password": "..."}
      await resetPassword({ password: newPassword }).unwrap();
      showToast("Your credential key has been rotated successfully. Redirecting to login...", "success");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        logout();
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to rotate credentials.", "error");
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <header className="space-y-4">
        <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Authentication</span>
        <h1 className="text-white text-3xl md:text-5xl font-serif">Security</h1>
        <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-lg italic">
          Protect your alchemist identity. We recommend periodic credential rotation for maximum vault security.
        </p>
      </header>

      <form onSubmit={handleUpdatePassword} className="space-y-8 md:space-y-10 max-w-2xl">
        <section className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm"
              required
            />
          </div>
        </section>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[9px] text-white/20 uppercase tracking-[1px] leading-relaxed">
            Ensure your password is at least 6 characters.
          </div>
          <button 
            type="submit"
            disabled={isResetting}
            className="w-full sm:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] disabled:opacity-45 cursor-pointer"
          >
            {isResetting ? "Updating..." : "Update Password"}
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
