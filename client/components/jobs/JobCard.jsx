"use client";

import { useState } from "react";
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
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-teal-300 cursor-pointer overflow-hidden h-full"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#124d46] to-teal-400 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>

      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#124d46] transition-colors line-clamp-2">
            {job.title}
          </h2>
          <p className="text-[#1a7066] font-medium mt-1">
            {job.company}
          </p>
        </div>
        
        {/* Save button (Icon only on top right for aesthetic) */}
        {!isApplied && (
          <button
            onClick={(e) => handleSaveToggle(e, job._id)}
            className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-300 ${
              isSaved 
                ? "bg-teal-100 text-[#124d46] shadow-inner" 
                : "bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-600 border border-slate-100 hover:shadow-sm"
            }`}
            title={isSaved ? "Saved" : "Save Job"}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
          <DollarSign className="w-3.5 h-3.5" />
          {job.salary}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <Briefcase className="w-3.5 h-3.5" />
          {job.type}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#124d46]/10 text-[#124d46] text-xs font-semibold">
          {job.category}
        </span>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 bg-teal-50/50 px-3 py-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
          <Eye className="w-4 h-4" />
          View Details
        </div>
        
        <div onClick={(e) => e.stopPropagation()}>
          {isApplied ? (
            <Button disabled className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none rounded-full px-6 font-semibold">
              Applied ✓
            </Button>
          ) : (
            <Button 
              asChild 
              className="bg-[#124d46] hover:bg-[#0a2e2a] text-white rounded-full px-6 shadow-md shadow-[#124d46]/20 transition-all duration-300 hover:shadow-[#124d46]/40 group/btn font-semibold"
            >
              <Link href={`/jobs/${job._id}`}>
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
