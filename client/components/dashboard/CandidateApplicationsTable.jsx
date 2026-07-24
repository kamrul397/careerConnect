"use client";

import { useEffect, useState } from "react";

import useAuth from "@/hooks/useAuth";
import { getCandidateApplications } from "@/services/applicationService";

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
                  className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor[application.status]}`}
                >
                  {application.status}
                </span>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}