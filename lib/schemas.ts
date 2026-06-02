import { z } from "zod";

// Base Profile Schema with Common Fields
export const BaseProfileSchema = z.object({
  id: z.string().optional(),
  organizationName: z.string().min(2, "Organization name is required").trim(),
  organizationType: z.enum(["Institution", "Hospital"]),
  location: z.string().min(2, "Location/Address is required").trim(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  contactNumber: z.string().min(5, "Contact number is required").trim(),
  website: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
});

// Institution specific fields
export const InstitutionProfileSchema = BaseProfileSchema.extend({
  organizationType: z.literal("Institution"),
  headOfInstitution: z.string().min(2, "Head of Institution is required"),
  numberOfStudents: z.coerce.number().min(0).optional(),
});

// Hospital specific fields
export const HospitalProfileSchema = BaseProfileSchema.extend({
  organizationType: z.literal("Hospital"),
  numberOfBeds: z.coerce.number().min(0).optional(),
  specializations: z.string().optional(),
  medicalSuperintendent: z.string().min(2, "Medical Superintendent is required"),
});

// Discriminated union for generic usage
export const OrganizationProfileSchema = z.discriminatedUnion("organizationType", [
  InstitutionProfileSchema,
  HospitalProfileSchema,
]);

export type BaseProfile = z.infer<typeof BaseProfileSchema>;
export type InstitutionProfile = z.infer<typeof InstitutionProfileSchema>;
export type HospitalProfile = z.infer<typeof HospitalProfileSchema>;
export type OrganizationProfile = z.infer<typeof OrganizationProfileSchema>;
