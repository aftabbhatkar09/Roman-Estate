'use client';
import { useState } from 'react';
import { FileText, Calendar, User, ArrowRight, Search, Tag, Clock } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';

interface BlogListingClientProps {
  initialBlogs: any[];
}

export default function BlogListingClient({ initialBlogs }: BlogListingClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = initialBlogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-24">
      {/* Header Section */}
      <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 md:mb-20">
        <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] border border-brand-primary/20">
          Insights & Perspectives
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-brand-dark tracking-tight leading-tight">
          Roman Estate <span className="gradient-text">Journal</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-medium leading-relaxed px-2 sm:px-0">
          Expert analysis, market trends, and luxury lifestyle inspiration 
          from Mumbai&apos;s premier real estate consultants.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-4 sm:pt-6 md:pt-8 px-2 sm:px-0">
          <div className="relative group">
            <Search className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-brand-primary group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="Search the archive..." 
              className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 md:py-5 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-card outline-none focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all text-brand-dark font-bold placeholder:text-gray-300 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 md:p-16 lg:p-24 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] text-center space-y-6 sm:space-y-8 border border-dashed border-gray-200 shadow-sm max-w-3xl mx-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-200" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">No articles found</h3>
            <p className="text-gray-400 font-medium leading-relaxed text-sm sm:text-base">We couldn&apos;t find any entries matching your search criteria. <br className="hidden sm:block" />Try searching for market trends, luxury, or South Mumbai.</p>
          </div>
          <button 
            onClick={() => setSearchTerm('')}
            className="premium-button-primary text-sm sm:text-base"
          >
            Show All Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {filteredBlogs.map((blog) => (
            <Link 
              href={`/blog/${blog.slug}`}
              key={blog._id} 
              className="premium-card group/item bg-white flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="group-hover/item:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5">
                  <span className="glass-morphism px-2 sm:px-3 md:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-brand-dark">
                    {blog.tags?.[0] || 'Market Insights'}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6 flex-wrap">
                  <div className="flex items-center text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-brand-primary shrink-0" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-brand-primary shrink-0" />
                    5 min read
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-brand-dark group-hover/item:text-brand-primary transition-colors mb-3 sm:mb-4 line-clamp-2 leading-tight tracking-tight">
                  {blog.title}
                </h3>
                
                <p className="text-gray-500 font-medium text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto pt-4 sm:pt-6 md:pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center font-black text-[8px] sm:text-[10px] text-brand-primary shrink-0">
                      RE
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black text-brand-dark uppercase tracking-widest">{blog.author}</span>
                  </div>
                  <span className="text-brand-primary font-bold text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 group/btn">
                    Read Article 
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
