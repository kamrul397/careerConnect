"use client";

import { Button } from "@/components/ui/button";
import { getPendingJobs, updateJobStatus, } from "@/services/jobService";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function PendingJobsTable() {
  const [jobs, setJobs] = useState([]);
  console.log("jobs", jobs)

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await getPendingJobs();
    setJobs(data);
  };

  return (
    <div className="space-y-6">

			{/* Premium Header */}
			<div className="bg-gradient-to-r from-[#124d46] to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden mb-6 flex-shrink-0">
				<div className="absolute top-[-50%] right-[-5%] w-64 h-64 bg-teal-400 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
				<div className="relative z-10">
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
						Pending Jobs
					</h1>
					<p className="text-teal-50 mt-2 md:mt-3 text-lg max-w-xl leading-relaxed opacity-90">
						Review recruiter submissions and approve new opportunities.
					</p>
				</div>
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

              // <tr
              //   key={job._id}
              //   className="border-t"
              // >
              //   <td className="p-4">{job.title}</td>

              //   <td className="p-4">{job.company}</td>

              //   <td className="p-4">
              //     {job.recruiterName}
              //   </td>

              //   <td className="p-4">
              //     {job.status}
              //   </td>

              //   <div className="flex justify-end gap-2">

              //     <Button
              //       size="sm"
              //       onClick={async () => {
              //         await updateJobStatus(job._id, "approved");

              //         toast.success("Job approved");

              //         loadJobs();
              //       }}
              //     >
              //       Approve
              //     </Button>

              //     <Button
              //       size="sm"
              //       variant="destructive"
              //       onClick={async () => {
              //         await updateJobStatus(job._id, "rejected");

              //         toast.success("Job rejected");

              //         loadJobs();
              //       }}
              //     >
              //       Reject
              //     </Button>

              //   </div>

              // </tr>
              // ✅ CORRECT (Wrapped inside <td>):
              <tr key={job._id} className="border-t">
                <td className="p-4">{job.title}</td>
                <td className="p-4">{job.company}</td>
                <td className="p-4">{job.recruiterName}</td>
                <td className="p-4">{job.status}</td>

                {/* ✅ Wrap inside <td> */}
                <td className="p-4 text-right">
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
                </td>
              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}