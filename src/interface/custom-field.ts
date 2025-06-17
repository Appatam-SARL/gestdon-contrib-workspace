import { FieldType } from '@/types/custom-field.types';

export interface ICustomFieldOption {
  _id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // Options are only relevant for select/radio types
  activityTypeId?: string;
}

export interface ICustomField {
  ownerId: string;
  form: string;
  fields: ICustomFieldOption[];
}
