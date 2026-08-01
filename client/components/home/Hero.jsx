"use client";

import Link from "next/link";
import { FaSearch, FaBriefcase } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/jobs`);
    }
  };

  const handlePopularSearch = (term) => {
    router.push(`/jobs?search=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative bg-transparent overflow-hidden min-h-[85vh] flex items-center">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%]  rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%]  rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] "></div>

      <div className="max-w-7xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="flex flex-col items-start space-y-4 mt-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50/80 border border-teal-200 text-[#124d46] text-sm font-semibold backdrop-blur-md shadow-sm transition-all hover:bg-teal-100/80 cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
            #1 Job Portal for Developers
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#124d46] to-teal-600">Dream Job</span> Faster.
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-lg leading-relaxed">
            Discover thousands of verified job opportunities from top companies around the world. Your next big career move starts here.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 rounded-2xl p-2 flex flex-col md:flex-row gap-2 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex-1 flex items-center bg-slate-50/50 rounded-xl px-4 border border-slate-100 focus-within:ring-2 focus-within:ring-[#124d46]/20 focus-within:border-[#124d46] transition-all">
              <FaBriefcase className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent border-none focus:ring-0 px-3 py-3 w-full text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] hover:from-[#0a2e2a] hover:to-black text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#124d46]/30 transition-all hover:shadow-[#124d46]/50 active:scale-95"
            >
              <FaSearch />
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Popular Searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Frontend', 'Backend', 'Full Stack', 'Remote'].map(term => (
                <span
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-700 cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="relative hidden lg:flex justify-center items-center group">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-200/40 to-emerald-200/40 rounded-[3rem] rotate-3 scale-105 -z-10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110 blur-xl"></div>
          <Image
            src="/hero.svg"
            alt="Job Search Illustration"
            width={600}
            height={600}
            className="w-full max-w-lg drop-shadow-2xl transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-105"
            priority
          />
        </div>
      </div>
    </section>
  );
}