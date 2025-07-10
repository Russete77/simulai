# 🛠️ Scripts de Importação e Validação

Scripts Python para gerenciar o dataset OAB e banco de dados Supabase.

## 📋 Scripts Disponíveis

### 1. `analyze_dataset.py`
Analisa a estrutura do dataset do Hugging Face antes da importação.

```bash
python analyze_dataset.py
```

**Saídas:**
- `data/samples/oab_sample.json` - Amostra dos dados
- `data/samples/dataset_info.json` - Metadados do dataset
- `data/samples/suggested_schema.json` - Schema sugerido

### 2. `import_dataset.py`
Importa o dataset completo do Hugging Face para o Supabase.

```bash
python import_dataset.py
```

**Funcionalidades:**
- ✅ Carrega dataset `russ7/oab_exams_2011_2025_combined`
- ✅ Limpa e transforma dados automaticamente
- ✅ Importa em lotes de 100 questões
- ✅ Cria estatísticas iniciais
- ✅ Gera logs detalhados

### 3. `validate_database.py`
Valida a integridade do banco de dados e qualidade dos dados.

```bash
python validate_database.py
```

**Validações:**
- 🔗 Conexão com Supabase
- 🏗️ Schema e tabelas
- 📋 Qualidade dos dados
- 🔗 Relacionamentos FK
- 🔒 Políticas RLS
- ⚡ Performance de queries

## 🚀 Configuração

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_KEY="your_service_key_here"
```

### 3. Executar Scripts

```bash
# 1. Analisar dataset (opcional)
python analyze_dataset.py

# 2. Importar dados
python import_dataset.py

# 3. Validar importação
python validate_database.py
```

## 📊 Estrutura dos Dados

### Dataset Original (Hugging Face)
- **Total**: ~5.605 questões OAB
- **Período**: 2011-2025
- **Fonte**: FGV
- **Formato**: JSON com questões, alternativas, gabaritos

### Dados Transformados (Supabase)
```json
{
  "id": "uuid",
  "question_text": "Texto da questão...",
  "options": [
    {"key": "A", "text": "Alternativa A"},
    {"key": "B", "text": "Alternativa B"}
  ],
  "correct_answer": "A",
  "explanation": "Explicação da resposta...",
  "category": "Direito Civil",
  "exam_year": 2024,
  "source": "FGV",
  "tags": ["civil", "contratos"]
}
```

## 🔧 Personalização

### Modificar Categorização
Edite a função `_infer_category()` em `import_dataset.py`:

```python
categories = {
    'Direito Civil': ['civil', 'contrato', 'propriedade'],
    'Direito Penal': ['penal', 'crime', 'delito'],
    # Adicione suas categorias...
}
```

### Ajustar Lote de Importação
Modifique `batch_size` na classe `OABDatasetImporter`:

```python
self.batch_size = 50  # Padrão: 100
```

### Adicionar Validações
Estenda a classe `DatabaseValidator` em `validate_database.py`:

```python
def validate_custom_logic(self):
    # Sua validação personalizada
    pass
```

## 📈 Monitoramento

### Logs de Importação
Os scripts geram logs em:
- `data/import_logs/` - Logs de importação
- `data/validation/` - Relatórios de validação

### Métricas Importantes
```sql
-- Total de questões por categoria
SELECT category, COUNT(*) 
FROM questions 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Qualidade dos dados
SELECT 
  COUNT(*) as total,
  COUNT(explanation) as with_explanation,
  COUNT(exam_year) as with_year
FROM questions;
```

## 🚨 Troubleshooting

### Erro: "Dataset not found"
- Verifique conexão com internet
- Confirme que o dataset existe no Hugging Face

### Erro: "Permission denied"
- Use `SUPABASE_SERVICE_KEY` (não anon key)
- Verifique políticas RLS no Supabase

### Erro: "Memory error"
- Reduza `batch_size` para 50 ou menos
- Execute em máquina com mais RAM

### Performance lenta
- Verifique índices no banco
- Use conexão de internet estável
- Execute fora de horários de pico

## 📞 Suporte

Para problemas específicos:
1. Verifique os logs em `data/`
2. Execute `validate_database.py` para diagnóstico
3. Consulte a documentação do Supabase

---

**🎯 Objetivo**: Importar e validar 5.000+ questões OAB para a plataforma Simulai!
