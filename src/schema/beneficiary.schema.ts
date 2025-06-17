import z from 'zod';

export const beneficiarySchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  description: z.string(),
  represetant: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    address: z.object({
      country: z.string(),
      street: z.string(),
      postalCode: z.string(),
      city: z.string(),
    }),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export const formBeneficiarySchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z
    .string()
    .min(2, 'La description doit contenir au moins 2 caractères'),
  representant: z.object({
    firstName: z
      .string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phone: z
      .string()
      .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères'),
    address: z.object({
      country: z
        .string()
        .min(2, 'Le nom du pays doit contenir au moins 2 caractères'),
      street: z
        .string()
        .min(2, 'Le nom de la rue doit contenir au moins 2 caractères'),
      postalCode: z
        .string()
        .min(2, 'Le code postal doit contenir au moins 2 caractères'),
      city: z
        .string()
        .min(2, 'Le nom de la ville doit contenir au moins 2 caractères'),
    }),
  }),
  contributorId: z.string(),
});

export const formUpdateBeneficiarySchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z
    .string()
    .min(2, 'La description doit contenir au moins 2 caractères'),
});

export const formUpdateRepresentantBeneficiarySchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères'),
  address: z.object({
    country: z
      .string()
      .min(2, 'Le nom du pays doit contenir au moins 2 caractères'),
    street: z
      .string()
      .min(2, 'Le nom de la rue doit contenir au moins 2 caractères'),
    postalCode: z
      .string()
      .min(2, 'Le code postal doit contenir au moins 2 caractères'),
    city: z
      .string()
      .min(2, 'Le nom de la ville doit contenir au moins 2 caractères'),
  }),
});

export type FormBeneficiaryValues = z.infer<typeof formBeneficiarySchema>;
export type BeneficiarySchema = z.infer<typeof beneficiarySchema>;
export type FormUpdateNameBeneficiarySchemaValue = z.infer<
  typeof formUpdateBeneficiarySchema
>;
export type FormUpdateRepresentantBeneficiarySchemaValue = z.infer<
  typeof formUpdateRepresentantBeneficiarySchema
>;
