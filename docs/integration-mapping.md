# Mapeamento de Integração Frontend-Backend

## 📋 Análise de Dados Mockados no Frontend

### 1. **useAnalytics.ts** - Dados de Atividade Recente
**Localização**: `frontend/src/hooks/useAnalytics.ts:91-97`
```typescript
const recentActivity = [
  { date: '2024-01-15', questionsAnswered: 25, accuracy: 76 },
  { date: '2024-01-14', questionsAnswered: 18, accuracy: 72 },
  { date: '2024-01-13', questionsAnswered: 32, accuracy: 81 },
  { date: '2024-01-12', questionsAnswered: 15, accuracy: 68 },
  { date: '2024-01-11', questionsAnswered: 28, accuracy: 74 }
];
```
**Necessário**: Endpoint para buscar atividade recente do usuário por período

### 2. **App.tsx** - Estatísticas do Usuário
**Localização**: `frontend/src/App.tsx:52-53`
```typescript
simuladosCompleted: 12, // Mock data
ranking: 127 // Mock data
```
**Necessário**: Endpoints para buscar simulados completados e ranking do usuário

## 🔗 Endpoints Necessários no Backend

### **Autenticação e Usuário**
- `POST /api/v1/auth/login` - Login do usuário
- `POST /api/v1/auth/register` - Registro de usuário
- `GET /api/v1/user/profile` - Perfil do usuário
- `GET /api/v1/user/stats` - Estatísticas gerais do usuário

### **Questões**
- `GET /api/v1/questions` - Listar questões com filtros
- `GET /api/v1/questions/{id}` - Buscar questão específica
- `POST /api/v1/questions/{id}/answer` - Responder questão
- `GET /api/v1/questions/subjects` - Listar matérias disponíveis

### **Simulados**
- `GET /api/v1/simulations` - Listar simulados do usuário
- `POST /api/v1/simulations` - Criar novo simulado
- `GET /api/v1/simulations/{id}` - Buscar simulado específico
- `POST /api/v1/simulations/{id}/submit` - Submeter simulado
- `GET /api/v1/simulations/{id}/results` - Resultados do simulado

### **Analytics**
- `GET /api/v1/analytics/overview` - Visão geral das estatísticas
- `GET /api/v1/analytics/performance` - Performance por matéria
- `GET /api/v1/analytics/activity` - Atividade recente
- `GET /api/v1/analytics/ranking` - Ranking do usuário

### **Redações (IA)**
- `POST /api/v1/essays/correct` - Correção de redação com IA
- `GET /api/v1/essays/history` - Histórico de redações

## 📊 Estruturas de Dados Esperadas

### **Question**
```typescript
interface Question {
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
```

### **UserStats**
```typescript
interface UserStats {
  questionsAnswered: number;
  accuracyRate: number;
  simuladosCompleted: number;
  ranking: number;
  totalStudyTime?: number;
  streakDays?: number;
}
```

### **AnalyticsData**
```typescript
interface AnalyticsData {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  subjectPerformance: SubjectPerformance[];
  recentActivity: ActivityData[];
}

interface SubjectPerformance {
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface ActivityData {
  date: string;
  questionsAnswered: number;
  accuracy: number;
}
```

### **Simulation**
```typescript
interface Simulation {
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
```

## 🔧 Status Atual dos Endpoints no Backend

### ✅ **Implementados**
- `GET /` - Health check
- `GET /api/v1/status` - Status da API

### ❌ **Não Implementados (Placeholders)**
- `GET /api/v1/questions` - Apenas placeholder
- `POST /api/v1/login` - Apenas placeholder  
- `POST /api/v1/simulations` - Apenas placeholder
- `POST /api/v1/essays/correct` - Apenas placeholder

## 🎯 Próximos Passos

1. **Implementar endpoints reais no FastAPI**
2. **Criar cliente HTTP configurado no frontend**
3. **Substituir dados mockados por chamadas reais**
4. **Implementar tratamento de erros e loading states**
5. **Adicionar cache e otimizações de performance**

## 📝 Observações

- Frontend já está configurado com Supabase para algumas operações
- Algumas funcionalidades podem usar Supabase diretamente (auth, questões)
- Backend FastAPI pode ser usado para lógica de negócio e IA
- Necessário definir qual abordagem usar para cada funcionalidade
