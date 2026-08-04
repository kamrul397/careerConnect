"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCandidateApplications } from "@/services/applicationService";
import { getSavedJobs } from "@/services/savedJobsService";
import { Briefcase, Bookmark, Calendar, ArrowRight, UserCircle } from "lucide-react";


export default function CandidateDashboard() {
  const { dbUser } = useAuth();

  // 1. Fetch applications
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ["candidateApplications", dbUser?.email],
    queryFn: () => getCandidateApplications(dbUser.email),
    enabled: !!dbUser?.email,
    staleTime: 1000 * 60 * 3,
  });

  // 2. Fetch saved jobs count
  const { data: savedJobs = [], isLoading: savedLoading } = useQuery({
    queryKey: ["savedJobs", dbUser?.email],
    queryFn: getSavedJobs,
    enabled: !!dbUser?.email,
    staleTime: 1000 * 60 * 3,
  });

  const loading = appsLoading || savedLoading;
  const appliedCount = applications.length;
  const savedCount = savedJobs.length;
  const interviewCount = applications.filter(app => app.status === "interview").length;


  return (
    <div className="flex flex-col gap-4 lg:gap-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#124d46] to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex-shrink-0">
        <div className="absolute top-[-50%] right-[-5%] w-64 h-64 bg-teal-400 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, {dbUser?.name} 👋
          </h1>
          <p className="text-teal-50 mt-2 md:mt-3 text-lg max-w-xl leading-relaxed opacity-90">
            Manage your applications, track your saved opportunities, and take the next big step in your career journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 flex-shrink-0">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-teal-600 transition-colors">Applied Jobs</h3>
            <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors text-teal-600">
              <Briefcase size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-slate-800">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : appliedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Saved Jobs</h3>
            <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors text-emerald-600">
              <Bookmark size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-slate-800">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : savedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Interviews</h3>
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors text-blue-600">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-slate-800">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : interviewCount}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1 min-h-[140px]">
        <div className="text-xl font-bold text-slate-800 mb-6">Quick Actions</div>

        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-[#124d46] hover:bg-[#0a2e2a] text-white px-6 py-6 rounded-xl shadow-lg shadow-[#124d46]/20 transition-all hover:shadow-[#124d46]/40 group font-medium text-base">
            <Link href="/jobs" className="flex items-center gap-2">
              <Briefcase size={18} />
              Browse Jobs
              <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="px-6 py-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#124d46] hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-base">
            <Link href="/dashboard/candidate/profile" className="flex items-center gap-2">
              <UserCircle size={18} />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
