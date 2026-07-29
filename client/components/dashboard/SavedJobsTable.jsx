"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import { getSavedJobs, removeSavedJob } from "@/services/savedJobsService";
import { toast } from "sonner";

export default function SavedJobsTable() {
  const { dbUser } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dbUser?.email) {
      loadSavedJobs();
    }
  }, [dbUser]);

  const loadSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setSavedJobs(data);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    // Save a backup in case API fails
    const backup = savedJobs.find((item) => item.jobDetails?._id === jobId);

    // ✅ Optimistic update — remove instantly from UI
    setSavedJobs((prev) =>
      prev.filter((item) => item.jobDetails?._id !== jobId)
    );

    try {
      await removeSavedJob(jobId);
      toast.success("Job removed from saved list.");
    } catch (error) {
      // ❌ API failed — put it back
      setSavedJobs((prev) => [...prev, backup]);
      toast.error("Failed to remove. Please try again.");
    }
  };

  const jobTypeBadge = {
    "Full-time": "bg-blue-100 text-blue-700",
    "Part-time": "bg-purple-100 text-purple-700",
    Remote: "bg-green-100 text-green-700",
    Hybrid: "bg-orange-100 text-orange-700",
    Contract: "bg-yellow-100 text-yellow-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading saved jobs...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Saved Jobs</h1>
        <p className="text-muted-foreground">
          Jobs you've bookmarked for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          You haven't saved any jobs yet.{" "}
          <Link href="/jobs" className="text-primary underline">
            Browse jobs
          </Link>
        </div>
      ) : (
        <table className="w-full rounded-lg border">

          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Job Title</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Salary</th>
              <th className="p-4 text-left">Saved On</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {savedJobs.map((item) => (
              <tr key={item._id} className="border-b hover:bg-muted/50 transition-colors">

                <td className="p-4 font-medium">
                  {item.jobDetails?.title}
                </td>

                <td className="p-4">
                  {item.jobDetails?.company}
                </td>

                <td className="p-4">
                  {item.jobDetails?.location}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      jobTypeBadge[item.jobDetails?.type] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.jobDetails?.type}
                  </span>
                </td>

                <td className="p-4">
                  {item.jobDetails?.salary}
                </td>

                <td className="p-4 text-muted-foreground">
                  {new Date(item.savedAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/jobs/${item.jobDetails?._id}`}
                      className="text-primary underline text-sm"
                    >
                      View Job
                    </Link>
                    <button
                      onClick={() => handleRemove(item.jobDetails?._id)}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}
