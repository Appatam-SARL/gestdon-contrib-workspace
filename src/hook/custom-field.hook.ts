import CustomFieldApi from '@/api/custom-field.api';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetCustomFieldsFromForm(form: string) {
  return useQuery({
    queryKey: ['custom-fields', form],
    queryFn: () => CustomFieldApi.getCustomFields(form),
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
    mutationFn: (id: string) => CustomFieldApi.deleteCustomField(id),
  });
}
