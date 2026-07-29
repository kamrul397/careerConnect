"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getCandidateApplications } from "@/services/applicationService";
import { getSavedJobs } from "@/services/savedJobsService";

export default function CandidateDashboard() {
	const { dbUser } = useAuth();
	const [applications, setApplications] = useState([]);
	const [savedCount, setSavedCount] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			if (dbUser?.email) {
				try {
					const [appData, savedData] = await Promise.all([
						getCandidateApplications(dbUser.email),
						getSavedJobs(),
					]);
					setApplications(appData);
					setSavedCount(savedData.length);
				} catch (error) {
					console.error("Error fetching stats:", error);
				} finally {
					setLoading(false);
				}
			}
		};
		fetchStats();
	}, [dbUser]);

	const appliedCount = applications.length;
	const interviewCount = applications.filter(app => app.status === "interview").length;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Welcome back, {dbUser?.name} 👋</h1>

				<p className="text-muted-foreground mt-2">
					Manage your applications and discover new opportunities.
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-6">
				<div className="border rounded-lg p-6">
					<h3 className="text-sm text-muted-foreground">Applied Jobs</h3>
					<p className="text-4xl font-bold mt-3">
						{loading ? "..." : appliedCount}
					</p>
				</div>

				<div className="border rounded-lg p-6">
					<h3 className="text-sm text-muted-foreground">Saved Jobs</h3>
					<p className="text-4xl font-bold mt-3">{loading ? "..." : savedCount}</p>
				</div>

				<div className="border rounded-lg p-6">
					<h3 className="text-sm text-muted-foreground">Interviews</h3>
					<p className="text-4xl font-bold mt-3">
						{loading ? "..." : interviewCount}
					</p>
				</div>
			</div>

			<div className="border rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

				<div className="flex flex-wrap gap-4">
					<Button asChild>
						<Link href="/jobs">Browse Jobs</Link>
					</Button>

					<Button variant="outline" asChild>
						<Link href="/profile">Edit Profile</Link>
					</Button>

					<Button variant="secondary">Upload Resume</Button>
				</div>
			</div>
		</div>
	);
}
