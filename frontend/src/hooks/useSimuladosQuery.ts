import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { SimuladoDisponivel, SimuladoRealizado, PaginatedResponse } from '../types/api';

// Chaves para o React Query
const simuladosKeys = {
  all: ['simulados'] as const,
  available: (filters?: { page?: number; limit?: number }) => 
    [...simuladosKeys.all, 'available', filters] as const,
  completed: (filters?: { page?: number; limit?: number }) => 
    [...simuladosKeys.all, 'completed', filters] as const,
  detail: (id: number) => [...simuladosKeys.all, 'detail', id] as const,
};

// Hook para obter simulados disponíveis
export const useAvailableSimulados = ({
  page = 1,
  limit = 10,
  enabled = true
} = {}) => {
  return useQuery<PaginatedResponse<SimuladoDisponivel>>({
    queryKey: simuladosKeys.available({ page, limit }),
    queryFn: async () => {
      const response = await api.get('/api/v1/simulados/disponiveis', {
        params: { page, limit }
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    enabled,
    placeholderData: (previousData) => previousData // Mantém dados anteriores durante carregamento de nova página
  });
};

// Hook para obter simulados realizados pelo usuário
export const useCompletedSimulados = ({
  page = 1,
  limit = 10,
  enabled = true
} = {}) => {
  return useQuery<PaginatedResponse<SimuladoRealizado>>({
    queryKey: simuladosKeys.completed({ page, limit }),
    queryFn: async () => {
      const response = await api.get('/api/v1/simulados/realizados', {
        params: { page, limit }
      });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled,
    placeholderData: (previousData) => previousData // Mantém dados anteriores durante carregamento de nova página
  });
};

// Hook para buscar detalhes de um simulado
export const useSimuladoDetail = (id: number, enabled: boolean = true) => {
  return useQuery<SimuladoDisponivel>({
    queryKey: simuladosKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/api/v1/simulados/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para iniciar um simulado
export const useStartSimulation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ simulationId }: { simulationId: number }) => {
      const response = await api.post(`/api/v1/simulados/iniciar/${simulationId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries para forçar refetch
      queryClient.invalidateQueries({ queryKey: simuladosKeys.all });
    }
  });
};

// Hook para submeter respostas de um simulado
export const useSubmitSimulation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      simulationId, 
      answers, 
      timeSpent 
    }: { 
      simulationId: number; 
      answers: Record<string, string>; 
      timeSpent: number 
    }) => {
      const response = await api.post(`/api/v1/simulados/submeter`, {
        simulado_id: simulationId,
        respostas: answers,
        tempo_gasto: timeSpent
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries para forçar refetch
      queryClient.invalidateQueries({ queryKey: simuladosKeys.all });
    }
  });
};

// Hook para dados mockados (temporário até backend estar pronto)
export const useMockSimuladosData = ({
  availablePage = 1,
  availableLimit = 10,
  completedPage = 1,
  completedLimit = 10
} = {}) => {
  // Dados mockados expandidos para simular paginação
  const allSimuladosDisponiveis: SimuladoDisponivel[] = [
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
    },
    {
      id: 4,
      titulo: 'Simulado Direito Administrativo',
      tipo: 'Customizado',
      questoes: 25,
      tempo: 75,
      disciplinas: ['Direito Administrativo'],
      participantes: 1245,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Questões sobre princípios e atos administrativos'
    },
    {
      id: 5,
      titulo: 'Simulado Direito Tributário',
      tipo: 'Customizado',
      questoes: 20,
      tempo: 60,
      disciplinas: ['Direito Tributário'],
      participantes: 987,
      dificuldade: 'Difícil',
      status: 'Disponível',
      descricao: 'Foco em tributos federais e competências tributárias'
    },
    {
      id: 6,
      titulo: 'Simulado Direito do Trabalho',
      tipo: 'Customizado',
      questoes: 30,
      tempo: 90,
      disciplinas: ['Direito do Trabalho'],
      participantes: 1432,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Questões sobre CLT e reforma trabalhista'
    },
    {
      id: 7,
      titulo: 'Simulado Direito Civil Completo',
      tipo: 'Customizado',
      questoes: 40,
      tempo: 120,
      disciplinas: ['Direito Civil'],
      participantes: 1876,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Abrange todos os livros do Código Civil'
    },
    {
      id: 8,
      titulo: 'Simulado Direito Empresarial',
      tipo: 'Customizado',
      questoes: 20,
      tempo: 60,
      disciplinas: ['Direito Empresarial'],
      participantes: 765,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Foco em sociedades empresariais e títulos de crédito'
    },
    {
      id: 9,
      titulo: 'Simulado Ética Profissional',
      tipo: 'Customizado',
      questoes: 15,
      tempo: 45,
      disciplinas: ['Ética Profissional'],
      participantes: 2134,
      dificuldade: 'Fácil',
      status: 'Disponível',
      descricao: 'Questões sobre o Estatuto da OAB e Código de Ética'
    },
    {
      id: 10,
      titulo: 'Simulado Direito Processual Civil',
      tipo: 'Customizado',
      questoes: 30,
      tempo: 90,
      disciplinas: ['Direito Processual Civil'],
      participantes: 1342,
      dificuldade: 'Difícil',
      status: 'Disponível',
      descricao: 'Foco no novo CPC e procedimentos especiais'
    },
    {
      id: 11,
      titulo: 'Simulado Direito Processual Penal',
      tipo: 'Customizado',
      questoes: 25,
      tempo: 75,
      disciplinas: ['Direito Processual Penal'],
      participantes: 1021,
      dificuldade: 'Difícil',
      status: 'Disponível',
      descricao: 'Questões sobre inquérito policial e ação penal'
    },
    {
      id: 12,
      titulo: 'Simulado Direito Internacional',
      tipo: 'Customizado',
      questoes: 15,
      tempo: 45,
      disciplinas: ['Direito Internacional'],
      participantes: 543,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Foco em tratados internacionais e direito internacional privado'
    }
  ];

  const allSimuladosRealizados: SimuladoRealizado[] = [
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
    },
    {
      id: 3,
      titulo: 'Simulado Direito Penal',
      dataRealizacao: '2024-01-05',
      nota: 72,
      acertos: 18,
      total: 25,
      tempo: 62,
      posicao: 45,
      totalParticipantes: 1567
    },
    {
      id: 4,
      titulo: 'Simulado Direito Constitucional',
      dataRealizacao: '2023-12-28',
      nota: 90,
      acertos: 18,
      total: 20,
      tempo: 52,
      posicao: 12,
      totalParticipantes: 1923
    },
    {
      id: 5,
      titulo: 'Simulado Direito Administrativo',
      dataRealizacao: '2023-12-20',
      nota: 76,
      acertos: 19,
      total: 25,
      tempo: 68,
      posicao: 34,
      totalParticipantes: 1432
    },
    {
      id: 6,
      titulo: 'Simulado Ética Profissional',
      dataRealizacao: '2023-12-15',
      nota: 93,
      acertos: 14,
      total: 15,
      tempo: 32,
      posicao: 5,
      totalParticipantes: 2134
    },
    {
      id: 7,
      titulo: 'Simulado Direito Tributário',
      dataRealizacao: '2023-12-10',
      nota: 65,
      acertos: 13,
      total: 20,
      tempo: 58,
      posicao: 78,
      totalParticipantes: 1245
    },
    {
      id: 8,
      titulo: 'Simulado Direito do Trabalho',
      dataRealizacao: '2023-12-05',
      nota: 80,
      acertos: 24,
      total: 30,
      tempo: 82,
      posicao: 32,
      totalParticipantes: 1678
    }
  ];

  // Calcular paginação para simulados disponíveis
  const startAvailable = (availablePage - 1) * availableLimit;
  const endAvailable = startAvailable + availableLimit;
  const paginatedAvailable = allSimuladosDisponiveis.slice(startAvailable, endAvailable);
  
  // Calcular paginação para simulados realizados
  const startCompleted = (completedPage - 1) * completedLimit;
  const endCompleted = startCompleted + completedLimit;
  const paginatedCompleted = allSimuladosRealizados.slice(startCompleted, endCompleted);

  return {
    availableSimulados: {
      data: {
        data: paginatedAvailable,
        meta: {
          currentPage: availablePage,
          totalPages: Math.ceil(allSimuladosDisponiveis.length / availableLimit),
          totalItems: allSimuladosDisponiveis.length,
          itemsPerPage: availableLimit,
          hasNextPage: endAvailable < allSimuladosDisponiveis.length,
          hasPrevPage: availablePage > 1
        }
      },
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve()
    },
    completedSimulados: {
      data: {
        data: paginatedCompleted,
        meta: {
          currentPage: completedPage,
          totalPages: Math.ceil(allSimuladosRealizados.length / completedLimit),
          totalItems: allSimuladosRealizados.length,
          itemsPerPage: completedLimit,
          hasNextPage: endCompleted < allSimuladosRealizados.length,
          hasPrevPage: completedPage > 1
        }
      },
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve()
    }
  };
};
