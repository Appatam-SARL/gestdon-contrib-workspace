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

const representantBeneficiaireSchema = z.object({
  firstName: z
    .string()
    .nonempty('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .nonempty('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .nonempty('Le numéro de téléphone est requis')
    .min(2, 'Le numéro de téléphone doit contenir au moins 2 caractères'),
  address: z.object({
    country: z
      .string()
      .nonempty('Le pays est requis')
      .min(2, 'Le pays doit contenir au moins 2 caractères'),
    street: z
      .string()
      .nonempty('La rue est requise')
      .min(2, 'La rue doit contenir au moins 2 caractères'),
    postalCode: z
      .string()
      .nonempty('Le code postal est requis')
      .min(2, 'Le code postal doit contenir au moins 2 caractères'),
    city: z
      .string()
      .nonempty('La ville est requise')
      .min(2, 'La ville doit contenir au moins 2 caractères'),
  }),
});

export const formBeneficiarySchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z
    .string()
    .nonempty('Le type est requis')
    .min(2, 'Le type doit contenir au moins 2 caractères'),
  description: z
    .string()
    .min(2, 'La description doit contenir au moins 2 caractères'),
  representant: representantBeneficiaireSchema,
});

export const formUpdateBeneficiarySchema = z.object({
  fullName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .optional(),
  type: z
    .string()
    .min(2, 'Le type doit contenir au moins 2 caractères')
    .nonempty('Le type est obligatoire'),
  description: z
    .string()
    .min(2, 'La description doit contenir au moins 2 caractères')
    .optional(),
  contributorId: z.string().optional(),
});

export const formAddRepresentantBeneficiarySchema = z.object({
  firstName: z
    .string()
    .nonempty('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .nonempty('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .nonempty('Le numéro de téléphone est requis')
    .min(2, 'Le numéro de téléphone doit contenir au moins 2 caractères'),
  address: z.object({
    country: z
      .string()
      .nonempty('Le pays est requis')
      .min(2, 'Le pays doit contenir au moins 2 caractères'),
    street: z
      .string()
      .nonempty('La rue est requise')
      .min(2, 'La rue doit contenir au moins 2 caractères'),
    postalCode: z
      .string()
      .nonempty('Le code postal est requis')
      .min(2, 'Le code postal doit contenir au moins 2 caractères'),
    city: z
      .string()
      .nonempty('La ville est requise')
      .min(2, 'La ville doit contenir au moins 2 caractères'),
  }),
});

export const formUpdateRepresentantBeneficiarySchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.object({
    country: z.string(),
    street: z.string(),
    postalCode: z.string(),
    city: z.string(),
  }),
});

export type FormBeneficiaryValues = z.infer<typeof formBeneficiarySchema>;
export type BeneficiarySchema = z.infer<typeof beneficiarySchema>;
export type FormUpdateNameBeneficiarySchemaValue = z.infer<
  typeof formUpdateBeneficiarySchema
>;
export type FormAddRepresentantBeneficiarySchemaValue = z.infer<
  typeof formAddRepresentantBeneficiarySchema
>;
export type FormUpdateRepresentantBeneficiarySchemaValue = z.infer<
  typeof formUpdateRepresentantBeneficiarySchema
>;
