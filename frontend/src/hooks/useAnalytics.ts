import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AnalyticsService } from '../services/analyticsService';
import type { AnalyticsData } from '../types/api';

// Interface movida para types/api.ts

export function useAnalytics(period: string = '30d') {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    accuracyRate: 0,
    subjectPerformance: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      // Get total questions available
      const { count: totalQuestions } = await supabase
        .from('questoes')
        .select('*', { count: 'exact', head: true });

      // Get user answers with question details
      const { data: userAnswersWithQuestions, error: answersError } = await supabase
        .from('user_answers')
        .select(`
          *,
          questoes (
            subject,
            difficulty
          )
        `)
        .eq('user_id', user.id);

      if (answersError) throw answersError;

      const answeredQuestions = userAnswersWithQuestions?.length || 0;
      const correctAnswers = userAnswersWithQuestions?.filter(a => a.is_correct).length || 0;
      const accuracyRate = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

      // Calculate subject performance
      const subjectStats = new Map();
      userAnswersWithQuestions?.forEach(answer => {
        const subject = answer.questoes?.subject;
        if (!subject) return;

        if (!subjectStats.has(subject)) {
          subjectStats.set(subject, { total: 0, correct: 0 });
        }

        const stats = subjectStats.get(subject);
        stats.total += 1;
        if (answer.is_correct) {
          stats.correct += 1;
        }
      });

      const subjectPerformance = Array.from(subjectStats.entries()).map(([subject, stats]) => ({
        subject,
        total: stats.total,
        correct: stats.correct,
        accuracy: Math.round((stats.correct / stats.total) * 100)
      }));

      // Buscar atividade recente via API
      const recentActivity = await AnalyticsService.getRecentActivity({
        period: period === '7d' ? '7d' : period === '30d' ? '30d' : '90d',
        limit: 30
      });

      setAnalytics({
        totalQuestions: totalQuestions || 0,
        answeredQuestions,
        correctAnswers,
        accuracyRate,
        subjectPerformance,
        recentActivity
      });

    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
      setError('Erro ao carregar dados de análise');
    } finally {
      setLoading(false);
    }
  }, [user, period]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, period, loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: loadAnalytics
  };
}