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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24">
      {/* Header Section */}
      <div className="text-center space-y-6 mb-20">
        <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] border border-brand-primary/20">
          Insights & Perspectives
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-brand-dark tracking-tight leading-tight">
          Roman Estate <span className="gradient-text">Journal</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Expert analysis, market trends, and luxury lifestyle inspiration 
          from Mumbai&apos;s premier real estate consultants.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-8">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="Search the archive..." 
              className="w-full pl-12 sm:pl-14 pr-6 py-4 sm:py-5 bg-white border border-gray-100 rounded-3xl shadow-card outline-none focus:border-brand-primary/30 focus:ring-2 focus:ring-brand-primary/10 transition-all text-brand-dark font-bold placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 md:p-24 rounded-[2rem] sm:rounded-[3rem] text-center space-y-8 border border-dashed border-gray-200 shadow-sm max-w-3xl mx-auto">
          <div className="w-32 h-32 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-16 h-16 text-gray-200" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-brand-dark tracking-tight">No articles found</h3>
            <p className="text-gray-400 font-medium leading-relaxed">We couldn&apos;t find any entries matching your search criteria. <br />Try searching for market trends, luxury, or South Mumbai.</p>
          </div>
          <button 
            onClick={() => setSearchTerm('')}
            className="premium-button-primary"
          >
            Show All Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
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
                <div className="absolute top-5 left-5">
                  <span className="glass-morphism px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-dark">
                    {blog.tags?.[0] || 'Market Insights'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 mr-2 text-brand-primary" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Clock className="w-4 h-4 mr-2 text-brand-primary" />
                    5 min read
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-brand-dark group-hover/item:text-brand-primary transition-colors mb-4 line-clamp-2 leading-tight tracking-tight">
                  {blog.title}
                </h3>
                
                <p className="text-gray-500 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center font-black text-[10px] text-brand-primary">
                      RE
                    </div>
                    <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">{blog.author}</span>
                  </div>
                  <span className="text-brand-primary font-bold text-xs flex items-center gap-1.5 group/btn">
                    Read Article 
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
