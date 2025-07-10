# 🎓 SIMULAI OAB - Plataforma de Preparação para OAB com IA

<div align="center">

![SIMULAI OAB](https://img.shields.io/badge/SIMULAI%20OAB-Preparação%20Inteligente-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss)

**A primeira plataforma com Inteligência Artificial para preparação OAB**

[🚀 Demo](#demo) • [📋 Funcionalidades](#funcionalidades) • [🛠️ Instalação](#instalação) • [📖 Documentação](#documentação)

</div>

---

## 📖 Sobre o Projeto

O **SIMULAI OAB** é uma plataforma SaaS inovadora que revoluciona a preparação para o Exame da Ordem dos Advogados do Brasil (OAB) através da integração de Inteligência Artificial. Nossa missão é maximizar as chances de aprovação dos candidatos oferecendo uma experiência de estudo personalizada, eficiente e baseada em dados.

### 🎯 Diferenciais Únicos

- **🤖 IA Integrada**: Correção automática de peças processuais com feedback detalhado
- **📊 Análise Preditiva**: Planos de estudo adaptativos baseados no desempenho individual
- **🎮 Gamificação**: Sistema de pontos, rankings e conquistas para manter a motivação
- **📚 Banco Extenso**: Mais de 15.000 questões da FGV e inéditas
- **⚡ Feedback Instantâneo**: Correções e explicações em tempo real

---

## ✨ Funcionalidades

### 🏠 **Dashboard Inteligente**
- Visão geral do progresso de estudos
- Estatísticas de desempenho em tempo real
- Recomendações personalizadas de estudo
- Ranking entre usuários

### 📚 **Banco de Questões**
- **15.000+ questões** da FGV e inéditas
- Filtros avançados por disciplina, ano, dificuldade
- Sistema de busca inteligente
- Explicações detalhadas para cada questão
- Histórico completo de respostas

### ⏱️ **Simulados Completos**
- Simulados oficiais cronometrados
- Simulados customizáveis por disciplina
- Ambiente real de prova
- Análise detalhada de desempenho
- Comparação com outros candidatos

### 📊 **Análise de Desempenho**
- Gráficos interativos de evolução
- Identificação de pontos fracos
- Relatórios por disciplina
- Métricas de tempo de resposta
- Sugestões de melhoria

### 📖 **Recursos Complementares**
- Resumos concisos por disciplina
- Mapas mentais interativos
- Flashcards para memorização
- Videoaulas especializadas
- Jurisprudências atualizadas

### 🤖 **Ferramentas de IA**
- **Correção de Peças**: Análise automática de estrutura e conteúdo
- **Gerador de Peças**: Assistente para construção de peças processuais
- **Plano Adaptativo**: Cronograma que se ajusta ao seu progresso
- **Vade Mecum Inteligente**: Sugestões contextuais de artigos

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18.3.1** - Biblioteca para interfaces de usuário
- **TypeScript 5.5.3** - Superset tipado do JavaScript
- **Tailwind CSS 3.4.1** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones moderna
- **React Router DOM** - Roteamento para aplicações React

### **Backend & Database**
- **Supabase** - Backend-as-a-Service com PostgreSQL
- **Row Level Security (RLS)** - Segurança a nível de linha
- **Real-time subscriptions** - Atualizações em tempo real

### **Ferramentas de Desenvolvimento**
- **Vite 5.4.2** - Build tool e dev server
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador de CSS
- **Autoprefixer** - Prefixos CSS automáticos

---

## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/simulai-oab.git
cd simulai-oab
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### **4. Execute as migrações do banco**
```bash
# As migrações são aplicadas automaticamente no Supabase
# Verifique se todas as tabelas foram criadas corretamente
```

### **5. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
simulai-oab/
├── public/                 # Arquivos públicos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Auth/          # Componentes de autenticação
│   │   ├── Header.tsx     # Cabeçalho da aplicação
│   │   ├── Navigation.tsx # Navegação principal
│   │   └── ...
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useQuestions.ts
│   │   └── useAnalytics.ts
│   ├── lib/               # Configurações e utilitários
│   │   └── supabase.ts    # Cliente Supabase
│   ├── pages/             # Páginas da aplicação
│   │   ├── QuestionsBank.tsx
│   │   ├── Simulados.tsx
│   │   ├── Analytics.tsx
│   │   └── Resources.tsx
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Ponto de entrada
├── supabase/
│   └── migrations/        # Migrações do banco de dados
├── package.json
└── README.md
```

---

## 🗄️ Banco de Dados

### **Tabelas Principais**

#### **questoes**
```sql
- id (uuid, PK)
- statement (text) - Enunciado da questão
- option_a, option_b, option_c, option_d (text) - Alternativas
- correct_answer (text) - Resposta correta (A, B, C, D)
- explanation (text) - Explicação da resposta
- subject (text) - Disciplina
- year (integer) - Ano da prova
- difficulty (enum) - Dificuldade (EASY, MEDIUM, HARD)
- created_at, updated_at (timestamptz)
```

#### **user_answers**
```sql
- id (uuid, PK)
- user_id (uuid, FK) - Referência ao usuário
- question_id (uuid, FK) - Referência à questão
- selected_answer (text) - Resposta selecionada
- is_correct (boolean) - Se a resposta está correta
- answered_at (timestamptz) - Data/hora da resposta
```

#### **user_profiles**
```sql
- id (uuid, PK) - Referência ao auth.users
- email (text) - Email do usuário
- full_name (text) - Nome completo
- avatar_url (text) - URL do avatar
- created_at, updated_at (timestamptz)
```

---

## 🔐 Autenticação e Segurança

### **Sistema de Autenticação**
- Autenticação via email/senha usando Supabase Auth
- Criação automática de perfil de usuário
- Sessões seguras com JWT

### **Row Level Security (RLS)**
- Políticas de segurança a nível de linha
- Usuários só acessam seus próprios dados
- Questões visíveis para todos os usuários autenticados

### **Políticas de Segurança**
```sql
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Questões são visíveis para todos os usuários autenticados
CREATE POLICY "Questions are viewable by everyone" ON questoes
  FOR SELECT TO authenticated USING (true);
```

---

## 📊 Funcionalidades de Analytics

### **Métricas Disponíveis**
- Taxa de acerto geral e por disciplina
- Tempo médio de resposta
- Evolução do desempenho ao longo do tempo
- Ranking entre usuários
- Identificação de pontos fracos

### **Relatórios Gerados**
- Desempenho por disciplina
- Histórico de simulados
- Recomendações personalizadas de estudo
- Comparação com outros candidatos

---

## 🎨 Design System

### **Paleta de Cores**
- **Primária**: Azul (#3B82F6 - #1E40AF)
- **Secundária**: Verde (#10B981 - #059669)
- **Accent**: Roxo (#8B5CF6 - #7C3AED)
- **Neutros**: Cinza (#6B7280 - #374151)

### **Componentes**
- Cards com sombras suaves e bordas arredondadas
- Botões com gradientes e estados de hover
- Formulários com validação visual
- Gráficos interativos e responsivos

---

## 🚀 Deploy

### **Netlify (Recomendado)**
```bash
npm run build
# Deploy da pasta dist/ no Netlify
```

### **Vercel**
```bash
npm run build
vercel --prod
```

### **Variáveis de Ambiente em Produção**
Certifique-se de configurar as variáveis de ambiente no seu provedor de deploy:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test

# Executar linting
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

## 📈 Roadmap

### **Versão 2.0**
- [ ] Correção de peças por IA (GPT-4)
- [ ] Gerador de peças guiado
- [ ] Chat com IA para dúvidas
- [ ] Planos de estudo adaptativos avançados

### **Versão 2.1**
- [ ] App mobile (React Native)
- [ ] Modo offline
- [ ] Sincronização entre dispositivos
- [ ] Notificações push

### **Versão 2.2**
- [ ] Grupos de estudo
- [ ] Mentoria online
- [ ] Marketplace de conteúdo
- [ ] Certificações

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### **Diretrizes de Contribuição**
- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

### **Desenvolvimento**
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase + PostgreSQL
- **IA**: Integração com APIs de Machine Learning

### **Contato**
- 📧 Email: contato@simulai-oab.com
- 🌐 Website: [simulai-oab.com](https://simulai-oab.com)
- 💬 Discord: [Comunidade SIMULAI](https://discord.gg/simulai)

---

## 🙏 Agradecimentos

- **FGV** - Pelas questões oficiais da OAB
- **Comunidade OAB** - Pelo feedback e sugestões
- **Desenvolvedores** - Pelas contribuições open source
- **Beta Testers** - Pelos testes e melhorias

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

![GitHub stars](https://img.shields.io/github/stars/seu-usuario/simulai-oab?style=social)
![GitHub forks](https://img.shields.io/github/forks/seu-usuario/simulai-oab?style=social)

**Feito com ❤️ para a comunidade jurídica brasileira**

</div>