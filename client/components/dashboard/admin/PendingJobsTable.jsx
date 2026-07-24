"use client";

import { Button } from "@/components/ui/button";
import {  getPendingJobs, updateJobStatus, } from "@/services/jobService";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function PendingJobsTable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await getPendingJobs();
    setJobs(data);
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Pending Jobs
        </h1>

        <p className="text-muted-foreground">
          Review recruiter submissions.
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">

          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">Job</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Recruiter</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {jobs.map((job) => (

              <tr
                key={job._id}
                className="border-t"
              >
                <td className="p-4">{job.title}</td>

                <td className="p-4">{job.company}</td>

                <td className="p-4">
                  {job.recruiterName}
                </td>

                <td className="p-4">
                  {job.status}
                </td>

               <div className="flex justify-end gap-2">

  <Button
    size="sm"
    onClick={async () => {
      await updateJobStatus(job._id, "approved");

      toast.success("Job approved");

      loadJobs();
    }}
  >
    Approve
  </Button>

  <Button
    size="sm"
    variant="destructive"
    onClick={async () => {
      await updateJobStatus(job._id, "rejected");

      toast.success("Job rejected");

      loadJobs();
    }}
  >
    Reject
  </Button>

</div>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}