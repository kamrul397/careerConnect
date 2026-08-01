"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { registerUser, updateUserProfile } from "@/services/authService";
import { saveUser } from "@/services/userService";
import { saveJob } from "@/services/savedJobsService";
import { registerSchema } from "@/validations/auth.validation";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import { getJwt } from "@/services/authApi";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [selectedFileName, setSelectedFileName] = useState("");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			role: "candidate",
		},
	});

	const { ref: photoRegisterRef, onChange: onPhotoChange, ...photoRegisterProps } = register("photo");

	const router = useRouter();
	const searchParams = useSearchParams();
	const jobIdToSave = searchParams.get("saveJob");
	const redirectUrl = searchParams.get("redirect");
	const { user, refreshDbUser } = useAuth();
	const isAuthActionInProgress = React.useRef(false);

	React.useEffect(() => {
		if (user && !isAuthActionInProgress.current) {
			router.replace("/dashboard");
		}
	}, [user, router]);

	const handleFileChange = (e) => {
		onPhotoChange(e);
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFileName(e.target.files[0].name);
		} else {
			setSelectedFileName("");
		}
	};

	const onSubmit = async (data) => {
		isAuthActionInProgress.current = true;
		try {
			let photoUrl = "";

			if (data.photo && data.photo.length > 0) {
				const file = data.photo[0];
				const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
				const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

				if (!cloudName || !uploadPreset) {
					toast.error("Cloudinary is not configured. Check your .env.local file.");
					return;
				}

				const formData = new FormData();
				formData.append("file", file);
				formData.append("upload_preset", uploadPreset);
				formData.append(
					"public_id",
					`profile_photos/${data.email.replace("@", "_at_").replace(/\./g, "_")}/photo_${Date.now()}`
				);

				const uploadRes = await fetch(
					`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
					{
						method: "POST",
						body: formData,
					}
				);

				if (!uploadRes.ok) {
					throw new Error("Failed to upload photo");
				}

				const cloudData = await uploadRes.json();
				photoUrl = cloudData.secure_url;
			}

			// 1. Create Firebase account
			const userCredential = await registerUser(data.email, data.password);

			// 2. Update Firebase profile
			await updateUserProfile(data.name, photoUrl);

			// 3. Save user in MongoDB FIRST so the backend has their selected role
			await saveUser({
				name: data.name,
				email: data.email,
				photo: photoUrl,
				role: data.role,
				createdAt: new Date(),
			});

			// 4. Explicitly generate the JWT cookie NOW. Since the user is in MongoDB,
			// the backend will correctly assign their role (e.g., 'candidate') to the token.
			await getJwt({
				email: userCredential.user.email,
				uid: userCredential.user.uid,
			});

			// 5. Update local context
			await refreshDbUser(data.email);

			reset();
			setSelectedFileName("");

			if (jobIdToSave && data.role === "candidate") {
				try {
					await saveJob(jobIdToSave);
					toast.success("Account created & Job Saved!");
				} catch (err) {
					toast.success("Account created successfully!");
					toast.error("Failed to auto-save job.");
				}
				router.push("/dashboard/candidate/saved-jobs");
			} else if (redirectUrl) {
				toast.success("Account created successfully!");
				router.push(redirectUrl);
			} else {
				toast.success("Account created successfully!");
				router.push("/");
			}
		} catch (error) {
			console.error(error);
			toast.error(getFirebaseErrorMessage(error.code));
		}
	};

	return (
		<div className="bg-white lg:p-6 lg:rounded-3xl lg:shadow-[0_8px_40px_rgb(0,0,0,0.04)] lg:border lg:border-gray-100 mt-20">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-3.5 flex flex-col justify-center w-full max-w-lg mx-auto text-left"
			>
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
					<p className="text-gray-500 mt-0.5 mb-1/2 text-sm">
						Join CareerConnect and find your next opportunity.
					</p>
				</div>

				{/* Full Name Row */}
				<div>
					<input
						{...register("name")}
						placeholder="Full Name"
						className="border rounded-lg p-2.5 w-full bg-gray-50/50 focus:ring-2 focus:ring-[#124d46] focus:border-transparent outline-none transition-all text-base"
					/>
					{errors.name && (
						<p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Email Row */}
				<div>
					<input
						type="email"
						{...register("email")}
						placeholder="Email Address"
						className="border rounded-lg p-2.5 w-full bg-gray-50/50 focus:ring-2 focus:ring-[#124d46] focus:border-transparent outline-none transition-all text-base"
					/>
					{errors.email && (
						<p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password + Role Side-by-Side Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{/* Password */}
					<div>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								{...register("password")}
								placeholder="Password"
								className="border rounded-lg p-2.5 pr-10 w-full bg-gray-50/50 focus:ring-2 focus:ring-[#124d46] focus:border-transparent outline-none transition-all text-base"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
								{errors.password.message}
							</p>
						)}
					</div>

					{/* Role */}
					<div>
						<select
							{...register("role")}
							className="border rounded-lg p-2.5 w-full bg-gray-50/50 focus:ring-2 focus:ring-[#124d46] focus:border-transparent outline-none transition-all text-gray-700 text-base h-[42px]"
						>
							<option value="candidate">I am a Candidate</option>
							<option value="recruiter">I am a Recruiter</option>
						</select>
						{errors.role && (
							<p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
								{errors.role.message}
							</p>
						)}
					</div>
				</div>

				{/* Large Photo Upload Row */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
						Profile Photo (Optional)
					</label>
					<label className="flex items-center justify-center w-full h-14 px-4 border-2 border-dashed border-gray-300 hover:border-[#124d46] rounded-xl cursor-pointer bg-gray-50/50 hover:bg-[#124d46]/5 transition-all group">
						<div className="flex items-center gap-3">
							<UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-[#124d46] transition-colors shrink-0" />
							{selectedFileName ? (
								<p className="text-xs text-[#124d46] font-semibold truncate max-w-[200px]">
									{selectedFileName}
								</p>
							) : (
								<p className="text-xs text-gray-600 font-medium">
									<span className="font-semibold text-[#124d46]">Click to upload</span> or drag and drop <span className="text-gray-400 text-[11px] ml-1">(SVG, PNG, JPG, GIF)</span>
								</p>
							)}
						</div>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							{...photoRegisterProps}
							ref={photoRegisterRef}
							onChange={handleFileChange}
						/>
					</label>
					{errors.photo && (
						<p className="text-red-500 text-xs font-medium mt-0.5 ml-1">
							{errors.photo.message}
						</p>
					)}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-[#124d46] hover:bg-[#0e3c37] hover:shadow-lg hover:-translate-y-0.5 text-white w-full py-2.5 rounded-lg disabled:opacity-70 transition-all font-semibold mt-1 text-base cursor-pointer"
				>
					{isSubmitting ? "Creating Account..." : "Register"}
				</button>

				<GoogleLoginButton />

				<p className="text-center text-base text-gray-600">
					Already have an account?
					<Link
						href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
						className="text-[#124d46] font-semibold ml-1.5 hover:underline"
					>
						Login here
					</Link>
				</p>
			</form>
		</div>
	);
}

export default function RegisterPage() {
	return (
		<Suspense fallback={<div className="text-center py-20 text-[#124d46] font-semibold">Loading registration...</div>}>
			<RegisterForm />
		</Suspense>
	);
}