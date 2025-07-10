import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { supabase } from './supabase';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Criar instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !session) {
          // Se não conseguir renovar, redirecionar para login
          await supabase.auth.signOut();
          window.location.href = '/';
          return Promise.reject(error);
        }

        // Atualizar o header com o novo token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        
        // Repetir a requisição original
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        await supabase.auth.signOut();
        window.location.href = '/';
        return Promise.reject(error);
      }
    }

    // Tratamento de outros erros
    const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
    console.error('Erro na API:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

// Função helper para fazer requisições com retry
export const apiRequest = async <T>(
  config: AxiosRequestConfig,
  retries: number = 3
): Promise<T> => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as { code?: string };
    if (retries > 0 && apiError.code === 'NETWORK_ERROR') {
      console.warn(`Tentativa de retry (${4 - retries}/3)...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
      return apiRequest<T>(config, retries - 1);
    }
    throw error;
  }
};

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
