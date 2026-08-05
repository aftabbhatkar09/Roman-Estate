"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-brand-primary/10 shadow-md"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-1 sm:gap-2 group shrink-0 min-w-0"
            >
              <div className="flex items-center gap-1 sm:gap-2 leading-none">
                <Image
                  src="/images/logo3.png"
                  alt="Roman Estate Logo"
                  height={48}
                  width={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15"
                />
                <div className="flex flex-col items-center justify-center font-serif text-black uppercase select-none mt-1">
                  <span className="text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.5em] ml-[0.5em] mb-0.5 font-medium">
                    The
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl tracking-widest font-normal leading-none">
                    Roman
                  </span>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 w-full">
                    <div className="h-px w-3 sm:w-5 md:w-8 bg-[#C2A365]"></div>
                    <span className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.5em] ml-[0.5em] font-medium text-gray-800">
                      Estate
                    </span>
                    <div className="h-px w-3 sm:w-5 md:w-8 bg-[#C2A365]"></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-md font-semibold transition-all duration-300 group ${
                      isActive
                        ? "text-brand-primary"
                        : "text-gray-500 hover:text-brand-dark"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-full bg-linear-to-r from-brand-primary to-brand-accent"
                          : "w-0 bg-brand-primary group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* CTA + Admin */}
            <div className="hidden md:flex items-center gap-5">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-primary transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="hidden lg:inline">+91 98765 43210</span>
              </a>
              <Link
                href="/admin"
                className="premium-button-primary py-2.5! px-6! text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Admin
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-brand-dark focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-100 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile menu header with full branding and close button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-white">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 leading-none"
              >
                <Image
                  src="/images/logo3.png"
                  alt="Roman Estate Logo"
                  height={40}
                  width={40}
                  className="w-10 h-10"
                />
                <div className="flex flex-col items-center justify-center font-serif text-black uppercase select-none">
                  <span className="text-[8px] tracking-[0.4em] mb-0.5 font-medium">
                    The
                  </span>
                  <span className="text-lg tracking-widest font-normal leading-none">
                    Roman
                  </span>
                  <span className="text-[7px] tracking-[0.4em] font-medium text-gray-800">
                    Estate
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto bg-white">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 px-5 rounded-2xl text-xl font-bold transition-all ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary font-black"
                        : "text-brand-dark hover:bg-gray-50 hover:text-brand-primary"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-sm" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTAs Footer */}
            <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/70 shrink-0">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white border border-gray-200 text-base font-bold text-gray-800 shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-primary" />
                </div>
                +91 98765 43210
              </a>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full premium-button-primary py-3.5 text-base font-bold"
              >
                <User className="w-5 h-5" />
                Admin Panel
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
