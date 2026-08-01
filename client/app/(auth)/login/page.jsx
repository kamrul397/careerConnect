"use client";

import Link from "next/link";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { loginSchema } from "@/validations/auth.validation";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import { saveJob } from "@/services/savedJobsService";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Logo from "@/components/shared/Logo";

function LoginForm() {
	const { user, loginUser } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const jobIdToSave = searchParams.get("saveJob");

	React.useEffect(() => {
		if (user) {
			router.replace("/dashboard");
		}
	}, [user, router]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data) => {
		try {
			await loginUser(data.email, data.password);

			if (jobIdToSave) {
				try {
					await saveJob(jobIdToSave);
					toast.success("Login Successful & Job Saved!");
				} catch (err) {
					toast.success("Login Successful!");
					toast.error("Failed to auto-save job.");
				}
				router.push("/dashboard/candidate/saved-jobs");
			} else {
				toast.success("Login Successful!");
				router.push("/");
			}
		} catch (error) {
			toast.error(getFirebaseErrorMessage(error.code));
		}
	};

	return (
		<div className="bg-white lg:p-6 lg:rounded-3xl lg:shadow-[0_8px_40px_rgb(0,0,0,0.04)] lg:border lg:border-gray-100">
			<div className="w-90 h-100 text-center">
				<h1 className="text-2xl font-bold text-gray-900 inline-flex items-center gap-1 ">Welcome to <Logo></Logo></h1>

				<p className="text-gray-500 mt-2 text-sm">Login to your account to continue.</p>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8 ">
					<div>
						<input
							type="email"
							placeholder="Email Address"
							{...register("email")}
							className="border rounded-xl p-3.5 w-full bg-gray-50/50 focus:ring-2 focus:ring-[#124d46] focus:border-transparent outline-none transition-all"
						/>

						{errors.email && (
							<p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{errors.email.message}</p>
						)}
					</div>

					<div>
						<input
							type="password"
							placeholder="Password"
							{...register("password")}
							className="border rounded-xl p-3.5 w-full bg-gray-50/50 focus:ring-2 focus:ring-[#124d46] focus:border-transparent outline-none transition-all"
						/>

						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
							</p>
						)}
					</div>

					<button
						disabled={isSubmitting}
						className="bg-[#124d46] hover:bg-[#0e3c37] hover:shadow-lg hover:-translate-y-0.5 text-white w-full py-3.5 rounded-xl disabled:opacity-70 transition-all font-medium"
					>
						{isSubmitting ? "Logging in..." : "Sign In"}
					</button>
				</form>

				<p className="text-center pt-6 text-sm text-gray-600 flex gap-2 flex-col">
					<span>Dont have an account?
						<Link href="/register" className="text-[#124d46] font-semibold ml-1.5 hover:underline ">
							Create one
						</Link></span>
					<GoogleLoginButton />
				</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="text-center py-20 text-[#124d46] font-semibold">Loading login...</div>}>
			<LoginForm />
		</Suspense>
	);
}
