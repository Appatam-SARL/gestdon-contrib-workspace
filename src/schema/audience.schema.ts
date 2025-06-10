import { z } from 'zod';

// TODO: Define the actual schema for creating an audience
export const createAudienceSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  // Add other fields for audience creation
});

export type FormCreateAudienceSchema = z.infer<typeof createAudienceSchema>;
