"use client";

import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import { getUserByEmail } from "@/services/userService";
import { saveJob } from "@/services/savedJobsService";

export default function GoogleLoginButton() {
	const { googleLogin } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const jobIdToSave = searchParams.get("saveJob");

	const handleGoogleLogin = async () => {
		try {
			const result = await googleLogin();
			const firebaseUser = result.user;

			// Check if user already exists in MongoDB
			const existingUser = await getUserByEmail(firebaseUser.email);

			if (existingUser) {
				if (jobIdToSave && existingUser.role === "candidate") {
					try {
						await saveJob(jobIdToSave);
						toast.success("Welcome back & Job Saved!");
					} catch (err) {
						toast.success("Welcome back!");
						toast.error("Failed to auto-save job.");
					}
					router.push("/dashboard/candidate/saved-jobs");
					return;
				}

				toast.success("Welcome back!");
				router.push("/");
				return;
			}

			// First-time Google user
			toast.success("Complete your profile");
			router.push(jobIdToSave ? `/complete-profile?saveJob=${jobIdToSave}` : "/complete-profile");
		} catch (error) {
			toast.error(getFirebaseErrorMessage(error.code));
		}
	};

	return (
		<button
			type="button"
			onClick={handleGoogleLogin}
			className="w-full border rounded-lg py-2.5 flex items-center justify-center gap-3 hover:bg-gray-100 transition text-base font-medium"
		>
			<FcGoogle size={22} />
			Continue with Google
		</button>
	);
}
