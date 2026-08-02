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
  Calendar,
  Clock,
  CheckCircle2,
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

  const defaultBanner =
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop";
  const defaultLogo =
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=300&auto=format&fit=crop";

  return (
    <div className="pt-20 md:pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-700 hover:text-[#124d46] bg-white border border-slate-200/90 hover:border-[#124d46]/60 px-4 py-2 rounded-full shadow-2xs hover:shadow-xs transition-all duration-200 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#124d46] transition-transform group-hover:-translate-x-1" />
          <span>Back to Companies Directory</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="w-full h-72 md:h-96 rounded-3xl bg-slate-200" />
          <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200">
            <div className="w-48 h-6 bg-slate-200 rounded" />
            <div className="w-full h-4 bg-slate-200 rounded" />
          </div>
        </div>
      ) : isError || !company ? (
        /* Error State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
          <Building2 className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Company Not Found</h3>
          <p className="text-[13px] text-slate-500 mt-1 mb-4">
            {error?.message || "The requested company profile could not be found."}
          </p>
          <Link
            href="/companies"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-[#124d46] text-white text-[13px] font-bold"
          >
            Browse All Companies
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. Large Hero Banner & Company Profile Card */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
            {/* Hero Cover Banner Image */}
            <div className="relative w-full h-64 md:h-80 overflow-hidden">
              <img
                src={company.banner || company.bannerImage || defaultBanner}
                alt={`${company.name} Banner`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30" />
            </div>

            {/* Overlaid Company Info Header */}
            <div className="relative z-10 px-6 md:px-10 pb-8 -mt-20 md:-mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              {/* Company Profile Pic Logo & Title */}
              <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
                <img
                  src={company.logo || defaultLogo}
                  alt={company.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white shadow-2xl bg-white shrink-0"
                />
                <div className="space-y-2 text-white pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-300/40 text-teal-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                      Verified Employer
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-bold backdrop-blur-md">
                      {company.industry || "Technology"}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                    {company.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 pt-1 font-medium">
                    {company.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                        {company.location}
                      </span>
                    )}
                    {company.employeeCount && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-teal-400 shrink-0" />
                        {company.employeeCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Open Jobs Badge */}
              <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto pt-2 md:pt-0">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs md:text-sm font-bold backdrop-blur-md transition-all shadow-md"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-80" />
                  </a>
                )}

                <span className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 text-xs md:text-sm font-extrabold shadow-lg shadow-teal-900/40">
                  <Briefcase className="w-4 h-4 mr-2 text-slate-950" />
                  {jobs.length} Open {jobs.length === 1 ? "Job" : "Jobs"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Company Details & Overview */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-slate-100 text-xs md:text-sm text-slate-600">
              {company.createdAt && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Created {new Date(company.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
              {company.updatedAt && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Updated {new Date(company.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">About {company.name}</h2>
              <div className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
                {company.description || (
                  <>
                    <p>
                      {company.name} is an industry-leading organization dedicated to engineering innovation, product excellence, and cultivating high-performing technology teams worldwide.
                    </p>
                    <p>
                      We foster a collaborative work culture centered around continuous learning, creative problem solving, and building scalable software solutions.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. Open Jobs Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Briefcase className="w-6 h-6 text-[#124d46]" />
                  Open Positions at {company.name}
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Explore active job openings and apply directly.
                </p>
              </div>
              <span className="text-xs md:text-sm font-extrabold text-teal-800 bg-teal-50 px-4 py-2 rounded-full border border-teal-200 shadow-2xs">
                {jobs.length} Positions Active
              </span>
            </div>

            <JobsGrid jobs={jobs} />
          </div>
        </div>
      )}
    </div>
  );
}
