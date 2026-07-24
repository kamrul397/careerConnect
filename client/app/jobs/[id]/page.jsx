"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApproveJobById } from "@/services/jobService";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { applyJob, checkApplied } from "@/services/applicationService";
import Link from "next/link";

export default function JobDetailsPage() {
  // 1. ALL HOOKS MUST BE AT THE TOP!
  const { id } = useParams();
  const { dbUser, user } = useAuth(); // ✅ Moved to the top
  const [job, setJob] = useState(null);
const [alreadyApplied, setAlreadyApplied] = useState(false);
  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);


  const checkApplication = async () => {
  const applied = await checkApplied(
    job._id,
    dbUser.email
  );

  setAlreadyApplied(applied);
};


  useEffect(() => {
  if (job && dbUser?.email) {
    checkApplication();
  }
}, [job, dbUser]);

  const loadJob = async () => {
    const data = await getApproveJobById(id);
    setJob(data);
  };

  const handleApply = async () => {
    if (!dbUser?.email) {
      toast.error("Please log in to apply for this job.");
      return;
    }

    try {
      await applyJob({
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        recruiterEmail: job.recruiterEmail,
        candidateEmail: dbUser.email,
        candidateName: dbUser.name,
        status: "pending",
        appliedAt: new Date(),
      });

      toast.success("Application submitted.");
    } catch (error) {
      toast.error("Application failed.");
    }
  };

  // 2. Early return AFTER all hooks are declared
  if (!job) {
    return <LoadingSpinner />;
  }

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold">{job.title}</h1>
      <p className="mt-2 text-muted-foreground">{job.company}</p>

      <div className="mt-8 space-y-4">
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Job Type:</strong> {job.type}</p>
        <p><strong>Description:</strong></p>
        <p>{job.description}</p>
        <p><strong>Requirements:</strong></p>
        <p>{job.requirements}</p>

{dbUser?.role === "candidate" ? (
  <Button
    disabled={alreadyApplied}
    onClick={handleApply}
  >
    {alreadyApplied ? "Already Applied" : "Apply Now"}
  </Button>
) : user ? (
  <p className="text-sm text-muted-foreground">
    Only candidates can apply for jobs.
  </p>
) : (
  <Button asChild>
    <Link href="/login">Login to Apply</Link>
  </Button>
)}
      </div>
    </section>
  );
}