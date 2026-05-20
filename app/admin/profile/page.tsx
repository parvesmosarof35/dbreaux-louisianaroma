"use client";

import { useState, useEffect } from "react";
import { 
  useGetMyProfileQuery, 
  useUpdateProfileMutation, 
  useResetPasswordMutation, 
  useDeleteAccountMutation 
} from "@/store/api/authApi";
import { useAuthActions } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/store/config/envConfig";
import Toast from "@/components/ui/Toast";

export default function AdminProfilePage() {
  const router = useRouter();
  const { logout } = useAuthActions();
  
  const { data: profileResponse, isLoading, refetch } = useGetMyProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  
  // Image
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password fields
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Deactivate modal
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

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
      setRole(data.role || "Maison Administrator");
      setPhoneNumber(data.phoneNumber || "");
      setAddress(data.address || "");
      setGender(data.gender || "Male");
      
      if (data.createdAt) {
        const date = new Date(data.createdAt);
        setJoinedDate(date.toLocaleDateString("en-US", { month: "short", year: "numeric" }));
      } else {
        setJoinedDate("N/A");
      }

      // Handle avatar URL from backend
      const imgPath = data.profile_image || data.image || data.avatar;
      if (imgPath) {
        const baseUrl = getBaseUrl().replace(/\/api\/v1\/?$/, "");
        setAvatarPreview(imgPath.startsWith("http") ? imgPath : `${baseUrl}${imgPath}`);
      }
    }
  }, [profileResponse]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim()) {
      showToast("Full Name cannot be blank.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("gender", gender);
    formData.append("male", gender);
    if (avatarFile) {
      // Support all commonly expected multipart fields for absolute safety including backend 'file'
      formData.append("file", avatarFile);
      formData.append("image", avatarFile);
      formData.append("profile_image", avatarFile);
    }

    try {
      await updateProfile(formData).unwrap();
      showToast("Maison identity successfully updated.", "success");
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update identity details.", "error");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast("Please enter a new password.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    try {
      // Postman reset_password accepts only {"password": "..."} in body when token is in header
      await resetPassword({ password: newPassword }).unwrap();
      showToast("Credential rotated successfully. Redirecting to login...", "success");
      setIsChangingPassword(false);
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

  const handleDeactivate = async () => {
    try {
      await deleteAccount({}).unwrap();
      showToast("Your alchemist identity has been dissolved.", "success");
      logout();
      router.push("/login");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to dissolve identity.", "error");
      setShowDeactivateConfirm(false);
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
    <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in duration-700 px-4 sm:px-6">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
        <label className="relative group cursor-pointer block">
          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[48px] overflow-hidden border-2 border-[#F2CA50]/20 bg-white/5 flex items-center justify-center font-serif text-[#F2CA50] text-4xl md:text-6xl shadow-2xl transition-all group-hover:border-[#F2CA50]/50">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (fullname || "A").slice(0, 1)
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#F2CA50]">
                Change Essence
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#F2CA50] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#121414] group-hover:bg-white transition-colors duration-300">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        </label>
        <div className="space-y-2">
          <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-serif">{fullname || "Alexander Vanderbilt"}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
            <span className="text-[#F2CA50] text-[9px] md:text-[10px] font-bold tracking-[3px] md:tracking-[4px] uppercase opacity-60">
              {role === "superadmin" ? "High Alchemist (Super)" : "Maison Administrator"}
            </span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/20 text-[9px] md:text-[10px] font-bold tracking-[3px] md:tracking-[4px] uppercase">Member since {joinedDate}</span>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdateIdentity} className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8 md:space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl font-serif">Master Identity</h2>
              <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Public Information</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" 
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Email Channel</label>
                <input 
                  type="email" 
                  value={email} 
                  disabled 
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50 cursor-not-allowed" 
                />
              </div>
              
              {/* Phone Number */}
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" 
                />
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-8 py-5.5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light appearance-none [&>option]:bg-[#121414] [&>option]:text-white cursor-pointer" 
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Physical Address */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Physical Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. 123 Main Street, New York, NY, USA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Role Assignment</label>
                <input 
                  type="text" 
                  value={role} 
                  disabled 
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Account Registry</label>
                <input 
                  type="text" 
                  value={joinedDate} 
                  disabled 
                  className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white/40 outline-none font-light opacity-50 cursor-not-allowed" 
                />
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex justify-center md:justify-end">
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full md:w-auto bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase px-8 md:px-12 py-5 md:py-6 rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] disabled:opacity-45 cursor-pointer"
              >
                {isUpdating ? "Updating Essence..." : "Update Identity"}
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password */}
        <div className="space-y-8">
          <div className="bg-[#121414] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 space-y-8 md:space-y-10">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-serif">Security</h2>
              <p className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Account Protection</p>
            </div>
            
            {!isChangingPassword ? (
              <div className="space-y-6">
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full border border-[#F2CA50]/20 text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase py-6 rounded-2xl hover:bg-[#F2CA50] hover:text-black transition-all cursor-pointer text-center"
                >
                  Modify Password
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm" 
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
                    className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-[#F2CA50]/50 transition-all font-light text-sm" 
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="flex-1 text-white/20 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isResettingPassword}
                    className="flex-1 bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[3px] uppercase py-4 rounded-xl hover:bg-white hover:text-black transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isResettingPassword ? "Saving..." : "Save Key"}
                  </button>
                </div>
              </form>
            )}
          </div>

         
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeactivateConfirm(false)} />
          <div className="bg-[#121414] border border-red-500/20 rounded-[32px] p-8 max-w-md w-full z-10 space-y-6 relative animate-in zoom-in duration-300">
            <h2 className="text-red-500 text-xl font-serif">Deactivate Account?</h2>
            <p className="text-white/40 text-xs font-light leading-relaxed">
              Are you sure you want to permanently dissolve your alchemist access? All personal catalogs, settings, and credentials will be removed.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 text-white/30 text-[9px] font-bold tracking-[2px] uppercase hover:text-white transition-all cursor-pointer"
              >
                Keep Identity
              </button>
              <button
                onClick={handleDeactivate}
                disabled={isDeletingAccount}
                className="flex-1 bg-red-500 text-white text-[10px] font-bold tracking-[3px] uppercase py-4 rounded-xl hover:bg-red-600 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isDeletingAccount ? "Dissolving..." : "Dissolve Account"}
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
