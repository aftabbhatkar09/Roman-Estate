"use client";

const SHARE_URLS: Record<string, (url: string, title: string) => string> = {
  Facebook: (url) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  Twitter: (url, title) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  LinkedIn: (url) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
};

export default function ShareButtons({ title }: { title: string }) {
  const handleShare = (social: string) => {
    const url = window.location.href;
    window.open(SHARE_URLS[social](url, title), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      {Object.keys(SHARE_URLS).map((social) => (
        <button
          key={social}
          type="button"
          onClick={() => handleShare(social)}
          className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl border border-gray-100 font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-brand-dark hover:bg-linear-to-br hover:from-brand-primary hover:to-brand-accent hover:text-white hover:border-transparent transition-all duration-300"
        >
          {social}
        </button>
      ))}
    </div>
  );
}
