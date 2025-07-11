import DashboardApi from '@/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = (filter: {
  period: string;
  contributorId: string;
}) => {
  return useQuery({
    queryKey: ['dashboard', ...Object.values(filter)],
    queryFn: () => DashboardApi.getDashboardStats(filter),
    enabled: !!filter.contributorId,
  });
};

export const useDashboardActivitiesByType = (filter: {
  period: string;
  contributorId: string;
}) => {
  return useQuery({
    queryKey: ['dashboard', 'activities-by-type', ...Object.values(filter)],
    queryFn: () => DashboardApi.getDashboardsActivitiesByType(filter),
    enabled: !!filter.contributorId,
  });
};

export const useDashboardBeneficiaryDistribution = (filter: {
  period: string;
  contributorId: string;
}) => {
  return useQuery({
    queryKey: [
      'dashboard',
      'beneficiary-distribution',
      ...Object.values(filter),
    ],
    queryFn: () => DashboardApi.getDashboardsByBeneficiary(filter),
    enabled: !!filter.contributorId,
  });
};
