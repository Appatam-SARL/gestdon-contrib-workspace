import { z } from 'zod';

// TODO: Define the actual schema for creating an audience
export const createAudienceSchema = z
  .object({
    beneficiaryId: z.string().min(1, 'Le bénéficiaire est requis'),
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().min(1, 'La description est requise'),
    type: z.enum(['normal', 'representative']), // Type of audience
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    representative: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'representative') {
      if (!data.representative?.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.firstName'],
          message: `Le prénom du représentant est requis pour ce type d'audience`,
        });
      }
      if (!data.representative?.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.lastName'],
          message: `Le nom du représentant est requis pour ce type d'audience`,
        });
      }
      if (!data.representative?.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.email'],
          message: `L'email du représentant est requis pour ce type d'audience`,
        });
      }
      if (!data.representative?.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.phone'],
          message: `Le téléphone du représentant est requis pour ce type d'audience`,
        });
      }
    }
  });

export const updateAudienceSchema = z
  .object({
    beneficiaryId: z.string().min(1, 'Le bénéficiaire est requis').optional(),
    title: z.string().min(1, 'Le titre est requis').optional(),
    description: z.string().min(1, 'La description est requise').optional(),
    type: z.enum(['normal', 'representative']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    representative: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email('Adresse email invalide').optional(),
        phone: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'representative') {
      if (!data.representative?.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.firstName'],
          message: `Le prénom du représentant est requis pour ce type d'audience`,
        });
      }
      if (!data.representative?.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.lastName'],
          message: `Le nom du représentant est requis pour ce type d'audience`,
        });
      }
      if (!data.representative?.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.email'],
          message: `L'email du représentant est requis pour ce type d'audience`,
        });
      }
      if (!data.representative?.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['representative.phone'],
          message: `Le téléphone du représentant est requis pour ce type d'audience`,
        });
      }
    }
  });

export const reportAudienceSchema = z.object({
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
});

export type FormCreateAudienceSchema = z.infer<typeof createAudienceSchema>;
export type FormUpdateAudienceSchema = z.infer<typeof updateAudienceSchema>;
export type FormReportAudienceSchema = z.infer<typeof reportAudienceSchema>;
