"use client";

import Link from "next/link";
import { Home, Briefcase, ArrowLeft, Search, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#124d46]/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10 bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-2xl">
        
        {/* Animated Badge & Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-teal-50 border-2 border-teal-200/80 flex items-center justify-center text-[#124d46] shadow-inner">
            <ShieldAlert className="w-12 h-12 text-[#124d46] animate-pulse" />
          </div>
          <span className="absolute -top-2 -right-2 px-3 py-1 bg-rose-500 text-white font-extrabold text-xs rounded-full shadow-md">
            404
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Oops! The page you are looking for doesn’t exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#124d46] hover:bg-[#0a2e2a] text-white font-bold text-sm shadow-md shadow-[#124d46]/20 transition-all active:scale-95 group"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#124d46] font-bold text-sm border border-teal-200 transition-all active:scale-95"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Jobs</span>
          </Link>
        </div>

        {/* Help Footer */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            CareerConnect Platform · Need help? Contact Support
          </p>
        </div>

      </div>
    </div>
  );
}
