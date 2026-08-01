"use client";

import Link from "next/link";
import useCategories from "@/hooks/useCategories";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Code,
  PenTool,
  Megaphone,
  Briefcase,
  LineChart,
  Stethoscope,
  GraduationCap,
  Headset,
  Wrench,
  Layers,
  ArrowRight,
} from "lucide-react";

// Helper to map category names to icons dynamically
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("software") || name.includes("it") || name.includes("developer")) return <Code className="w-6 h-6" />;
  if (name.includes("design") || name.includes("art")) return <PenTool className="w-6 h-6" />;
  if (name.includes("marketing") || name.includes("seo")) return <Megaphone className="w-6 h-6" />;
  if (name.includes("finance") || name.includes("accounting")) return <LineChart className="w-6 h-6" />;
  if (name.includes("health") || name.includes("medical")) return <Stethoscope className="w-6 h-6" />;
  if (name.includes("education") || name.includes("teaching")) return <GraduationCap className="w-6 h-6" />;
  if (name.includes("sales")) return <Briefcase className="w-6 h-6" />;
  if (name.includes("customer") || name.includes("support")) return <Headset className="w-6 h-6" />;
  if (name.includes("engineering") || name.includes("mechanic")) return <Wrench className="w-6 h-6" />;

  // Default fallback icon
  return <Layers className="w-6 h-6" />;
};

export default function Categories() {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-transparent">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-8 md:py-10 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#124d46] to-teal-600">Category</span>
            </h2>
            <p className="text-base text-slate-600 mt-1.5 font-medium">
              Explore job opportunities across specialized industries and find your perfect fit.
            </p>
          </div>

          <div className="hidden md:block">
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-1.5 text-[#124d46] font-bold text-base hover:text-[#0a2e2a] transition-colors"
            >
              View all categories
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Compact Grid with Larger Text & Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="group flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 border-2 border-teal-100/90 shadow-xs hover:shadow-md hover:border-[#124d46] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
            >
              {/* Larger Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#124d46] flex items-center justify-center shrink-0 border border-teal-200/80 group-hover:bg-[#124d46] group-hover:text-white transition-all duration-200 shadow-xs">
                {getCategoryIcon(category.name)}
              </div>

              {/* Text Info: Larger Category Name + Jobs Count */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-[#124d46] transition-colors truncate">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm font-semibold text-teal-700/90 mt-0.5">
                  {category.jobs} {category.jobs === 1 ? "job available" : "jobs available"}
                </p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#124d46] group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#124d46] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#0a2e2a] transition-all shadow-sm active:scale-95"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}