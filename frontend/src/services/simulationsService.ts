import { api } from '../lib/api';
import type {
  Simulation,
  CreateSimulationRequest,
  SubmitSimulationRequest,
  SaveProgressRequest,
  SimulationResult,
  PaginatedResponse
} from '../types/api';

export class SimulationsService {
  private static readonly BASE_PATH = '/api/v1/simulations';

  /**
   * Listar simulados do usuário
   */
  static async getSimulations(params: {
    status?: 'pending' | 'in_progress' | 'completed';
    limit?: number;
    offset?: number;
  } = {}): Promise<PaginatedResponse<Simulation>> {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

    return api.get<PaginatedResponse<Simulation>>(url);
  }

  /**
   * Buscar simulado específico
   */
  static async getSimulation(id: string): Promise<Simulation> {
    return api.get<Simulation>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Criar novo simulado
   */
  static async createSimulation(request: CreateSimulationRequest): Promise<Simulation> {
    return api.post<Simulation>(this.BASE_PATH, request);
  }

  /**
   * Iniciar um simulado (marcar como em progresso)
   */
  static async startSimulation(id: string): Promise<{
    simulation_id: string;
    started_at: string;
    time_limit: number;
  }> {
    return api.post<{
      simulation_id: string;
      started_at: string;
      time_limit: number;
    }>(`${this.BASE_PATH}/${id}/start`);
  }

  /**
   * Submeter respostas do simulado
   */
  static async submitSimulation(request: SubmitSimulationRequest): Promise<SimulationResult> {
    return api.post<SimulationResult>(
      `${this.BASE_PATH}/${request.simulation_id}/submit`,
      { answers: request.answers }
    );
  }

  /**
   * Buscar resultado de um simulado
   */
  static async getSimulationResult(id: string): Promise<SimulationResult> {
    return api.get<SimulationResult>(`${this.BASE_PATH}/${id}/results`);
  }

  /**
   * Pausar simulado em progresso
   */
  static async pauseSimulation(id: string): Promise<{
    simulation_id: string;
    paused_at: string;
    remaining_time: number;
  }> {
    return api.post<{
      simulation_id: string;
      paused_at: string;
      remaining_time: number;
    }>(`${this.BASE_PATH}/${id}/pause`);
  }

  /**
   * Retomar simulado pausado
   */
  static async resumeSimulation(id: string): Promise<{
    simulation_id: string;
    resumed_at: string;
    remaining_time: number;
  }> {
    return api.post<{
      simulation_id: string;
      resumed_at: string;
      remaining_time: number;
    }>(`${this.BASE_PATH}/${id}/resume`);
  }

  /**
   * Salvar progresso do simulado (respostas parciais)
   */
  static async saveProgress(id: string, data: SaveProgressRequest): Promise<{
    simulation_id: string;
    saved_at: string;
    progress_percentage: number;
  }> {
    return api.post<{
      simulation_id: string;
      saved_at: string;
      progress_percentage: number;
    }>(`${this.BASE_PATH}/${id}/progress`, data);
  }

  /**
   * Buscar progresso salvo de um simulado
   */
  static async getProgress(id: string): Promise<{
    simulation_id: string;
    answers: {
      question_id: string;
      selected_option?: number;
    }[];
    progress_percentage: number;
    last_saved_at: string;
  }> {
    return api.get<{
      simulation_id: string;
      answers: {
        question_id: string;
        selected_option?: number;
      }[];
      progress_percentage: number;
      last_saved_at: string;
    }>(`${this.BASE_PATH}/${id}/progress`);
  }

  /**
   * Deletar simulado
   */
  static async deleteSimulation(id: string): Promise<void> {
    return api.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Buscar templates de simulado disponíveis
   */
  static async getSimulationTemplates(): Promise<{
    id: string;
    name: string;
    description: string;
    question_count: number;
    time_limit: number;
    subjects: string[];
    difficulty: string;
  }[]> {
    return api.get<{
      id: string;
      name: string;
      description: string;
      question_count: number;
      time_limit: number;
      subjects: string[];
      difficulty: string;
    }[]>(`${this.BASE_PATH}/templates`);
  }

  /**
   * Criar simulado a partir de template
   */
  static async createFromTemplate(templateId: string, customizations?: {
    title?: string;
    question_count?: number;
    time_limit?: number;
  }): Promise<Simulation> {
    return api.post<Simulation>(`${this.BASE_PATH}/templates/${templateId}`, customizations);
  }

  /**
   * Buscar estatísticas gerais de simulados do usuário
   */
  static async getSimulationStats(): Promise<{
    total_simulations: number;
    completed_simulations: number;
    average_score: number;
    best_score: number;
    total_time_spent: number;
    subjects_performance: {
      subject: string;
      simulations_count: number;
      average_score: number;
    }[];
  }> {
    return api.get<{
      total_simulations: number;
      completed_simulations: number;
      average_score: number;
      best_score: number;
      total_time_spent: number;
      subjects_performance: {
        subject: string;
        simulations_count: number;
        average_score: number;
      }[];
    }>(`${this.BASE_PATH}/stats`);
  }

  /**
   * Buscar simulação ativa do usuário
   */
  static async getActiveSimulation(): Promise<Simulation | null> {
    return api.get<Simulation | null>(`${this.BASE_PATH}/active`);
  }

  /**
   * Finalizar simulação
   */
  static async finishSimulation(id: string): Promise<SimulationResult> {
    return api.post<SimulationResult>(`${this.BASE_PATH}/${id}/finish`);
  }

  /**
   * Submeter resposta individual durante simulação
   */
  static async submitAnswer(id: string, data: {
    question_id: string;
    selected_option: number;
  }): Promise<{
    is_correct: boolean;
    correct_answer: number;
    explanation?: string;
  }> {
    return api.post<{
      is_correct: boolean;
      correct_answer: number;
      explanation?: string;
    }>(`${this.BASE_PATH}/${id}/answer`, data);
  }
}
