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
} from "lucide-react";
import Image from "next/image";
import { useSubmitInquiryMutation } from "@/lib/redux/slices/apiSlice";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
        message: "",
        _honeypot: "",
      });
    } catch (err: any) {
      setError(err.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
            alt="Office"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-dark/90 to-brand-accent/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
          <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-brand-primary/25">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            How Can We <br />
            <span className="gradient-text">
              Assist You?
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Our advisors are ready to help you navigate Mumbai&apos;s premium real
            estate landscape.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              {[
                {
                  icon: Phone,
                  title: "Private Advisory",
                  content: "+91 98765 43210",
                  sub: "Mon-Sat: 9:00 AM – 7:00 PM",
                  gradient: "from-brand-primary/10 to-brand-accent/10",
                  iconColor: "text-brand-primary",
                },
                {
                  icon: Mail,
                  title: "Digital Correspondence",
                  content: "hello@romanestate.com",
                  sub: "Response within 12 hours",
                  gradient: "from-brand-primary/5 to-brand-accent/5",
                  iconColor: "text-brand-primary",
                },
                {
                  icon: MapPin,
                  title: "Corporate Headquarters",
                  content: "Opera House, Charni Road, Mumbai 400004",
                  sub: "By Appointment Only",
                  gradient: "from-brand-primary/10 to-brand-accent/10",
                  iconColor: "text-brand-primary",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      {item.title}
                    </h3>
                    <p className="text-xl font-black text-brand-dark">
                      {item.content}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Cards */}
            <div className="bg-gradient-to-br from-brand-dark to-brand-dark-light rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 md:p-12 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-primary/15 to-brand-accent/15 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Globe className="w-6 h-6 text-brand-primary-light" />
                    Digital Presence
                  </h3>
                  <p className="text-gray-400 font-medium leading-relaxed">
                    Join our exclusive community for real-time market insights
                    and off-market opportunities.
                  </p>
                </div>
                <div className="flex gap-4">
                  {[Camera, Briefcase, Send].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-brand-primary hover:to-brand-accent flex items-center justify-center transition-all border border-white/10 group/icon"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-card border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-16 space-y-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-12 h-12 text-brand-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-brand-dark tracking-tight">
                      Transmission Received
                    </h2>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                      Thank you for your interest. A senior advisor will reach
                      out to you within the next business day.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="premium-button-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h2 className="text-3xl font-black text-brand-dark tracking-tight">
                        Direct Inquiry
                      </h2>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Please provide your details and requirements below.
                      Confidentiality is our priority.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all font-bold text-brand-dark"
                          placeholder="Ex: Alexander Roman"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all font-bold text-brand-dark"
                          placeholder="alex@domain.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all font-bold text-brand-dark"
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        Brief Inquiry
                      </label>
                      <textarea
                        required
                        rows={5}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all resize-none font-bold text-brand-dark"
                        placeholder="What are you looking for?"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full premium-button-primary py-5 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group/btn"
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Send Message{" "}
                          <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="h-[400px] sm:h-[500px] md:h-[600px] bg-gray-50 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-gray-100 relative group shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000"
            alt="Office Location"
            fill
            className="object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-16 md:left-16 glass-morphism p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-white/20 transform group-hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full animate-pulse" />
              <span className="text-brand-dark font-black uppercase tracking-[0.2em] text-[10px]">
                Headquarters
              </span>
            </div>
            <h3 className="text-3xl font-black text-brand-dark mb-2 tracking-tight">
              Visit Us in Mumbai
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
              Opera House, Charni Road, Mumbai, Maharashtra 400004
            </p>
            <button className="mt-8 premium-button-primary !py-3 !px-8 text-sm flex items-center gap-2">
              Open in Maps <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
