"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FaBriefcase,
  FaUsers,
  FaBuilding,
  FaAward,
  FaFileUpload,
  FaBookmark,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaEnvelope,
  FaWhatsapp,
  FaUserTie,
  FaEdit,
  FaPlusCircle,
  FaLock,
  FaRegPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "@/lib/axios";

const qualityChartData = [
  { name: "Verified Tech Jobs", value: 88, color: "#10B981" },
  { name: "Under Admin Audit", value: 8, color: "#F59E0B" },
  { name: "Filtered Spam/Unverified", value: 4, color: "#EF4444" },
];

const candidateOutcomeData = [
  { name: "Resumes Uploaded", count: 850 },
  { name: "Verified Applications", count: 1240 },
  { name: "Recruiter Views", count: 1980 },
  { name: "Shortlisted / Hired", count: 420 },
];

export default function AboutContent() {
  const { data: statsData, isLoading: loading } = useQuery({
    queryKey: ["publicStats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/stats/public");
      return data?.stats || {};
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const activeJobsCount = statsData?.activeJobs ?? null;
  const jobSeekersCount = statsData?.jobSeekers ?? null;
  const companiesCount = statsData?.companies ?? null;


  const stats = [
    {
      icon: FaBriefcase,
      value: loading ? null : `${activeJobsCount}+`,
      label: "Active Job Listings",
      color: "from-teal-500 to-emerald-600",
    },
    {
      icon: FaUsers,
      value: loading ? null : `${jobSeekersCount}+`,
      label: "Talented Job Seekers",
      color: "from-emerald-500 to-teal-700",
    },
    {
      icon: FaBuilding,
      value: loading ? null : `${companiesCount}+`,
      label: "Verified Employers",
      color: "from-teal-600 to-teal-800",
    },
    {
      icon: FaAward,
      value: "98%",
      label: "Hiring Success Rate",
      color: "from-emerald-600 to-teal-500",
    },
  ];

  const candidateFeatures = [
    {
      icon: FaRegPaperPlane,
      title: "Seamless Job Applications",
      description:
        "Apply to verified opportunities with a single click and track your application progress in real-time.",
    },
    {
      icon: FaFileUpload,
      title: "Resume Upload & Profile",
      description:
        "Upload your latest resume (PDF) and build a complete candidate profile for recruiters to discover.",
    },
    {
      icon: FaBookmark,
      title: "Saved Jobs Dashboard",
      description:
        "Bookmark high-potential job listings to compare, organize, and apply at your convenience.",
    },
  ];

  const recruiterFeatures = [
    {
      icon: FaPlusCircle,
      title: "Post New Job Openings",
      description:
        "Create rich job postings with salary details, tech stack requirements, and custom location parameters.",
    },
    {
      icon: FaEdit,
      title: "Manage & Edit Listings",
      description:
        "Update active job postings anytime to reflect new requirements, team changes, or closing dates.",
    },
    {
      icon: FaUserTie,
      title: "Review Applicants",
      description:
        "Inspect candidate profiles, evaluate uploaded resumes, and manage applicant status efficiently.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-24 pb-16 relative w-full max-w-full overflow-x-hidden">
      {/* Decorative Ambient Background Effects */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#124d46]/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-96 h-96 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-[#124d46] text-sm font-semibold mb-6 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          About CareerConnect Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Empowering Job Seekers. <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-[#124d46] via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Connecting Verified Tech Companies.
          </span>
        </h1>

        <p className="mt-6 text-slate-600 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
          CareerConnect is a modern career platform where candidate talent meets verified tech hiring.
          Candidates can search, apply, save jobs, and upload resumes, while recruiters post and manage job opportunities with strict admin verification.
        </p>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm`}>
                  <Icon className="text-xl" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900 min-h-[36px] flex items-center justify-center">
                  {item.value === null ? (
                    <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                  ) : (
                    item.value
                  )}
                </div>
                <div className="text-xs md:text-sm font-medium text-slate-500 mt-1">{item.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Platform Capabilities (Candidates vs Recruiters) */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Tailored Ecosystem for Candidates & Employers
          </h2>
          <p className="text-slate-600 text-base">
            Built with purpose-driven workflows for job seekers and hiring recruiters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidates Card */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-teal-100 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 text-teal-500/10">
              <FaUsers className="text-9xl" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-800 text-xs font-semibold uppercase tracking-wider">
                <FaUsers className="text-teal-600" />
                <span>For Candidates</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Find, Save & Apply for Dream Jobs</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Take full control of your tech job search with personal tools designed to showcase your qualifications and streamline your application journey.
              </p>

              <div className="space-y-4 pt-2">
                {candidateFeatures.map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                        <FIcon />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#124d46] hover:bg-[#0a2e2a] text-white rounded-xl font-bold text-sm transition duration-200 shadow-sm"
              >
                <span>Browse All Jobs</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Recruiters Card */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 text-slate-100">
              <FaBuilding className="text-9xl" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <FaBuilding className="text-emerald-600" />
                <span>For Recruiters & Employers</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Post & Manage Job Listings</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Connect with talented professionals, publish new openings, manage existing listings, and review candidate resume submissions seamlessly.
              </p>

              <div className="space-y-4 pt-2">
                {recruiterFeatures.map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                        <FIcon />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href="/dashboard/recruiter/post-job"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition duration-200 shadow-sm"
              >
                <span>Post a Job Opening</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Company Approval & Admin Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-gradient-to-br from-[#124d46] via-[#0d3d37] to-[#072421] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Ambient Decorative Shapes */}
          <div className="absolute -top-24 -right-24 w-60 sm:w-80 h-60 sm:h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Policy Explanation */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[11px] sm:text-xs font-semibold uppercase tracking-wider max-w-full flex-wrap">
                <FaShieldAlt className="text-teal-400 text-xs sm:text-sm shrink-0" />
                <span>Verified Governance & Admin Approval</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Company Registration & Admin Verification
              </h2>

              <p className="text-teal-100 text-xs sm:text-sm md:text-base leading-relaxed">
                To guarantee complete platform legitimacy, eliminate fake job postings, and safeguard job seekers, <strong>only administrators can approve new company profiles and listings</strong>.
              </p>

              <div className="bg-teal-900/50 border border-teal-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2.5 sm:gap-3 text-teal-200 font-bold text-xs sm:text-sm">
                  <FaLock className="text-teal-400 mt-0.5 shrink-0" />
                  <span>Registering a Company or Specific Company Details?</span>
                </div>
                <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed">
                  If you are interested in registering a new company or posting a job under specific company credentials, please reach out to the Admin directly. The administrator will review, configure, and approve your company details.
                </p>
              </div>
            </div>

            {/* Contact Action Cards */}
            <div className="lg:col-span-5 bg-white text-slate-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl space-y-4 sm:space-y-6">
              <div className="border-b border-slate-100 pb-3 sm:pb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Direct Admin Contact</h3>
                <p className="text-slate-500 text-xs mt-0.5 sm:mt-1">Get in touch for company registration & verified employer onboarding.</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Email Card */}
                <a
                  href="mailto:kamrulislam25262800@gmail.com"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-100 text-[#124d46] flex items-center justify-center text-lg sm:text-xl shrink-0 group-hover:scale-105 transition duration-200">
                    <FaEnvelope />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Email</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 break-all sm:break-normal group-hover:text-[#124d46] transition duration-200">
                      kamrulislam25262800@gmail.com
                    </div>
                  </div>
                </a>

                {/* WhatsApp / Phone Card */}
                <a
                  href="https://wa.me/8801894565173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg sm:text-xl shrink-0 group-hover:scale-105 transition duration-200">
                    <FaWhatsapp />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp & Direct Phone</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition duration-200">
                      +880 1894-565173
                    </div>
                  </div>
                </a>
              </div>

              <div className="pt-1 sm:pt-2 text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500">
                  <FaCheckCircle className="text-emerald-500 shrink-0" />
                  Fast Admin response for employer verification
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Platform Quality & Verification Recharts Analytics */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#124d46] text-xs font-semibold uppercase tracking-wider">
            <FaChartLine className="text-teal-600" />
            <span>Verified Quality Analytics</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Why Job Seekers & Employers Trust CareerConnect
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Visual metrics demonstrating our strict admin vetting standards and candidate success rates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart Card: Job Quality & Safety Standard */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Strict Admin Verification Standard</h3>
              <p className="text-xs text-slate-500 mb-6">Distribution of job postings vetted and approved by platform administrators.</p>

              <div className="h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {qualityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              {qualityChartData.map((item, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50">
                  <span className="w-2.5 h-2.5 rounded-full inline-block mr-1.5" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-800">{item.value}%</span>
                  <div className="text-[10px] text-slate-500 truncate">{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Card: Candidate Growth & Engagement */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Candidate Opportunity & Hiring Activity</h3>
              <p className="text-xs text-slate-500 mb-6">Metrics highlighting candidate engagement, resume uploads, and recruiter interactions.</p>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={candidateOutcomeData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} angle={-10} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} />
                    <Bar dataKey="count" fill="#124d46" radius={[6, 6, 0, 0]} name="Total Activity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-900 text-xs font-medium mt-4">
              <span>🛡️ 100% Admin Verified Profiles & Job Listings</span>
              <span className="font-bold text-teal-700">Safe & Trustworthy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="relative bg-gradient-to-r from-[#124d46] via-[#0d3c37] to-[#082824] rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Discover or Post Verified Opportunities?
            </h2>
            <p className="text-teal-100 text-base md:text-lg">
              Join thousands of job seekers and verified recruiters on CareerConnect today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/jobs"
                className="bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg shadow-teal-900/40 hover:brightness-110 transition duration-200 flex items-center gap-2 text-sm md:text-base"
              >
                <span>Browse All Jobs</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/register"
                className="border border-teal-300/40 bg-teal-900/40 text-teal-100 hover:bg-teal-800/60 font-semibold px-8 py-3.5 rounded-full transition duration-200 text-sm md:text-base"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
