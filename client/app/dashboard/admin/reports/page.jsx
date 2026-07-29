"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getPendingJobs, getApprovedJobs } from "@/services/jobService";
import { getAllUsers } from "@/services/userService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
    const router = useRouter();
    const [userStats, setUserStats] = useState([]);
    const [jobStats, setJobStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pending, approved, users] = await Promise.all([
                    getPendingJobs(),
                    getApprovedJobs(),
                    getAllUsers()
                ]);

                const recruitersCount = users?.filter(u => u.role === 'recruiter').length || 0;
                const candidatesCount = users?.filter(u => u.role === 'candidate' || u.role === 'user').length || 0;

                setUserStats([
                    { name: 'Candidates', count: candidatesCount },
                    { name: 'Recruiters', count: recruitersCount },
                ]);

                const pendingCount = pending?.length || pending?.jobs?.length || 0;
                const approvedCount = approved?.length || approved?.jobs?.length || 0;

                setJobStats([
                    { name: 'Pending Jobs', value: pendingCount },
                    { name: 'Approved Jobs', value: approvedCount }
                ]);

            } catch (error) {
                console.error("Error fetching report data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 space-y-8">
            <Button variant="outline" onClick={() => router.back()}>
                ← Back
            </Button>

            <div>
                <h1 className="text-3xl font-bold">Platform Reports</h1>
                <p className="text-muted-foreground mt-2">Visual analytics of platform activity.</p>
            </div>

            {loading ? (
                <p>Loading reports...</p>
            ) : (
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="border rounded-lg p-6 bg-card">
                        <h2 className="text-xl font-semibold mb-6">User Distribution</h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" name="Total Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 bg-card">
                        <h2 className="text-xl font-semibold mb-6">Job Status Distribution</h2>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={jobStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {jobStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
