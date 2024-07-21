import { z } from "zod";

export const RoleSchema = z.object({
  id: z.number(),
  jobTitle: z.string(),
  location: z.string(),
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]).nullable().optional(),
  responsibilities: z.array(z.string()).optional(),
});

export const ExperienceSchema = z.object({
  id: z.number(),
  companyName: z.string(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  roles: z.array(RoleSchema).optional(),
});

export type ExperienceSchema = z.infer<typeof ExperienceSchema>;

export const PrintConfigContent = z.object({
  experienceId: z.string(),
  rolesIds: z.array(z.string()),
});

export type PrintConfigContent = z.infer<typeof PrintConfigContent>;

export const PrintConfig = z.object({
  pages: z
    .object({
      number: z.number(),
      availableHeight: z.number(),
      availableWidth: z.number(),
      contents: z.array(PrintConfigContent),
    })
    .array(),
});

export type PrintConfig = z.infer<typeof PrintConfig>;

export const ResumeSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  jobTitle: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().email(),
  websiteUrl: z.string().url().nullable(),
  githubUrl: z.string().url().nullable(),
  twitterUrl: z.string().url().nullable(),
  linkedinUrl: z.string().url().nullable(),
  introduction: z.string(),
  buzzwords: z.string(),
  experiences: z.array(ExperienceSchema),
  printConfig: PrintConfig.optional().nullable(),
  createdAt: z.union([z.date(), z.string()]),
});

export const ResumeHeaderSchema = z.object({
  fullName: z.string(),
  jobTitle: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  websiteUrl: z.string().url(),
  githubUrl: z.string().url(),
  twitterUrl: z.string().url(),
  linkedinUrl: z.string().url(),
});

export const IntroAndBuzzwordsSchema = z.object({
  introduction: z.string(),
  buzzwords: z.array(z.string()),
});

export const ExperienceSectionSchema = z.object({
  resumeId: z.string(),
  experiences: z.array(ExperienceSchema),
});

export const AddWorkExperienceSchema = ExperienceSchema.extend({
  roles: z
    .array(RoleSchema.extend({ id: RoleSchema.shape.id.optional() }))
    .optional(),
}).omit({ id: true });

export type AddWorkExperienceSchema = z.infer<typeof AddWorkExperienceSchema>;

export const EditWorkExperienceSchema = ExperienceSchema.extend({
  roles: z
    .array(RoleSchema.extend({ id: RoleSchema.shape.id.optional() }))
    .optional(),
}).omit({ id: true });

export type EditWorkExperienceSchema = z.infer<typeof EditWorkExperienceSchema>;

// Inferred types
export type Role = z.infer<typeof RoleSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type ResumeHeaderProps = z.infer<typeof ResumeHeaderSchema>;
export type IntroAndBuzzwordsProps = z.infer<typeof IntroAndBuzzwordsSchema>;
export type ExperienceSectionProps = z.infer<typeof ExperienceSectionSchema> & {
  onAddExperience: (experience: AddWorkExperienceSchema) => void;
  onEditExperience: (experienceId: number) => void;
};
export type AddWorkExperienceModalProps = z.infer<
  typeof AddWorkExperienceSchema
>;
export type EditWorkExperienceModalProps = z.infer<
  typeof EditWorkExperienceSchema
>;
