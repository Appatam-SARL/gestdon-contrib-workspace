import { z } from 'zod';

// TODO: Define the actual schema for creating an audience
export const createAudienceSchema = z.object({
  beneficiaryId: z
    .string()
    .nonempty('Le beneficiaire du don est requis')
    .min(1, 'Le bénéficiaire est requis'),
  locationOfActivity: z
    .string()
    .nonempty("Le lieu de l'activité est requis")
    .min(1, "Le lieu de l'activité est requis"),
  title: z
    .string()
    .nonempty('Le titre est requis')
    .min(1, 'Le titre est requis'),
  description: z
    .string()
    .nonempty('La description est requise')
    .min(1, 'La description est requise'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const representativeSchema = z.object({
  representative: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
});

export const updateAudienceSchema = z.object({
  beneficiaryId: z.string().min(1, 'Le bénéficiaire est requis').optional(),
  locationOfActivity: z
    .string()
    .nonempty("Le lieu de l'activité est requis")
    .min(1, "Le lieu de l'activité est requis")
    .optional(),
  title: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().min(1, 'La description est requise').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const reportAudienceSchema = z.object({
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
});

export const formValidateAudienceSchema = z.object({
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
});

export const formRejectedAudienceSchema = z.object({
  motif: z
    .string()
    .nonempty('Le champs motif est requis')
    .min(1, 'Le motif est requis'),
});

export const formAssignAudienceSchema = z.object({
  assigneeId: z
    .string()
    .nonempty("L'ID de la personne qui est assignée à l'audience est requis")
    .min(1, 'Le bénéficiaire est requis')
    .optional(),
});

export type FormCreateAudienceSchema = z.infer<typeof createAudienceSchema>;
export type FormUpdateAudienceSchema = z.infer<typeof updateAudienceSchema>;
export type FormReportAudienceSchema = z.infer<typeof reportAudienceSchema>;
export type FormValidateAudienceSchema = z.infer<
  typeof formValidateAudienceSchema
>;
export type FormRejectedAudienceSchema = z.infer<
  typeof formRejectedAudienceSchema
>;
export type FormAssignAudienceSchema = z.infer<typeof formAssignAudienceSchema>;
export type FormRepresentantAudienceSchema = z.infer<
  typeof representativeSchema
>;
