"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAllCompanies } from "@/services/companyService";
import Input from "@/components/ui/input";
import Link from "next/link";
import {
  Building2,
  Search,
  MapPin,
  Users,
  Briefcase,
  Globe,
  ExternalLink,
  ArrowRight,
  Eye,
  RotateCcw,
} from "lucide-react";

const industries = [
  "All",
  "Technology",
  "Design & Web Development",
  "Software Engineering & Cloud",
  "Mobile Development",
  "Artificial Intelligence",
  "Cybersecurity",
  "DevOps & Infrastructure",
  "Marketing & SEO",
];

export default function PublicCompaniesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // TanStack Query for fetching companies
  const {
    data: companies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["companies", searchQuery, selectedIndustry],

    queryFn: () =>
      getAllCompanies({
        search: searchQuery,
        industry: selectedIndustry,
      }),
  });

  const handleCardClick = (id) => {
    router.push(`/companies/${id}`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("All");
  };

  return (
    <div className="pt-20 md:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Optimized Top Search Bar Container (Matching Jobs Page) */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search companies by name, location, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-sm w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Industry Dropdown / Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === "All" ? "All Industries" : ind}
                </option>
              ))}
            </select>

            {(searchQuery || selectedIndustry !== "All") && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#124d46] hover:bg-teal-50 transition-colors shrink-0"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedIndustry === ind
                  ? "bg-[#124d46] text-white shadow-md shadow-[#124d46]/20"
                  : "bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-[#124d46] border border-slate-200/80"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#124d46]" />
          Companies Directory
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
          {companies.length} Companies Available
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-3xl bg-white border-2 border-teal-200/90 p-6 h-64 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="w-20 h-5 bg-slate-100 rounded-xl" />
              </div>
              <div className="h-6 bg-slate-100 rounded w-3/4 mx-auto" />
              <div className="flex justify-center gap-2">
                <div className="w-20 h-6 bg-slate-100 rounded-xl" />
                <div className="w-20 h-6 bg-slate-100 rounded-xl" />
              </div>
              <div className="h-10 bg-slate-100 rounded-full mt-auto" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border p-10 text-center bg-white">
          <h2 className="text-xl font-bold text-red-600">Failed to load companies</h2>
          <p className="mt-2 text-xs text-slate-500">{error?.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-[#124d46] text-white rounded-xl text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-10 text-center bg-white">
          <h2 className="text-xl font-semibold text-slate-800">No Companies Found</h2>
          <p className="mt-2 text-xs text-slate-500">
            Please try resetting your search filters or check back later.
          </p>
        </div>
      ) : (
        /* Companies Grid (Matched exactly to JobsGrid & JobCard styling) */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company._id}
              onClick={() => handleCardClick(company._id)}
              className="group relative flex flex-col justify-between rounded-3xl bg-white border-2 border-teal-200/90 shadow-sm hover:shadow-xl hover:shadow-[#124d46]/10 hover:border-[#124d46] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden p-6 h-full text-slate-900"
            >
              <div>
                {/* Top Header Row: Logo Avatar & Company Name */}
                <div className="flex justify-between items-center mb-4 gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        company.logo ||
                        "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=300&auto=format&fit=crop"
                      }
                      alt={company.name}
                      className="w-9 h-9 rounded-full object-cover border border-teal-200 shrink-0 bg-teal-50"
                    />
                    <span className="text-base font-bold text-slate-900 tracking-tight truncate">
                      {company.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-extrabold border border-teal-200/80 shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-[#124d46]" />
                    <span>{company.jobsCount || 0} Jobs</span>
                  </span>
                </div>

                {/* Company Name Title */}
                <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900 text-center mb-4 group-hover:text-[#124d46] transition-colors leading-snug line-clamp-2">
                  {company.name}
                </h2>

                {/* Badges Row (Industry, Location, Employees) */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  {company.industry && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80 max-w-full">
                      <Building2 className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
                      <span className="truncate max-w-[160px]">{company.industry}</span>
                    </span>
                  )}
                  {company.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80 max-w-full">
                      <MapPin className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
                      <span className="truncate max-w-[160px]">{company.location}</span>
                    </span>
                  )}
                  {company.employeeCount && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80 max-w-full">
                      <Users className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
                      <span className="truncate max-w-[160px]">{company.employeeCount}</span>
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-center text-xs text-slate-500 line-clamp-2 mb-5 leading-relaxed">
                  {company.description || "Leading tech company hiring developers, designers, and managers."}
                </p>
              </div>

              {/* Bottom Footer Actions (Matching JobCard) */}
              <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#124d46]/70 text-[#124d46] group-hover:bg-[#124d46] group-hover:text-white text-sm font-bold transition-all shadow-2xs shrink-0 cursor-pointer">
                  <Eye className="w-4 h-4 text-[#124d46] group-hover:text-white transition-colors" />
                  <span>View Company</span>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 bg-[#124d46] group-hover:bg-[#0a2e2a] text-white font-bold rounded-full px-5 py-2.5 text-sm shadow-md shadow-[#124d46]/20 transition-all">
                    <span>View Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
