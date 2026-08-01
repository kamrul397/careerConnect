"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	getApplicants,
	updateApplicationStatus,
} from "@/services/applicationService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, ArrowLeft, CheckCircle2, XCircle, Clock, Search, FileText } from "lucide-react";

export default function ApplicantsPage() {
	const { id } = useParams();
	const router = useRouter();

	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadApplicants();
	}, []);

	const loadApplicants = async () => {
		try {
			setLoading(true);
			const data = await getApplicants(id);
			setApplications(data || []);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatus = async (appId, status) => {
		try {
			await updateApplicationStatus(appId, status);
			const messages = {
				shortlisted: "Candidate shortlisted.",
				interview: "Interview scheduled.",
				hired: "Candidate hired successfully.",
				rejected: "Candidate rejected.",
			};
			toast.success(messages[status]);
			loadApplicants();
		} catch (error) {
			console.error(error);
			toast.error("Failed to update application.");
		}
	};

	const getStatusBadge = (status) => {
		switch (status?.toLowerCase()) {
			case "hired":
				return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-emerald-100 border-emerald-200 text-emerald-700 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Hired</span>;
			case "rejected":
				return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-red-100 border-red-200 text-red-700 text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
			case "shortlisted":
				return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-blue-100 border-blue-200 text-blue-700 text-xs font-bold"><Search className="w-3.5 h-3.5" /> Shortlisted</span>;
			case "interview":
				return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-purple-100 border-purple-200 text-purple-700 text-xs font-bold"><Users className="w-3.5 h-3.5" /> Interviewing</span>;
			default:
				return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-amber-100 border-amber-200 text-amber-700 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Pending</span>;
		}
	};

	return (
		<div className="space-y-8 pb-10">
			{/* Page Header */}
			<div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
				<div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-extrabold mb-1.5 flex items-center gap-2">
							<Users className="w-8 h-8 text-teal-300" />
							Job Applicants
						</h1>
						<p className="text-teal-100 text-base max-w-xl">
							Review and manage candidate applications for this position.
						</p>
					</div>
					<Button 
						onClick={() => router.push("/dashboard/recruiter/my-jobs")}
						variant="secondary"
						className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap border border-white/20"
					>
						<ArrowLeft className="w-4 h-4 mr-2" /> Back to My Jobs
					</Button>
				</div>
			</div>

			{/* Table Container */}
			<div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
				{loading ? (
					<div className="p-12 text-center text-slate-500 font-medium animate-pulse">
						Loading applicants...
					</div>
				) : applications.length === 0 ? (
					<div className="p-16 flex flex-col items-center justify-center text-center">
						<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
							<FileText className="w-10 h-10 text-slate-300" />
						</div>
						<h3 className="text-xl font-bold text-slate-900 mb-2">No Applicants Yet</h3>
						<p className="text-slate-500 max-w-sm">
							Nobody has applied for this job yet. Check back later once candidates start submitting their applications!
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
								<tr>
									<th className="px-6 py-5">Candidate</th>
									<th className="px-6 py-5">Applied On</th>
									<th className="px-6 py-5">Status</th>
									<th className="px-6 py-5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{applications.map((app) => (
									<tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
										<td className="px-6 py-5">
											<p className="font-bold text-slate-900 text-base mb-1">{app.candidateName}</p>
											<p className="text-slate-500 text-xs font-medium">{app.candidateEmail}</p>
										</td>
										<td className="px-6 py-5 text-slate-600 font-medium">
											{new Date(app.appliedAt).toLocaleDateString(undefined, {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</td>
										<td className="px-6 py-5">
											{getStatusBadge(app.status)}
										</td>
										<td className="px-6 py-5 text-right">
											<div className="flex flex-wrap items-center justify-end gap-2">
												{app.status === "pending" && (
													<>
														<Button size="sm" onClick={() => handleStatus(app._id, "shortlisted")} className="bg-blue-600 hover:bg-blue-700">
															Shortlist
														</Button>
														<Button size="sm" variant="outline" onClick={() => handleStatus(app._id, "interview")}>
															Interview
														</Button>
														<Button size="sm" variant="destructive" onClick={() => handleStatus(app._id, "rejected")}>
															Reject
														</Button>
													</>
												)}
												{app.status === "shortlisted" && (
													<>
														<Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handleStatus(app._id, "interview")}>
															Interview
														</Button>
														<Button size="sm" variant="destructive" onClick={() => handleStatus(app._id, "rejected")}>
															Reject
														</Button>
													</>
												)}
												{app.status === "interview" && (
													<>
														<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatus(app._id, "hired")}>
															Hire
														</Button>
														<Button size="sm" variant="destructive" onClick={() => handleStatus(app._id, "rejected")}>
															Reject
														</Button>
													</>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
