import BeneficiaryTypeApi from '@/api/beneficiary-type.api';
import { IBeneficiaryTypeForm } from '@/interface/beneficiary-type';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetBeneficiaryType = () => {
  return useQuery({
    queryKey: ['beneficiary-type'],
    queryFn: () => BeneficiaryTypeApi.getBeneficiaryTypes(),
  });
};

export const useCreateBeneficiaryType = () => {
  return useMutation({
    mutationFn: (data: IBeneficiaryTypeForm) =>
      BeneficiaryTypeApi.createBeneficiaryType(data),
  });
};

export const useUpdateBeneficiaryType = () => {
  return useMutation({
    mutationFn: (data: IBeneficiaryTypeForm) =>
      BeneficiaryTypeApi.updateBeneficiaryType(data),
  });
};

export const useDeleteBeneficiaryType = () => {
  return useMutation({
    mutationFn: (id: string) => BeneficiaryTypeApi.deleteBeneficiaryType(id),
  });
};
