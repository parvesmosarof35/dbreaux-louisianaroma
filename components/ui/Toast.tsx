"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "error" | "success" | "info";
}

export default function Toast({ message, isVisible, onClose, type = "info" }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"
      }`}
    >
      <div className={`
        bg-[#1A1C1C] border px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4
        ${type === "error" ? "border-red-500/50" : "border-[#F2CA50]/30"}
      `}>
        <div className={`w-2 h-2 rounded-full animate-pulse ${type === "error" ? "bg-red-500" : "bg-[#F2CA50]"}`}></div>
        <span className="text-white text-sm font-light tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
}
