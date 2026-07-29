"use client";

import JobsGrid from "@/components/jobs/JobsGrid";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getApprovedJobs } from "@/services/jobService";
import { getSavedJobs } from "@/services/savedJobsService";
import { getCandidateApplications } from "@/services/applicationService";
import useCategories from "@/hooks/useCategories";
import useAuth from "@/hooks/useAuth";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobsPage() {
  const { dbUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { categories } = useCategories();

  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );

  useEffect(() => {
    const category = searchParams.get("category");

    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All");
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

      // Build Sets for O(1) lookup in each JobCard
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
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Find Your Dream Job
        </h1>

        <p className="mt-2 text-muted-foreground">
          Browse all approved opportunities from verified recruiters.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by job title or company..."
          className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === "All"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
            }`}
        >
          All ({jobs.length})
        </button>

        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === category.name
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
              }`}
          >
            {category.name} ({category.jobs})
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="mb-6 text-sm text-muted-foreground">
        {filteredJobs.length} jobs found
      </p>

      <JobsGrid jobs={filteredJobs} savedJobIds={savedJobIds} appliedJobIds={appliedJobIds} />
    </section>
  );
}