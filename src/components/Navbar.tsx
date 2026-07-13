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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-none">
              <span
                className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-brand-dark" : "text-brand-dark"
                }`}
              >
                ROMAN
                <span className="text-brand-gold">.</span>
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
                  className={`relative text-sm font-semibold transition-all duration-300 group ${
                    isActive
                      ? "text-brand-gold"
                      : "text-gray-600 hover:text-brand-gold"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold rounded-full transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-gold transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-brand-gold" />
              </div>
              <span className="hidden lg:inline">+91 98765 43210</span>
            </a>
            <Link
              href="/admin"
              className="premium-button-primary !py-2 !px-5 text-sm flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-brand-dark focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-[72px] bg-white z-40 transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center text-2xl font-bold transition-colors ${
                  isActive
                    ? "text-brand-gold"
                    : "text-brand-dark hover:text-brand-gold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-8 border-t border-gray-100 space-y-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-4 text-lg font-semibold text-gray-600"
            >
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-brand-gold" />
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
