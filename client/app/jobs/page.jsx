"use client";

import JobsGrid from "@/components/jobs/JobsGrid";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getApprovedJobs, getJobCategories } from "@/services/jobService";
import { useEffect, useState } from "react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, categoriesData] = await Promise.all([
        getApprovedJobs(),
        getJobCategories(),
      ]);

      setJobs(jobsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs =
    selectedCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === selectedCategory);

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

      <JobsGrid jobs={filteredJobs} />
    </section>
  );
}