"use client";

import JobsGrid from "@/components/jobs/JobsGrid";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getApprovedJobs } from "@/services/jobService";
import { getSavedJobs } from "@/services/savedJobsService";
import { getCandidateApplications } from "@/services/applicationService";
import useCategories from "@/hooks/useCategories";
import useAuth from "@/hooks/useAuth";
import { Search, Filter, X, SlidersHorizontal, RotateCcw, AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

function JobsContent() {
  const { dbUser } = useAuth();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedType, setSelectedType] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { categories } = useCategories();



  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All");
    }

    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // TanStack Query for Jobs Data, Saved Jobs & Applications
  const {
    data: { jobs = [], savedJobIds = new Set(), appliedJobIds = new Set() } = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobsData", dbUser?._id, dbUser?.role],
    queryFn: async () => {
      const isCandidate = dbUser?.role === "candidate";

      const [jobsData, savedData, applicationsData] = await Promise.all([
        getApprovedJobs(),
        isCandidate ? getSavedJobs() : Promise.resolve([]),
        isCandidate ? getCandidateApplications(dbUser?.email) : Promise.resolve([]),
      ]);

      return {
        jobs: jobsData || [],
        savedJobIds: new Set(savedData.map((item) => item.jobDetails?._id)),
        appliedJobIds: new Set(applicationsData.map((app) => app.jobId)),
      };
    },
  });

  const filteredJobs = jobs.filter((job) => {
    const normalize = (str) => str?.toLowerCase().replace(/[\s-]/g, "") || "";
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesType =
      selectedType === "All" ||
      normalize(job.type).includes(normalize(selectedType));
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });


  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
  };

  return (
    <div className="pt-20 md:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Optimized Top Search Bar Container */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 w-full flex items-center bg-slate-50/80 rounded-xl px-3.5 py-2 border border-slate-200/80 focus-within:ring-2 focus-within:ring-[#124d46]/20 focus-within:border-[#124d46] transition-all">
            <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent px-2.5 text-slate-800 outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons: Filter & Sidebar Toggle */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 shrink-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${isFilterOpen || selectedType !== "All"
                ? "bg-[#124d46] text-white border-[#124d46] shadow-xs"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Jobs</span>
              {selectedType !== "All" && (
                <span className="w-4 h-4 rounded-full bg-teal-300 text-[#124d46] text-[10px] font-extrabold flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border ${isSidebarOpen || selectedCategory !== "All"
                ? "bg-teal-50 text-[#124d46] border-teal-200 shadow-2xs"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
            >
              <Filter className="w-3.5 h-3.5 text-[#124d46]" />
              <span>{isSidebarOpen ? "Hide Categories" : "Show Categories"}</span>
              {selectedCategory !== "All" && (
                <span className="px-2 py-0.5 rounded-full bg-[#124d46] text-white text-[10px] font-extrabold max-w-[100px] truncate">
                  {selectedCategory}
                </span>
              )}
            </button>

            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Showing <strong className="text-[#124d46] font-extrabold">{isLoading ? "..." : filteredJobs.length}</strong> jobs
            </span>
          </div>
        </div>

        {/* Work Type Filter Drawer */}
        {isFilterOpen && (
          <div className="pt-3 border-t border-slate-100 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#124d46]" /> Work Type
              </span>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100/90 text-rose-700 hover:text-rose-800 border border-rose-200/90 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer group"
                title="Reset all search & filter parameters"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600 transition-transform duration-500 group-hover:-rotate-180" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {["All", "Full-time", "Part-time", "Remote", "Hybrid", "Contract"].map((type) => {
                const normalize = (str) => str?.toLowerCase().replace(/[\s-]/g, "") || "";
                const count = type === "All"
                  ? jobs.length
                  : jobs.filter((job) => normalize(job.type).includes(normalize(type))).length;

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${selectedType === type
                      ? "bg-[#124d46] text-white border-[#124d46] shadow-xs"
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-[#124d46]"
                      }`}
                  >
                    <span>{type}</span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${selectedType === type
                        ? "bg-teal-300 text-[#124d46]"
                        : "bg-slate-200 text-slate-600"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Layout: Left Full Category Names Sidebar + Right Jobs Grid */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Toggle Left Sidebar for Full Category Names */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4 shrink-0 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5 text-[#124d46] font-extrabold text-lg uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Categories</span>
              </div>
              <span className="text-[14px] font-bold text-slate-400">
                {categories.length} Total
              </span>
            </div>

            {/* Left Side Full Category Names */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-md font-bold transition-all cursor-pointer ${selectedCategory === "All"
                  ? "bg-teal-50 text-[#124d46] border border-teal-200/80 font-extrabold shadow-2xs"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <span>All Categories</span>
                <span className="text-[14px] font-semibold text-slate-400">({jobs.length})</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[15px] transition-all cursor-pointer ${selectedCategory === category.name
                    ? "bg-teal-50 text-[#124d46] border border-teal-200/80 shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <span className="pr-2 text-left font-bold">{category.name}</span>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">({category.jobs})</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Jobs Grid Container */}
        <div className="flex-1 w-full">
          {isLoading ? (
            /* Jobs Skeleton Grid */
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl bg-white border-2 border-teal-100 p-6 h-[270px] animate-pulse flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                        <div className="w-24 h-4 bg-slate-100 rounded-md" />
                      </div>
                      <div className="w-5 h-5 rounded-full bg-slate-100" />
                    </div>

                    <div className="h-6 bg-slate-100 rounded-lg w-3/4 mx-auto" />

                    <div className="flex justify-center gap-2">
                      <div className="w-16 h-6 bg-slate-100 rounded-xl" />
                      <div className="w-20 h-6 bg-slate-100 rounded-xl" />
                      <div className="w-16 h-6 bg-slate-100 rounded-xl" />
                    </div>

                    <div className="w-28 h-5 bg-slate-100 rounded-md mx-auto" />
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="w-28 h-8 bg-slate-100 rounded-full" />
                    <div className="w-24 h-8 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Error State */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center shadow-xs space-y-3">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Failed to load jobs</h3>
              <p className="text-xs text-slate-500 font-medium">
                {error?.message || "An unexpected error occurred while fetching available jobs."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-5 py-2 rounded-xl bg-[#124d46] text-white font-bold text-xs hover:bg-[#0a2e2a] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-[#124d46] flex items-center justify-center mx-auto text-xl font-bold">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900">No jobs match your search</h3>
              <p className="text-xs text-slate-500 font-medium">
                Try adjusting your search terms, selected work type, or categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-xl bg-[#124d46] text-white font-bold text-xs hover:bg-[#0a2e2a] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <JobsGrid jobs={filteredJobs} savedJobIds={savedJobIds} appliedJobIds={appliedJobIds} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobsContent />
    </Suspense>
  );
}