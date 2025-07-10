# 🚀 Vercel Deployment Setup Guide

Este guia explica como configurar o deploy automático do frontend no Vercel.

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Repositório GitHub conectado
3. Projeto Next.js configurado

## 🔧 Configuração Manual (Primeira vez)

### 1. Conectar Repositório ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte sua conta GitHub
4. Selecione o repositório `simulai`
5. Configure as seguintes opções:

```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm ci
```

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Backend API
NEXT_PUBLIC_API_URL_PRODUCTION=https://your-backend-url.com

# Authentication
NEXTAUTH_URL_PRODUCTION=https://your-project.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

# Payment (Opcional)
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Configurar GitHub Actions (Automático)

Para deploy automático via GitHub Actions, configure os secrets:

1. Vá em **GitHub Repository > Settings > Secrets and Variables > Actions**
2. Adicione os seguintes secrets:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Como obter os valores:

**VERCEL_TOKEN:**
1. Vá em [Vercel Account Settings](https://vercel.com/account/tokens)
2. Crie um novo token
3. Copie o valor

**VERCEL_ORG_ID e VERCEL_PROJECT_ID:**
1. No terminal, dentro da pasta `frontend`:
```bash
npx vercel link
```
2. Os IDs serão salvos em `.vercel/project.json`

## 🔄 Deploy Automático

Após a configuração, o deploy acontece automaticamente:

- **Push para `main`**: Deploy de produção
- **Pull Request**: Deploy de preview
- **Push para outras branches**: Deploy de desenvolvimento

## 🌐 URLs de Acesso

- **Produção**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`

## 📊 Monitoramento

O Vercel fornece:

- ✅ Analytics de performance
- ✅ Logs de build e runtime
- ✅ Métricas de Core Web Vitals
- ✅ Alertas de erro

## 🔧 Comandos Úteis

```bash
# Deploy manual
npx vercel

# Deploy de produção
npx vercel --prod

# Ver logs
npx vercel logs

# Listar deployments
npx vercel ls
```

## 🚨 Troubleshooting

### Build Falha
- Verifique as variáveis de ambiente
- Confirme que `npm run build` funciona localmente
- Verifique os logs no painel do Vercel

### Erro 404
- Confirme o `Root Directory` como `frontend`
- Verifique se o `next.config.js` está correto

### Variáveis de Ambiente
- Prefixe variáveis públicas com `NEXT_PUBLIC_`
- Redeploy após alterar variáveis

## 📚 Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
