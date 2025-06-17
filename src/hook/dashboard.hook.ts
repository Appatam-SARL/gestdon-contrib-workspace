import DashboardApi from '@/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = (filter: string) => {
  return useQuery({
    queryKey: ['dashboard', filter],
    queryFn: () => DashboardApi.getDashboardStats(filter),
    enabled: true,
  });
};

export const useDashboardActivitiesByType = (filter: string) => {
  return useQuery({
    queryKey: ['dashboard', 'activities-by-type', filter],
    queryFn: () => DashboardApi.getDashboardsActivitiesByType(filter),
    enabled: true,
  });
};

export const useDashboardBeneficiaryDistribution = (filter: string) => {
  return useQuery({
    queryKey: ['dashboard', 'beneficiary-distribution', filter],
    queryFn: () => DashboardApi.getDashboardsByBeneficiary(filter),
    enabled: true,
  });
};
