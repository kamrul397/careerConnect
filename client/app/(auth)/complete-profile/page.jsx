"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { getUserByEmail, saveUser } from "@/services/userService";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function CompleteProfilePage() {
	const { user, loading, refreshDbUser } = useAuth();
	const router = useRouter();
	const [checking, setChecking] = useState(true);
	const { register, handleSubmit, reset } = useForm({
		defaultValues: {
			name: "",
			email: "",
			photo: "",
			role: "candidate",
		},
	});

	useEffect(() => {
		const checkUser = async () => {
			if (!user) {
				router.replace("/login");
				return;
			}

			try {
				const existingUser = await getUserByEmail(user.email);

				if (existingUser) {
					router.replace("/");
					return;
				}
			} catch (error) {
				console.error(error);
			} finally {
				setChecking(false);
			}
		};

		checkUser();
	}, [user, router]);
	useEffect(() => {
		if (user) {
			reset({
				name: user.displayName || "",
				email: user.email || "",
				photo: user.photoURL || "",
				role: "candidate",
			});
		}
	}, [user, reset]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (checking) {
		return (
			<div className="flex justify-center items-center h-screen">
				Checking profile...
			</div>
		);
	}

	const onSubmit = async (data) => {
		try {
			await saveUser({
				...data,
				createdAt: new Date(),
			});
			await refreshDbUser();

			toast.success("Profile completed successfully!");

			router.replace("/");
		} catch (error) {
			toast.error("Something went wrong.");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<input {...register("name")} className="w-full border p-3 rounded" />

				<input
					{...register("email")}
					disabled
					className="w-full border p-3 rounded bg-gray-100"
				/>

				<input {...register("photo")} className="w-full border p-3 rounded" />

				<select {...register("role")} className="w-full border p-3 rounded">
					<option value="candidate">Candidate</option>
					<option value="recruiter">Recruiter</option>
				</select>

				<button className="w-full bg-blue-600 text-white py-3 rounded">
					Complete Registration
				</button>
			</form>
		</div>
	);
}
