export default function PropertiesLoading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-10 sm:h-12 w-72 sm:w-96 bg-gray-200 rounded-lg mb-4" />
          <div className="h-5 w-full max-w-xl bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters skeleton */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-6 h-96" />

        {/* Cards skeleton */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="aspect-4/3 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
