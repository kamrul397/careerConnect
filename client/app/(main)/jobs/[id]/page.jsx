"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import useAuth from "@/hooks/useAuth";

import { getApproveJobById } from "@/services/jobService";
import { applyJob, checkApplied } from "@/services/applicationService";
import { saveJob, removeSavedJob, getSavedJobs } from "@/services/savedJobsService";

import { toast } from "sonner";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Building2,
  BookmarkPlus,
  BookmarkCheck,
  ArrowLeft,
  CheckCircle2,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { dbUser, user } = useAuth();

  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  useEffect(() => {
    if (job && dbUser?.email) {
      checkApplication();
      checkSaved();
    }
  }, [job, dbUser]);

  const loadJob = async () => {
    try {
      const data = await getApproveJobById(id);
      setJob(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job.");
    }
  };

  const checkApplication = async () => {
    if (!job || !dbUser?.email) return;

    try {
      const applied = await checkApplied(job._id, dbUser.email);
      setAlreadyApplied(applied);
    } catch (error) {
      console.error(error);
    }
  };

  const checkSaved = async () => {
    if (!job || dbUser?.role !== "candidate") return;

    try {
      const savedJobs = await getSavedJobs();
      const alreadySaved = savedJobs.some(
        (item) => item.jobDetails?._id === job._id
      );
      setIsSaved(alreadySaved);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async () => {
    if (!dbUser?.email) {
      toast.error("Please login first to apply.");
      router.push(`/login?redirect=/jobs/${job._id}`);
      return;
    }

    try {
      setApplying(true);

      await applyJob({
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        recruiterEmail: job.recruiterEmail,
        candidateEmail: dbUser.email,
        candidateName: dbUser.name,
        status: "pending",
        appliedAt: new Date(),
      });

      toast.success("Application submitted successfully!");
      setAlreadyApplied(true);

      setTimeout(() => {
        router.push("/dashboard/candidate/my-applications");
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed.");
    } finally {
      setApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!dbUser) {
      toast.info("Please login to save jobs");
      router.push(`/login?saveJob=${job._id}`);
      return;
    }

    if (isSaved) {
      // Optimistic update
      setIsSaved(false);
      try {
        await removeSavedJob(job._id);
        toast.success("Job removed from saved!");
      } catch (error) {
        setIsSaved(true);
        toast.error("Failed to remove saved job.");
      }
    } else {
      // Optimistic update
      setIsSaved(true);
      try {
        await saveJob(job._id);
        toast.success("Job saved!");
      } catch (error) {
        setIsSaved(false);
        toast.error(error.response?.data?.message || "Failed to save job.");
      }
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-pulse">
          {/* Back Button Skeleton */}
          <div className="w-32 h-9 bg-slate-200/80 rounded-full" />

          {/* Top Header Card Skeleton */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex gap-2">
                  <div className="w-28 h-6 bg-slate-100 rounded-full" />
                  <div className="w-32 h-6 bg-slate-100 rounded-full" />
                </div>
                <div className="w-3/4 h-10 bg-slate-100 rounded-xl" />
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="w-28 h-8 bg-slate-100 rounded-full" />
                  <div className="w-24 h-8 bg-slate-100 rounded-full" />
                  <div className="w-24 h-8 bg-slate-100 rounded-full" />
                  <div className="w-32 h-8 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-36 h-12 bg-slate-100 rounded-2xl" />
                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Body Section Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
                <div className="w-48 h-7 bg-slate-100 rounded-lg" />
                <div className="w-full h-4 bg-slate-100 rounded" />
                <div className="w-full h-4 bg-slate-100 rounded" />
                <div className="w-5/6 h-4 bg-slate-100 rounded" />
                <div className="w-4/5 h-4 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                <div className="w-36 h-6 bg-slate-100 rounded-lg" />
                <div className="w-full h-10 bg-slate-100 rounded-xl" />
                <div className="w-full h-10 bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#124d46] bg-white border border-slate-200 hover:border-teal-300 px-4 py-2 rounded-full shadow-xs transition-all duration-200 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Jobs</span>
        </button>

        {/* Top Header Card */}
        <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50 p-6 md:p-10 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#124d46] via-teal-500 to-emerald-400" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={job.companyId ? `/companies/${job.companyId}` : `/companies`}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-[#124d46] text-base font-extrabold border border-teal-200/90 transition-all cursor-pointer shadow-2xs group/comp"
                  title="View Company Details"
                >
                  <Building2 className="w-4 h-4 text-[#124d46]" />
                  <span>{job.company}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#124d46] opacity-75 group-hover/comp:opacity-100 transition-opacity" />
                </Link>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Company
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {job.title}
              </h1>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-sm font-semibold border border-teal-200">
                  <DollarSign className="w-4 h-4 text-teal-600" />
                  {job.salary}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-200">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  {job.type}
                </span>
                {job.category && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#124d46]/10 text-[#124d46] text-sm font-semibold border border-[#124d46]/20">
                    {job.category}
                  </span>
                )}
                {job.createdAt && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons Container (Header Large Buttons) */}
            <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end justify-start pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              
              {/* Save/Unsave Button using JobCard Logic */}
              {(!dbUser || dbUser?.role === "candidate") && !alreadyApplied && (
                <button
                  onClick={handleSaveToggle}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base font-bold transition-all duration-300 shadow-sm active:scale-95 cursor-pointer ${
                    isSaved
                      ? "bg-teal-100 text-[#124d46] border border-teal-300 shadow-inner scale-102"
                      : "bg-white text-[#124d46] border-2 border-[#124d46] hover:bg-[#124d46] hover:text-white"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-5 h-5 text-[#124d46]" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-5 h-5" />
                      <span>Save Job</span>
                    </>
                  )}
                </button>
              )}

              {/* Apply Button */}
              {dbUser?.role === "candidate" ? (
                alreadyApplied ? (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-100 text-slate-400 text-base font-bold border border-slate-200 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Applied ✓</span>
                  </button>
                ) : (
                  <button
                    disabled={applying}
                    onClick={handleApply}
                    className="inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#124d46] to-[#0a2e2a] hover:from-[#0a2e2a] hover:to-black text-white text-base md:text-lg font-bold shadow-lg shadow-[#124d46]/30 hover:shadow-xl hover:shadow-[#124d46]/40 transition-all duration-300 active:scale-95 cursor-pointer group/btn"
                  >
                    <span>{applying ? "Applying..." : "Apply Now"}</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                )
              ) : user ? (
                <div className="text-slate-500 text-sm font-medium bg-slate-100 px-4 py-2 rounded-xl">
                  Only candidates can apply
                </div>
              ) : (
                <Link
                  href={`/login?saveJob=${job._id}`}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#124d46] hover:bg-[#0a2e2a] text-white text-base font-bold shadow-lg shadow-[#124d46]/20 transition-all duration-300 hover:scale-105"
                >
                  <span>Login to Apply</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Job Description & Requirements (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <span className="w-3 h-3 rounded-full bg-[#124d46]" />
                Job Description
              </h2>
              <div className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <span className="w-3 h-3 rounded-full bg-teal-500" />
                Key Requirements
              </h2>
              <div className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                {job.requirements}
              </div>
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Job Overview
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-[#124d46] shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-500 font-medium block">Company</span>
                    <Link
                      href={job.companyId ? `/companies/${job.companyId}` : `/companies`}
                      className="font-bold text-[#124d46] hover:underline text-base truncate block"
                    >
                      {job.company}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-[#124d46] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Location</span>
                    <span className="font-bold text-slate-900 text-base">{job.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Salary / Rate</span>
                    <span className="font-bold text-slate-900 text-base">{job.salary}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Employment Type</span>
                    <span className="font-bold text-slate-900 text-base">{job.type}</span>
                  </div>
                </div>

                {/* Dedicated View Company Details Button */}
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href={job.companyId ? `/companies/${job.companyId}` : `/companies`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200/90 text-[#124d46] font-bold text-xs transition-all shadow-2xs group cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#124d46]" />
                    <span>View Company Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recruiter Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Posted By
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#124d46] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {job.recruiterName ? job.recruiterName.charAt(0).toUpperCase() : "R"}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{job.recruiterName || "Hiring Manager"}</span>
                    <span className="text-xs text-slate-500">Recruiter</span>
                  </div>
                </div>

                {job.recruiterEmail && (
                  <div className="flex items-center gap-2 text-slate-600 text-xs pt-2">
                    <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="truncate">{job.recruiterEmail}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
