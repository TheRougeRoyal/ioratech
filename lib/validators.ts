import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100).optional(),
  company: z.string().max(100).optional(),
  job_title: z.string().max(100).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const EmissionSchema = z.object({
  scope: z.enum(["Scope 1", "Scope 2", "Scope 3"]),
  category: z.string().min(1, "Category is required").max(100),
  value: z.number({ message: "Value must be a number" }),
  unit: z.string().max(20).default("tCO2e"),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format").default(() => new Date().toISOString().slice(0, 7)),
});

export const ApiKeyCreateSchema = z.object({
  name: z.string().min(1, "API key name is required").max(100),
  description: z.string().max(255).optional(),
  expires_in_days: z.number().int().min(1).max(365).optional(),
  scopes: z.array(z.enum(["read", "write", "admin", "full_access"])).default(["read"]),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type EmissionInput = z.infer<typeof EmissionSchema>;
export type ApiKeyCreateInput = z.infer<typeof ApiKeyCreateSchema>;
