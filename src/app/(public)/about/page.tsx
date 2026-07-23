import Image from "next/image";
import Link from "next/link";
import { 
  Award, 
  Target, 
  Users2, 
  History, 
  ShieldCheck, 
  Gem, 
  Briefcase, 
  Globe2,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export const metadata = {
  title: "About Us | Roman Estate",
  description: "Learn about Roman Estate's legacy of luxury real estate in Mumbai.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            alt="Modern Office"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-dark/90 to-brand-accent/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8">
          <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-brand-primary/25">
            Our Legacy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Redefining <br />
            <span className="gradient-text">Mumbai Luxury</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed px-2 sm:px-0">
            Since 1994, Roman Estate has been the definitive choice for those seeking 
            unparalleled excellence in the Mumbai real estate market.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 sm:py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 bg-brand-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                    A Tradition of <br />Excellence and Trust
                  </h2>
                  <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed">
                    What began as a boutique advisory has evolved into Mumbai&apos;s premier luxury real estate firm. 
                    Our philosophy is simple: we don&apos;t just broker transactions; we curate lifestyles 
                    and secure generational wealth.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-2 sm:pt-4">
                  {[
                    { icon: Target, title: 'Precision', desc: 'Meticulous attention to every detail of the acquisition.' },
                    { icon: ShieldCheck, title: 'Integrity', desc: 'Unwavering commitment to transparency and ethics.' },
                    { icon: Gem, title: 'Exclusivity', desc: 'Access to Mumbai\'s most prestigious off-market listings.' },
                    { icon: Award, title: 'Expertise', desc: 'Decades of deep-rooted market intelligence.' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2 sm:space-y-3 group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center group-hover:from-brand-primary group-hover:to-brand-accent transition-all duration-500">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary group-hover:text-white" />
                      </div>
                      <h3 className="font-black text-brand-dark uppercase tracking-wider text-[11px] sm:text-xs">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&q=80&w=1000"
                alt="Architecture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
              <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-4 sm:left-6 md:left-12 right-4 sm:right-6 md:right-12 glass-morphism p-4 sm:p-6 md:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] border border-white/20">
                <p className="text-white text-sm sm:text-base md:text-lg font-bold italic leading-relaxed">
                  &ldquo;Excellence is not an act, but a habit. In the world of luxury real estate, 
                  it is the only standard that matters.&rdquo;
                </p>
                <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-white shrink-0">R</div>
                  <div className="min-w-0">
                    <p className="text-white font-black text-sm sm:text-base">Roman D&apos;Souza</p>
                    <p className="text-brand-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Founder & Chairman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {[
              { label: 'Properties Sold', val: '2.5k+' },
              { label: 'Client Satisfaction', val: '99%' },
              { label: 'Market Experience', val: '30yrs' },
              { label: 'Global Network', val: '12+' }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-1 sm:space-y-2">
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black gradient-text tracking-tight">{stat.val}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 md:mb-20">
            <span className="text-brand-primary text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em]">The Professionals</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark tracking-tight">Meet Our Principal Advisors</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-sm sm:text-base md:text-lg">
              Our team consists of industry veterans with unparalleled knowledge 
               of Mumbai&apos;s luxury property landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {[
              { name: 'Sameer Khan', role: 'VP, Luxury Acquisitions', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
              { name: 'Ananya Iyer', role: 'Director, Client Relations', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
              { name: 'Vikram Mehta', role: 'Head of Legal & Compliance', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' }
            ].map((member, i) => (
              <div key={i} className="premium-card bg-white group/item">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={member.img} alt={member.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 translate-y-10 group-hover/item:translate-y-0 transition-transform duration-500">
                    <div className="flex gap-4 justify-center">
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 text-center space-y-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-brand-dark">{member.name}</h3>
                  <p className="text-brand-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-brand-dark rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[4rem] p-6 sm:p-8 md:p-12 lg:p-24 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/5 to-transparent -skew-x-12 transform translate-x-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Why Discerning Clients <br />Choose Us
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    'Unmatched portfolio of South Mumbai masterpieces.',
                    'Rigorous verification and legal due diligence.',
                    'Strategic investment advisory with proven ROI.',
                    'Complete discretion and confidentiality for elite clients.'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 group">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 flex items-center justify-center shrink-0 group-hover:from-brand-primary group-hover:to-brand-accent transition-colors">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary-light group-hover:text-white" />
                      </div>
                      <p className="text-gray-400 font-medium group-hover:text-white transition-colors text-sm sm:text-base">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-300 leading-relaxed italic">
                  &ldquo;Our mission is to empower our clients through expert guidance, 
                  ensuring every real estate decision is a step toward a more refined future.&rdquo;
                </p>
                <Link href="/contact" className="premium-button-primary inline-flex items-center gap-2 text-sm sm:text-base">
                  Start Your Journey <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
