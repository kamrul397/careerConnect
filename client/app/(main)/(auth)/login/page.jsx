"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { loginSchema } from "@/validations/auth.validation";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
	const { loginUser } = useAuth();
	const router = useRouter();

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

			toast.success("Login Successful!");

			router.push("/");
		} catch (error) {
			toast.error(getFirebaseErrorMessage(error.code));
		}
	};

	return (
		<>
			<h1 className="text-3xl font-bold text-center">Welcome Back</h1>

			<p className="text-center text-gray-500 mt-2">Login to continue.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
				<div>
					<input
						type="email"
						placeholder="Email"
						{...register("email")}
						className="border rounded-lg p-3 w-full"
					/>

					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
					)}
				</div>

				<div>
					<input
						type="password"
						placeholder="Password"
						{...register("password")}
						className="border rounded-lg p-3 w-full"
					/>

					{errors.password && (
						<p className="text-red-500 text-sm mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					disabled={isSubmitting}
					className="bg-blue-600 text-white w-full py-3 rounded-lg disabled:opacity-50"
				>
					{isSubmitting ? "Logging in..." : "Login"}
				</button>
			</form>

			<p className="text-center mt-6">
				Dont have an account?
				<Link href="/register" className="text-blue-600 ml-2">
					Register
				</Link>
				<GoogleLoginButton />
			</p>
		</>
	);
}
