"use client";

import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { getSavedJobs, removeSavedJob } from "@/services/savedJobsService";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  ArrowRight,
  Trash2,
  Eye,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedJobsTable() {
  const { dbUser } = useAuth();
  const queryClient = useQueryClient();

  // TanStack Query for saved jobs
  const {
    data: savedJobs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["savedJobs", dbUser?.email],
    queryFn: () => getSavedJobs(),
    enabled: !!dbUser?.email,
  });

  const handleRemove = async (jobId) => {
    try {
      await removeSavedJob(jobId);
      toast.success("Job removed from saved list.");
      queryClient.invalidateQueries(["savedJobs", dbUser?.email]);
    } catch (error) {
      toast.error("Failed to remove. Please try again.");
    }
  };

  const jobTypeBadge = {
    "Full-time": "bg-blue-100/80 text-blue-700 border border-blue-200/50",
    "Part-time": "bg-purple-100/80 text-purple-700 border border-purple-200/50",
    Remote: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/50",
    Hybrid: "bg-orange-100/80 text-orange-700 border border-orange-200/50",
    Contract: "bg-yellow-100/80 text-yellow-700 border border-yellow-200/50",
  };

  // Skeleton Loader State
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Banner Skeleton */}
        <div className="bg-gradient-to-r from-teal-900/40 to-emerald-800/40 rounded-3xl p-8 h-36 flex items-center justify-between">
          <div className="space-y-3">
            <div className="w-48 h-8 bg-slate-200/60 rounded-xl" />
            <div className="w-72 h-4 bg-slate-200/40 rounded-md" />
          </div>
          <div className="w-32 h-12 bg-slate-200/50 rounded-2xl" />
        </div>

        {/* Saved Jobs List Skeleton */}
        <div className="space-y-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0" />
                  <div className="w-48 h-6 bg-slate-100 rounded-lg" />
                  <div className="w-20 h-5 bg-slate-100 rounded-full" />
                </div>
                <div className="flex gap-4 pt-1">
                  <div className="w-28 h-4 bg-slate-100 rounded" />
                  <div className="w-24 h-4 bg-slate-100 rounded" />
                  <div className="w-20 h-4 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-28 h-9 bg-slate-100 rounded-lg" />
                <div className="w-9 h-9 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h3 className="text-xl font-bold text-slate-800">Failed to load saved jobs</h3>
        <p className="text-slate-500 text-xs">{error?.message || "An error occurred."}</p>
        <Button onClick={() => refetch()} className="bg-[#124d46] text-white">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#124d46] to-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-teal-400 rounded-full mix-blend-overlay filter blur-[80px] opacity-40 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-emerald-300 fill-emerald-300/20" />
              Saved Jobs
            </h1>
            <p className="text-teal-50 mt-2 text-lg max-w-xl leading-relaxed opacity-90">
              Keep track of the opportunities you're most interested in. Apply when you're ready!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 self-start md:self-auto">
            <Briefcase className="w-5 h-5 text-emerald-300" />
            <div>
              <div className="text-xs text-teal-100 font-medium uppercase tracking-wider">Total Saved</div>
              <div className="text-xl font-bold">{savedJobs.length} Jobs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-5 bg-teal-50 rounded-full mb-4">
            <Bookmark className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 mb-6 max-w-md">
            You haven't bookmarked any jobs. Start exploring and save the ones that catch your eye!
          </p>
          <Button asChild className="bg-[#124d46] hover:bg-[#0a2e2a] text-white px-8 py-6 rounded-xl shadow-lg shadow-[#124d46]/20 transition-all">
            <Link href="/jobs" className="flex items-center gap-2 font-semibold">
              Browse Jobs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {savedJobs.map((item, index) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border-2 border-slate-100 hover:border-teal-200 shadow-xs hover:shadow-md transition-all duration-200 p-5 group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Job Info & Index */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Index Badge */}
                  <span className="w-8 h-8 rounded-xl bg-teal-50 text-[#124d46] text-xs font-extrabold flex items-center justify-center border border-teal-200/80 shrink-0 shadow-2xs">
                    #{index + 1}
                  </span>

                  <Link
                    href={`/jobs/${item.jobDetails?._id}`}
                    className="font-semibold text-slate-800 group-hover:text-[#124d46] transition-colors text-base"
                  >
                    {item.jobDetails?.title || "Untitled Position"}
                  </Link>

                  {item.jobDetails?.type && (
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${jobTypeBadge[item.jobDetails?.type] ?? "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {item.jobDetails?.type}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-slate-500 text-sm pl-11">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    {item.jobDetails?.company || "Company Confidential"}
                  </span>

                  {item.jobDetails?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {item.jobDetails?.location}
                    </span>
                  )}

                  {item.jobDetails?.salary && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {item.jobDetails?.salary}
                    </span>
                  )}

                  <span className="flex items-center gap-2 text-slate-500 text-xs">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-colors rounded-lg font-medium flex items-center gap-1.5"
                >
                  <Link href={`/jobs/${item.jobDetails?._id}`}>
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.jobDetails?._id)}
                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-lg px-2"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}