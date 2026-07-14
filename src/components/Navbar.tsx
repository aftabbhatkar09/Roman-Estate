"use client";
import Link from "next/link";
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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-500 ${
        scrolled
          ? "bg-white/72 backdrop-blur-xl border-b border-brand-primary/10 py-3 shadow-lg shadow-brand-primary/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tight text-brand-dark">
                ROMAN
                <span className="text-brand-primary">.</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase -mt-0.5">
                ESTATE
              </span>
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
                        ? "w-full bg-gradient-to-r from-brand-primary to-brand-accent"
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
              className="premium-button-primary !py-2.5 !px-6 text-sm flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-brand-dark focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-white z-50 shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-brand-dark">
                ROMAN<span className="text-brand-primary">.</span>
              </span>
              <span className="text-[8px] font-bold text-gray-400 tracking-[0.3em] uppercase -mt-0.5">
                ESTATE
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 px-6 py-8 space-y-1 overflow-y-auto">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center py-3.5 text-lg font-bold transition-all duration-300 ${
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-dark hover:text-brand-primary"
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {isActive && (
                    <span className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-accent rounded-full mr-3" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="px-6 py-6 border-t border-gray-100 space-y-3">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 py-3 text-base font-semibold text-gray-600"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-brand-primary" />
              </div>
              +91 98765 43210
            </a>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full premium-button-primary"
            >
              <User className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
