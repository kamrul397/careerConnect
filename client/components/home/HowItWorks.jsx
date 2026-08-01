"use client";

import {
  UserCheck,
  Search,
  FileCheck2,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Create Account",
    icon: UserCheck,
    description:
      "Register via Google or Email and choose your role as a Candidate or Recruiter.",
    gradient: "from-teal-500/20 to-emerald-500/20",
    badgeBg: "bg-teal-50 text-[#124d46] border-teal-200",
    iconColor: "text-[#124d46]",
  },
  {
    step: "02",
    title: "Build Profile & Resume",
    icon: FileCheck2,
    description:
      "Upload your PDF resume securely and showcase your skills, location, and experience.",
    gradient: "from-emerald-500/20 to-teal-600/20",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    iconColor: "text-emerald-700",
  },
  {
    step: "03",
    title: "Search & Save Jobs",
    icon: Search,
    description:
      "Filter opportunities by category, salary, and work type, and bookmark saved positions.",
    gradient: "from-teal-600/20 to-cyan-600/20",
    badgeBg: "bg-cyan-50 text-cyan-800 border-cyan-200",
    iconColor: "text-cyan-700",
  },
  {
    step: "04",
    title: "Apply & Get Hired",
    icon: Trophy,
    description:
      "Submit instant applications, track hiring status in real-time, and land your dream job.",
    gradient: "from-emerald-600/20 to-teal-700/20",
    badgeBg: "bg-teal-100 text-[#124d46] border-teal-300",
    iconColor: "text-[#124d46]",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-5 bg-transparent overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-100/90 text-[#124d46] text-xs font-extrabold uppercase tracking-widest border border-teal-200/80 shadow-xs">
            Simple &amp; Seamless Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            How <span className="bg-gradient-to-r from-[#124d46] via-teal-700 to-emerald-600 bg-clip-text text-transparent">CareerConnect</span> Works
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
            Your step-by-step roadmap to finding career opportunities or hiring top-tier professional talent.
          </p>
        </div>

        {/* 4 Step Cards Grid with Desktop Connecting Flow */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Desktop Connecting Line behind cards */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-200 -translate-y-6 z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Step Header: Icon & Step Badge */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.badgeBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <span className="text-2xl font-black text-slate-300 group-hover:text-[#124d46] transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#124d46] transition-colors mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-extrabold text-[#124d46] uppercase tracking-wider gap-1.5 opacity-90 group-hover:opacity-100">
                  <span>Step {index + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer Banner */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#124d46] to-[#0a2e2a] p-6 sm:p-8 rounded-3xl text-white shadow-xl max-w-3xl mx-auto">
            <div className="text-center sm:text-left flex-1">
              <h4 className="text-xl font-bold">Ready to take the next step?</h4>
              <p className="text-teal-100 text-xs sm:text-sm mt-1">Join thousands of job seekers and hiring managers today.</p>
            </div>
            <Link
              href="/register"
              className="px-6 py-3 rounded-2xl bg-white text-[#124d46] font-extrabold text-sm hover:bg-teal-50 transition-all shadow-md active:scale-95 shrink-0"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}