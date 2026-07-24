"use client";

import Link from "next/link";

import RoleGuard from "@/components/auth/RoleGuard";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RecruiterDashboard() {
	return (
		<RoleGuard role="recruiter">
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

					<p className="text-muted-foreground mt-2">
						Manage your job postings and company profile.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<Card>
						<CardContent className="space-y-4 p-6">
							<h2 className="text-xl font-semibold">Post Job</h2>

							<p className="text-muted-foreground">Create a new job posting.</p>

							<Button asChild className="w-full">
								<Link href="/dashboard/recruiter/post-job">Post Job</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="space-y-4 p-6">
							<h2 className="text-xl font-semibold">Manage Jobs</h2>

							<p className="text-muted-foreground">
								View, edit and delete jobs.
							</p>

							<Button asChild className="w-full">
								<Link href="/dashboard/recruiter/manage-jobs">Manage Jobs</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="space-y-4 p-6">
							<h2 className="text-xl font-semibold">Company Profile</h2>

							<p className="text-muted-foreground">
								Update your company information.
							</p>

							<Button variant="outline" className="w-full">
								Coming Soon
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</RoleGuard>
	);
}
