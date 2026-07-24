"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { deleteJob, getRecruiterJobs } from "@/services/jobService";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RecruiterJobsTable() {
	const { dbUser } = useAuth();
	const router = useRouter();
	const [jobs, setJobs] = useState([]);

	useEffect(() => {
		if (!dbUser?.email) return;

		loadJobs();
	}, [dbUser]);

	const loadJobs = async () => {
		const data = await getRecruiterJobs(dbUser.email);

		setJobs(data);
	};

	const handleDelete = async (id) => {
		try {
			await deleteJob(id);

			toast.success("Job deleted");

			await loadJobs();
		} catch (error) {
			console.error(error);
			toast.error("Delete failed");
		}
	};

	const badgeColor = {
		pending: "bg-yellow-100 text-yellow-700",
		approved: "bg-green-100 text-green-700",
		rejected: "bg-red-100 text-red-700",
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">My Jobs</h1>

				<p className="text-muted-foreground">Manage your posted jobs.</p>
			</div>

			<table className="w-full border rounded-lg">
				<thead>
					<tr className="border-b">
						<th className="p-4 text-left">Job</th>

						<th className="p-4 text-left">Company</th>

						<th className="p-4 text-left">Status</th>

						<th className="p-4 text-right">Actions</th>
					</tr>
				</thead>

				<tbody>
					{jobs.map((job) => (
						<tr key={job._id}>
							<td>{job.title}</td>

							<td>{job.company}</td>

							<td>
								<span
									className={`rounded-full px-3 py-1 text-xs ${badgeColor[job.status]}`}
								>
									{job.status}
								</span>
							</td>

							<td className="space-x-2 text-right">
								<Button
									size="sm"
									variant="outline"
									onClick={() =>
										router.push(`/dashboard/recruiter/edit-job/${job._id}`)
									}
								>
									Edit
								</Button>

								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleDelete(job._id)}
								>
									Delete
								</Button>

								<Button
									size="sm"
									onClick={() =>
										router.push(
											`/dashboard/recruiter/my-jobs/${job._id}/applicants`,
										)
									}
								>
									Applicants
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
