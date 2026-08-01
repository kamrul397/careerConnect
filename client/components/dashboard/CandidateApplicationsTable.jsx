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
    setApplications(data || []);
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#124d46] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-teal-300" />
            My Applications
          </h1>
          <p className="text-teal-50 mt-2 text-sm sm:text-base max-w-xl leading-relaxed opacity-90">
            Track the status of all your job applications in one place.
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="p-4 bg-slate-50 rounded-full mb-3">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-800">No applications found</p>
          <p className="text-xs text-slate-500 mt-1">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List (< md screens) */}
          <div className="block md:hidden space-y-3.5">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-2xl border-2 border-slate-100 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#124d46] shrink-0" />
                      {application.jobTitle}
                    </h3>
                    <p className="text-slate-600 text-xs flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {application.company}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full shrink-0 ${
                      badgeColor[application.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {new Date(application.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  {application.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWithdraw(application._id)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 transition-colors rounded-lg text-xs font-semibold h-8 px-3"
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= md screens) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Job Role</th>
                    <th className="px-6 py-4 font-semibold">Company</th>
                    <th className="px-6 py-4 font-semibold">Applied Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((application) => (
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
                            year: "numeric",
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}