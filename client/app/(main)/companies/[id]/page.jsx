"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "@/services/companyService";
import JobsGrid from "@/components/jobs/JobsGrid";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Briefcase,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function SingleCompanyDetailsPage({ params }) {
  // Unwrap params using React.use() for Next.js 15+ App Router
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // TanStack Query to fetch single company details & company jobs
  const {
    data: res,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id),
    enabled: !!id,
  });

  const company = res?.company;
  const jobs = company?.jobs || [];

  return (
    <div className="pt-20 md:pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#124d46] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Companies Directory
        </Link>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#124d46] mb-3" />
          <p className="text-sm font-medium">Loading company profile...</p>
        </div>
      ) : isError || !company ? (
        /* Error State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
          <Building2 className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Company Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {error?.message || "The requested company profile could not be found."}
          </p>
          <Link
            href="/companies"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#124d46] text-white text-xs font-bold"
          >
            Browse All Companies
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Company Header Card */}
          <div className="bg-white border-2 border-teal-200/90 rounded-3xl overflow-hidden shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Logo + Company Title + Industry */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    company.logo ||
                    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=300&auto=format&fit=crop"
                  }
                  alt={company.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-teal-200 bg-teal-50 shrink-0 shadow-xs"
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  <span className="inline-block text-xs font-extrabold text-[#124d46] bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 mt-1">
                    {company.industry || "Technology"}
                  </span>
                </div>
              </div>

              {/* Actions & Job Count Badge */}
              <div className="flex items-center gap-3 self-start md:self-center">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full border-2 border-[#124d46]/70 text-[#124d46] hover:bg-[#124d46] hover:text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}

                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#124d46] text-white text-xs font-extrabold shadow-md shadow-[#124d46]/20">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  {jobs.length} Open Jobs
                </span>
              </div>
            </div>

            {/* Badges Info Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80">
                <MapPin className="w-3.5 h-3.5 text-[#124d46]" />
                <span>{company.location || "Remote"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80">
                <Users className="w-3.5 h-3.5 text-[#124d46]" />
                <span>{company.employeeCount || "10-50 employees"}</span>
              </span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">About {company.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description ||
                  "Leading technology company hiring engineers, designers, and software professionals."}
              </p>
            </div>
          </div>

          {/* Open Jobs Section (Rendered with JobsGrid & JobCard for 100% design consistency) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#124d46]" />
                Open Positions at {company.name}
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                {jobs.length} Jobs Available
              </span>
            </div>

            <JobsGrid jobs={jobs} />
          </div>
        </div>
      )}
    </div>
  );
}
