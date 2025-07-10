// Tipos para as entidades principais da API

export interface Question {
  id: string;
  statement: string;
  options: string[];
  correct_answer: number;
  subject: string;
  year: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  explanation?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  questionsAnswered: number;
  accuracyRate: number;
  simuladosCompleted: number;
  ranking: number;
  totalStudyTime?: number;
  streakDays?: number;
}

export interface SubjectPerformance {
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface ActivityData {
  date: string;
  questionsAnswered: number;
  accuracy: number;
}

export interface AnalyticsData {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  subjectPerformance: SubjectPerformance[];
  recentActivity: ActivityData[];
}

export interface Simulation {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number; // em minutos
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  startedAt?: string;
  completedAt?: string;
  created_at: string;
}

export interface UserAnswer {
  id: string;
  question_id: string;
  user_id: string;
  selected_option: number;
  is_correct: boolean;
  answered_at: string;
}

export interface Essay {
  id: string;
  title: string;
  content: string;
  score?: number;
  feedback?: string;
  corrected_at?: string;
  created_at: string;
}

// Tipos para requisições e respostas da API

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface QuestionsFilters {
  subject?: string;
  year?: number;
  difficulty?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface QuestionsResponse {
  questions: Question[];
  total: number;
  hasMore: boolean;
}

export interface AnswerQuestionRequest {
  question_id: string;
  selected_option: number;
}

export interface AnswerQuestionResponse {
  is_correct: boolean;
  correct_answer: number;
  explanation?: string;
}

export interface CreateSimulationRequest {
  title: string;
  subject?: string;
  questionCount: number;
  timeLimit: number;
  difficulty?: string;
}

export interface SubmitSimulationRequest {
  simulation_id: string;
  answers: {
    question_id: string;
    selected_option: number;
  }[];
}

export interface StartSimulationRequest {
  simulation_id: string;
  start_time?: string;
}

export interface SaveProgressRequest {
  simulation_id: string;
  current_question: number;
  answers: {
    question_id: string;
    selected_option: number;
  }[];
  time_spent: number;
}

export interface SimulationResult {
  simulation_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  subject_performance: SubjectPerformance[];
  detailed_results: {
    question_id: string;
    is_correct: boolean;
    selected_option: number;
    correct_answer: number;
  }[];
}

export interface CorrectEssayRequest {
  title: string;
  content: string;
  subject?: string;
}

export interface CorrectEssayResponse {
  essay_id: string;
  score: number;
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

// Tipos para parâmetros de analytics
export interface AnalyticsParams {
  period?: '7d' | '30d' | '90d' | '1y';
  subject?: string;
}

// Tipos para respostas de erro da API
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Tipos para paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
