"use client";

import Link from "next/link";

export default function NavLinks({ user, role }) {
	return (
		<div className="flex items-center gap-6">
			<Link href="/">Home</Link>

			{/* Guest + Candidate */}
			{role !== "recruiter" && role !== "admin" && (
				<>
					<Link href="/jobs">Jobs</Link>
					<Link href="/companies">Companies</Link>
				</>
			)}

			{/* Logged in users */}
			{user && (
				<>
					<Link href="/dashboard">Dashboard</Link>
					{/* {role === "candidate" && (
						<Link href="/dashboard/candidate/profile">Profile</Link>
					)} */}
				</>
			)}
		</div>
	);
}