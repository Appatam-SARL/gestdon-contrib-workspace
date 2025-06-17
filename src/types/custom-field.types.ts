import { z } from 'zod';

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  DATE: 'date',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export interface CustomField {
  _id?: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  activityTypeId?: string;
  beneficiaryTypeId?: string;
}

export const customFieldSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: 'Le nom est requis.' }),
  label: z.string().min(1, { message: 'Le libellé est requis.' }),
  type: z.enum(
    [
      FIELD_TYPES.TEXT,
      FIELD_TYPES.NUMBER,
      FIELD_TYPES.TEXTAREA,
      FIELD_TYPES.DATE,
      FIELD_TYPES.SELECT,
      FIELD_TYPES.RADIO,
      FIELD_TYPES.CHECKBOX,
    ],
    {
      required_error: 'Le type est requis.',
    }
  ),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  activityTypeId: z.string().optional(),
  beneficiaryTypeId: z.string().optional(),
});

export type CustomFieldFormData = z.infer<typeof customFieldSchema>;

export const DEFAULT_FORM_VALUES: Omit<CustomFieldFormData, '_id'> = {
  name: '',
  label: '',
  type: FIELD_TYPES.TEXT,
  required: false,
  options: [],
};
