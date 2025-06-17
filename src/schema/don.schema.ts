import z from 'zod';

export const createDonSchema = z.object({
  beneficiaire: z.string(),
  montant: z.string(),
  devise: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const donSchema = z.object({
  _id: z.string(),
  beneficiaire: z.string(),
  montant: z.number(),
  devise: z.string(),
  dateDon: z.date(),
  contributorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type FormDonValues = z.infer<typeof donSchema>;
export type FormCreateDonSchema = z.infer<typeof createDonSchema>;
