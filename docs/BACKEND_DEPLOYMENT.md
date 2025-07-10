# 🚀 Backend Deployment Guide

Este guia explica como configurar o deploy do backend FastAPI no Railway e Render.

## 🚂 Railway Deployment (Recomendado)

Railway é uma plataforma moderna e fácil de usar para deploy de aplicações.

### 1. Configuração Inicial

1. Acesse [railway.app](https://railway.app) e faça login
2. Conecte sua conta GitHub
3. Clique em "New Project" > "Deploy from GitHub repo"
4. Selecione o repositório `simulai`

### 2. Configuração do Projeto

```bash
# Instalar Railway CLI
curl -fsSL https://railway.app/install.sh | sh

# Login
railway login

# Conectar ao projeto
railway link
```

### 3. Variáveis de Ambiente

No painel do Railway, configure:

```bash
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# Authentication
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256

# CORS
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Environment
ENVIRONMENT=production
DEBUG=False
PORT=8000
```

### 4. Deploy Manual

```bash
# Deploy
railway up

# Ver logs
railway logs

# Abrir no browser
railway open
```

## 🎨 Render Deployment (Alternativa)

### 1. Configuração Inicial

1. Acesse [render.com](https://render.com) e faça login
2. Conecte sua conta GitHub
3. Clique em "New" > "Web Service"
4. Selecione o repositório `simulai`

### 2. Configuração do Serviço

```
Name: simulai-backend
Environment: Python 3
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3. Variáveis de Ambiente

Configure as mesmas variáveis do Railway no painel do Render.

### 4. Database (PostgreSQL)

1. Crie um novo PostgreSQL database
2. Conecte ao web service
3. A `DATABASE_URL` será configurada automaticamente

## 🐳 Docker Local

Para testar localmente:

```bash
# Build da imagem
docker build -t simulai-backend ./backend

# Run container
docker run -p 8000:8000 --env-file backend/.env simulai-backend

# Com docker-compose
docker-compose up backend
```

## 🔧 GitHub Actions Secrets

Configure os seguintes secrets no GitHub:

### Railway
```bash
RAILWAY_TOKEN=your_railway_token
RAILWAY_SERVICE_ID=your_service_id
```

### Render
```bash
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_service_id
```

### Como obter os tokens:

**Railway Token:**
1. Vá em [Railway Account Settings](https://railway.app/account/tokens)
2. Crie um novo token
3. Copie o valor

**Render API Key:**
1. Vá em [Render Account Settings](https://dashboard.render.com/account)
2. Crie uma nova API Key
3. Copie o valor

## 📊 Monitoramento

### Railway
- ✅ Logs em tempo real
- ✅ Métricas de CPU/RAM
- ✅ Health checks automáticos
- ✅ Rollback automático

### Render
- ✅ Logs estruturados
- ✅ Métricas de performance
- ✅ Health checks
- ✅ Auto-scaling

## 🔄 Deploy Automático

Após configurar os secrets, o deploy acontece automaticamente:

- **Push para `main`**: Deploy de produção
- **Pull Request**: Deploy de preview (se configurado)

## 🌐 URLs de Acesso

- **Railway**: `https://your-service.railway.app`
- **Render**: `https://your-service.onrender.com`

## 🚨 Troubleshooting

### Build Falha
```bash
# Verificar logs
railway logs
# ou
render logs

# Testar localmente
docker build -t test ./backend
```

### Database Connection
```bash
# Verificar DATABASE_URL
railway variables
# ou verificar no painel do Render
```

### CORS Issues
```bash
# Verificar ALLOWED_ORIGINS
# Deve incluir o domínio do frontend
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

## 📚 Recursos

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 💡 Dicas

1. **Use Railway** para desenvolvimento rápido
2. **Use Render** para produção estável
3. **Configure health checks** sempre
4. **Monitor logs** regularmente
5. **Use variáveis de ambiente** para configurações
6. **Teste localmente** antes do deploy
