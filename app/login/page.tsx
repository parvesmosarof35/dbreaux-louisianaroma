"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Toast from "@/components/ui/Toast";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import {
  useLogInMutation,
  useCreateUserMutation,
  useUserVarificationMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
} from "@/store/api/authApi";

// Zero-dependency native Base64 decoder for JWT payload extraction
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Active Screen state: "login" | "signup" | "verify" | "forgot" | "reset"
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "verify" | "forgot" | "reset">("login");

  // RTK Query Mutations
  const [logIn, { isLoading: isLoginLoading }] = useLogInMutation();
  const [createUser, { isLoading: isSignupLoading }] = useCreateUserMutation();
  const [userVerification, { isLoading: isVerifyLoading }] = useUserVarificationMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [verifyEmail, { isLoading: isVerifyEmailLoading }] = useVerifyEmailMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  // Form Inputs - Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Form Inputs - Sign Up
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Form Inputs - OTP Verification
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationContextEmail, setVerificationContextEmail] = useState("");

  // Form Inputs - Forgot/Reset Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetUserId, setResetUserId] = useState("");

  // Password visibility controls
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Inline dynamic tooltips for wrong password error handling
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [signupPasswordError, setSignupPasswordError] = useState("");

  // Toast Alerts State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Restore remembered email on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("maison_remembered_email");
      if (savedEmail) {
        setLoginEmail(savedEmail);
        setSignupEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginPasswordError(""); // Reset any prior password error tooltips
    try {
      const response = await logIn({
        email: loginEmail,
        password: loginPassword,
      }).unwrap();

      if (response?.success && response?.data?.accessToken) {
        const token = response.data.accessToken;
        const decodedUser = decodeToken(token);

        if (decodedUser) {
          dispatch(setUser({ user: decodedUser, token }));
          triggerToast("Successfully authenticated. Welcome back to the Maison.", "success");

          // Persistence validation
          if (rememberMe) {
            localStorage.setItem("maison_remembered_email", loginEmail);
          } else {
            localStorage.removeItem("maison_remembered_email");
          }

          // Programmatic role-based redirection
          setTimeout(() => {
            if (decodedUser.role === "admin" || decodedUser.role === "superadmin") {
              router.push("/admin/dashboard");
            } else {
              router.push("/dashboard/userdashboard/profile");
            }
          }, 1000);
        } else {
          triggerToast("Failed to authenticate: Invalid token signature.", "error");
        }
      } else {
        const errMsg = response?.message || "Failed to enter the Maison.";
        setLoginPasswordError(errMsg);
        triggerToast(errMsg, "error");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Olfactory credentials mismatch.";
      setLoginPasswordError(errMsg);
      triggerToast(errMsg, "error");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupPasswordError(""); // Reset any prior password error tooltips
    try {
      const response = await createUser({
        fullname: signupName,
        email: signupEmail,
        phoneNumber: signupPhone,
        password: signupPassword,
      }).unwrap();

      if (response?.success) {
        triggerToast("Noble registration successful! Verification code sent to your email.", "success");
        setVerificationContextEmail(signupEmail);

        // Persistence validation
        if (rememberMe) {
          localStorage.setItem("maison_remembered_email", signupEmail);
        } else {
          localStorage.removeItem("maison_remembered_email");
        }

        // Switch to verification code view
        setTimeout(() => {
          setActiveTab("verify");
        }, 1500);
      } else {
        const errMsg = response?.message || "Failed to register credentials.";
        if (errMsg.toLowerCase().includes("password")) {
          setSignupPasswordError(errMsg);
        }
        triggerToast(errMsg, "error");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Enrollment process encountered an issue.";
      if (errMsg.toLowerCase().includes("password")) {
        setSignupPasswordError(errMsg);
      }
      triggerToast(errMsg, "error");
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      triggerToast("Please present the 6-digit OTP code.", "error");
      return;
    }
    try {
      const response = await userVerification({
        verificationCode: Number(verificationCode),
      }).unwrap();

      if (response?.success && response?.data?.accessToken) {
        const token = response.data.accessToken;
        const decodedUser = decodeToken(token);

        if (decodedUser) {
          dispatch(setUser({ user: decodedUser, token }));
          triggerToast("Account verification successful. Access granted.", "success");

          setTimeout(() => {
            if (decodedUser.role === "admin" || decodedUser.role === "superadmin") {
              router.push("/admin/dashboard");
            } else {
              router.push("/dashboard/userdashboard/profile");
            }
          }, 1500);
        } else {
          triggerToast("Failed to verify: Token mismatch.", "error");
        }
      } else {
        triggerToast(response?.message || "Verification rejected.", "error");
      }
    } catch (err: any) {
      triggerToast(
        err?.data?.message || err?.message || "Invalid or expired verification code.",
        "error"
      );
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({
        email: forgotEmail,
      }).unwrap();

      if (response?.success) {
        triggerToast("Credential reset code dispatched to your inbox.", "success");
        setTimeout(() => {
          setActiveTab("reset");
        }, 1500);
      } else {
        triggerToast(response?.message || "Reset request failed.", "error");
      }
    } catch (err: any) {
      triggerToast(
        err?.data?.message || err?.message || "Email address not found in catalog.",
        "error"
      );
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !resetNewPassword) {
      triggerToast("All security fields must be complete.", "error");
      return;
    }
    try {
      // 1. Verify OTP first to get the reset token
      const verifyResponse = await verifyEmail({
        verificationCode: Number(resetCode),
      }).unwrap();

      if (verifyResponse?.success && verifyResponse?.data) {
        const resetToken = verifyResponse.data;
        const decoded = decodeToken(resetToken);

        if (decoded && decoded.id) {
          // 2. Reset the password
          const resetResponse = await resetPassword({
            userId: decoded.id,
            password: resetNewPassword,
          }).unwrap();

          if (resetResponse?.success) {
            triggerToast("Security credentials successfully renewed. Please log in.", "success");
            setTimeout(() => {
              setActiveTab("login");
            }, 1500);
          } else {
            triggerToast(resetResponse?.message || "Reset sequence failed.", "error");
          }
        } else {
          triggerToast("Invalid security signature returned.", "error");
        }
      } else {
        triggerToast("Verification failed: OTP code invalid.", "error");
      }
    } catch (err: any) {
      triggerToast(
        err?.data?.message || err?.message || "Incorrect verification code or reset failed.",
        "error"
      );
    }
  };

  const isFormLoading =
    isLoginLoading ||
    isSignupLoading ||
    isVerifyLoading ||
    isForgotLoading ||
    isVerifyEmailLoading ||
    isResetLoading;

  return (
    <div className="bg-[#0A0A0A] min-h-screen relative overflow-hidden flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bottleofperfume.png"
          alt="Background"
          fill
          className="object-cover opacity-30 blur-2xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>
      </div>

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 z-10">
        <div className="w-full max-w-[500px] bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 p-12 space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          {/* Main Navigation Tabs - only for login and signup views */}
          {(activeTab === "login" || activeTab === "signup") && (
            <div className="flex justify-center gap-12 border-b border-white/5 pb-6">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setLoginPasswordError("");
                }}
                className={`text-[10px] font-bold tracking-[4px] uppercase transition-all ${
                  activeTab === "login"
                    ? "text-[#F2CA50] border-b border-[#F2CA50] pb-2"
                    : "text-white/20 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setLoginPasswordError("");
                }}
                className={`text-[10px] font-bold tracking-[4px] uppercase transition-all ${
                  activeTab === "signup"
                    ? "text-[#F2CA50] border-b border-[#F2CA50] pb-2"
                    : "text-white/20 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* VIEW: LOGIN */}
          {activeTab === "login" && (
            <div className="space-y-8">
              <header className="text-center space-y-4">
                <h1 className="text-white text-3xl font-serif">Welcome back</h1>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Enter your credentials to access the Maison.
                </p>
              </header>

              <form onSubmit={handleLoginSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginPasswordError) setLoginPasswordError("");
                    }}
                    placeholder="enter your email"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light placeholder:text-white/10 placeholder:lowercase"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                <div className="space-y-3 relative">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginPasswordError) setLoginPasswordError("");
                      }}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-b border-white/10 py-3 pr-10 text-white outline-none focus:border-[#F2CA50] transition-colors font-light"
                      required
                      disabled={isFormLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#F2CA50] transition-colors cursor-pointer"
                      disabled={isFormLoading}
                    >
                      {showLoginPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Tooltip Error Alert */}
                  {loginPasswordError && (
                    <div className="absolute z-50 bg-[#1A1C1C] border border-red-500/50 rounded-xl px-4 py-2.5 shadow-2xl -top-12 right-0 flex items-center gap-2 animate-bounce">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-white text-xs font-light tracking-wide whitespace-nowrap">{loginPasswordError}</span>
                      <div className="absolute -bottom-1 right-6 w-2 h-2 bg-[#1A1C1C] border-r border-b border-red-500/50 rotate-45"></div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold tracking-[2px] uppercase">
                  <label className="flex items-center gap-3 cursor-pointer group text-white/40 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="hidden"
                      disabled={isFormLoading}
                    />
                    <div
                      className={`w-4 h-4 border rounded group-hover:border-[#F2CA50] transition-colors flex items-center justify-center ${
                        rememberMe ? "border-[#F2CA50] bg-[#F2CA50]/10" : "border-white/10"
                      }`}
                    >
                      {rememberMe && (
                        <div className="w-1.5 h-1.5 rounded-sm bg-[#F2CA50]"></div>
                      )}
                    </div>
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-white/20 hover:text-[#F2CA50] transition-colors cursor-pointer"
                    disabled={isFormLoading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-xl hover:bg-white disabled:bg-[#F2CA50]/50 disabled:text-black/50 transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoginLoading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: SIGN UP */}
          {activeTab === "signup" && (
            <div className="space-y-8">
              <header className="text-center space-y-4">
                <h1 className="text-white text-3xl font-serif">Create an Account</h1>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Join our exclusive portfolio of signature olfactory connoisseurs.
                </p>
              </header>

              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="enter your full name"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light text-sm"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="enter your email"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light text-sm placeholder:text-white/10 placeholder:lowercase"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="enter your phone number"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light text-sm"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                 <div className="space-y-2 relative">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupPasswordError) setSignupPasswordError("");
                      }}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-b border-white/10 py-3 pr-10 text-white outline-none focus:border-[#F2CA50] transition-colors font-light text-sm"
                      required
                      disabled={isFormLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#F2CA50] transition-colors cursor-pointer"
                      disabled={isFormLoading}
                    >
                      {showSignupPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Signup Password Tooltip Error Alert */}
                  {signupPasswordError && (
                    <div className="absolute z-50 bg-[#1A1C1C] border border-red-500/50 rounded-xl px-4 py-2.5 shadow-2xl -top-12 right-0 flex items-center gap-2 animate-bounce">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-white text-xs font-light tracking-wide whitespace-nowrap">{signupPasswordError}</span>
                      <div className="absolute -bottom-1 right-6 w-2 h-2 bg-[#1A1C1C] border-r border-b border-red-500/50 rotate-45"></div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold tracking-[2px] uppercase pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group text-white/40 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="hidden"
                      disabled={isFormLoading}
                    />
               
                   
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-xl hover:bg-white disabled:bg-[#F2CA50]/50 disabled:text-black/50 transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] mt-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSignupLoading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: ACCOUNT VERIFICATION (OTP) */}
          {activeTab === "verify" && (
            <div className="space-y-8">
              <header className="text-center space-y-4">
                <span className="text-[#F2CA50] text-[9px] font-bold tracking-[4px] uppercase bg-[#F2CA50]/10 px-4 py-1.5 rounded-full">
                  Verification Required
                </span>
                <h1 className="text-white text-3xl font-serif pt-2">Confirm Senses</h1>
                <p className="text-white/40 text-xs font-light leading-relaxed px-4">
                  We have dispatched a 6-digit credential code to{" "}
                  <span className="text-white/80 font-medium">
                    {verificationContextEmail || "your inbox"}
                  </span>
                  . Please present it to complete enrollment.
                </p>
              </header>

              <form onSubmit={handleVerificationSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase flex justify-between">
                    <span>6-Digit Verification Code</span>
                    <button
                      type="button"
                      onClick={() => {
                        // Switch back to signup so they can register again or change details
                        setActiveTab("signup");
                      }}
                      className="text-white/40 hover:text-white transition-colors capitalize underline"
                    >
                      Change Details
                    </button>
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-full bg-transparent border-b border-white/10 py-4 text-center text-white tracking-[12px] text-2xl font-serif outline-none focus:border-[#F2CA50] transition-colors"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-xl hover:bg-white disabled:bg-[#F2CA50]/50 disabled:text-black/50 transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifyLoading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Verify Credentials"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {activeTab === "forgot" && (
            <div className="space-y-8">
              <header className="text-center space-y-4">
                <h1 className="text-white text-3xl font-serif">Recover Signature</h1>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Provide your registered email address to receive reset security tokens.
                </p>
              </header>

              <form onSubmit={handleForgotSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="enter your email"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#F2CA50] transition-colors font-light placeholder:text-white/10 placeholder:lowercase"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold tracking-[2px] uppercase">
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                    disabled={isFormLoading}
                  >
                    ← Back to Login
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-xl hover:bg-white disabled:bg-[#F2CA50]/50 disabled:text-black/50 transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isForgotLoading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: RESET PASSWORD */}
          {activeTab === "reset" && (
            <div className="space-y-8">
              <header className="text-center space-y-4">
                <span className="text-[#F2CA50] text-[9px] font-bold tracking-[4px] uppercase bg-[#F2CA50]/10 px-4 py-1.5 rounded-full">
                  Secure Renewal
                </span>
                <h1 className="text-white text-3xl font-serif pt-2">Renew Credentials</h1>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  Enter your verification reset code and configure your new noble password.
                </p>
              </header>

              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white tracking-[8px] outline-none focus:border-[#F2CA50] transition-colors font-light text-center"
                    required
                    disabled={isFormLoading}
                  />
                </div>

                <div className="space-y-3 relative">
                  <label className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">
                    New Security Password
                  </label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-b border-white/10 py-3 pr-10 text-white outline-none focus:border-[#F2CA50] transition-colors font-light"
                      required
                      disabled={isFormLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#F2CA50] transition-colors cursor-pointer"
                      disabled={isFormLoading}
                    >
                      {showResetPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold tracking-[2px] uppercase">
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                    disabled={isFormLoading}
                  >
                    ← Back to Send
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full bg-[#F2CA50] text-black text-[10px] font-bold tracking-[3px] uppercase py-5 rounded-xl hover:bg-white disabled:bg-[#F2CA50]/50 disabled:text-black/50 transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isResetLoading || isVerifyEmailLoading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* <footer className="py-12 text-center z-10 space-y-6">
        <Link
          href="/admin/dashboard"
          className="inline-block text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-all border-b border-[#F2CA50]/20 pb-1"
        >
          Admin Login
        </Link>
        <p className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">
          Part of the Louisianaroma Artisanal Group
        </p>
      </footer> */}
    </div>
  );
}

