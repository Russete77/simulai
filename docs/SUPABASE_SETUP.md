# 🗄️ Supabase Setup & Dataset Import Guide

Este guia explica como configurar o Supabase e importar o dataset de questões OAB do Hugging Face.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Python 3.11+ instalado
- Acesso ao dataset: `russ7/oab_exams_2011_2025_combined`

## 🚀 1. Configuração do Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Configure o projeto:
   - **Name**: `simulai-oab`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America)
4. Aguarde a criação do projeto (2-3 minutos)

### 1.2 Obter Credenciais

No dashboard do projeto, vá em **Settings > API**:

```bash
# Copie estas informações:
Project URL: https://your-project-id.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.3 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Copie do .env.example e preencha com suas credenciais
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```bash
# SUPABASE CONFIGURATION
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Frontend (Next.js)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🏗️ 2. Criar Schema do Banco

### 2.1 Executar Script SQL

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie todo o conteúdo de `database/schema.sql`
4. Cole no editor e clique em **"Run"**

Ou execute via linha de comando:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Executar migrations
supabase db push
```

### 2.2 Verificar Tabelas Criadas

No dashboard, vá em **Table Editor** e verifique se as tabelas foram criadas:

- ✅ `profiles` - Perfis de usuários
- ✅ `questions` - Questões OAB
- ✅ `simulations` - Simulados
- ✅ `user_simulations` - Tentativas de simulados
- ✅ `user_question_history` - Histórico de respostas
- ✅ `flashcards` - Cartões de estudo
- ✅ `achievements` - Conquistas
- ✅ E outras tabelas...

## 📥 3. Importar Dataset do Hugging Face

### 3.1 Instalar Dependências

```bash
# Navegar para pasta de scripts
cd scripts

# Instalar dependências Python
pip install -r requirements.txt
```

### 3.2 Analisar Dataset (Opcional)

Primeiro, analise a estrutura do dataset:

```bash
python analyze_dataset.py
```

Isso criará:
- `data/samples/oab_sample.json` - Amostra dos dados
- `data/samples/dataset_info.json` - Metadados do dataset
- `data/samples/suggested_schema.json` - Schema sugerido

### 3.3 Executar Importação

```bash
# Importar dataset completo para Supabase
python import_dataset.py
```

O script irá:
1. 🔄 Carregar dataset do Hugging Face (5.605 questões)
2. 🧹 Limpar e transformar os dados
3. 📤 Importar para Supabase em lotes de 100
4. 📊 Criar estatísticas iniciais das questões

### 3.4 Verificar Importação

No Supabase Dashboard:

1. Vá em **Table Editor > questions**
2. Verifique se as questões foram importadas
3. Confirme que há ~5.605 registros

Ou via SQL:

```sql
-- Contar questões importadas
SELECT COUNT(*) FROM questions;

-- Ver amostra de questões
SELECT id, question_text, category, exam_year 
FROM questions 
LIMIT 5;

-- Estatísticas por categoria
SELECT category, COUNT(*) as total
FROM questions 
GROUP BY category 
ORDER BY total DESC;
```

## 🔧 4. Configurações Avançadas

### 4.1 Row Level Security (RLS)

O schema já inclui políticas RLS para segurança:

```sql
-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 4.2 Índices de Performance

Índices já criados para otimização:

```sql
-- Verificar índices
SELECT indexname, tablename, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

### 4.3 Backup e Restore

```bash
# Backup do banco
supabase db dump > backup.sql

# Restore do backup
supabase db reset
psql -h db.your-project-id.supabase.co -U postgres -d postgres < backup.sql
```

## 📊 5. Validação e Testes

### 5.1 Testar Conexão

```python
from supabase import create_client
import os

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# Testar consulta
result = supabase.table('questions').select('*').limit(1).execute()
print(f"Conexão OK: {len(result.data)} questão encontrada")
```

### 5.2 Consultas de Exemplo

```sql
-- Top 10 categorias com mais questões
SELECT category, COUNT(*) as total
FROM questions 
WHERE is_active = true
GROUP BY category 
ORDER BY total DESC 
LIMIT 10;

-- Questões por ano
SELECT exam_year, COUNT(*) as total
FROM questions 
WHERE exam_year IS NOT NULL
GROUP BY exam_year 
ORDER BY exam_year DESC;

-- Questões com explicação
SELECT COUNT(*) as with_explanation,
       (SELECT COUNT(*) FROM questions) as total,
       ROUND(COUNT(*)::decimal / (SELECT COUNT(*) FROM questions) * 100, 2) as percentage
FROM questions 
WHERE explanation IS NOT NULL AND explanation != '';
```

## 🚨 6. Troubleshooting

### Erro: "relation does not exist"
- Verifique se o schema foi executado corretamente
- Confirme que está usando o schema `public`

### Erro: "permission denied"
- Verifique se está usando a `service_role` key para importação
- Confirme as políticas RLS

### Erro: "dataset not found"
- Verifique conexão com internet
- Confirme que o dataset `russ7/oab_exams_2011_2025_combined` está acessível

### Performance lenta
- Verifique se os índices foram criados
- Use `EXPLAIN ANALYZE` para analisar queries

## 📈 7. Monitoramento

### 7.1 Dashboard do Supabase

Monitore no dashboard:
- **Database > Usage** - Uso de storage e conexões
- **Auth > Users** - Usuários registrados
- **Logs** - Logs de erro e atividade

### 7.2 Métricas Importantes

```sql
-- Estatísticas gerais
SELECT 
    (SELECT COUNT(*) FROM questions) as total_questions,
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM user_simulations) as total_simulations,
    (SELECT COUNT(*) FROM user_question_history) as total_answers;

-- Performance das questões
SELECT 
    AVG(total_attempts) as avg_attempts,
    AVG(correct_attempts::decimal / NULLIF(total_attempts, 0) * 100) as avg_success_rate
FROM question_stats;
```

## ✅ 8. Próximos Passos

Após a configuração:

1. ✅ **Schema criado** - Todas as tabelas configuradas
2. ✅ **Dataset importado** - 5.605+ questões OAB disponíveis
3. 🔄 **Implementar API** - Endpoints FastAPI para acesso aos dados
4. 🔄 **Configurar Auth** - Sistema de autenticação Supabase
5. 🔄 **Desenvolver Frontend** - Interface Next.js para usuários

---

## 📞 Suporte

- **Documentação**: [supabase.com/docs](https://supabase.com/docs)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Para problemas específicos do projeto

---

**🎯 Objetivo**: Ter um banco de dados robusto com 5.000+ questões OAB prontas para uso na plataforma Simulai!
