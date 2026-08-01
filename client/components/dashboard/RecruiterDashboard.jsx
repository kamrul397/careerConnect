"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getRecruiterJobs } from "@/services/jobService";
import { getApplicants } from "@/services/applicationService";
import { Briefcase, CheckCircle, Clock, Users, ArrowRight, PlusCircle, Building2 } from "lucide-react";

export default function RecruiterDashboard() {
  const { dbUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicantsCount, setApplicantsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (dbUser?.email) {
        try {
          const recruiterJobs = await getRecruiterJobs(dbUser.email);
          setJobs(recruiterJobs || []);

          // Calculate total applicants by fetching applicants for each job
          if (recruiterJobs && recruiterJobs.length > 0) {
            const applicantPromises = recruiterJobs.map(job => getApplicants(job._id));
            const applicantsArrays = await Promise.all(applicantPromises.map(p => p.catch(() => [])));

            let total = 0;
            applicantsArrays.forEach(arr => {
              total += (arr?.length || 0);
            });
            setApplicantsCount(total);
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [dbUser]);

  const approvedCount = jobs.filter(job => job.status === "approved").length;
  const pendingCount = jobs.filter(job => job.status === "pending").length;

  return (
    <div className="flex flex-col gap-4 lg:gap-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#124d46] to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex-shrink-0">
        <div className="absolute top-[-50%] right-[-5%] w-64 h-64 bg-teal-400 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, {dbUser?.name} 👋
          </h1>
          <p className="text-teal-50 mt-2 md:mt-3 text-lg max-w-xl leading-relaxed opacity-90">
            Manage your job postings, track candidates, and build your dream team with ease.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 flex-shrink-0">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Approved Jobs</h3>
            <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors text-emerald-600">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-slate-800">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : approvedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Pending Jobs</h3>
            <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-slate-800">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : pendingCount}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Applicants</h3>
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-slate-800">
            {loading ? <span className="animate-pulse text-slate-300">...</span> : applicantsCount}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1 min-h-[140px]">
        <div className="text-xl font-bold text-slate-800 mb-6">Quick Actions</div>

        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-[#124d46] hover:bg-[#0a2e2a] text-white px-6 py-6 rounded-xl shadow-lg shadow-[#124d46]/20 transition-all hover:shadow-[#124d46]/40 group font-medium text-base">
            <Link href="/dashboard/recruiter/post-job" className="flex items-center gap-2">
              <PlusCircle size={18} />
              Post a New Job
              <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="px-6 py-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#124d46] hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-base">
            <Link href="/dashboard/recruiter/my-jobs" className="flex items-center gap-2">
              <Briefcase size={18} />
              Manage Jobs
            </Link>
          </Button>

          <Button asChild variant="outline" className="px-6 py-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#124d46] hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-base">
            <Link href="/dashboard/recruiter/profile" className="flex items-center gap-2">
              <Building2 size={18} />
              Company Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
