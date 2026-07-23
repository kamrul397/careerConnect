"use client";

import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import { getUserByEmail } from "@/services/userService";

export default function GoogleLoginButton() {
	const { googleLogin } = useAuth();
	const router = useRouter();

	const handleGoogleLogin = async () => {
		try {
			const result = await googleLogin();

			const firebaseUser = result.user;

			// Check if user already exists in MongoDB
			const existingUser = await getUserByEmail(firebaseUser.email);

			if (existingUser) {
				toast.success("Welcome back!");
				router.push("/");
				return;
			}

			// First-time Google user
			toast.success("Complete your profile");
			router.push("/complete-profile");
		} catch (error) {
			toast.error(getFirebaseErrorMessage(error.code));
		}
	};

	return (
		<button
			type="button"
			onClick={handleGoogleLogin}
			className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
		>
			<FcGoogle size={22} />
			Continue with Google
		</button>
	);
}
