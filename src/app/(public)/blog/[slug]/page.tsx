import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { Calendar, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import ShareButtons from "@/components/ShareButtons";
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
    console.error("Error fetching blog:", error);
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
      <div className="relative min-h-120 sm:min-h-140 md:min-h-160 w-full overflow-hidden bg-brand-dark flex flex-col justify-end pt-28 sm:pt-32 pb-8 sm:pb-12 md:pb-16">
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
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/45 to-brand-dark/20" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
            <Link
              href="/blog"
              className="glass-morphism px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-brand-dark hover:bg-white transition-all inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs shadow-xl"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary shrink-0" />{" "}
              Journal Archive
            </Link>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {blog.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-linear-to-r from-brand-primary to-brand-accent text-white px-2.5 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 pt-2 sm:pt-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center font-black text-white text-sm sm:text-lg shadow-xl shrink-0">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                      Author
                    </p>
                    <p className="text-white font-black text-sm sm:text-base">
                      {blog.author}
                    </p>
                  </div>
                </div>

                <div className="h-6 sm:h-10 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary-light" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                      Published
                    </p>
                    <p className="text-white font-black text-sm sm:text-base">
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
      <div className="max-w-7xl mx-auto px-4 mt-8 sm:mt-12 md:mt-16 lg:mt-24 flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-20">
        <div className="lg:w-2/3">
          <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none text-gray-500 font-medium leading-relaxed prose-headings:text-brand-dark prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-primary prose-strong:text-brand-dark prose-blockquote:border-brand-primary prose-blockquote:bg-gray-50 prose-blockquote:p-4 sm:prose-blockquote:p-6 md:prose-blockquote:p-8 prose-blockquote:rounded-xl sm:prose-blockquote:rounded-2xl md:prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:font-bold prose-blockquote:text-brand-dark">
            {blog.content.split("\n").map((para: string, i: number) =>
              para.trim() ? (
                <p key={i} className="mb-4 sm:mb-6 md:mb-8">
                  {para}
                </p>
              ) : (
                <br key={i} />
              ),
            )}
          </div>

          {/* Social Share */}
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 pt-6 sm:pt-8 md:pt-10 lg:pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg md:text-xl font-black text-brand-dark tracking-tight">
                Share this perspective
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                Circulate this insight within your professional network.
              </p>
            </div>
            <ShareButtons title={blog.title} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-8 sm:space-y-10 md:space-y-12">
          <div className="bg-gray-50 p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-4xl md:rounded-[3rem] border border-gray-100 space-y-5 sm:space-y-6 md:space-y-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary shrink-0" />
              <h4 className="text-base sm:text-lg md:text-xl font-black text-brand-dark tracking-tight">
                Curated Topics
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                "Market Trends",
                "Investment Strategy",
                "Mumbai Real Estate",
                "Luxury Living",
                "Portfolio Growth",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-white border border-gray-100 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-brand-primary hover:text-brand-primary cursor-pointer transition-all shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-br from-brand-dark to-brand-dark-light p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl sm:rounded-4xl md:rounded-[3rem] lg:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-linear-to-br from-brand-primary/15 to-brand-accent/15 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-5 sm:space-y-6 md:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                  Seeking a <br />
                  New Sanctuary?
                </h4>
                <p className="text-gray-400 font-medium leading-relaxed text-sm sm:text-base">
                  Connect with our principal advisors for a bespoke property
                  consultation.
                </p>
              </div>
              <Link
                href="/contact"
                className="premium-button-primary w-full inline-flex justify-center text-sm sm:text-base"
              >
                Connect with an Expert
              </Link>
            </div>
          </div>

          {/* Featured Listing Ad */}
          <div className="relative aspect-4/5 max-h-125 rounded-4xl sm:rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
              alt="Featured Property"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-10 space-y-3 sm:space-y-4">
              <span className="text-brand-primary-light text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">
                Featured Offering
              </span>
              <h5 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
                Penthouse at Worli Skyline
              </h5>
              <Link
                href="/properties"
                className="text-white font-bold text-[11px] sm:text-xs flex items-center gap-2 group/link"
              >
                View Masterpiece{" "}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
