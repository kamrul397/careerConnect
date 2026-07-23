"use client";

// import { Button } from "@/components/ui/button";
// import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";

export default function CandidateDashboard() {
	const { dbUser } = useAuth();

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

					<p className="text-4xl font-bold mt-3">0</p>
				</div>

				<div className="border rounded-lg p-6">
					<h3 className="text-sm text-muted-foreground">Saved Jobs</h3>

					<p className="text-4xl font-bold mt-3">0</p>
				</div>

				<div className="border rounded-lg p-6">
					<h3 className="text-sm text-muted-foreground">Interviews</h3>

					<p className="text-4xl font-bold mt-3">0</p>
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
