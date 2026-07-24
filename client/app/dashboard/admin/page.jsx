"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function DashboardHeader() {

    const router = useRouter();

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
							0
						</p>
					</div>

					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">
							Approved Jobs
						</h3>

						<p className="text-4xl font-bold mt-3">
							0
						</p>
					</div>

					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">
							Recruiters
						</h3>

						<p className="text-4xl font-bold mt-3">
							0
						</p>
					</div>

					<div className="border rounded-lg p-6">
						<h3 className="text-sm text-muted-foreground">
							Candidates
						</h3>

						<p className="text-4xl font-bold mt-3">
							0
						</p>
					</div>
				</div>

				<div className="border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						Quick Actions
					</h2>

					<div className="flex flex-wrap gap-4">
						<button className="rounded-md border px-4 py-2">
							Review Pending Jobs
						</button>

						<button className="rounded-md border px-4 py-2">
							Manage Users
						</button>

						<button className="rounded-md border px-4 py-2">
							View Reports
						</button>
					</div>
				</div>
			</div>

        </header>

    );
}