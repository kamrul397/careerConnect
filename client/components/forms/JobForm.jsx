import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
// ✅ CORRECT (no curly braces = default import)
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
export default function JobForm({ mode = "create", initialData = {}, onSubmit }) {
	const {
		control,          // <-- added
		handleSubmit,
		reset,
	} = useForm({
		defaultValues: {
			title: "",
			category: "",
			company: "",
			location: "",
			salary: "",
			type: "",
			description: "",
			requirements: "",
		},
	});

	// ...reset effect stays the same

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Title – native input works, keep it or also wrap with Controller */}
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<input
						className="border p-2 w-full"
						placeholder="Frontend Developer"
						{...field}
					/>
				)}
			/>



			{/* Company – custom Input */}
			<Controller
				name="company"
				control={control}
				render={({ field }) => (
					<Input id="company" placeholder="Google" {...field} />
				)}
			/>

			{/* Location – custom Input */}
			<Controller
				name="location"
				control={control}
				render={({ field }) => (
					<Input id="location" placeholder="Dhaka, Bangladesh" {...field} />
				)}
			/>

			{/* Salary – custom Input */}
			<Controller
				name="salary"
				control={control}
				render={({ field }) => (
					<Input id="salary" placeholder="$50,000 / year" {...field} />
				)}
			/>

			{/* Type – native select (works out of the box) */}
			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<select
						id="type"
						className="w-full rounded-md border p-2"
						{...field}
					>
						<option value="">Select Job Type</option>
						<option value="Full Time">Full Time</option>
						<option value="Part Time">Part Time</option>
						<option value="Remote">Remote</option>
						<option value="Internship">Internship</option>
					</select>
				)}
			/>

			{/* Category – native select */}
			<Controller
				name="category"
				control={control}
				render={({ field }) => (
					<select
						id="category"
						className="w-full rounded-md border p-2"
						{...field}
					>
						<option value="">Select Category</option>
						<option value="Engineering">Engineering</option>
						<option value="Design">Design</option>
						<option value="Marketing">Marketing</option>
						<option value="Product">Product</option>
						<option value="Sales">Sales</option>
					</select>
				)}
			/>

			{/* Description – custom Textarea */}
			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<Textarea
						id="description"
						rows={6}
						placeholder="Describe the job..."
						{...field}
					/>
				)}
			/>

			{/* Requirements – custom Textarea */}
			<Controller
				name="requirements"
				control={control}
				render={({ field }) => (
					<Textarea
						id="requirements"
						rows={5}
						placeholder="React, Next.js, MongoDB..."
						{...field}
					/>
				)}
			/>

			{/* Submit button stays the same */}
			<Button type="submit" className="w-full" size="lg">
				{mode === "create" ? "Post Job" : "Update Job"}
			</Button>
		</form >
	);
}