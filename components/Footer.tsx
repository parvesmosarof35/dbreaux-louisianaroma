import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1">
            <Image
              src="/footerlogo.png"
              alt="Louisianaroma Footer Logo"
              width={150}
              height={40}
              className="mb-6 h-10 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed mb-8 opacity-80">
              The pinnacle of bespoke perfumery, blending traditional savoir-faire with contemporary digital precision.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </Link>
              <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </Link>
              <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </Link>
              <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
              </Link>
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
                <span className="opacity-70">support@louisianaroma.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="opacity-70">+880 1234 567 890</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="opacity-70">Dhaka, Bangladesh</span>
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
