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
} from "lucide-react";

export default function PublicCompaniesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // TanStack Query for fetching companies
  const {
    data: companies = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["companies", searchQuery],

    queryFn: () =>
      getAllCompanies({
        search: searchQuery,
      }),
  });

  const handleCardClick = (id) => {
    router.push(`/companies/${id}`);
  };

  return (
    <div className="pt-20 md:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Top Search Bar Container */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search companies by name, location, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-sm w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
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
              className="rounded-2xl bg-white border border-slate-200 p-6 h-64 animate-pulse space-y-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
                  <div className="space-y-2">
                    <div className="w-32 h-6 bg-slate-100 rounded-lg" />
                    <div className="w-20 h-4 bg-slate-100 rounded-md" />
                  </div>
                </div>
                <div className="w-20 h-6 bg-slate-100 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="w-24 h-6 bg-slate-100 rounded-lg" />
                <div className="w-24 h-6 bg-slate-100 rounded-lg" />
              </div>
              <div className="h-10 bg-slate-100 rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border p-10 text-center bg-white">
          <h2 className="text-xl font-bold text-red-600">Failed to load companies</h2>
          <p className="mt-2 text-[13px] text-slate-500">{error?.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-[#124d46] text-white rounded-xl text-[13px] font-bold"
          >
            Try Again
          </button>
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-10 text-center bg-white">
          <h2 className="text-xl font-semibold text-slate-800">No Companies Found</h2>
          <p className="mt-2 text-[13px] text-slate-500">
            Please try resetting your search filters or check back later.
          </p>
        </div>
      ) : (
        /* Companies Grid - Distinct Corporate Layout & +1px Font Sizing */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company._id}
              onClick={() => handleCardClick(company._id)}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-[#124d46]/10 hover:border-[#124d46]/70 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden p-6 h-full text-slate-900"
            >
              {/* Decorative Top Banner Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#124d46] via-teal-500 to-[#124d46] opacity-80 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Row: Large Logo, Name & Jobs Count */}
                <div className="flex items-start justify-between gap-3 mb-4 pt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        company.logo ||
                        "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=300&auto=format&fit=crop"
                      }
                      alt={company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200/80 shrink-0 bg-teal-50/50 p-1 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <h2 className="text-[21px] font-extrabold tracking-tight text-slate-900 group-hover:text-[#124d46] transition-colors leading-snug truncate">
                        {company.name}
                      </h2>
                      {company.industry && (
                        <span className="inline-flex items-center text-[13px] font-bold text-[#124d46] bg-teal-50/80 px-2.5 py-0.5 rounded-lg border border-teal-200/60 mt-1">
                          {company.industry}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#124d46] text-[13px] font-extrabold border border-emerald-200/80 shrink-0 shadow-2xs">
                    <Briefcase className="w-3.5 h-3.5 text-[#124d46]" />
                    <span>{company.jobsCount || 0} Jobs</span>
                  </span>
                </div>

                {/* Badges Row (Location & Employee Count) */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {company.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/80 text-slate-700 text-[13px] font-medium border border-slate-200/60 max-w-full">
                      <MapPin className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
                      <span className="truncate max-w-[160px]">{company.location}</span>
                    </span>
                  )}
                  {company.employeeCount && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/80 text-slate-700 text-[13px] font-medium border border-slate-200/60 max-w-full">
                      <Users className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
                      <span className="truncate max-w-[160px]">{company.employeeCount}</span>
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-left text-[13px] text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                  {company.description || "Leading global technology company dedicated to engineering innovative software solutions, empowering high-performing teams, and building scalable digital platforms for top enterprises."}
                </p>
              </div>

              {/* Bottom Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto gap-3">
                <div className="inline-flex items-center gap-2 text-slate-700 group-hover:text-[#124d46] text-[15px] font-bold transition-colors cursor-pointer">
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-[#124d46] transition-colors" />
                  <span>View Company</span>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 bg-[#124d46] group-hover:bg-[#0a2e2a] text-white font-bold rounded-xl px-4 py-2.5 text-[15px] shadow-md shadow-[#124d46]/15 transition-all">
                    <span>View Jobs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
