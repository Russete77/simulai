-- Script para configurar índices no banco de dados Supabase
-- Execute este script no editor SQL do Supabase

-- =============================================
-- 1. VERIFICAR TABELAS EXISTENTES
-- =============================================
DO $$
DECLARE
    table_record RECORD;
    table_exists BOOLEAN;
BEGIN
    -- Criar uma tabela temporária para armazenar as tabelas que existem
    DROP TABLE IF EXISTS existing_tables;
    CREATE TEMP TABLE existing_tables (table_name TEXT);
    
    -- Verificar cada tabela e adicionar à lista se existir
    -- Tabela questions
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public' 
        AND    table_name   = 'questions'
    ) INTO table_exists;
    
    IF table_exists THEN
        INSERT INTO existing_tables VALUES ('questions');
    END IF;
    
    -- Tabela question_stats
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public' 
        AND    table_name   = 'question_stats'
    ) INTO table_exists;
    
    IF table_exists THEN
        INSERT INTO existing_tables VALUES ('question_stats');
    END IF;
    
    -- Tabela simulations
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public' 
        AND    table_name   = 'simulations'
    ) INTO table_exists;
    
    IF table_exists THEN
        INSERT INTO existing_tables VALUES ('simulations');
    END IF;
    
    -- Tabela user_question_history
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public' 
        AND    table_name   = 'user_question_history'
    ) INTO table_exists;
    
    IF table_exists THEN
        INSERT INTO existing_tables VALUES ('user_question_history');
    END IF;
    
    -- Tabela flashcards
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public' 
        AND    table_name   = 'flashcards'
    ) INTO table_exists;
    
    IF table_exists THEN
        INSERT INTO existing_tables VALUES ('flashcards');
    END IF;
    
    -- Mostrar tabelas encontradas
    RAISE NOTICE 'Tabelas encontradas no banco de dados:';
    FOR table_record IN SELECT * FROM existing_tables LOOP
        RAISE NOTICE '- %', table_record.table_name;
    END LOOP;
END $$;

-- =============================================
-- 2. CRIAR ÍNDICES
-- =============================================
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Índices para a tabela questions
    IF EXISTS (SELECT 1 FROM existing_tables WHERE table_name = 'questions') THEN
        -- Índice para categoria
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions (category);
            RAISE NOTICE '✅ Índice idx_questions_category criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_questions_category já existe ou ocorreu um erro: %', SQLERRM;
        END;
        
        -- Índice para nível de dificuldade
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions (difficulty_level);
            RAISE NOTICE '✅ Índice idx_questions_difficulty criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_questions_difficulty já existe ou ocorreu um erro: %', SQLERRM;
        END;
        
        -- Índice para ano do exame
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_questions_exam_year ON public.questions (exam_year);
            RAISE NOTICE '✅ Índice idx_questions_exam_year criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_questions_exam_year já existe ou ocorreu um erro: %', SQLERRM;
        END;
    END IF;
    
    -- Índices para a tabela question_stats
    IF EXISTS (SELECT 1 FROM existing_tables WHERE table_name = 'question_stats') THEN
        -- Índice para question_id (único)
        BEGIN
            CREATE UNIQUE INDEX IF NOT EXISTS idx_question_stats_question_id ON public.question_stats (question_id);
            RAISE NOTICE '✅ Índice idx_question_stats_question_id criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_question_stats_question_id já existe ou ocorreu um erro: %', SQLERRM;
        END;
        
        -- Índice para classificação de dificuldade
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_question_stats_difficulty ON public.question_stats (difficulty_rating);
            RAISE NOTICE '✅ Índice idx_question_stats_difficulty criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_question_stats_difficulty já existe ou ocorreu um erro: %', SQLERRM;
        END;
    END IF;
    
    -- Índices para a tabela user_question_history
    IF EXISTS (SELECT 1 FROM existing_tables WHERE table_name = 'user_question_history') THEN
        -- Índice composto para usuário e questão (único)
        BEGIN
            CREATE UNIQUE INDEX IF NOT EXISTS idx_user_question_history_user_question 
            ON public.user_question_history (user_id, question_id);
            RAISE NOTICE '✅ Índice idx_user_question_history_user_question criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_user_question_history_user_question já existe ou ocorreu um erro: %', SQLERRM;
        END;
        
        -- Índice para data da última tentativa
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_user_question_history_last_attempted 
            ON public.user_question_history (user_id, last_attempted_at);
            RAISE NOTICE '✅ Índice idx_user_question_history_last_attempted criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_user_question_history_last_attempted já existe ou ocorreu um erro: %', SQLERRM;
        END;
    END IF;
    
    -- Índices para a tabela simulations
    IF EXISTS (SELECT 1 FROM existing_tables WHERE table_name = 'simulations') THEN
        -- Índice para usuário
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_simulations_user ON public.simulations (user_id);
            RAISE NOTICE '✅ Índice idx_simulations_user criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_simulations_user já existe ou ocorreu um erro: %', SQLERRM;
        END;
    END IF;
    
    -- Índices para a tabela flashcards
    IF EXISTS (SELECT 1 FROM existing_tables WHERE table_name = 'flashcards') THEN
        -- Índice para usuário e data de revisão
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_flashcards_user ON public.flashcards (user_id, last_reviewed_at);
            RAISE NOTICE '✅ Índice idx_flashcards_user criado com sucesso';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ℹ️  Índice idx_flashcards_user já existe ou ocorreu um erro: %', SQLERRM;
        END;
    END IF;
    
    RAISE NOTICE '\n✅ Configuração de índices concluída com sucesso!';
    RAISE NOTICE '   Verifique as mensagens acima para ver quais índices foram criados.';
END $$;

-- =============================================
-- 3. VERIFICAÇÃO FINAL
-- =============================================
-- Mostrar índices criados
SELECT
    tablename AS "Tabela",
    indexname AS "Índice",
    indexdef AS "Definição"
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
