"use client";

import Link from "next/link";
import JobsGrid from "@/components/jobs/JobsGrid";
import { getApprovedJobs } from "@/services/jobService";
import { getSavedJobs } from "@/services/savedJobsService";
import { getCandidateApplications } from "@/services/applicationService";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function FeaturedJobs() {
  const { dbUser } = useAuth();
  const isCandidate = dbUser?.role === "candidate";

  // 1. Fetch Approved Jobs with 5 min cache
  const { data: jobsData = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["approvedJobs"],
    queryFn: getApprovedJobs,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch Saved Jobs for candidate
  const { data: savedData = [], isLoading: savedLoading } = useQuery({
    queryKey: ["savedJobs", dbUser?.email],
    queryFn: getSavedJobs,
    enabled: !!isCandidate,
    staleTime: 1000 * 60 * 5,
  });

  // 3. Fetch Applications for candidate
  const { data: applicationsData = [], isLoading: appsLoading } = useQuery({
    queryKey: ["candidateApplications", dbUser?.email],
    queryFn: () => getCandidateApplications(dbUser.email),
    enabled: !!isCandidate && !!dbUser?.email,
    staleTime: 1000 * 60 * 5,
  });

  const loading = jobsLoading || (isCandidate && (savedLoading || appsLoading));

  // Process data for presentation
  const jobs = jobsData.slice(0, 6);
  const savedJobIds = new Set(savedData.map((item) => item.jobDetails?._id));
  const appliedJobIds = new Set(applicationsData.map((app) => app.jobId));


  return (
    <section className="relative py-8 md:py-10 bg-transparent overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5">
        {/* Centered Heading Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#124d46] via-teal-700 to-emerald-600">Jobs</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium mx-auto max-w-xl">
            Explore hand-picked, premium opportunities from top companies actively seeking top talent.
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <JobsGrid
            jobs={jobs}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
          />
        )}

        {/* Centered Button Below Featured Jobs Grid */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 bg-[#124d46] hover:bg-[#080e0d] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-[#124d46]/20 active:scale-95 text-base group"
          >
            <span>Explore all jobs</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}