import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../../services/analyticsService';

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (period: string) => [...analyticsKeys.all, 'overview', period] as const,
  userStats: () => [...analyticsKeys.all, 'user-stats'] as const,
  subjectPerformance: (period: string) => [...analyticsKeys.all, 'subject-performance', period] as const,
  recentActivity: (params: { period?: string; limit?: number }) => 
    [...analyticsKeys.all, 'recent-activity', params] as const,
  ranking: (params: { scope?: string; subject?: string }) => 
    [...analyticsKeys.all, 'ranking', params] as const,
  studyTime: (period: string) => [...analyticsKeys.all, 'study-time', period] as const,
  comparison: (params: { period?: string; subject?: string }) => 
    [...analyticsKeys.all, 'comparison', params] as const,
};

// Hook para buscar visão geral das estatísticas
export function useAnalyticsOverview(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: analyticsKeys.overview(period),
    queryFn: () => AnalyticsService.getOverview({ period }),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar estatísticas do usuário
export function useUserStats() {
  return useQuery({
    queryKey: analyticsKeys.userStats(),
    queryFn: () => AnalyticsService.getUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para buscar performance por matéria
export function useSubjectPerformance(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: analyticsKeys.subjectPerformance(period),
    queryFn: () => AnalyticsService.getSubjectPerformance({ period }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para buscar atividade recente
export function useRecentActivity(params: { 
  period?: '7d' | '30d' | '90d'; 
  limit?: number 
} = { period: '7d' }) {
  return useQuery({
    queryKey: analyticsKeys.recentActivity(params),
    queryFn: () => AnalyticsService.getRecentActivity(params),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar ranking
export function useRanking(params: { 
  scope?: 'global' | 'monthly' | 'weekly'; 
  subject?: string; 
} = {}) {
  return useQuery({
    queryKey: analyticsKeys.ranking(params),
    queryFn: () => AnalyticsService.getUserRanking(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para buscar tempo de estudo
export function useStudyTime(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: analyticsKeys.studyTime(period),
    queryFn: () => AnalyticsService.getStudyTimeStats({ period }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para buscar comparações
export function useComparison(params: { 
  period?: '30d' | '90d' | '1y'; 
  subject?: string; 
}) {
  return useQuery({
    queryKey: analyticsKeys.comparison(params),
    queryFn: () => AnalyticsService.getComparison(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook combinado para dashboard analytics
export function useDashboardAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  const overview = useAnalyticsOverview(period);
  const userStats = useUserStats();
  const subjectPerformance = useSubjectPerformance(period);
  const recentActivity = useRecentActivity({ period: '7d', limit: 10 });
  const ranking = useRanking({});

  return {
    overview,
    userStats,
    subjectPerformance,
    recentActivity,
    ranking,
    isLoading: overview.isLoading || userStats.isLoading || subjectPerformance.isLoading,
    isError: overview.isError || userStats.isError || subjectPerformance.isError,
    error: overview.error || userStats.error || subjectPerformance.error,
  };
}
