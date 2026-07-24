"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
	getApplicants,
	updateApplicationStatus,
} from "@/services/applicationService";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export default function ApplicantsPage() {
	const { id } = useParams();

	const [applications, setApplications] = useState([]);

	useEffect(() => {
		loadApplicants();
	}, []);

	const loadApplicants = async () => {
		const data = await getApplicants(id);

		setApplications(data);
	};
	const handleStatus = async (id, status) => {
  try {
    await updateApplicationStatus(id, status);

    const messages = {
      shortlisted: "Candidate shortlisted.",
      interview: "Interview scheduled.",
      hired: "Candidate hired successfully.",
      rejected: "Candidate rejected.",
    };

    toast.success(messages[status]);

    loadApplicants();
  } catch (error) {
    console.error(error);

    toast.error("Failed to update application.");
  }
};
	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Applicants</h1>

			<table className="w-full border rounded-lg">
				<thead>
					<tr>
						<th>Name</th>

						<th>Email</th>

						<th>Status</th>

						<th>Applied</th>

						<th>Action</th>
					</tr>
				</thead>

				<tbody>
					{applications.map((application) => (
						<tr key={application._id} className="border-b">
							<td className="p-4">{application.candidateName}</td>

							<td className="p-4">{application.candidateEmail}</td>

							<td className="p-4 capitalize">{application.status}</td>

							<td className="p-4">
								{new Date(application.appliedAt).toLocaleDateString()}
							</td>

							<td className="p-4">
								<div className="flex flex-wrap gap-2">
									{application.status === "pending" && (
										<>
											<Button
												size="sm"
												onClick={() =>
													handleStatus(application._id, "shortlisted")
												}
											>
												Shortlist
											</Button>

											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleStatus(application._id, "interview")
												}
											>
												Interview
											</Button>

											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													handleStatus(application._id, "rejected")
												}
											>
												Reject
											</Button>
										</>
									)}

									{application.status === "shortlisted" && (
										<>
											<Button
												size="sm"
												onClick={() =>
													handleStatus(application._id, "interview")
												}
											>
												Interview
											</Button>

											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													handleStatus(application._id, "rejected")
												}
											>
												Reject
											</Button>
										</>
									)}

									{application.status === "interview" && (
										<>
											<Button
												size="sm"
												className="bg-green-600 hover:bg-green-700"
												onClick={() => handleStatus(application._id, "hired")}
											>
												Hire
											</Button>

											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													handleStatus(application._id, "rejected")
												}
											>
												Reject
											</Button>
										</>
									)}

									{application.status === "hired" && (
										<span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
											Hired
										</span>
									)}

									{application.status === "rejected" && (
										<span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
											Rejected
										</span>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
