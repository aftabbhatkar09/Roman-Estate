import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { Calendar, User, ArrowLeft, Tag, Share2, ArrowRight } from "lucide-react";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug });

  if (!blog) return { title: "Article Not Found" };

  return {
    title: `${blog.title} | Roman Estate Insights`,
    description: blog.excerpt,
  };
}

async function getBlog(slug: string) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) return null;
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    return null;
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Article Header/Hero */}
      <div className="relative h-[55vw] max-h-[85vh] min-h-[420px] md:min-h-[520px] w-full overflow-hidden bg-brand-dark">
        <ImageWithFallback
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            opacity: 0.55,
          }}
          quality={90}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/35 to-brand-primary/5" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <Link
              href="/blog"
              className="glass-morphism px-6 py-2.5 rounded-2xl font-black text-brand-dark hover:bg-white transition-all inline-flex items-center gap-2 text-xs shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 text-brand-primary" /> Journal Archive
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {blog.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-white text-lg shadow-xl">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Author</p>
                    <p className="text-white font-black">{blog.author}</p>
                  </div>
                </div>

                <div className="h-10 w-px bg-white/10 hidden md:block" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-brand-primary-light" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Published</p>
                    <p className="text-white font-black">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16 md:mt-24 flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="lg:w-2/3">
          <div className="prose prose-xl max-w-none text-gray-500 font-medium leading-relaxed prose-headings:text-brand-dark prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-primary prose-strong:text-brand-dark prose-blockquote:border-brand-primary prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:font-bold prose-blockquote:text-brand-dark">
            {blog.content.split("\n").map((para: string, i: number) =>
              para.trim() ? (
                <p key={i} className="mb-8">
                  {para}
                </p>
              ) : (
                <br key={i} />
              ),
            )}
          </div>

          {/* Social Share */}
          <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-1">
              <h4 className="text-xl font-black text-brand-dark tracking-tight">Share this perspective</h4>
              <p className="text-sm text-gray-400 font-medium">Circulate this insight within your professional network.</p>
            </div>
            <div className="flex items-center gap-4">
              {['Facebook', 'Twitter', 'LinkedIn'].map((social, i) => (
                <button
                  key={i}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 rounded-2xl border border-gray-100 font-black text-xs uppercase tracking-widest text-brand-dark hover:bg-gradient-to-br hover:from-brand-primary hover:to-brand-accent hover:text-white hover:border-transparent transition-all duration-300"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-12">
          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-8">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-brand-primary" />
              <h4 className="text-xl font-black text-brand-dark tracking-tight">Curated Topics</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                "Market Trends",
                "Investment Strategy",
                "Mumbai Real Estate",
                "Luxury Living",
                "Portfolio Growth",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-brand-primary hover:text-brand-primary cursor-pointer transition-all shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-dark to-brand-dark-light p-8 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-primary/15 to-brand-accent/15 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h4 className="text-3xl font-black leading-tight tracking-tight">
                  Seeking a <br />New Sanctuary?
                </h4>
                <p className="text-gray-400 font-medium leading-relaxed">
                  Connect with our principal advisors for a bespoke property consultation.
                </p>
              </div>
              <Link
                href="/contact"
                className="premium-button-primary w-full inline-flex justify-center"
              >
                Connect with an Expert
              </Link>
            </div>
          </div>

          {/* Featured Listing Ad */}
          <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden group">
             <Image 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                alt="Featured Property"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full p-10 space-y-4">
                <span className="text-brand-primary-light text-[10px] font-black uppercase tracking-[0.3em]">Featured Offering</span>
                <h5 className="text-2xl font-black text-white tracking-tight">Penthouse at Worli Skyline</h5>
                <Link href="/properties" className="text-white font-bold text-xs flex items-center gap-2 group/link">
                  View Masterpiece <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
             </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
