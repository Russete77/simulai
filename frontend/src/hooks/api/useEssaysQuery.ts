import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EssaysService } from '../../services/essaysService';
import type { CorrectEssayRequest } from '../../types/api';

// Query Keys
export const essaysKeys = {
  all: ['essays'] as const,
  history: (params: { limit?: number; offset?: number; subject?: string }) => 
    [...essaysKeys.all, 'history', params] as const,
  details: () => [...essaysKeys.all, 'detail'] as const,
  detail: (id: string) => [...essaysKeys.details(), id] as const,
  drafts: (params: { limit?: number; offset?: number }) => 
    [...essaysKeys.all, 'drafts', params] as const,
  topics: (params: { subject?: string; difficulty?: string; year?: number }) => 
    [...essaysKeys.all, 'topics', params] as const,
  stats: () => [...essaysKeys.all, 'stats'] as const,
  examples: (params: { subject?: string; min_score?: number; limit?: number }) => 
    [...essaysKeys.all, 'examples', params] as const,
};

// Hook para buscar histórico de redações
export function useEssayHistory(params: { 
  limit?: number; 
  offset?: number; 
  subject?: string 
} = {}) {
  return useQuery({
    queryKey: essaysKeys.history(params),
    queryFn: () => EssaysService.getEssayHistory(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar uma redação específica
export function useEssay(id: string) {
  return useQuery({
    queryKey: essaysKeys.detail(id),
    queryFn: () => EssaysService.getEssay(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para buscar rascunhos
export function useDrafts(params: { 
  limit?: number; 
  offset?: number 
} = {}) {
  return useQuery({
    queryKey: essaysKeys.drafts(params),
    queryFn: () => EssaysService.getDrafts(params),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar temas de redação
export function useEssayTopics(params: { 
  subject?: string; 
  difficulty?: string; 
  year?: number 
} = {}) {
  return useQuery({
    queryKey: essaysKeys.topics(params),
    queryFn: () => EssaysService.getEssayTopics(params),
    staleTime: 30 * 60 * 1000, // 30 minutos (temas raramente mudam)
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

// Hook para buscar estatísticas de redações
export function useEssayStats() {
  return useQuery({
    queryKey: essaysKeys.stats(),
    queryFn: () => EssaysService.getEssayStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para buscar exemplos de redações
export function useEssayExamples(params: { 
  subject?: string; 
  min_score?: number; 
  limit?: number 
} = {}) {
  return useQuery({
    queryKey: essaysKeys.examples(params),
    queryFn: () => EssaysService.getExampleEssays(params),
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

// Mutation para corrigir redação
export function useCorrectEssay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CorrectEssayRequest) => 
      EssaysService.correctEssay(data),
    onSuccess: () => {
      // Invalidar histórico e estatísticas
      queryClient.invalidateQueries({ queryKey: essaysKeys.history({}) });
      queryClient.invalidateQueries({ queryKey: essaysKeys.stats() });
    },
  });
}

// Mutation para salvar rascunho
export function useSaveDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: {
      title: string;
      content: string;
      subject?: string;
    }) => EssaysService.saveDraft(draft),
    onSuccess: () => {
      // Invalidar lista de rascunhos
      queryClient.invalidateQueries({ queryKey: essaysKeys.drafts({}) });
    },
  });
}

// Mutation para deletar rascunho
export function useDeleteDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => EssaysService.deleteDraft(id),
    onSuccess: () => {
      // Invalidar lista de rascunhos
      queryClient.invalidateQueries({ queryKey: essaysKeys.drafts({}) });
    },
  });
}

// Mutation para solicitar nova correção
export function useRequestReCorrection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ essayId, notes }: { essayId: string; notes?: string }) => 
      EssaysService.requestReCorrection(essayId, notes),
    onSuccess: (_, variables) => {
      // Invalidar redação específica
      queryClient.invalidateQueries({ queryKey: essaysKeys.detail(variables.essayId) });
    },
  });
}

// Mutation para avaliar feedback
export function useRateFeedback() {
  return useMutation({
    mutationFn: ({ essayId, rating }: {
      essayId: string;
      rating: {
        helpfulness: number;
        accuracy: number;
        clarity: number;
        comments?: string;
      };
    }) => EssaysService.rateFeedback(essayId, rating),
  });
}

// Hook combinado para página de redações
export function useEssaysPage() {
  const history = useEssayHistory({ limit: 10 });
  const drafts = useDrafts({ limit: 5 });
  const topics = useEssayTopics();
  const stats = useEssayStats();

  return {
    history,
    drafts,
    topics,
    stats,
    isLoading: history.isLoading || topics.isLoading || stats.isLoading,
    isError: history.isError || topics.isError || stats.isError,
    error: history.error || topics.error || stats.error,
  };
}
