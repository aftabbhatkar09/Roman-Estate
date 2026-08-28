import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthShell({
  icon: Icon = ShieldCheck,
  heading,
  subheading,
  footerLinkHref = "/",
  footerLinkLabel = "← Back to public website",
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  heading: string;
  subheading: string;
  footerLinkHref?: string;
  footerLinkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-brand-dark via-brand-dark-light to-[#1e1b4b] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-center leading-none">
              <span
                className="text-4xl font-black tracking-tight text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Roman<span className="text-brand-primary">.</span>
              </span>
              <span className="text-[11px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">
                Estate
              </span>
            </div>
          </Link>
          <p className="text-gray-500 text-sm font-medium mt-4">
            Admin Panel — Restricted Access
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="bg-linear-to-r from-brand-dark via-brand-dark-light to-indigo-900 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">
                  {heading}
                </h1>
                <p className="text-gray-400 text-xs font-medium">
                  {subheading}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">{children}</div>

          <div className="px-8 pb-8">
            <div className="border-t border-gray-100 pt-6 text-center">
              <Link
                href={footerLinkHref}
                className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors"
              >
                {footerLinkLabel}
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs font-medium mt-6">
          Secured with encrypted session tokens
        </p>
      </div>
    </div>
  );
}
