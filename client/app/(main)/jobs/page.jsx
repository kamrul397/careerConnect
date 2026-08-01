"use client";

import JobsGrid from "@/components/jobs/JobsGrid";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getApprovedJobs } from "@/services/jobService";
import { getSavedJobs } from "@/services/savedJobsService";
import { getCandidateApplications } from "@/services/applicationService";
import useCategories from "@/hooks/useCategories";
import useAuth from "@/hooks/useAuth";
import { Search, Filter, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function JobsContent() {
  const { dbUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedType, setSelectedType] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  useEffect(() => {
    loadData();
  }, [dbUser]);

  const loadData = async () => {
    try {
      const isCandidate = dbUser?.role === "candidate";

      const [jobsData, savedData, applicationsData] = await Promise.all([
        getApprovedJobs(),
        isCandidate ? getSavedJobs() : Promise.resolve([]),
        isCandidate ? getCandidateApplications(dbUser.email) : Promise.resolve([]),
      ]);

      setJobs(jobsData);
      setSavedJobIds(new Set(savedData.map((item) => item.jobDetails?._id)));
      setAppliedJobIds(new Set(applicationsData.map((app) => app.jobId)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesType = selectedType === "All" || job.type?.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  const activeFiltersCount = (selectedCategory !== "All" ? 1 : 0) + (selectedType !== "All" ? 1 : 0);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Optimized Top Search Bar Container (No Extra Padding) */}
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
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 text-xs font-bold cursor-pointer hidden lg:inline-flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Showing <strong className="text-[#124d46] font-extrabold">{filteredJobs.length}</strong> jobs
            </span>
          </div>
        </div>

        {/* Work Type Filter Drawer (Shows ONLY when Filter Jobs is clicked) */}
        {isFilterOpen && (
          <div className="pt-3 border-t border-slate-100 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#124d46]" /> Work Type
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Full-time", "Part-time", "Remote", "Hybrid", "Contract"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${selectedType === type
                    ? "bg-[#124d46] text-white border-[#124d46] shadow-xs"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-[#124d46]"
                    }`}
                >
                  {type}
                </button>
              ))}
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
                onClick={() => setSelectedCategory("All")}
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
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[15px]  transition-all cursor-pointer ${selectedCategory === category.name
                    ? "bg-teal-50 text-[#124d46] border border-teal-200/80  shadow-2xs"
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
          {filteredJobs.length === 0 ? (
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