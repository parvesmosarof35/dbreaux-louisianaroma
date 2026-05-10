"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blend Station", href: "/blend" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-[92px] px-[48px] pr-[48.02px] py-[24px]">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center h-full">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/navbarlogo.png"
                alt="Louisianaroma Logo"
                width={180}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11.6px] font-normal tracking-[2.4px] uppercase transition-all duration-300 hover:text-[var(--primary)] align-middle flex items-center h-full`}
                style={{ 
                  fontFamily: "Georgia, serif",
                  lineHeight: "16px",
                  color: pathname === link.href ? "var(--primary)" : "rgba(255, 255, 255, 0.8)"
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/cart" className="text-white hover:text-[var(--primary)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <Link href="/login" className="text-white hover:text-[var(--primary)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
    </nav>
  );
}
