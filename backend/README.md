# Simulai OAB - Backend API

API backend para a plataforma Simulai OAB usando FastAPI e IA.

## 🚀 Tech Stack

- **Framework:** FastAPI 0.109
- **Python:** 3.11+
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4 + Hugging Face
- **Auth:** Supabase Auth + JWT
- **Deploy:** Railway/Render

## 🛠️ Desenvolvimento

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Executar servidor de desenvolvimento
uvicorn main:app --reload

# Testes
pytest

# Formatação de código
black .
isort .
flake8 .
```

## 📡 API Endpoints

- `GET /` - Health check
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário
- `GET /questions` - Listar questões
- `POST /questions/answer` - Responder questão
- `POST /simulations` - Criar simulado
- `POST /essays/correct` - Correção de peças por IA
- `GET /study-plan` - Plano de estudos adaptativo

## 🤖 Features IA

- ✅ Correção automatizada de peças (2ª fase)
- ✅ Geração de planos de estudo adaptativos
- ✅ Análise de desempenho inteligente
- ✅ Sugestões personalizadas de conteúdo
- ✅ Integração com dataset FGV (Hugging Face)

## 🌐 Deploy

Automaticamente deployado no Railway/Render via GitHub Actions.

## 📄 Licença

Proprietary - Russo & Haru © 2025
