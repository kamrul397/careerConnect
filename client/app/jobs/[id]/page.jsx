"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import useAuth from "@/hooks/useAuth";

import { getApproveJobById } from "@/services/jobService";
import { applyJob, checkApplied } from "@/services/applicationService";

import { toast } from "sonner";

export default function JobDetailsPage() {
	const { id } = useParams();
	const router = useRouter();

	const { dbUser, user } = useAuth();

	const [job, setJob] = useState(null);
	const [alreadyApplied, setAlreadyApplied] = useState(false);
	const [applying, setApplying] = useState(false);

	useEffect(() => {
		if (id) {
			loadJob();
		}
	}, [id]);

	useEffect(() => {
		if (job && dbUser?.email) {
			checkApplication();
		}
	}, [job, dbUser]);

	const loadJob = async () => {
		try {
			const data = await getApproveJobById(id);
			setJob(data);
		} catch (error) {
			console.error(error);
			toast.error("Failed to load job.");
		}
	};

	const checkApplication = async () => {
		if (!job || !dbUser?.email) return;

		try {
			const applied = await checkApplied(job._id, dbUser.email);

			setAlreadyApplied(applied);
		} catch (error) {
			console.error(error);
		}
	};

	const handleApply = async () => {
		if (!dbUser?.email) {
			toast.error("Please login first.");
			return;
		}

		try {
			setApplying(true);

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

			toast.success("Application submitted successfully!");

			setAlreadyApplied(true);

			setTimeout(() => {
				router.push("/dashboard/candidate/my-applications");
			}, 1200);
		} catch (error) {
			toast.error(error.response?.data?.message || "Application failed.");
		} finally {
			setApplying(false);
		}
	};

	if (!job) {
		return <LoadingSpinner />;
	}

	return (
		<section className="max-w-5xl mx-auto px-4 py-10">
			{/* Back Button */}

			<Button variant="outline" className="mb-6" onClick={() => router.back()}>
				← Back
			</Button>

			{/* Header */}

			<div className="rounded-xl border bg-white shadow-sm p-8">
				<h1 className="text-4xl font-bold">{job.title}</h1>

				<p className="text-lg text-muted-foreground mt-2">{job.company}</p>

				<div className="mt-6 flex flex-wrap gap-3">
					<span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
						{job.type}
					</span>

					<span className="rounded-full bg-gray-100 px-4 py-1 text-sm">
						📍 {job.location}
					</span>

					<span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
						💰 {job.salary}
					</span>
				</div>
			</div>

			{/* Description */}

			<div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
				<h2 className="text-2xl font-semibold mb-4">Job Description</h2>

				<p className="leading-7 text-muted-foreground">{job.description}</p>
			</div>

			{/* Requirements */}

			<div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
				<h2 className="text-2xl font-semibold mb-4">Requirements</h2>

				<p className="leading-7 text-muted-foreground">{job.requirements}</p>
			</div>

			{/* Recruiter */}

			<div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
				<h2 className="text-2xl font-semibold mb-4">Recruiter Information</h2>

				<div className="space-y-2">
					<p>
						<strong>Name:</strong> {job.recruiterName}
					</p>

					<p>
						<strong>Email:</strong> {job.recruiterEmail}
					</p>

					<p>
						<strong>Posted:</strong>{" "}
						{new Date(job.createdAt).toLocaleDateString()}
					</p>
				</div>
			</div>

			{/* Apply Section */}

			<div className="mt-8 flex justify-end">
				{dbUser?.role === "candidate" ? (
					<Button
						size="lg"
						disabled={alreadyApplied || applying}
						onClick={handleApply}
					>
						{alreadyApplied
							? "Already Applied"
							: applying
								? "Applying..."
								: "Apply Now"}
					</Button>
				) : user ? (
					<p className="text-muted-foreground">
						Only candidates can apply for jobs.
					</p>
				) : (
					<Button asChild size="lg">
						<Link href="/login">Login to Apply</Link>
					</Button>
				)}
			</div>
		</section>
	);
}
