"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import JobForm from "@/components/forms/JobForm";

import useAuth from "@/hooks/useAuth";
import { createJob } from "@/services/jobService";

export default function PostJobPage() {
	const { dbUser } = useAuth();

	const router = useRouter();

	const handleCreateJob = async (values) => {
		try {
			await createJob({
				...values,

				recruiterEmail: dbUser.email,

				recruiterName: dbUser.name,

				// status: "pending",
				//       createdAt: new Date(),
			});

			toast.success("Job submitted successfully. Waiting for admin approval.");

			router.push("/dashboard/recruiter/my-jobs");
		} catch (error) {
			console.error(error);

			toast.error("Failed to post job.");
		}
	};

	return <JobForm mode="create" onSubmit={handleCreateJob} />;
}
