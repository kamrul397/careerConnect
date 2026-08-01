"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JobsGrid from "@/components/jobs/JobsGrid";
import { getApprovedJobs } from "@/services/jobService";
import { getSavedJobs } from "@/services/savedJobsService";
import { getCandidateApplications } from "@/services/applicationService";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowRight } from "lucide-react";

export default function FeaturedJobs() {
  const { dbUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const isCandidate = dbUser?.role === "candidate";

        const [jobsData, savedData, applicationsData] = await Promise.all([
          getApprovedJobs(),
          isCandidate ? getSavedJobs() : Promise.resolve([]),
          isCandidate ? getCandidateApplications(dbUser.email) : Promise.resolve([]),
        ]);

        // Limit to 6 jobs for the featured section
        setJobs(jobsData.slice(0, 6));
        setSavedJobIds(new Set(savedData.map((item) => item.jobDetails?._id)));
        setAppliedJobIds(new Set(applicationsData.map((app) => app.jobId)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dbUser]);

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