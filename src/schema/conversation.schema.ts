import { z } from 'zod';

export const createConversationSchema = z.object({
  subject: z.string().nonempty('Veuillez saisir un sujet'),
});

export type FormCreateConversationSchema = z.infer<
  typeof createConversationSchema
>;
