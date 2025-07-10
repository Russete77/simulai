import { api } from '../lib/api';
import type {
  Question,
  QuestionsFilters,
  QuestionsResponse,
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  UserAnswer,
  PaginatedResponse
} from '../types/api';

export class QuestionsService {
  private static readonly BASE_PATH = '/api/v1/questions';

  /**
   * Buscar questões com filtros e paginação
   */
  static async getQuestions(filters: QuestionsFilters = {}): Promise<QuestionsResponse> {
    const params = new URLSearchParams();
    
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

    return api.get<QuestionsResponse>(url);
  }

  /**
   * Buscar questão específica por ID
   */
  static async getQuestion(id: string): Promise<Question> {
    return api.get<Question>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Responder uma questão
   */
  static async answerQuestion(request: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    return api.post<AnswerQuestionResponse>(
      `${this.BASE_PATH}/${request.question_id}/answer`,
      { selected_option: request.selected_option }
    );
  }

  /**
   * Buscar matérias disponíveis
   */
  static async getSubjects(): Promise<string[]> {
    return api.get<string[]>(`${this.BASE_PATH}/subjects`);
  }

  /**
   * Buscar questões aleatórias para simulado
   */
  static async getRandomQuestions(params: {
    count: number;
    subject?: string;
    difficulty?: string;
    excludeAnswered?: boolean;
  }): Promise<Question[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('count', params.count.toString());
    
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.excludeAnswered) queryParams.append('exclude_answered', 'true');

    return api.get<Question[]>(`${this.BASE_PATH}/random?${queryParams.toString()}`);
  }

  /**
   * Buscar histórico de respostas do usuário
   */
  static async getUserAnswers(filters: {
    question_id?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<PaginatedResponse<UserAnswer>> {
    const params = new URLSearchParams();
    
    if (filters.question_id) params.append('question_id', filters.question_id);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.BASE_PATH}/answers?${queryString}` : `${this.BASE_PATH}/answers`;

    return api.get<PaginatedResponse<UserAnswer>>(url);
  }

  /**
   * Marcar questão como favorita
   */
  static async toggleFavorite(questionId: string): Promise<{ is_favorite: boolean }> {
    return api.post<{ is_favorite: boolean }>(`${this.BASE_PATH}/${questionId}/favorite`);
  }

  /**
   * Buscar questões favoritas do usuário
   */
  static async getFavoriteQuestions(filters: {
    limit?: number;
    offset?: number;
  } = {}): Promise<PaginatedResponse<Question>> {
    const params = new URLSearchParams();
    
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.BASE_PATH}/favorites?${queryString}` : `${this.BASE_PATH}/favorites`;

    return api.get<PaginatedResponse<Question>>(url);
  }

  /**
   * Reportar problema em uma questão
   */
  static async reportQuestion(questionId: string, reason: string, description?: string): Promise<void> {
    return api.post<void>(`${this.BASE_PATH}/${questionId}/report`, {
      reason,
      description
    });
  }
}
