import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  Briefcase,
  Send,
  Video,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300">
      {/* Top CTA Banner */}
      <div className="gradient-animate">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                Ready to find your masterpiece?
              </h3>
              <p className="text-white/80 text-lg">
                Explore Mumbai&apos;s most exclusive collection of premium properties.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                href="/properties"
                className="bg-white text-brand-primary px-10 py-4 rounded-full font-bold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2"
              >
                Browse Properties <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 md:gap-16">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex flex-col leading-none">
              <span className="text-3xl font-black tracking-tight text-white">
                ROMAN<span className="text-brand-primary">.</span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">
                ESTATE
              </span>
            </div>
            <p className="text-base leading-relaxed text-gray-400 max-w-xs">
              Redefining luxury real estate in Mumbai for over three decades.
              Excellence in every square foot.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Camera, href: "#", label: "Instagram" },
                { icon: Briefcase, href: "#", label: "LinkedIn" },
                { icon: Send, href: "#", label: "Twitter" },
                { icon: Video, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 bg-white/5 hover:bg-brand-primary rounded-xl flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-brand-primary text-gray-400 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-[0.2em]">
              Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "Properties", href: "/properties" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-2 group text-base"
                  >
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-[0.2em]">
              Expertise
            </h4>
            <ul className="space-y-4">
              {[
                "Luxury Consulting",
                "Property Acquisition",
                "Portfolio Management",
                "Legal Advisory",
                "Market Intelligence",
              ].map((s) => (
                <li
                  key={s}
                  className="text-gray-400 flex items-center gap-2 text-base"
                >
                  <span className="w-1.5 h-1.5 bg-brand-primary/30 rounded-full" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-[0.2em]">
              Get in Touch
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-gray-400 text-base leading-relaxed">
                  Opera House, Charni Road,
                  <br />
                  Mumbai, Maharashtra 400004
                </span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-4 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white text-base">
                    +91 98765 43210
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@romanestate.com"
                  className="flex items-center gap-4 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white text-base">
                    info@romanestate.com
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Roman Estate. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              RERA Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
