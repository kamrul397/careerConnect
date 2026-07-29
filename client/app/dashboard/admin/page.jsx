"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingJobs, getApprovedJobs } from "@/services/jobService";
import { getAllUsers } from "@/services/userService";


export default function DashboardHeader() {

	const router = useRouter();
	const [stats, setStats] = useState({
		pendingJobs: 0,
		approvedJobs: 0,
		recruiters: 0,
		candidates: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [pending, approved, users] = await Promise.all([
					getPendingJobs(),
					getApprovedJobs(),
					getAllUsers()
				]);

				// Adjust the `.length` depending on whether your API returns the array directly or inside an object (e.g., pending.jobs.length)
				const pendingCount = pending?.length || pending?.jobs?.length || 0;
				const approvedCount = approved?.length || approved?.jobs?.length || 0;

				const recruitersCount = users?.filter(u => u.role === 'recruiter').length || 0;
				const candidatesCount = users?.filter(u => u.role === 'candidate' || u.role === 'user').length || 0;

				setStats({
					pendingJobs: pendingCount,
					approvedJobs: approvedCount,
					recruiters: recruitersCount,
					candidates: candidatesCount
				});
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	return (

		<header className="border-b p-4 ">

			<Button
				variant="outline"
				onClick={() => router.back()}
			>
				← Back
			</Button>

			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold">
						Admin Dashboard
					</h1>

					<p className="text-muted-foreground mt-2">
						Manage users, recruiters and job approvals.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-4">
					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">

							<Link href={'admin/pending-jobs'}>Pending Jobs</Link>
						</h3>

						<p className="text-4xl font-bold mt-3">
							{loading ? "..." : stats.pendingJobs}
						</p>
					</div>

					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">
							Approved Jobs
						</h3>

						<p className="text-4xl font-bold mt-3">
							{loading ? "..." : stats.approvedJobs}
						</p>
					</div>

					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">
							Recruiters
						</h3>

						<p className="text-4xl font-bold mt-3">
							{loading ? "..." : stats.recruiters}
						</p>
					</div>

					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">
							Candidates
						</h3>

						<p className="text-4xl font-bold mt-3">
							{loading ? "..." : stats.candidates}
						</p>
					</div>
				</div>

				<div className="border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						Quick Actions
					</h2>

					<div className="flex flex-wrap gap-4">
						<Link href="/dashboard/admin/pending-jobs" className="rounded-md border px-4 py-2 hover:bg-muted transition-colors">
							Review Pending Jobs
						</Link>

						<Link href="/dashboard/admin/users" className="rounded-md border px-4 py-2 hover:bg-muted transition-colors">
							Manage Users
						</Link>

						<Link href="/dashboard/admin/reports" className="rounded-md border px-4 py-2 hover:bg-muted transition-colors">
							View Reports
						</Link>
					</div>
				</div>
			</div>

		</header>

	);
}