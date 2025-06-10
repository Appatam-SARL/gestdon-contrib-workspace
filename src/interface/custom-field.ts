interface ICustomFieldOption {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[]; // Options are only relevant for select/radio types
}

interface ICustomField {
  ownerId: string;
  form: string;
  fields: ICustomFieldOption[];
}
