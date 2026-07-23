"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { BriefcaseBusiness, Building2, FileText, Plus } from "lucide-react";

import useAuth from "@/hooks/useAuth";

export default function RecruiterDashboard() {
	const { dbUser } = useAuth();

	return (
		<div className="space-y-8">
			{/* Welcome */}
			<div>
				<h1 className="text-3xl font-bold">Welcome back, {dbUser?.name} 👋</h1>

				<p className="text-muted-foreground mt-2">
					Manage your company and job postings.
				</p>
			</div>

			{/* Statistics */}
			<div className="grid gap-6 md:grid-cols-3">
				<div className="rounded-lg border bg-white p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-sm text-muted-foreground">Jobs Posted</h3>

						<BriefcaseBusiness className="h-5 w-5 text-blue-600" />
					</div>

					<p className="mt-4 text-4xl font-bold">0</p>
				</div>

				<div className="rounded-lg border bg-white p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-sm text-muted-foreground">Active Jobs</h3>

						<Building2 className="h-5 w-5 text-green-600" />
					</div>

					<p className="mt-4 text-4xl font-bold">0</p>
				</div>

				<div className="rounded-lg border bg-white p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-sm text-muted-foreground">Applications</h3>

						<FileText className="h-5 w-5 text-orange-600" />
					</div>

					<p className="mt-4 text-4xl font-bold">0</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="rounded-lg border bg-white p-6">
				<h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>

				<div className="flex flex-wrap gap-4">
					<Button asChild>
						<Link href="/dashboard/post-job">
							<Plus className="mr-2 h-4 w-4" />
							Post a Job
						</Link>
					</Button>

					<Button variant="outline" asChild>
						<Link href="/dashboard/manage-jobs">Manage Jobs</Link>
					</Button>

					<Button variant="secondary" asChild>
						<Link href="/dashboard/company-profile">Company Profile</Link>
					</Button>
				</div>
			</div>

			{/* Recent Jobs */}
			<div className="rounded-lg border bg-white p-6">
				<h2 className="mb-4 text-xl font-semibold">Recent Jobs</h2>

				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
					You haven't posted any jobs yet.
				</div>
			</div>
		</div>
	);
}
