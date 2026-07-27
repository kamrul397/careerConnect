"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JobForm({
	mode = "create",
	initialData = {},
	onSubmit,
}) {
	const { register, handleSubmit, reset } = useForm({
		defaultValues: {
			title: "",
			company: "",
			location: "",
			salary: "",
			type: "",
			description: "",
			requirements: "",
		},
	});

	useEffect(() => {
		reset({
			title: initialData.title || "",
			company: initialData.company || "",
			location: initialData.location || "",
			salary: initialData.salary || "",
			type: initialData.type || "",
			description: initialData.description || "",
			requirements: initialData.requirements || "",
		});
	}, [initialData, reset]);

	const submitHandler = (data) => {
		onSubmit(data);

		if (mode === "create") {
			reset();
		}
	};

	return (
		<div className="rounded-2xl border bg-white p-8 shadow-sm">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">
					{mode === "create" ? "Post a New Job" : "Update Job"}
				</h1>

				<p className="mt-2 text-muted-foreground">
					Fill in the job information below.
				</p>
			</div>

			<form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
				<div className="grid gap-6 md:grid-cols-2">
					{/* Title */}

					<div>
						<label htmlFor="title" className="mb-2 block font-medium">
							Job Title
						</label>

						<Input
							id="title"
							placeholder="Frontend Developer"
							{...register("title")}
						/>
					</div>

					{/* Company */}

					<div>
						<label htmlFor="company" className="mb-2 block font-medium">
							Company Name
						</label>

						<Input id="company" placeholder="Google" {...register("company")} />
					</div>

					{/* Location */}

					<div>
						<label htmlFor="location" className="mb-2 block font-medium">
							Location
						</label>

						<Input
							id="location"
							placeholder="Dhaka, Bangladesh"
							{...register("location")}
						/>
					</div>

					{/* Salary */}

					<div>
						<label htmlFor="salary" className="mb-2 block font-medium">
							Salary
						</label>

						<Input
							id="salary"
							placeholder="$50,000 / year"
							{...register("salary")}
						/>
					</div>

					{/* Type */}

					<div className="md:col-span-2">
						<label htmlFor="type" className="mb-2 block font-medium">
							Job Type
						</label>

						<select
							id="type"
							{...register("type")}
							className="w-full rounded-md border p-2"
						>
							<option value="">Select Job Type</option>
							<option value="Full Time">Full Time</option>
							<option value="Part Time">Part Time</option>
							<option value="Remote">Remote</option>
							<option value="Internship">Internship</option>
						</select>
					</div>
				</div>

				{/* Description */}

				<div>
					<label htmlFor="description" className="mb-2 block font-medium">
						Job Description
					</label>

					<Textarea
						id="description"
						rows={6}
						placeholder="Describe the job..."
						{...register("description")}
					/>
				</div>

				{/* Requirements */}

				<div>
					<label htmlFor="requirements" className="mb-2 block font-medium">
						Requirements
					</label>

					<Textarea
						id="requirements"
						rows={5}
						placeholder="React, Next.js, MongoDB..."
						{...register("requirements")}
					/>
				</div>

				<Button type="submit" className="w-full" size="lg">
					{mode === "create" ? "Post Job" : "Update Job"}
				</Button>
			</form>
		</div>
	);
}
