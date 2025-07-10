import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionsService } from '../../services/questionsService';
import type { 
  QuestionsFilters, 
  AnswerQuestionRequest,
  Question 
} from '../../types/api';

// Query Keys
export const questionsKeys = {
  all: ['questions'] as const,
  lists: () => [...questionsKeys.all, 'list'] as const,
  list: (filters: QuestionsFilters) => [...questionsKeys.lists(), filters] as const,
  details: () => [...questionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionsKeys.details(), id] as const,
  subjects: () => [...questionsKeys.all, 'subjects'] as const,
  random: (filters: QuestionsFilters) => [...questionsKeys.all, 'random', filters] as const,
  favorites: () => [...questionsKeys.all, 'favorites'] as const,
  answers: (filters: { question_id?: string; limit?: number; offset?: number }) => 
    [...questionsKeys.all, 'answers', filters] as const,
};

// Hook para buscar questões com filtros
export function useQuestions(filters: QuestionsFilters = {}) {
  return useQuery({
    queryKey: questionsKeys.list(filters),
    queryFn: () => QuestionsService.getQuestions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar uma questão específica
export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionsKeys.detail(id),
    queryFn: () => QuestionsService.getQuestion(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar matérias disponíveis
export function useSubjects() {
  return useQuery({
    queryKey: questionsKeys.subjects(),
    queryFn: () => QuestionsService.getSubjects(),
    staleTime: 30 * 60 * 1000, // 30 minutos (dados raramente mudam)
  });
}

// Hook para buscar questões aleatórias
export function useRandomQuestions(filters: QuestionsFilters = {}) {
  return useQuery({
    queryKey: questionsKeys.random(filters),
    queryFn: () => QuestionsService.getRandomQuestions(filters),
    staleTime: 0, // Sempre buscar novas questões aleatórias
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar questões favoritas
export function useFavoriteQuestions() {
  return useQuery({
    queryKey: questionsKeys.favorites(),
    queryFn: () => QuestionsService.getFavoriteQuestions(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para buscar histórico de respostas
export function useAnswerHistory(filters: { 
  question_id?: string; 
  limit?: number; 
  offset?: number 
} = {}) {
  return useQuery({
    queryKey: questionsKeys.answers(filters),
    queryFn: () => QuestionsService.getAnswerHistory(filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

// Mutation para responder questão
export function useAnswerQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnswerQuestionRequest) => 
      QuestionsService.answerQuestion(data),
    onSuccess: (response, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: questionsKeys.answers({}) });
      queryClient.invalidateQueries({ queryKey: questionsKeys.detail(variables.question_id) });
      
      // Atualizar cache da questão com a resposta
      queryClient.setQueryData(
        questionsKeys.detail(variables.question_id),
        (oldData: Question | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              user_answer: variables.selected_option,
              is_correct: response.is_correct,
            };
          }
          return oldData;
        }
      );
    },
  });
}

// Mutation para adicionar/remover favorito
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, isFavorite }: { questionId: string; isFavorite: boolean }) => {
      return isFavorite 
        ? QuestionsService.addToFavorites(questionId)
        : QuestionsService.removeFromFavorites(questionId);
    },
    onSuccess: (_, variables) => {
      // Invalidar lista de favoritos
      queryClient.invalidateQueries({ queryKey: questionsKeys.favorites() });
      
      // Atualizar cache da questão
      queryClient.setQueryData(
        questionsKeys.detail(variables.questionId),
        (oldData: Question | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              is_favorite: variables.isFavorite,
            };
          }
          return oldData;
        }
      );
    },
  });
}

// Mutation para reportar problema
export function useReportProblem() {
  return useMutation({
    mutationFn: ({ questionId, reason, description }: {
      questionId: string;
      reason: string;
      description?: string;
    }) => QuestionsService.reportProblem(questionId, reason, description),
  });
}
