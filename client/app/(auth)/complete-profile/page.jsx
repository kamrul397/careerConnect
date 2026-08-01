"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import { getUserByEmail, saveUser } from "@/services/userService";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import Image from "next/image";
import { Camera, Maximize2, Mail, X } from "lucide-react";
import { HiUserCircle } from "react-icons/hi";

export default function CompleteProfilePage() {
	const { user, loading, refreshDbUser } = useAuth();
	const router = useRouter();
	const [checking, setChecking] = useState(true);

	const [photoModalOpen, setPhotoModalOpen] = useState(false);
	const [uploadingPhoto, setUploadingPhoto] = useState(false);
	const [photoUrl, setPhotoUrl] = useState("");
	const photoInputRef = useRef(null);

	const { register, handleSubmit, reset } = useForm({
		defaultValues: {
			name: "",
			email: "",
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
				role: "candidate",
			});
			setPhotoUrl(user.photoURL || "");
		}
	}, [user, reset]);

	const handlePhotoChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file.");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Photo size must be under 5MB.");
			return;
		}

		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

		if (!cloudName || !uploadPreset) {
			toast.error("Cloudinary is not configured. Check your .env.local file.");
			return;
		}

		setUploadingPhoto(true);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", uploadPreset);
			formData.append(
				"public_id",
				`profile_photos/${user.email.replace("@", "_at_").replace(/\./g, "_")}/photo_${Date.now()}`
			);

			const uploadRes = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!uploadRes.ok) {
				throw new Error("Failed to upload image to Cloudinary");
			}

			const cloudData = await uploadRes.json();
			setPhotoUrl(cloudData.secure_url);
			toast.success("Photo uploaded successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to update photo.");
		} finally {
			setUploadingPhoto(false);
		}
	};

	const onSubmit = async (data) => {
		try {
			await saveUser({
				...data,
				photo: photoUrl,
				createdAt: new Date(),
			});
			await refreshDbUser();

			toast.success("Profile completed successfully!");

			router.replace("/");
		} catch (error) {
			toast.error("Something went wrong.");
		}
	};

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

	return (
		<div className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
			{/* Top Profile Summary Card */}
			<div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] p-6 sm:p-8 text-white relative">
				<div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

				<div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
					{/* Avatar with Click-to-Enlarge Modal & Camera Button */}
					<div className="relative group shrink-0">
						<div
							onClick={() => photoUrl && setPhotoModalOpen(true)}
							className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white/20 overflow-hidden relative shadow-lg bg-teal-900 flex items-center justify-center ${
								photoUrl ? "cursor-pointer transition-transform duration-300 hover:scale-105" : ""
							}`}
							title={photoUrl ? "Click to view full photo" : ""}
						>
							{photoUrl ? (
								<>
									<Image
										src={photoUrl}
										alt="Profile Photo"
										fill
										priority
										sizes="112px"
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
										<Maximize2 className="w-5 h-5" />
									</div>
								</>
							) : (
								<HiUserCircle className="w-full h-full text-slate-300" />
							)}
						</div>

						{/* Change Photo Trigger */}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								photoInputRef.current?.click();
							}}
							disabled={uploadingPhoto}
							className="absolute bottom-0 right-0 bg-white text-[#124d46] p-2 rounded-full shadow-md hover:bg-teal-50 transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
							title="Change Profile Photo"
						>
							<Camera className="w-4 h-4" />
						</button>

						<input
							type="file"
							ref={photoInputRef}
							accept="image/*"
							className="hidden"
							onChange={handlePhotoChange}
						/>
					</div>

					{/* User Details */}
					<div className="space-y-2 text-center sm:text-left flex-1">
						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
							<h2 className="text-4xl font-bold">{user?.displayName || "Welcome!"}</h2>
						</div>
						<p className="text-teal-100 mt-1 text-sm">
							Please complete your details below to get started.
						</p>

						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-md text-teal-100/90 font-medium mt-2">
							{user?.email && (
								<span className="flex items-center gap-1.5">
									<Mail className="w-3.5 h-3.5 text-teal-300" />
									{user.email}
								</span>
							)}
						</div>

						{uploadingPhoto && (
							<p className="text-xs text-teal-200 font-semibold animate-pulse pt-1">
								Uploading new photo...
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Form Content */}
			<div className="p-8">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="grid sm:grid-cols-2 gap-5">
						{/* Name */}
						<div className="space-y-1.5">
							<label className="text-slate-900 font-bold text-xs uppercase tracking-wider block">
								Full Name <span className="text-red-500">*</span>
							</label>
							<input
								{...register("name", { required: true })}
								placeholder="John Doe"
								className="w-full bg-white border-2 border-slate-300 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 text-base h-11 px-4 rounded-xl outline-none transition-all"
							/>
						</div>

						{/* Email */}
						<div className="space-y-1.5">
							<label className="text-slate-900 font-bold text-xs uppercase tracking-wider block">
								Email Address <span className="text-slate-400 font-normal text-xs">(Read only)</span>
							</label>
							<input
								{...register("email")}
								disabled
								className="w-full bg-slate-100 border border-slate-300 text-slate-500 font-medium text-base h-11 px-4 rounded-xl cursor-not-allowed"
							/>
						</div>
					</div>

					{/* Role */}
					<div className="space-y-1.5">
						<label className="text-slate-900 font-bold text-xs uppercase tracking-wider block">
							Account Type <span className="text-red-500">*</span>
						</label>
						<select
							{...register("role")}
							className="w-full bg-white border-2 border-slate-300 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 text-base h-11 px-4 rounded-xl outline-none transition-all appearance-none cursor-pointer"
						>
							<option value="candidate">Candidate - Looking for jobs</option>
							<option value="recruiter">Recruiter - Hiring talent</option>
						</select>
					</div>

					{/* Submit Button */}
					<div className="pt-4">
						<button
							type="submit"
							disabled={uploadingPhoto}
							className="w-full bg-[#124d46] hover:bg-[#0a2e2a] text-white py-3.5 rounded-xl font-bold shadow-md shadow-[#124d46]/30 transition-all flex items-center justify-center gap-2 text-base active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{uploadingPhoto ? "Uploading Photo..." : "Complete Registration"}
						</button>
					</div>
				</form>
			</div>

			{/* Full-Screen Photo Preview Lightbox Modal */}
			{photoModalOpen && photoUrl && (
				<div
					className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in-0"
					onClick={() => setPhotoModalOpen(false)}
				>
					<div
						className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center p-2"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setPhotoModalOpen(false)}
							className="absolute -top-12 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition cursor-pointer"
							title="Close Preview"
						>
							<X className="w-6 h-6" />
						</button>
						<img
							src={photoUrl}
							alt="Profile Photo"
							className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border-2 border-white/20"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
