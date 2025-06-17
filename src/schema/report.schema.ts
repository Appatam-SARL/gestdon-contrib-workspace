import { z } from 'zod';

export const createReportSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  commitments: z.object({
    action: z.string().min(1),
    responsible: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
    }),
    dueDate: z.string().min(1),
  }),
  documents: z.any().optional(),
});

export type FormCreateReportSchema = z.infer<typeof createReportSchema>;
