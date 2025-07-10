import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SimuladoDisponivel, SimuladoRealizado, SubmitSimulationRequest, SubmitSimulationResponse } from '../types/api';

// Query Keys
export const simuladosKeys = {
  all: ['simulados'] as const,
  available: () => [...simuladosKeys.all, 'available'] as const,
  completed: () => [...simuladosKeys.all, 'completed'] as const,
  detail: (id: number) => [...simuladosKeys.all, 'detail', id] as const,
};

// Hook para buscar simulados disponíveis
export const useAvailableSimulados = () => {
  return useQuery({
    queryKey: simuladosKeys.available(),
    queryFn: async (): Promise<SimuladoDisponivel[]> => {
      const response = await api.get<SimuladoDisponivel[]>('/api/v1/simulations/available');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar simulados realizados
export const useCompletedSimulados = () => {
  return useQuery({
    queryKey: simuladosKeys.completed(),
    queryFn: async (): Promise<SimuladoRealizado[]> => {
      const response = await api.get<SimuladoRealizado[]>('/api/v1/simulations/completed');
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar detalhes de um simulado
export const useSimuladoDetail = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: simuladosKeys.detail(id),
    queryFn: async (): Promise<SimuladoDisponivel> => {
      const response = await api.get<SimuladoDisponivel>(`/api/v1/simulations/${id}`);
      return response;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para iniciar um simulado
export const useStartSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { simulationId: number }): Promise<{ success: boolean; message: string }> => {
      const response = await api.post<{ success: boolean; message: string }>(`/api/v1/simulations/${request.simulationId}/start`, {});
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidar cache dos simulados disponíveis
      queryClient.invalidateQueries({ queryKey: simuladosKeys.available() });
      
      // Atualizar cache do simulado específico se necessário
      queryClient.setQueryData(
        simuladosKeys.detail(variables.simulationId),
        (oldData: SimuladoDisponivel | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              participantes: oldData.participantes + 1
            };
          }
          return oldData;
        }
      );
    },
  });
};

// Hook para submeter respostas do simulado
export const useSubmitSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SubmitSimulationRequest): Promise<SubmitSimulationResponse> => {
      const response = await api.post<SubmitSimulationResponse>('/api/v1/simulations/submit', request);
      return response;
    },
    onSuccess: () => {
      // Invalidar cache dos simulados realizados para mostrar o novo resultado
      queryClient.invalidateQueries({ queryKey: simuladosKeys.completed() });
      
      // Invalidar cache dos simulados disponíveis (pode afetar estatísticas)
      queryClient.invalidateQueries({ queryKey: simuladosKeys.available() });
    },
  });
};

// Hook para dados mockados (temporário até backend estar pronto)
export const useMockSimuladosData = () => {
  const simuladosDisponiveis: SimuladoDisponivel[] = [
    {
      id: 1,
      titulo: 'Simulado OAB XXXVII - 1ª Fase',
      tipo: 'Prova Real',
      questoes: 80,
      tempo: 300,
      disciplinas: ['Todas as disciplinas'],
      participantes: 2847,
      dificuldade: 'Oficial',
      status: 'Disponível',
      descricao: 'Simulado completo nos moldes da prova oficial da OAB'
    },
    {
      id: 2,
      titulo: 'Simulado Direito Constitucional',
      tipo: 'Customizado',
      questoes: 20,
      tempo: 60,
      disciplinas: ['Direito Constitucional'],
      participantes: 1523,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Foco em princípios constitucionais e direitos fundamentais'
    },
    {
      id: 3,
      titulo: 'Simulado 2ª Fase - Penal',
      tipo: 'Discursiva',
      questoes: 4,
      tempo: 300,
      disciplinas: ['Direito Penal', 'Processo Penal'],
      participantes: 892,
      dificuldade: 'Difícil',
      status: 'Disponível',
      descricao: 'Peças processuais e questões discursivas de direito penal'
    }
  ];

  const simuladosRealizados: SimuladoRealizado[] = [
    {
      id: 1,
      titulo: 'Simulado OAB XXXVI - 1ª Fase',
      dataRealizacao: '2024-01-15',
      nota: 68,
      acertos: 54,
      total: 80,
      tempo: 245,
      posicao: 127,
      totalParticipantes: 2156
    },
    {
      id: 2,
      titulo: 'Simulado Direito Civil',
      dataRealizacao: '2024-01-10',
      nota: 85,
      acertos: 17,
      total: 20,
      tempo: 45,
      posicao: 23,
      totalParticipantes: 1834
    }
  ];

  return {
    availableSimulados: {
      data: simuladosDisponiveis,
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve()
    },
    completedSimulados: {
      data: simuladosRealizados,
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve()
    }
  };
};
