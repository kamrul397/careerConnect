"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { getCandidateApplications, withdrawApplication } from "@/services/applicationService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Briefcase, Building2, Calendar, FileText } from "lucide-react";

export default function CandidateApplicationsTable() {
  const { dbUser } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (dbUser?.email) {
      loadApplications();
    }
  }, [dbUser]);

  const loadApplications = async () => {
    const data = await getCandidateApplications(dbUser.email);
    setApplications(data);
  };

  const handleWithdraw = async (id) => {
    const previousApplications = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: "withdrawn" } : app))
    );

    try {
      await withdrawApplication(id);
      toast.success("Application withdrawn.");
    } catch (error) {
      setApplications(previousApplications);
      toast.error(error.response?.data?.message || "Failed to withdraw application.");
    }
  };

  const badgeColor = {
    pending: "bg-amber-100/80 text-amber-700 border border-amber-200/50",
    shortlisted: "bg-blue-100/80 text-blue-700 border border-blue-200/50",
    interview: "bg-fuchsia-100/80 text-fuchsia-700 border border-fuchsia-200/50",
    hired: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/50",
    rejected: "bg-rose-100/80 text-rose-700 border border-rose-200/50",
    withdrawn: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-slate-900 to-[#124d46] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-teal-300" />
            My Applications
          </h1>
          <p className="text-teal-50 mt-2 text-lg max-w-xl leading-relaxed opacity-90">
            Track the status of all your job applications in one place.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-5 font-semibold">Job Role</th>
                <th className="px-6 py-5 font-semibold">Company</th>
                <th className="px-6 py-5 font-semibold">Applied Date</th>
                <th className="px-6 py-5 font-semibold">Status</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-600">No applications found</p>
                      <p className="text-sm">You haven't applied to any jobs yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr
                    key={application._id}
                    className="group hover:bg-teal-50/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-[#124d46]">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-[#124d46] transition-colors">
                          {application.jobTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {application.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(application.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                          badgeColor[application.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {application.status === "pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(application._id)}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors rounded-lg font-medium"
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <span className="text-sm text-slate-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}