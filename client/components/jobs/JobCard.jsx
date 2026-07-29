"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { saveJob } from "@/services/savedJobsService";
import { toast } from "sonner";

export default function JobCard({ job, initialSaved = false, initialApplied = false }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isApplied, setIsApplied] = useState(initialApplied);

  const handleSave = async (jobId) => {
    // ✅ Optimistic update — change button instantly
    setIsSaved(true);

    try {
      await saveJob(jobId);
      toast.success("Job saved!");
    } catch (error) {
      // ❌ Rollback if API fails
      setIsSaved(false);
      toast.error(error.response?.data?.message || "Failed to save.");
    }
  };

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

        <p className="text-sm">
          🏷️ {job.category}
        </p>
      </div>

      <div className="mt-6 flex gap-2 w-full">
        {/* Save button — hidden if already applied */}
        {!isApplied && (
          <Button
            onClick={() => handleSave(job._id)}
            disabled={isSaved}
            variant={isSaved ? "default" : "outline"}
            className="flex-1"
          >
            {isSaved ? "Saved ✓" : "Save"}
          </Button>
        )}

        {/* Apply / Applied button */}
        {isApplied ? (
          <Button disabled className="flex-1">
            Applied ✓
          </Button>
        ) : (
          <Button asChild className="flex-1">
            <Link href={`/jobs/${job._id}`}>
              Apply Now
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
