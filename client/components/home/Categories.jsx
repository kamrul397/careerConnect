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
  ArrowRight
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
      <div className="flex justify-center items-center py-20 bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-12 bg-transparent relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 transform -skew-x-12 translate-x-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Category</span>
            </h2>
            <p className="text-base text-slate-600 mt-2 leading-relaxed max-w-xl">
              Explore thousands of job opportunities across specialized industries and find your perfect fit.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-800 transition-colors"
            >
              View all categories
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="group relative flex flex-col items-center bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-teal-300 transition-all duration-300 overflow-hidden text-center"
            >
              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon Container */}
              <div className="relative z-10 mb-3 p-3 bg-slate-50 text-slate-700 rounded-full group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-teal-600/20 transition-all duration-300">
                {getCategoryIcon(category.name)}
              </div>

              <h3 className="relative z-10 text-base font-bold text-slate-800 group-hover:text-teal-900 transition-colors">
                {category.name}
              </h3>

              <p className="relative z-10 text-xs font-medium text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-white/80 transition-colors">
                {category.jobs} {category.jobs === 1 ? 'Job' : 'Jobs'}
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-100 text-slate-800 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-all shadow-sm active:scale-95"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}