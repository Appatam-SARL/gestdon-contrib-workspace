import { useMutation, useQuery } from '@tanstack/react-query';

import { createAudience, getAudiences } from '@/api/audience.api'; // TODO: Verify this import path
import { IAudienceFilterForm } from '@/interface/audience'; // TODO: Verify this import path
import { FormCreateAudienceSchema } from '@/schema/audience.schema'; // TODO: Verify this import path

// TODO: Implement the actual useAudiences hook
export const useAudiences = (filters: IAudienceFilterForm) => {
  return useQuery({
    queryKey: ['audiences', filters], // TODO: Adjust query key as needed
    queryFn: () => getAudiences(filters),
    // Add other react-query options here (e.g., enabled, staleTime)
  });
};

// TODO: Implement the actual useCreateAudience hook
export const useCreateAudience = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (audienceData: FormCreateAudienceSchema) =>
      createAudience(audienceData), // TODO: Adjust mutationFn if needed
    onSuccess: () => {
      // TODO: Invalidate audiences query after successful creation
      // queryClient.invalidateQueries({ queryKey: ['audiences'] });
      onSuccessCallback?.();
    },
    // Add other react-query options here (e.g., onError)
  });
};
