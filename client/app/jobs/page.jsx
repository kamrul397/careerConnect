"use client";

import JobsGrid from "@/components/jobs/JobsGrid";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getApprovedJobs } from "@/services/jobService";
import { useEffect, useState } from "react";

// import LoadingSpinner from "@/components/shared/LoadingSpinner";
// import JobsGrid from "@/components/jobs/JobsGrid";

// import { getApprovedJobs } from "@/services/jobService";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getApprovedJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  console.log("jobs are", jobs);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Find Your Dream Job
        </h1>

        <p className="mt-2 text-muted-foreground">
          Browse all approved opportunities from verified recruiters.
        </p>
      </div>

      <JobsGrid jobs={jobs} />
    </section>
  );
}