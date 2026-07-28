"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JobCard from "@/components/jobs/JobCard";
import { getApprovedJobs } from "@/services/jobService";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobsData = await getApprovedJobs();
        // Limit to 6 jobs for the featured section
        setJobs(jobsData.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">
            Featured Jobs
          </h2>

          <p className="text-gray-600 mt-3">
            Explore some of the latest opportunities from top companies.
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* Button */}
        <div className="text-center mt-12">
          <Link
            href="/jobs"
            className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}