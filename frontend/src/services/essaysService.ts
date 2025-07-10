import { api } from '../lib/api';
import type {
  Essay,
  CorrectEssayRequest,
  CorrectEssayResponse,
  PaginatedResponse
} from '../types/api';

export class EssaysService {
  private static readonly BASE_PATH = '/api/v1/essays';

  /**
   * Submeter redação para correção com IA
   */
  static async correctEssay(request: CorrectEssayRequest): Promise<CorrectEssayResponse> {
    return api.post<CorrectEssayResponse>(`${this.BASE_PATH}/correct`, request);
  }

  /**
   * Buscar histórico de redações do usuário
   */
  static async getEssayHistory(params: {
    limit?: number;
    offset?: number;
    subject?: string;
  } = {}): Promise<PaginatedResponse<Essay>> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.subject) queryParams.append('subject', params.subject);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/history?${queryString}` : `${this.BASE_PATH}/history`;

    return api.get<PaginatedResponse<Essay>>(url);
  }

  /**
   * Buscar redação específica
   */
  static async getEssay(id: string): Promise<Essay & {
    feedback?: string;
    score?: number;
    suggestions?: string[];
    strengths?: string[];
    weaknesses?: string[];
  }> {
    return api.get<Essay & {
      feedback?: string;
      score?: number;
      suggestions?: string[];
      strengths?: string[];
      weaknesses?: string[];
    }>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Salvar rascunho de redação
   */
  static async saveDraft(draft: {
    title: string;
    content: string;
    subject?: string;
  }): Promise<{
    id: string;
    saved_at: string;
  }> {
    return api.post<{
      id: string;
      saved_at: string;
    }>(`${this.BASE_PATH}/drafts`, draft);
  }

  /**
   * Buscar rascunhos salvos
   */
  static async getDrafts(params: {
    limit?: number;
    offset?: number;
  } = {}): Promise<PaginatedResponse<{
    id: string;
    title: string;
    content: string;
    subject?: string;
    saved_at: string;
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/drafts?${queryString}` : `${this.BASE_PATH}/drafts`;

    return api.get<PaginatedResponse<{
      id: string;
      title: string;
      content: string;
      subject?: string;
      saved_at: string;
    }>>(url);
  }

  /**
   * Deletar rascunho
   */
  static async deleteDraft(id: string): Promise<void> {
    return api.delete<void>(`${this.BASE_PATH}/drafts/${id}`);
  }

  /**
   * Buscar temas de redação disponíveis
   */
  static async getEssayTopics(params: {
    subject?: string;
    difficulty?: string;
    year?: number;
  } = {}): Promise<{
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    year: number;
    requirements: string[];
  }[]> {
    const queryParams = new URLSearchParams();
    
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.year) queryParams.append('year', params.year.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/topics?${queryString}` : `${this.BASE_PATH}/topics`;

    return api.get<{
      id: string;
      title: string;
      description: string;
      subject: string;
      difficulty: string;
      year: number;
      requirements: string[];
    }[]>(url);
  }

  /**
   * Buscar estatísticas de redações do usuário
   */
  static async getEssayStats(): Promise<{
    total_essays: number;
    average_score: number;
    best_score: number;
    improvement_rate: number;
    subjects_performance: {
      subject: string;
      essays_count: number;
      average_score: number;
    }[];
    recent_scores: {
      date: string;
      score: number;
    }[];
  }> {
    return api.get<{
      total_essays: number;
      average_score: number;
      best_score: number;
      improvement_rate: number;
      subjects_performance: {
        subject: string;
        essays_count: number;
        average_score: number;
      }[];
      recent_scores: {
        date: string;
        score: number;
      }[];
    }>(`${this.BASE_PATH}/stats`);
  }

  /**
   * Solicitar nova correção de uma redação existente
   */
  static async requestReCorrection(essayId: string, notes?: string): Promise<CorrectEssayResponse> {
    return api.post<CorrectEssayResponse>(`${this.BASE_PATH}/${essayId}/re-correct`, {
      notes
    });
  }

  /**
   * Avaliar qualidade da correção (feedback do usuário)
   */
  static async rateFeedback(essayId: string, rating: {
    helpfulness: number; // 1-5
    accuracy: number; // 1-5
    clarity: number; // 1-5
    comments?: string;
  }): Promise<void> {
    return api.post<void>(`${this.BASE_PATH}/${essayId}/rate-feedback`, rating);
  }

  /**
   * Buscar exemplos de redações bem avaliadas (para estudo)
   */
  static async getExampleEssays(params: {
    subject?: string;
    min_score?: number;
    limit?: number;
  } = {}): Promise<{
    id: string;
    title: string;
    content: string;
    score: number;
    subject: string;
    highlights: string[];
  }[]> {
    const queryParams = new URLSearchParams();
    
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.min_score) queryParams.append('min_score', params.min_score.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}/examples?${queryString}` : `${this.BASE_PATH}/examples`;

    return api.get<{
      id: string;
      title: string;
      content: string;
      score: number;
      subject: string;
      highlights: string[];
    }[]>(url);
  }
}
