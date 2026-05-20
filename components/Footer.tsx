"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetBrandingSocialsQuery } from "@/store/api/settingApi";
import { getImageUrl } from "@/store/config/envConfig";

const formatExternalUrl = (url: string) => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
    return trimmed;
  }
  // Safe validation: if it looks like a domain name, prefix with https://, else fallback to "#"
  if (/^[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}(?:\/\S*)?$/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return "#";
};

export default function Footer() {
  const { data: socialsResponse } = useGetBrandingSocialsQuery({});
  const socials = socialsResponse?.data || {};

  const emailVal = socials.email?.isActive && socials.email.url ? socials.email.url : "support@louisianaroma.com";
  const phoneVal = socials.phone?.isActive && socials.phone.url ? socials.phone.url : "+880 1234 567 890";
  const addressVal = socials.address?.isActive && socials.address.url ? socials.address.url : "Dhaka, Bangladesh";

  const footerLogoSrc = socials.footerLogo ? getImageUrl(socials.footerLogo) : "/footerlogo.png";

  const socialConfig = [
    { key: "facebook", label: "Facebook", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg> },
    { key: "twitter", label: "Twitter", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> },
    { key: "instagram", label: "Instagram", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
    { key: "linkedin", label: "LinkedIn", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg> },
    { key: "youtube", label: "YouTube", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
    { key: "tiktok", label: "TikTok", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.42-.43-.61-.67-.02 2.44-.01 4.88-.01 7.32-.05 1.52-.42 3.06-1.28 4.31-1.39 2.01-3.91 3.12-6.31 2.87-2.73-.24-5.13-2.16-5.88-4.82-.96-3.28.66-6.97 3.92-8.07.97-.33 2.01-.42 3.03-.31v4.05c-.88-.13-1.81.01-2.58.49-1.22.72-1.8 2.21-1.45 3.58.37 1.5 1.77 2.57 3.32 2.48 1.48-.02 2.76-1.07 3.12-2.51.16-.62.14-1.27.14-1.91V.02h-.8z"/></svg> },
    { key: "whatsapp", label: "WhatsApp", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2c-5.516 0-9.986 4.47-9.986 9.986 0 1.762.459 3.48 1.332 5l-1.417 5.176 5.297-1.39c1.472.802 3.125 1.226 4.77 1.228h.004c5.514 0 9.984-4.47 9.988-9.986 0-2.67-1.037-5.18-2.924-7.067C17.228 3.037 14.71 2 12.031 2zm6.39 13.961c-.352 1-1.77 1.828-2.43 1.93-.602.096-1.39.172-2.22-.096-.543-.176-1.23-.418-2.115-.8-3.76-1.624-6.194-5.464-6.383-5.717-.188-.254-1.38-1.84-1.38-3.514 0-1.674.866-2.5 1.176-2.834.31-.334.678-.418.904-.418h.678c.226 0 .528.02.772.61.246.59.848 2.07.924 2.22.074.15.124.324.024.524-.1.2-.204.324-.352.5-.15.176-.312.3-.448.462-.15.15-.31.312-.132.62.18.302.8 1.318 1.71 2.13 1.176 1.05 2.162 1.376 2.47 1.53.308.15.49.124.672-.08.18-.204.772-.9.978-1.204.204-.308.41-.254.678-.15.268.1.17.8 3.418 1.702.324.16.542.24.738.384.2.146.302.268.302.476 0 .2-.098.428-.45.864z"/></svg> },
    { key: "telegram", label: "Telegram", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.78 18.65L9.23 11l14-8.56c.63-.56 1.21-.26.74.22L6.15 16.62l-5.38-1.69c-1.17-.37-1.19-1.17.25-1.73l21-8.09c.97-.37 1.83.22 1.51 1.69L20 20.81c-.26 1.25-1 1.56-2.06.97l-5.7-4.2-2.75 2.65c-.31.31-.56.57-1.15.57z"/></svg> },
    { key: "snapchat", label: "Snapchat", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.88 2 2.69 5.86 2.69 11.23c0 2.25 1.13 3.93 1.7 4.96.2.37.15.6-.08.85a3.86 3.86 0 01-1 .73c-.63.3-1 .61-1 .96s.51.58 1.79.46c.39-.03.74.21 1 .53a9.92 9.92 0 005.15 2.87c.23.05.35.19.38.41a2.82 2.82 0 00.35 1c.14.25.32.25.43 0a2.82 2.82 0 00.35-1c.03-.22.15-.36.38-.41a9.92 9.92 0 005.15-2.87c.23-.32.58-.56 1-.53 1.28.12 1.79-.11 1.79-.46s-.37-.66-1-.96a3.86 3.86 0 01-1-.73c-.23-.25-.28-.48-.08-.85.57-1.03 1.7-2.71 1.7-4.96C21.31 5.86 17.12 2 12 2z"/></svg> }
  ];

  const activeSocials = socialConfig
    .filter((social) => socials[social.key]?.isActive && socials[social.key]?.url)
    .map((social) => ({
      ...social,
      url: formatExternalUrl(socials[social.key].url),
    }))
    .filter((social) => social.url !== "#");

  const hasActiveSocials = activeSocials.length > 0;

  return (
    <footer className="bg-[var(--primary)] text-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1 ">
            <Image
              src={footerLogoSrc}
              alt="Louisianaroma Footer Logo"
              width={150}
              height={40}
              className="mb-6 h-10 w-auto object-contain -ml-10"
            />
            <p className="text-sm leading-relaxed mb-8 opacity-80">
              The pinnacle of bespoke perfumery, blending traditional savoir-faire with contemporary digital precision.
            </p>
            <div className="flex space-x-4">
              {!hasActiveSocials ? (
                <>
                  <Link href="https://facebook.com" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  </Link>
                  <Link href="https://twitter.com" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Twitter">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </Link>
                  <Link href="https://instagram.com" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Instagram">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </Link>
                </>
              ) : (
                activeSocials.map((social) => (
                  <a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-sm">Shop</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/blend" className="opacity-70 hover:opacity-100 transition-opacity">Blend Station</Link></li>
              <li><Link href="/shop" className="opacity-70 hover:opacity-100 transition-opacity">Shop</Link></li>
              <li><Link href="/faq" className="opacity-70 hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link href="/about" className="opacity-70 hover:opacity-100 transition-opacity">About Us</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-sm">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/contact" className="opacity-70 hover:opacity-100 transition-opacity">Contact Support</Link></li>
              <li><Link href="/privacy" className="opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/terms" className="opacity-70 hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-sm">Contact</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center space-x-3">
                <span className="opacity-70">{emailVal}</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="opacity-70">{phoneVal}</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="opacity-70">{addressVal}</span>
              </li>
            </ul>
            
            <div className="mt-8 bg-black/5 p-4 rounded-xl border border-black/10">
               <div className="flex items-center space-x-2 text-xs font-semibold mb-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
                 <span>Need Help?</span>
               </div>
               <p className="text-xs opacity-70 leading-tight">Our support team is available 24/7.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-black/10 text-center text-xs opacity-50">
          <p>© {new Date().getFullYear()} Louisianaroma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
