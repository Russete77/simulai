# Mapeamento Frontend-Backend: Dados Mockados vs Endpoints

## Resumo Executivo

Este documento mapeia todos os pontos onde dados mockados estão sendo utilizados no frontend e identifica os endpoints necessários no backend FastAPI para substituí-los.

## Status Atual

### Backend FastAPI
- **Localização**: `c:\Users\erick\simula-gera\backend\main.py`
- **Status**: Apenas endpoints placeholder
- **Endpoints Disponíveis**:
  - `GET /` - Health check
  - `GET /api/v1/status` - API status
  - `GET /api/v1/questions` - Placeholder
  - `POST /api/v1/auth/login` - Placeholder
  - `POST /api/v1/simulations` - Placeholder
  - `POST /api/v1/essays/correct` - Placeholder

### Frontend React
- **Status**: Usando dados mockados e Supabase diretamente
- **Problema**: Não integrado com API própria

## Mapeamento Detalhado

### 1. Página Simulados (`/src/pages/Simulados.tsx`)

#### Dados Mockados Identificados:

**A. Simulados Disponíveis**
```typescript
const simuladosDisponiveis = [
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
  // ... mais 2 simulados
]
```

**B. Simulados Realizados**
```typescript
const simuladosRealizados = [
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
  // ... mais 1 simulado
]
```

#### Endpoints Necessários:
- `GET /api/v1/simulations/available` - Listar simulados disponíveis
- `GET /api/v1/simulations/completed` - Listar simulados realizados pelo usuário
- `POST /api/v1/simulations/{id}/start` - Iniciar simulado
- `GET /api/v1/simulations/{id}` - Obter detalhes do simulado
- `POST /api/v1/simulations/{id}/submit` - Submeter respostas

#### Estrutura de Dados Esperada:
```typescript
interface SimuladoDisponivel {
  id: number;
  titulo: string;
  tipo: 'Prova Real' | 'Customizado' | 'Discursiva';
  questoes: number;
  tempo: number; // em minutos
  disciplinas: string[];
  participantes: number;
  dificuldade: 'Oficial' | 'Fácil' | 'Média' | 'Difícil';
  status: 'Disponível' | 'Indisponível';
  descricao: string;
}

interface SimuladoRealizado {
  id: number;
  titulo: string;
  dataRealizacao: string; // ISO date
  nota: number;
  acertos: number;
  total: number;
  tempo: number; // tempo gasto em minutos
  posicao: number;
  totalParticipantes: number;
}
```

### 2. Página Banco de Questões (`/src/pages/QuestionsBank.tsx`)

#### Status Atual:
- **Conectado ao Supabase**: Sim ✅
- **Dados Mockados**: Apenas lista de disciplinas
- **Problema**: Usa Supabase diretamente, não passa pela API própria

#### Dados Mockados:
```typescript
const disciplinas = [
  'Direito Constitucional', 'Direito Civil', 'Direito Penal', 
  'Direito Processual Civil', 'Direito Processual Penal', 
  'Direito Administrativo', 'Direito Tributário', 
  'Direito do Trabalho', 'Direito Empresarial', 'Ética Profissional'
];
```

#### Endpoints Necessários:
- `GET /api/v1/questions` - Listar questões com filtros
- `GET /api/v1/questions/{id}` - Obter questão específica
- `POST /api/v1/questions/{id}/answer` - Submeter resposta
- `GET /api/v1/questions/subjects` - Listar disciplinas disponíveis
- `GET /api/v1/questions/stats` - Estatísticas do usuário

#### Parâmetros de Filtro:
- `subject` - Disciplina
- `year` - Ano da prova
- `difficulty` - Dificuldade (EASY, MEDIUM, HARD)
- `status` - Status (answered, unanswered, correct, incorrect)
- `limit` - Limite de resultados
- `offset` - Paginação

### 3. Página Recursos (`/src/pages/Resources.tsx`)

#### Dados Mockados Identificados:

**A. Resumos**
```typescript
const resumos = [
  {
    id: 1,
    titulo: 'Direitos Fundamentais na CF/88',
    disciplina: 'Direito Constitucional',
    tipo: 'Resumo',
    paginas: 12,
    visualizacoes: 2847,
    rating: 4.8,
    tags: ['Direitos Fundamentais', 'Constituição', 'Eficácia'],
    descricao: 'Resumo completo sobre direitos fundamentais...',
    autor: 'Prof. Ana Silva'
  }
  // ... mais recursos
]
```

**B. Vídeos, Áudios, Jurisprudências** - Estrutura similar

#### Endpoints Necessários:
- `GET /api/v1/resources/summaries` - Resumos
- `GET /api/v1/resources/videos` - Vídeos
- `GET /api/v1/resources/audios` - Áudios
- `GET /api/v1/resources/jurisprudence` - Jurisprudências
- `GET /api/v1/resources/{id}` - Recurso específico
- `POST /api/v1/resources/{id}/view` - Registrar visualização

### 4. App Principal (`/src/App.tsx`)

#### Dados Mockados:
```typescript
const mockUserStats = {
  simuladosCompleted: 12, // Mock data
  ranking: 127 // Mock data
}
```

#### Endpoints Necessários:
- `GET /api/v1/users/stats` - Estatísticas do usuário
- `GET /api/v1/users/profile` - Perfil do usuário

### 5. Analytics (Hooks existentes)

#### Status:
- **Hooks React Query**: ✅ Implementados
- **Serviços**: ✅ Implementados
- **Backend**: ❌ Endpoints não implementados

#### Endpoints Necessários:
- `GET /api/v1/analytics/overview` - Visão geral
- `GET /api/v1/analytics/performance` - Performance por matéria
- `GET /api/v1/analytics/activity` - Atividade recente
- `GET /api/v1/analytics/ranking` - Ranking do usuário
- `GET /api/v1/analytics/study-time` - Tempo de estudo
- `GET /api/v1/analytics/comparison` - Comparações

## Inconsistências Identificadas

### 1. Nomenclatura de Tabelas
- **Banco de Dados**: `questions`, `user_simulations`
- **Frontend**: Referencia `questoes` em alguns lugares
- **Solução**: Padronizar para inglês

### 2. Estrutura de Dados
- **Frontend**: Usa estruturas específicas para cada página
- **Backend**: Precisa implementar DTOs correspondentes
- **Solução**: Definir interfaces TypeScript compartilhadas

### 3. Autenticação
- **Frontend**: Usa Supabase Auth diretamente
- **Backend**: Não integrado com Supabase
- **Solução**: Implementar middleware de autenticação

## Priorização de Implementação

### Fase 1 - Crítico (Imediato)
1. **Autenticação e Autorização**
   - Middleware de autenticação
   - Integração com Supabase Auth
   - Proteção de rotas

2. **Banco de Questões**
   - Endpoints de questões
   - Sistema de filtros
   - Submissão de respostas

### Fase 2 - Importante (Curto Prazo)
1. **Simulados**
   - CRUD de simulados
   - Sistema de execução
   - Correção automática

2. **Analytics Básico**
   - Estatísticas do usuário
   - Performance por matéria

### Fase 3 - Desejável (Médio Prazo)
1. **Recursos Educacionais**
   - Gestão de conteúdo
   - Sistema de avaliações

2. **Analytics Avançado**
   - Comparações
   - Relatórios detalhados

## Próximos Passos

1. **Implementar autenticação no backend**
2. **Criar endpoints de questões**
3. **Substituir dados mockados por chamadas de API**
4. **Implementar sistema de simulados**
5. **Conectar analytics com dados reais**

## Observações Técnicas

- **Paginação**: Implementar em todos os endpoints de listagem
- **Cache**: Usar Redis para cache de questões e estatísticas
- **Validação**: Implementar validação de dados com Pydantic
- **Documentação**: Manter Swagger/OpenAPI atualizado
- **Testes**: Implementar testes unitários e de integração

---

**Documento criado em**: 2025-01-10  
**Última atualização**: 2025-01-10  
**Status**: Análise Completa ✅
