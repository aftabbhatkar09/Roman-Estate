import Link from "next/link";
import { Home, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-7xl sm:text-8xl font-black gradient-text tracking-tight">
            404
          </p>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
              Page Not Found
            </h1>
            <p className="text-gray-500">
              The page you&apos;re looking for doesn&apos;t exist or may have
              been moved.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="premium-button-primary flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/properties"
              className="premium-button-outline flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
