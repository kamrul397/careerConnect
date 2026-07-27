"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function JobCard({ job }) {
  console.log("job", job);
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {job.title}
        </h2>

        <p className="text-muted-foreground">
          {job.company}
        </p>

        <p className="text-sm">
          📍 {job.location}
        </p>

        <p className="text-sm">
          💰 {job.salary}
        </p>

        <p className="text-sm">
          {job.type}
        </p>
      </div>

      <Button
        asChild
        className="mt-6 w-full"
      >
        <Link href={`/jobs/${job._id}`}>
          View Details
        </Link>
      </Button>
    </div>
  );
}