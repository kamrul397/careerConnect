"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { registerUser, updateUserProfile } from "@/services/authService";
import { saveUser } from "@/services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validations/auth.validation";
import toast from "react-hot-toast";

export default function RegisterPage() {

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
  
  const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     reset,
//   } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1. Create Firebase account
      await registerUser(data.email, data.password);

      // 2. Update Firebase profile
      await updateUserProfile(data.name, data.photo);

      // 3. Save user in MongoDB
      await saveUser({
        name: data.name,
        email: data.email,
        photo: data.photo,
        role: data.role,
        createdAt: new Date(),
      });

      reset();

      toast.success("Account created successfully!");

      router.push("/");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <h1 className="text-3xl font-bold">
        Register
      </h1>

      <input
  {...register("name")}
  placeholder="Full Name"
  className="border p-3 w-full rounded"
/>

{errors.name && (
  <p className="text-red-500 text-sm mt-1">
    {errors.name.message}
  </p>
)}

      <input
  {...register("photo")}
  placeholder="Photo URL (Optional)"
  className="border p-3 w-full rounded"
/>

{errors.photo && (
  <p className="text-red-500 text-sm mt-1">
    {errors.photo.message}
  </p>
)}

      <input
  type="email"
  {...register("email")}
  placeholder="Email"
  className="border p-3 w-full rounded"
/>

{errors.email && (
  <p className="text-red-500 text-sm mt-1">
    {errors.email.message}
  </p>
)}
     <input
  type="password"
  {...register("password")}
  placeholder="Password"
  className="border p-3 w-full rounded"
/>

{errors.password && (
  <p className="text-red-500 text-sm mt-1">
    {errors.password.message}
  </p>
)}

    <select
  {...register("role")}
  className="border p-3 w-full rounded"
>
  <option value="candidate">Candidate</option>
  <option value="recruiter">Recruiter</option>
</select>

{errors.role && (
  <p className="text-red-500 text-sm mt-1">
    {errors.role.message}
  </p>
)}

     <button
  type="submit"
  disabled={isSubmitting}
  className="bg-blue-600 text-white w-full py-3 rounded disabled:opacity-50"
>
  {isSubmitting ? "Creating Account..." : "Register"}
</button>
    </form>
  );
}