import { z } from 'zod';

export const activitySchema = z.object({
  _id: z.number(),
  title: z.string(),
  locationOfActivity: z.string(),
  description: z.string(),
  contributorId: z.string(),
  activityTypeId: z.string(),
  customFields: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      state: z.string().optional(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const formActivitySchema = z.object({
  title: z
    .string()
    .nonempty('Ce champ est requis')
    .min(3, 'Minimum 3 caractères'),
  locationOfActivity: z
    .string()
    .nonempty('Ce champ est requis')
    .min(3, 'Minimum 3 caractères'),
  description: z
    .string()
    .nonempty('Ce champ est requis')
    .min(10, 'Minimum 10 caractères'),
  activityTypeId: z.string().optional(),
  customFields: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      state: z.string().optional(),
    })
  ),
});

export const formActivityValidateSchema = z.object({
  startDate: z.string().nonempty('Ce champ est requis'),
  endDate: z.string().nonempty('Ce champ est requis'),
});

export const formAssignSchema = z.object({
  assigneeId: z.string().nonempty('Ce champ est requis'),
});

export const formRejectSchema = z.object({
  motif: z.string().nonempty('Ce champ est requis'),
});

export const formAssignRepresentative = z.object({
  representative: z.object({
    firstName: z.string().nonempty('Ce champ est requis'),
    lastName: z.string().nonempty('Ce champ est requis'),
    email: z.string().nonempty('Ce champ est requis'),
    phone: z.string().nonempty('Ce champ est requis'),
  }),
});

export type FormActivitySchema = z.infer<typeof formActivitySchema>;
export type FormValidateActivitySchema = z.infer<
  typeof formActivityValidateSchema
>;
export type FormActivityAssignByMemberSchema = z.infer<typeof formAssignSchema>;
export type FormRejectSchema = z.infer<typeof formRejectSchema>;
export type FormAssignRepresentativeSchema = z.infer<
  typeof formAssignRepresentative
>;
