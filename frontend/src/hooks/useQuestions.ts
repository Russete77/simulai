import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

type Question = Database['public']['Tables']['questoes']['Row'];
type UserAnswer = Database['public']['Tables']['user_answers']['Row'];

interface UseQuestionsProps {
  filters?: {
    subject?: string;
    year?: number;
    difficulty?: string;
    status?: string;
  };
  searchTerm?: string;
  limit?: number;
}

export function useQuestions({ filters = {}, searchTerm = '', limit = 50 }: UseQuestionsProps = {}) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('questoes').select('*');
      
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.year) {
        query = query.eq('year', filters.year);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty.toUpperCase());
      }
      if (searchTerm) {
        query = query.ilike('statement', `%${searchTerm}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Erro ao carregar questões:', err);
      setError('Erro ao carregar questões');
    } finally {
      setLoading(false);
    }
  };

  const loadUserAnswers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setUserAnswers(data || []);
    } catch (err) {
      console.error('Erro ao carregar respostas:', err);
    }
  };

  const answerQuestion = async (questionId: string, selectedAnswer: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const question = questions.find(q => q.id === questionId);
    if (!question) throw new Error('Questão não encontrada');
    
    const isCorrect = selectedAnswer === question.correct_answer;
    
    const { error } = await supabase
      .from('user_answers')
      .upsert({
        user_id: user.id,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      });
    
    if (error) throw error;
    
    // Reload user answers
    await loadUserAnswers();
    
    return { isCorrect, correctAnswer: question.correct_answer };
  };

  const getUserAnswerForQuestion = (questionId: string) => {
    return userAnswers.find(answer => answer.question_id === questionId);
  };

  const getQuestionStatus = (questionId: string) => {
    const userAnswer = getUserAnswerForQuestion(questionId);
    if (!userAnswer) return 'nao_respondida';
    return userAnswer.is_correct ? 'acertou' : 'errou';
  };

  useEffect(() => {
    loadQuestions();
  }, [filters.subject, filters.year, filters.difficulty, searchTerm, limit]);

  useEffect(() => {
    if (user) {
      loadUserAnswers();
    }
  }, [user]);

  // Filter questions by status if needed
  const filteredQuestions = questions.filter(question => {
    if (filters.status) {
      const status = getQuestionStatus(question.id);
      return filters.status === status;
    }
    return true;
  });

  return {
    questions: filteredQuestions,
    userAnswers,
    loading,
    error,
    answerQuestion,
    getUserAnswerForQuestion,
    getQuestionStatus,
    refetch: loadQuestions
  };
}