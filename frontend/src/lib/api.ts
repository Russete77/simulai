import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { supabase } from './supabase';
import { HttpError, RequestQueueItem, ApiConfig, ExtendedAxiosRequestConfig } from '../types/api';

// Configuração da API
const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  retries: 3,
  retryDelay: 1000,
};

// Fila para requisições durante refresh de token
let isRefreshing = false;
let failedQueue: RequestQueueItem[] = [];

// Função para processar fila de requisições
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token && config.headers) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      resolve(apiClient(config));
    }
  });
  
  failedQueue = [];
};

// Função para criar erro HTTP padronizado
const createHttpError = (error: AxiosError): HttpError => {
  const responseData = error.response?.data as { message?: string } | undefined;
  const httpError: HttpError = {
    message: responseData?.message || error.message || 'Erro desconhecido',
    status: error.response?.status || 0,
    statusText: error.response?.statusText || 'Unknown Error',
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    code: error.code,
    timestamp: new Date().toISOString(),
  };

  // Log do erro para debugging
  console.error('Erro na API:', {
    status: httpError.status,
    message: httpError.message,
    url: httpError.url,
    method: httpError.method,
  });

  return httpError;
};

// Criar instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.warn('Erro ao obter token de autenticação:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas e erros
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as unknown as ExtendedAxiosRequestConfig;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de retry
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já estiver renovando, adicionar à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tentar renovar o token
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !session) {
          // Se não conseguir renovar, processar fila com erro
          processQueue(new Error('Token refresh failed'), null);
          await supabase.auth.signOut();
          window.location.href = '/';
          return Promise.reject(createHttpError(error));
        }

        // Processar fila com sucesso
        processQueue(null, session.access_token);
        
        // Atualizar o header com o novo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        }
        
        // Repetir a requisição original
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        processQueue(refreshError as Error, null);
        await supabase.auth.signOut();
        window.location.href = '/';
        return Promise.reject(createHttpError(error));
      } finally {
        isRefreshing = false;
      }
    }

    // Criar erro HTTP padronizado
    return Promise.reject(createHttpError(error));
  }
);

// Função para verificar se deve tentar novamente
function shouldRetry(error: AxiosError): boolean {
  return (
    !error.response || // Erro de rede
    (error.response.status >= 500 && error.response.status < 600) || // Erro do servidor
    error.code === 'ECONNABORTED' || // Timeout
    error.code === 'ENOTFOUND' || // DNS error
    error.code === 'ECONNRESET' // Connection reset
  );
}

// Função para delay com backoff exponencial
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função helper para fazer requisições com retry
export async function apiRequest<T>(
  config: AxiosRequestConfig,
  retries: number = API_CONFIG.retries
): Promise<T> {
  let lastError: AxiosError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      lastError = error as AxiosError;
      
      if (attempt === retries || !shouldRetry(lastError)) {
        throw createHttpError(lastError);
      }
      
      const delayMs = API_CONFIG.retryDelay * Math.pow(2, attempt);
      console.warn(`Tentativa ${attempt + 1}/${retries + 1} falhou, tentando novamente em ${delayMs}ms...`);
      await delay(delayMs);
    }
  }
  
  throw createHttpError(lastError!);
}

// Métodos HTTP simplificados
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>({ method: 'GET', url, ...config }),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiRequest<T>({ method: 'POST', url, data, ...config }),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiRequest<T>({ method: 'PUT', url, data, ...config }),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiRequest<T>({ method: 'PATCH', url, data, ...config }),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>({ method: 'DELETE', url, ...config }),
};

export default apiClient;
