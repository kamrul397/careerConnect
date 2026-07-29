"use client";

import { useEffect, useState } from "react";

import useAuth from "@/hooks/useAuth";
import { getCandidateApplications, withdrawApplication } from "@/services/applicationService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CandidateApplicationsTable() {
  const { dbUser } = useAuth();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (dbUser?.email) {
      loadApplications();
    }
  }, [dbUser]);

  const loadApplications = async () => {
    const data = await getCandidateApplications(
      dbUser.email
    );

    setApplications(data);
  };

  const handleWithdraw = async (id) => {
    const previousApplications = [...applications];
    // Optimistic UI update
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
    pending:
      "bg-yellow-100 text-yellow-700",

    shortlisted:
      "bg-blue-100 text-blue-700",

    interview:
      "bg-purple-100 text-purple-700",

    hired:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",

    withdrawn:
      "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          My Applications
        </h1>

        <p className="text-muted-foreground">
          Track all of your job applications.
        </p>
      </div>

      <table className="w-full rounded-lg border">

        <thead>

          <tr className="border-b">

            <th className="p-4 text-left">
              Job
            </th>

            <th className="p-4 text-left">
              Company
            </th>

            <th className="p-4 text-left">
              Applied
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {applications.map((application) => (
            <tr
              key={application._id}
              className="border-b"
            >
              <td className="p-4">
                {application.jobTitle}
              </td>

              <td className="p-4">
                {application.company}
              </td>

              <td className="p-4">
                {new Date(
                  application.appliedAt
                ).toLocaleDateString()}
              </td>

              <td className="p-4">

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor[application.status] || "bg-gray-100 text-gray-700"}`}
                >
                  {application.status}
                </span>

              </td>

              <td className="p-4">
                {application.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWithdraw(application._id)}
                  >
                    Withdraw
                  </Button>
                )}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}