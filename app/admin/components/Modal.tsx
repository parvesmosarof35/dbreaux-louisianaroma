"use client";

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-[#121414] border border-white/10 rounded-[40px] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-white text-3xl font-serif">{title}</h2>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-[#F2CA50] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
