"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveJob, removeSavedJob } from "@/services/savedJobsService";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import {
  FileText,
  MapPin,
  Layers,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Eye,
} from "lucide-react";

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
      setIsSaved(false);
      try {
        await removeSavedJob(jobId);
        toast.success("Job removed from saved!");
      } catch (error) {
        setIsSaved(true);
        toast.error("Failed to remove saved job.");
      }
    } else {
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
      className="group relative flex flex-col justify-between rounded-3xl bg-white border-2 border-teal-200/90 shadow-sm hover:shadow-xl hover:shadow-[#124d46]/10 hover:border-[#124d46] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden p-6 h-full text-slate-900"
    >
      <div>
        {/* Top Header Row: Logo/Company Name & Save Bookmark */}
        <div className="flex justify-between items-center mb-4 gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Minimalist Logo Badge */}
            <div className="w-8 h-8 rounded-full bg-teal-50 text-[#124d46] text-xs font-extrabold flex items-center justify-center border border-teal-200 shrink-0">
              {job.company?.slice(0, 2).toUpperCase() || "CC"}
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight truncate">
              {job.company}
            </span>
          </div>

          {!isApplied && (
            <button
              onClick={(e) => handleSaveToggle(e, job._id)}
              className="p-1 text-[#124d46] hover:text-[#0a2e2a] transition-colors cursor-pointer shrink-0"
              title={isSaved ? "Saved" : "Save Job"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 fill-[#124d46] text-[#124d46]" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Job Title */}
        <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900 text-center mb-4 group-hover:text-[#124d46] transition-colors leading-snug line-clamp-2">
          {job.title}
        </h2>

        {/* Flexible Wrap Badges to prevent overflow */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {job.type && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80 max-w-full">
              <FileText className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
              <span className="capitalize">{job.type}</span>
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
              <span className="truncate max-w-[180px]">{job.location}</span>
            </span>
          )}
          {job.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50/80 text-[#124d46] text-xs font-semibold border border-teal-200/80 max-w-full">
              <Layers className="w-3.5 h-3.5 text-[#124d46] shrink-0" />
              <span className="truncate max-w-[180px]">{job.category}</span>
            </span>
          )}
        </div>

        {/* Salary */}
        <p className="text-center text-sm font-bold text-[#124d46] mb-5">
          {job.salary}
        </p>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto gap-3">
        {/* Eye icon + View Details with larger rounded border button */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#124d46]/70 text-[#124d46] group-hover:bg-[#124d46] group-hover:text-white text-sm font-bold transition-all shadow-2xs shrink-0 cursor-pointer">
          <Eye className="w-4 h-4 text-[#124d46] group-hover:text-white transition-colors" />
          <span>View Details</span>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          {isApplied ? (
            <span className="inline-flex items-center text-sm font-semibold text-[#124d46] bg-teal-50 px-5 py-2.5 rounded-full border border-teal-200">
              Applied ✓
            </span>
          ) : (
            <Button
              asChild
              className="bg-[#124d46] hover:bg-[#0a2e2a] text-white font-bold rounded-full px-5 py-2.5 text-sm shadow-md shadow-[#124d46]/20 active:scale-95 transition-all h-auto"
            >
              <Link href={`/jobs/${job._id}`} className="flex items-center gap-2">
                <span>Apply</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}