"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Globe,
  Camera,
  Briefcase,
  ArrowRight,
  Building2,
  Home,
} from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useSubmitInquiryMutation } from "@/lib/redux/slices/apiSlice";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bhk: "",
    requirementType: "Buying",
    message: "",
    _honeypot: "",
  });
  const [submitInquiry, { isLoading: loading }] = useSubmitInquiryMutation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData._honeypot) {
      console.warn("Bot detected");
      return;
    }

    setError(null);
    try {
      await submitInquiry(formData).unwrap();
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        bhk: "",
        requirementType: "Buying",
        message: "",
        _honeypot: "",
      });
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      setError(error.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Header */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-45">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
            alt="Office"
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary/20 via-brand-dark/55 to-brand-accent/10" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-brand-dark/80" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-4 sm:space-y-6">
          <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-brand-primary to-brand-accent text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-brand-primary/25">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            How Can We <br />
            <span className="gradient-text">Assist You?</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed px-2 sm:px-0">
            Our advisors are ready to help you navigate Mumbai&apos;s premium
            real estate landscape.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8 sm:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  icon: Phone,
                  title: "Private Advisory",
                  content: "+91 84248 86355",
                  sub: "Mon-Sat: 9:00 AM – 7:00 PM",
                  gradient: "from-brand-primary/10 to-brand-accent/10",
                  iconColor: "text-brand-primary",
                },
                {
                  icon: Mail,
                  title: "Digital Correspondence",
                  content: "theromanestate@gmail.com",
                  sub: "Response within 12 hours",
                  gradient: "from-brand-primary/5 to-brand-accent/5",
                  iconColor: "text-brand-primary",
                },
                {
                  icon: MapPin,
                  title: "Corporate Headquarters",
                  content: "Dockyard Road, Mazgoan, Mumbai 400010",
                  sub: "By Appointment Only",
                  gradient: "from-brand-primary/10 to-brand-accent/10",
                  iconColor: "text-brand-primary",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100} className="flex items-start gap-4 sm:gap-6 group">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br ${item.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <item.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`}
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                      {item.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl font-black text-brand-dark wrap-break-word">
                      {item.content}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      {item.sub}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Social Cards */}
            <Reveal delay={300} className="bg-linear-to-br from-brand-dark to-brand-dark-light rounded-3xl sm:rounded-4xl md:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-12 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-linear-to-br from-brand-primary/15 to-brand-accent/15 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary-light shrink-0" />
                    Digital Presence
                  </h2>
                  <p className="text-gray-400 font-medium leading-relaxed text-sm sm:text-base">
                    Join our exclusive community for real-time market insights
                    and off-market opportunities.
                  </p>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  {[
                    { icon: Camera, label: "Instagram" },
                    { icon: Briefcase, label: "LinkedIn" },
                    { icon: Send, label: "Twitter" },
                  ].map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-linear-to-br hover:from-brand-primary hover:to-brand-accent flex items-center justify-center transition-all border border-white/10 group/icon"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Contact Form */}
          <Reveal delay={150} className="lg:col-span-7">
            <div className="bg-white rounded-3xl sm:rounded-4xl md:rounded-[3rem] shadow-card border border-gray-100 p-5 sm:p-6 md:p-10 lg:p-16 relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-10 sm:py-16 space-y-6 sm:space-y-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-brand-primary/10 to-brand-accent/10 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary" />
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
                      Transmission Received
                    </h2>
                    <p className="text-gray-500 text-base sm:text-lg font-medium leading-relaxed max-w-sm mx-auto">
                      Thank you for your interest. A senior advisor will reach
                      out to you within the next business day.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="premium-button-outline text-sm sm:text-base"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-12">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                        Direct Inquiry
                      </h2>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                      Please provide your details and requirements below.
                      Confidentiality is our priority.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5 sm:space-y-8"
                  >
                    <input
                      type="text"
                      name="_honeypot"
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData._honeypot}
                      onChange={(e) =>
                        setFormData({ ...formData, _honeypot: e.target.value })
                      }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                      <div className="space-y-2 sm:space-y-3">
                        <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-cream border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all font-bold text-brand-dark text-sm sm:text-base"
                          placeholder="Ex: Alexander Roman"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-cream border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all font-bold text-brand-dark text-sm sm:text-base"
                          placeholder="alex@domain.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-cream border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all font-bold text-brand-dark text-sm sm:text-base"
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Home className="w-3 h-3" /> Property Size
                      </label>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {(["1 BHK", "2 BHK", "3 BHK", "4 BHK"] as const).map(
                          (size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  bhk: formData.bhk === size ? "" : size,
                                })
                              }
                              className={`flex-1 min-w-20 px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                                formData.bhk === size
                                  ? "bg-linear-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-lg shadow-brand-primary/25"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-brand-primary/30"
                              }`}
                            >
                              {size}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> Requirement Type
                      </label>
                      <div className="flex gap-2 sm:gap-3">
                        {(["Buying", "Selling", "Renting"] as const).map(
                          (type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  requirementType: type,
                                })
                              }
                              className={`flex-1 px-3 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                                formData.requirementType === type
                                  ? "bg-linear-to-r from-brand-primary to-brand-accent text-white border-transparent shadow-lg shadow-brand-primary/25"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-brand-primary/30"
                              }`}
                            >
                              {type}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                        Brief Inquiry
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-cream border border-transparent rounded-xl sm:rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all resize-none font-bold text-brand-dark text-sm sm:text-base"
                        placeholder="What are you looking for?"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border border-red-100">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full premium-button-primary py-3.5 sm:py-5 text-base sm:text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group/btn"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      ) : (
                        <>
                          Send Message{" "}
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Map Section */}
      <Reveal className="max-w-7xl mx-auto px-4 pb-20 sm:pb-24 md:pb-32">
        <div className="h-75 sm:h-100 md:h-125 lg:h-150 bg-cream rounded-3xl sm:rounded-4xl md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden border border-gray-100 relative group shadow-card">
          <iframe
            title="Roman Estate office location — Dockyard Road, Mazgoan, Mumbai"
            src="https://www.google.com/maps?q=Dockyard+Road,+Mazgoan,+Mumbai+400010&output=embed"
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-dark/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 sm:bottom-6 md:bottom-10 lg:bottom-16 left-3 sm:left-6 md:left-10 lg:left-16 right-3 sm:right-auto glass-morphism p-4 sm:p-6 md:p-8 lg:p-12 rounded-3xl sm:rounded-4xl md:rounded-[3rem] shadow-2xl border border-white/20 transform group-hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-linear-to-r from-brand-primary to-brand-accent rounded-full animate-pulse shrink-0" />
              <span className="text-brand-dark font-black uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">
                Headquarters
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-dark mb-1 sm:mb-2 tracking-tight">
              Visit Us in Mumbai
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed max-w-50 sm:max-w-xs text-xs sm:text-sm md:text-base">
              Dockyard Road, Mazgoan, Mumbai 400010
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Dockyard+Road,+Mazgoan,+Mumbai+400010"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-6 md:mt-8 premium-button-primary py-2! sm:py-3! px-5! sm:px-6! md:px-8! text-[11px] sm:text-sm flex items-center gap-2 w-fit"
            >
              Open in Maps <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
