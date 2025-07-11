import CustomFieldApi from '@/api/custom-field.api';
import { ICustomFieldFilterForm } from '@/interface/custom-field';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetCustomFieldsFromForm(
  form: string,
  ownerId: string,
  searchQuery?: string,
  page?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['custom-fields', form, searchQuery, page, limit],
    queryFn: () =>
      CustomFieldApi.getCustomFields(form, ownerId, searchQuery, page, limit),
  });
}

export function useGetCustomFieldsByActivityType(
  filter: ICustomFieldFilterForm
) {
  return useQuery({
    queryKey: ['custom-fields-by-type', ...Object.values(filter)],
    queryFn: () => CustomFieldApi.getCustomFieldsByActivityType(filter),
  });
}

export function useCreateCustomField() {
  return useMutation({
    mutationFn: (data: any) => CustomFieldApi.createCustomField(data),
  });
}

export function useUpdateCustomField() {
  return useMutation({
    mutationFn: (data: any) => CustomFieldApi.updateCustomField(data),
  });
}

export function useDeleteCustomField() {
  return useMutation({
    mutationFn: ({
      form,
      fieldId,
      data,
    }: {
      form: string;
      fieldId: string;
      data: { entityType: string; ownerId: string };
    }) => CustomFieldApi.deleteCustomField(form, fieldId, data),
  });
}
