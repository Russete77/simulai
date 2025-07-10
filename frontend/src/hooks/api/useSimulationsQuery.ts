import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SimulationsService } from '../../services/simulationsService';
import type { 
  CreateSimulationRequest,
  StartSimulationRequest,
  SaveProgressRequest
} from '../../types/api';

// Query Keys
export const simulationsKeys = {
  all: ['simulations'] as const,
  lists: () => [...simulationsKeys.all, 'list'] as const,
  list: (filters: { status?: string; limit?: number; offset?: number }) => 
    [...simulationsKeys.lists(), filters] as const,
  details: () => [...simulationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...simulationsKeys.details(), id] as const,
  templates: () => [...simulationsKeys.all, 'templates'] as const,
  active: () => [...simulationsKeys.all, 'active'] as const,
};

// Hook para buscar simulações do usuário
export function useSimulations(filters: { 
  status?: 'pending' | 'in_progress' | 'completed'; 
  limit?: number; 
  offset?: number 
} = {}) {
  return useQuery({
    queryKey: simulationsKeys.list(filters),
    queryFn: () => SimulationsService.getSimulations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar uma simulação específica
export function useSimulation(id: string) {
  return useQuery({
    queryKey: simulationsKeys.detail(id),
    queryFn: () => SimulationsService.getSimulation(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 segundos (dados podem mudar durante simulação)
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar templates de simulação
export function useSimulationTemplates() {
  return useQuery({
    queryKey: simulationsKeys.templates(),
    queryFn: () => SimulationsService.getSimulationTemplates(),
    staleTime: 30 * 60 * 1000, // 30 minutos (templates raramente mudam)
    gcTime: 60 * 60 * 1000, // 1 hora
  });
}

// Hook para buscar simulação ativa
export function useActiveSimulation() {
  return useQuery({
    queryKey: simulationsKeys.active(),
    queryFn: () => SimulationsService.getActiveSimulation(),
    staleTime: 10 * 1000, // 10 segundos
    gcTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 30 * 1000, // Refetch a cada 30 segundos se há simulação ativa
  });
}

// Mutation para criar simulação
export function useCreateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSimulationRequest) => 
      SimulationsService.createSimulation(data),
    onSuccess: () => {
      // Invalidar lista de simulações
      queryClient.invalidateQueries({ queryKey: simulationsKeys.lists() });
    },
  });
}

// Mutation para iniciar simulação
export function useStartSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: StartSimulationRequest & { id: string }) => 
      SimulationsService.startSimulation(id, data),
    onSuccess: (_, variables) => {
      // Invalidar simulação específica e simulação ativa
      queryClient.invalidateQueries({ queryKey: simulationsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.active() });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.lists() });
    },
  });
}

// Mutation para submeter resposta
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, question_id, selected_option }: { 
      id: string; 
      question_id: string; 
      selected_option: number; 
    }) => 
      SimulationsService.submitAnswer(id, { question_id, selected_option }),
    onSuccess: (_, variables) => {
      // Invalidar simulação específica
      queryClient.invalidateQueries({ queryKey: simulationsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.active() });
    },
  });
}

// Mutation para pausar simulação
export function usePauseSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SimulationsService.pauseSimulation(id),
    onSuccess: (_, id) => {
      // Invalidar simulação específica e ativa
      queryClient.invalidateQueries({ queryKey: simulationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.active() });
    },
  });
}

// Mutation para retomar simulação
export function useResumeSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SimulationsService.resumeSimulation(id),
    onSuccess: (_, id) => {
      // Invalidar simulação específica e ativa
      queryClient.invalidateQueries({ queryKey: simulationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.active() });
    },
  });
}

// Mutation para salvar progresso
export function useSaveProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveProgressRequest & { id: string }) => {
      const { id, ...progressData } = data;
      return SimulationsService.saveProgress(id, progressData);
    },
    onSuccess: (_, variables) => {
      // Invalidar simulação específica
      queryClient.invalidateQueries({ queryKey: simulationsKeys.detail(variables.id) });
    },
  });
}

// Mutation para finalizar simulação
export function useFinishSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SimulationsService.finishSimulation(id),
    onSuccess: (_, id) => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: simulationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.active() });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.lists() });
    },
  });
}

// Mutation para deletar simulação
export function useDeleteSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SimulationsService.deleteSimulation(id),
    onSuccess: (_, id) => {
      // Remover do cache e invalidar listas
      queryClient.removeQueries({ queryKey: simulationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: simulationsKeys.active() });
    },
  });
}

// Hook combinado para página de simulações
export function useSimulationsPage() {
  const simulations = useSimulations({ limit: 20 });
  const templates = useSimulationTemplates();
  const activeSimulation = useActiveSimulation();

  return {
    simulations,
    templates,
    activeSimulation,
    isLoading: simulations.isLoading || templates.isLoading,
    isError: simulations.isError || templates.isError,
    error: simulations.error || templates.error,
  };
}
