# 🎓 Simulai OAB

Plataforma SaaS moderna e responsiva para preparação da OAB usando IA, oferecendo uma experiência hiperpersonalizada para estudantes de Direito.

## 🎯 Visão Geral

O Simulai OAB é uma plataforma completa que combina inteligência artificial com metodologias comprovadas de ensino para maximizar as chances de aprovação na OAB (1ª e 2ª fase).

## Arquitetura

```
simulaigera/
├── frontend/          # React 18 + Vite + TypeScript
├── backend/           # FastAPI + Python 3.11
├── mobile/            # React Native + Expo
├── database/          # Supabase PostgreSQL Schema
└── .taskmaster/       # Task management
```

## Tech Stack

### Frontend (Web)
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **UI:** TailwindCSS + Lucide Icons
- **Auth:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel

### Backend (API)
- **Framework:** FastAPI 0.109
- **Language:** Python 3.11
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4 + Hugging Face
- **Deploy:** Railway/Render

### Mobile (App)
- **Framework:** React Native 0.73
- **Platform:** Expo 50
- **UI:** NativeWind
- **Deploy:** EAS Build

## 🧩 Funcionalidades Principais

### 📚 1ª Fase
- ✅ **Banco de 5000+ questões** da FGV (Hugging Face)
- ✅ **Filtros inteligentes** por disciplina, tema, ano, dificuldade
- ✅ **Feedback imediato** com explicações detalhadas
- ✅ **Simulados personalizados** com modo prova real

### ✍️ 2ª Fase
- 🤖 **Correção automatizada por IA** com rubricas
- 📝 **Feedback instantâneo** com sugestões de melhoria
- 📊 **Comparação com padrões FGV**
- 🎯 **Peças processuais e questões discursivas**

### 🧠 IA & Personalização
- 📈 **Plano de estudos adaptativo**
- 🎯 **Foco em pontos fracos**
- 📖 **Vade Mecum interativo**
- 🃏 **Flashcards automáticos**
- 🏆 **Gamificação inteligente**

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Python 3.11+
- Git

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/simulai-gera.git
cd simulai-gera

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload

# Mobile
cd ../mobile
npm install
npm start
```

## 🌐 Deploy

- **Frontend:** Vercel (automático via GitHub)
- **Backend:** Railway/Render (automático via GitHub)
- **Mobile:** EAS Build (Google Play + App Store)

## 💰 Monetização

### Freemium
- Acesso limitado a questões
- Simulados básicos

### Premium (R$ 50-200/mês)
- ✅ Correção ilimitada de discursivas
- ✅ Plano de estudos dinâmico
- ✅ Simulados ilimitados
- ✅ Comunidade avançada
- ✅ Estatísticas completas

## 📊 Métricas de Sucesso

- 📈 Taxa de aprovação dos usuários
- 👥 DAU/MAU (usuários ativos)
- ⏱️ Tempo médio de estudo diário
- 🎯 Taxa de conclusão de simulados
- ⭐ NPS e retenção (30/60/90 dias)

## 👥 Equipe

**Responsáveis:** Russo & Haru  
**Data:** Março 2025  
**Versão:** 1.0

## 📄 Licença

Proprietary © 2025 - Todos os direitos reservados

---

🚀 **Transformando a preparação para OAB com inteligência artificial!**
