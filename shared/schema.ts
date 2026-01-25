import { pgTable, text, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === DOMAIN TYPES for Client-Side Logic ===

export const UserTypes = ["Freelancers & Self-Employed", "Salary Earner", "Business Owner", "Mixed Income", "Company Owner", "NGO/Charity"] as const;
export const IncomeSources = ["Local", "Foreign", "Mixed"] as const;
export const Locations = ["Lagos", "Abuja", "Other State"] as const;

// Input Schema for Tax Classifier
export const taxProfileSchema = z.object({
  userType: z.enum(UserTypes, { required_error: "Please select your user type" }),
  incomeSource: z.enum(IncomeSources, { required_error: "Please select your income source" }),
  location: z.enum(Locations, { required_error: "Please select your location" }),
});

export type TaxProfile = z.infer<typeof taxProfileSchema>;

// Input Schema for Self-Assessment
export const assessmentSchema = z.object({
  hasTIN: z.boolean().default(false),
  keepsRecords: z.boolean().default(false),
  filedLastYear: z.boolean().default(false),
  understandsDeductions: z.boolean().default(false),
  separatesBusinessPersonal: z.boolean().default(false),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;

// Static Content Types
export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown supported
  category: "PIT" | "VAT" | "General" | "WHT";
}

export interface ChecklistItem {
  id: string;
  text: string;
  requiredFor: typeof UserTypes[number][];
}

// === DATABASE SCHEMA (Minimal boilerplate) ===
// We are not persisting user data, but the template requires a schema.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
});
