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

	return (
		<div className="max-w-4xl mx-auto space-y-6 pb-10">
			{/* Page Header */}
			<div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
				<div className="relative z-10">
					<h1 className="text-3xl font-extrabold mb-1.5">Post a New Job</h1>
					<p className="text-teal-100 text-base max-w-xl">
						Fill out the details below to publish a new open position. Your listing will be reviewed before going live.
					</p>
				</div>
			</div>

			{/* Form */}
			<div className="px-2 sm:px-0">
				<JobForm mode="create" onSubmit={handleCreateJob} />
			</div>
		</div>
	);
}
