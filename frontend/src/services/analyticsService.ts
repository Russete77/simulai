import { api } from '../lib/api';
import type {
  AnalyticsData,
  UserStats,
  SubjectPerformance,
  ActivityData,
  AnalyticsParams
} from '../types/api';

export class AnalyticsService {
  private static readonly BASE_PATH = '/api/v1/analytics';

  /**
   * Buscar visão geral das estatísticas do usuário
   */
  static async getOverview(params: AnalyticsParams = {}): Promise<AnalyticsData> {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.subject) queryParams.append('subject', params.subject);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/overview?${queryString}` : `${this.BASE_PATH}/overview`;

    return api.get<AnalyticsData>(url);
  }

  /**
   * Buscar estatísticas básicas do usuário
   */
  static async getUserStats(): Promise<UserStats> {
    return api.get<UserStats>(`${this.BASE_PATH}/user-stats`);
  }

  /**
   * Buscar performance por matéria
   */
  static async getSubjectPerformance(params: AnalyticsParams = {}): Promise<SubjectPerformance[]> {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/performance?${queryString}` : `${this.BASE_PATH}/performance`;

    return api.get<SubjectPerformance[]>(url);
  }

  /**
   * Buscar atividade recente do usuário
   */
  static async getRecentActivity(params: {
    period?: '7d' | '30d' | '90d';
    limit?: number;
  } = {}): Promise<ActivityData[]> {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/activity?${queryString}` : `${this.BASE_PATH}/activity`;

    return api.get<ActivityData[]>(url);
  }

  /**
   * Buscar ranking do usuário
   */
  static async getUserRanking(params: {
    scope?: 'global' | 'monthly' | 'weekly';
    subject?: string;
  } = {}): Promise<{
    position: number;
    total_users: number;
    score: number;
    percentile: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.scope) queryParams.append('scope', params.scope);
    if (params.subject) queryParams.append('subject', params.subject);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/ranking?${queryString}` : `${this.BASE_PATH}/ranking`;

    return api.get<{
      position: number;
      total_users: number;
      score: number;
      percentile: number;
    }>(url);
  }

  /**
   * Buscar estatísticas de tempo de estudo
   */
  static async getStudyTimeStats(params: {
    period?: '7d' | '30d' | '90d' | '1y';
  } = {}): Promise<{
    total_time: number;
    daily_average: number;
    streak_days: number;
    best_streak: number;
    study_sessions: {
      date: string;
      duration: number;
      questions_answered: number;
    }[];
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/study-time?${queryString}` : `${this.BASE_PATH}/study-time`;

    return api.get<{
      total_time: number;
      daily_average: number;
      streak_days: number;
      best_streak: number;
      study_sessions: {
        date: string;
        duration: number;
        questions_answered: number;
      }[];
    }>(url);
  }

  /**
   * Buscar progresso ao longo do tempo
   */
  static async getProgressOverTime(params: {
    period?: '30d' | '90d' | '1y';
    metric?: 'accuracy' | 'speed' | 'questions_per_day';
  } = {}): Promise<{
    date: string;
    value: number;
  }[]> {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.metric) queryParams.append('metric', params.metric);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/progress?${queryString}` : `${this.BASE_PATH}/progress`;

    return api.get<{
      date: string;
      value: number;
    }[]>(url);
  }

  /**
   * Buscar comparação com outros usuários
   */
  static async getComparison(params: {
    subject?: string;
    period?: '30d' | '90d' | '1y';
  } = {}): Promise<{
    user_performance: {
      accuracy: number;
      questions_answered: number;
      study_time: number;
    };
    average_performance: {
      accuracy: number;
      questions_answered: number;
      study_time: number;
    };
    percentile_rank: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.period) queryParams.append('period', params.period);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/comparison?${queryString}` : `${this.BASE_PATH}/comparison`;

    return api.get<{
      user_performance: {
        accuracy: number;
        questions_answered: number;
        study_time: number;
      };
      average_performance: {
        accuracy: number;
        questions_answered: number;
        study_time: number;
      };
      percentile_rank: number;
    }>(url);
  }
}
