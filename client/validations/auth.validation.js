import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  photo: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[a-z]/, "Password must contain one lowercase letter")
    .regex(/[0-9]/, "Password must contain one number"),

  role: z.enum(["candidate", "recruiter"], {
    errorMap: () => ({
      message: "Please select a role",
    }),
  }),
});