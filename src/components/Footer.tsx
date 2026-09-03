import Link from "next/link";
import Image from "next/image";
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
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                Ready to find your masterpiece?
              </h3>
              <p className="text-white/80 text-base sm:text-lg">
                Explore Mumbai&apos;s most exclusive collection of premium
                properties.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                href="/properties"
                className="bg-white text-brand-primary-dark px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2 text-sm sm:text-base"
              >
                Browse Properties <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-16">
          {/* Brand */}
          <div className="space-y-6 sm:space-y-8 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col leading-none">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex items-center gap-2 leading-none">
                  <Image
                    src="/images/logo3.png"
                    alt="Roman Estate Logo"
                    height={48}
                    width={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15"
                  />
                  <div className="flex flex-col items-center justify-center font-serif text-black uppercase select-none mt-1">
                    <span className="text-white text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.5em] ml-[0.5em] mb-0.5 font-medium">
                      The
                    </span>
                    <span className="text-white text-xl sm:text-2xl md:text-3xl tracking-widest font-normal leading-none">
                      Roman
                    </span>
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 w-full">
                      <div className="h-px w-3 sm:w-5 md:w-8 bg-[#C2A365]"></div>
                      <span className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.5em] ml-[0.5em] font-medium text-white">
                        Estate
                      </span>
                      <div className="h-px w-3 sm:w-5 md:w-8 bg-[#C2A365]"></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-400 max-w-xs">
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
            <h4 className="text-white font-bold mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm uppercase tracking-[0.2em]">
              Navigation
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "Properties", href: "/properties" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-2 group text-sm sm:text-base"
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
            <h4 className="text-white font-bold mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm uppercase tracking-[0.2em]">
              Expertise
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                "Luxury Consulting",
                "Property Acquisition",
                "Portfolio Management",
                "Legal Advisory",
                "Market Intelligence",
              ].map((s) => (
                <li
                  key={s}
                  className="text-gray-400 flex items-center gap-2 text-sm sm:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-brand-primary/30 rounded-full shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm uppercase tracking-[0.2em]">
              Get in Touch
            </h4>
            <ul className="space-y-4 sm:space-y-6">
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                </div>
                <span className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Dockyard Road, Mazgoan,
                  <br />
                  Mumbai 400010
                </span>
              </li>
              <li>
                <a
                  href="tel:+918424886355"
                  className="flex items-center gap-3 sm:gap-4 group transition-colors"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white text-sm sm:text-base">
                    +91 84248 86355
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:theromanestate@gmail.com"
                  className="flex items-center gap-3 sm:gap-4 group transition-colors"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white text-sm sm:text-base">
                    theromanestate@gmail.com
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-12 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-px w-8 sm:w-12 bg-[#C2A365]/60" />
            <span className="text-[10px] sm:text-xs text-[#C2A365] uppercase tracking-[0.3em] font-bold">
              Our Promise
            </span>
            <div className="h-px w-8 sm:w-12 bg-[#C2A365]/60" />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-white/90 tracking-wide">
            Building Relationships Beyond Real Estate.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Roman Estate. All rights reserved.
          </p>
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
