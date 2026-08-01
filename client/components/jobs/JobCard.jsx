"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveJob, removeSavedJob } from "@/services/savedJobsService";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { MapPin, DollarSign, Briefcase, BookmarkPlus, BookmarkCheck, ArrowRight, Eye } from "lucide-react";

export default function JobCard({ job, initialSaved = false, initialApplied = false }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isApplied, setIsApplied] = useState(initialApplied);
  const { dbUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  useEffect(() => {
    setIsApplied(initialApplied);
  }, [initialApplied]);

  const handleCardClick = () => {
    router.push(`/jobs/${job._id}`);
  };

  const handleSaveToggle = async (e, jobId) => {
    e.stopPropagation();

    if (!dbUser) {
      toast.info("Please login to save jobs");
      router.push(`/login?saveJob=${jobId}`);
      return;
    }

    if (isSaved) {
      // Optimistic update
      setIsSaved(false);
      try {
        await removeSavedJob(jobId);
        toast.success("Job removed from saved!");
      } catch (error) {
        setIsSaved(true);
        toast.error("Failed to remove saved job.");
      }
    } else {
      // Optimistic update
      setIsSaved(true);
      try {
        await saveJob(jobId);
        toast.success("Job saved!");
      } catch (error) {
        setIsSaved(false);
        toast.error(error.response?.data?.message || "Failed to save.");
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-300/80 cursor-pointer overflow-hidden h-full"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#124d46] to-teal-400 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />

      <div>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-[#124d46] transition-colors duration-200 line-clamp-2 leading-snug">
              {job.title}
            </h2>
            <p className="text-[#1a7066] font-semibold text-sm tracking-wide">
              {job.company}
            </p>
          </div>

          {/* Save button */}
          {!isApplied && (
            <button
              onClick={(e) => handleSaveToggle(e, job._id)}
              className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#124d46] ${isSaved
                  ? "bg-teal-100 text-[#124d46] shadow-inner scale-105"
                  : "bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-600 border border-slate-100 hover:shadow-sm active:scale-95"
                }`}
              title={isSaved ? "Saved" : "Save Job"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 transition-transform duration-200" />
              ) : (
                <BookmarkPlus className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 my-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 text-slate-700 text-xs font-semibold backdrop-blur-sm border border-slate-200/50">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full bg-teal-50/80 text-teal-800 text-xs font-semibold border border-teal-100/80">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
            {job.salary}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 text-emerald-800 text-xs font-semibold border border-emerald-100/80">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#124d46]/10 text-[#124d46] text-xs font-semibold border border-[#124d46]/10">
            {job.category}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50/70 hover:bg-teal-50 px-3 py-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-all duration-200">
          <Eye className="w-3.5 h-3.5 text-teal-600" />
          <span>View Details</span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          {isApplied ? (
            <Button
              disabled
              className="bg-slate-100 text-slate-400 hover:bg-slate-100 border-none rounded-full px-5 py-2 text-xs font-semibold cursor-not-allowed opacity-90"
            >
              Applied ✓
            </Button>
          ) : (
            <Button
              asChild
              className="bg-[#124d46] hover:bg-[#0a2e2a] text-white rounded-full px-5 py-2 text-xs font-semibold shadow-sm shadow-[#124d46]/20 transition-all duration-300 hover:shadow-md hover:shadow-[#124d46]/30 active:scale-95 group/btn"
            >
              <Link href={`/jobs/${job._id}`} className="flex items-center gap-1.5">
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}