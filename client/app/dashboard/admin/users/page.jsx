"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@/services/userService";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch users on page load
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data || []);
        } catch (error) {
            toast.error("Failed to load users: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Delete user handler
    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteUser(userId);
            toast.success("User deleted successfully");
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (error) {
            toast.error("Failed to delete user: " + (error.response?.data?.message || error.message));
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">Manage Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of all registered users in the platform.
                    </p>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                    Total Users: {users.length}
                </Badge>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u) => (
                                <TableRow key={u._id}>
                                    {/* Name */}
                                    <TableCell className="font-medium">
                                        {u.name || u.displayName || "N/A"}
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell>{u.email}</TableCell>

                                    {/* Role */}
                                    <TableCell>
                                        <Badge
                                            variant={
                                                u.role === "admin"
                                                    ? "destructive"
                                                    : u.role === "recruiter"
                                                        ? "default"
                                                        : "secondary"
                                            }
                                        >
                                            {u.role || "candidate"}
                                        </Badge>
                                    </TableCell>

                                    {/* Action: Delete */}
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={isDeleting || u.role === "admin"}
                                            onClick={() => handleDelete(u._id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}