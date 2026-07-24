"use client";

import JobCard from "./JobCard";

// import JobCard from "./JobCard";

export default function JobsGrid({ jobs }) {
  if (!jobs.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <h2 className="text-2xl font-semibold">
          No Jobs Available
        </h2>

        <p className="mt-2 text-muted-foreground">
          Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
        />
      ))}
    </div>
  );
}