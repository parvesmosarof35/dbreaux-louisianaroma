import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
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
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-sm font-medium tracking-widest uppercase hover:text-[var(--primary)] transition-colors">Home</Link>
            <Link href="/blend" className="text-sm font-medium tracking-widest uppercase hover:text-[var(--primary)] transition-colors">Blend Station</Link>
            <Link href="/shop" className="text-sm font-medium tracking-widest uppercase hover:text-[var(--primary)] transition-colors">Shop</Link>
            <Link href="/about" className="text-sm font-medium tracking-widest uppercase hover:text-[var(--primary)] transition-colors">About</Link>
            <Link href="/faq" className="text-sm font-medium tracking-widest uppercase hover:text-[var(--primary)] transition-colors">FAQ</Link>
            <Link href="/contact" className="text-sm font-medium tracking-widest uppercase hover:text-[var(--primary)] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-[var(--primary)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            <button className="text-white hover:text-[var(--primary)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
