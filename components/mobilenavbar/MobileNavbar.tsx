"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileNavbar.module.css";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  // { name: "Blend Station", href: "/blend" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

interface MobileNavbarProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function MobileNavbar({ onToggle }: MobileNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (onToggle) onToggle(newState);
  };

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      if (onToggle) onToggle(false);
    }
  }, [pathname]);

  // Trap focus logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) return;

      const menuLinks = navRef.current?.querySelectorAll<HTMLAnchorElement>(`.${styles.nav__link}`);
      const menuToggle = navRef.current?.querySelector<HTMLAnchorElement>(`.${styles.nav__toggle}`);

      if (e.key === "Tab" && menuLinks && menuToggle) {
        if (e.shiftKey) {
          if (document.activeElement === menuLinks[0]) {
            menuToggle.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === menuToggle) {
          menuLinks[0].focus();
          e.preventDefault();
        } else if (document.activeElement === menuLinks[menuLinks.length - 1]) {
          menuToggle.focus();
          e.preventDefault();
        }
      }

      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  return (
    <nav 
      ref={navRef}
      id="nav" 
      className={`${styles.nav} ${isMenuOpen ? styles["nav--open"] : ""}`} 
      role="navigation"
    >
      {/* ACTUAL NAVIGATION MENU */}
      <ul 
        className={styles.nav__menu} 
        id="menu" 
        tabIndex={-1} 
        aria-label="main navigation" 
        hidden={!isMenuOpen}
      >
        {navLinks.map((link) => (
          <li key={link.name} className={styles.nav__item}>
            <Link 
              href={link.href} 
              className={styles.nav__link}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      
      {/* MENU TOGGLE BUTTON */}
      <button 
        onClick={toggleMenu}
        className={styles.nav__toggle} 
        aria-expanded={isMenuOpen} 
        aria-controls="menu"
        aria-label="Toggle Menu"
      >
        <svg className={styles.menuicon} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <title>Toggle Menu</title>
          <g>
            <line className={styles.menuicon__bar} x1="13" y1="16.5" x2="37" y2="16.5"/>
            <line className={styles.menuicon__bar} x1="13" y1="24.5" x2="37" y2="24.5"/>
            <line className={styles.menuicon__bar} x1="13" y1="24.5" x2="37" y2="24.5"/>
            <line className={styles.menuicon__bar} x1="13" y1="32.5" x2="37" y2="32.5"/>
            <circle className={styles.menuicon__circle} r="23" cx="25" cy="25" />
          </g>
        </svg>
      </button>
      
      {/* ANIMATED BACKGROUND ELEMENT */}
      <div className={styles.splash}></div>
    </nav>
  );
}
