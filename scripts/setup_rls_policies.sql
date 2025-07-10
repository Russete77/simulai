-- Script para configurar políticas RLS (Row Level Security) no Supabase
-- Execute este script no editor SQL do Supabase

-- =============================================
-- 1. VERIFICAR TABELAS EXISTENTES
-- =============================================

-- Primeiro, vamos verificar quais tabelas existem
DO $$
DECLARE
    table_record RECORD;
    table_exists BOOLEAN;
BEGIN
    -- Criar uma tabela temporária para armazenar as tabelas que existem
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
-- 2. DESATIVAR RLS TEMPORARIAMENTE
-- =============================================

-- Desativar RLS apenas nas tabelas que existem
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN SELECT table_name FROM existing_tables LOOP
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY;', table_record.table_name);
        RAISE NOTICE 'RLS desativado na tabela: %', table_record.table_name;
    END LOOP;
END $$;

-- =============================================
-- 3. REMOVER POLÍTICAS EXISTENTES (se houver)
-- =============================================

-- Remover políticas existentes apenas das tabelas que existem
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN SELECT table_name FROM existing_tables LOOP
        -- Remover políticas comuns
        EXECUTE format('DROP POLICY IF EXISTS "Permitir leitura para todos" ON %I', table_record.table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Permitir inserção apenas para admins" ON %I', table_record.table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Permitir atualização apenas para admins" ON %I', table_record.table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Permitir exclusão apenas para admins" ON %I', table_record.table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Permitir atualização apenas para service_role" ON %I', table_record.table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Acesso apenas aos próprios dados" ON %I', table_record.table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Acesso total para service_role" ON %I', table_record.table_name);
        
        RAISE NOTICE 'Políticas removidas da tabela: %', table_record.table_name;
    END LOOP;
END $$;

-- =============================================
-- 4. CONFIGURAR POLÍTICAS PARA CADA TABELA
-- =============================================

-- Função auxiliar para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() = 'service_role' OR 
           (auth.uid() IS NOT NULL AND EXISTS (
               SELECT 1 FROM auth.users 
               WHERE id = auth.uid() 
               AND raw_user_meta_data->>'role' = 'admin'
           ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário está acessando seus próprios dados
CREATE OR REPLACE FUNCTION public.is_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar políticas para cada tabela existente
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN SELECT table_name FROM existing_tables LOOP
        -- Ativar RLS na tabela
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_record.table_name);
        RAISE NOTICE 'RLS ativado na tabela: %', table_record.table_name;
        
        -- Configurar políticas específicas para cada tabela
        IF table_record.table_name = 'questions' THEN
            -- Políticas para a tabela questions
            EXECUTE format('
                CREATE POLICY "Permitir leitura para todos" 
                ON public.%I
                FOR SELECT 
                USING (true);
                
                CREATE POLICY "Permitir inserção apenas para admins"
                ON public.%I
                FOR INSERT 
                WITH CHECK (public.is_admin());
                
                CREATE POLICY "Permitir atualização apenas para admins"
                ON public.%I
                FOR UPDATE 
                USING (public.is_admin());
                
                CREATE POLICY "Permitir exclusão apenas para admins"
                ON public.%I
                FOR DELETE 
                USING (public.is_admin());
            ', table_record.table_name, table_record.table_name, table_record.table_name, table_record.table_name);
            
            RAISE NOTICE 'Políticas configuradas para a tabela: %', table_record.table_name;
            
        ELSIF table_record.table_name = 'question_stats' THEN
            -- Políticas para a tabela question_stats
            EXECUTE format('
                CREATE POLICY "Permitir leitura para todos" 
                ON public.%I
                FOR SELECT 
                USING (true);
                
                CREATE POLICY "Permitir atualização apenas para service_role"
                ON public.%I
                FOR UPDATE 
                USING (auth.role() = ''service_role'');
            ', table_record.table_name, table_record.table_name);
            
            RAISE NOTICE 'Políticas configuradas para a tabela: %', table_record.table_name;
            
        ELSIF table_record.table_name IN ('user_question_history', 'flashcards') THEN
            -- Políticas para tabelas de usuário
            EXECUTE format('
                CREATE POLICY "Acesso apenas aos próprios dados"
                ON public.%I
                FOR ALL
                USING (public.is_owner(user_id) OR auth.role() = ''service_role'');
                
                CREATE POLICY "Acesso total para service_role"
                ON public.%I
                FOR ALL
                USING (auth.role() = ''service_role'');
            ', table_record.table_name, table_record.table_name);
            
            RAISE NOTICE 'Políticas configuradas para a tabela: %', table_record.table_name;
            
        ELSE
            -- Política padrão para outras tabelas (leitura pública, escrita restrita)
            EXECUTE format('
                CREATE POLICY "Permitir leitura para todos" 
                ON public.%I
                FOR SELECT 
                USING (true);
                
                CREATE POLICY "Acesso total para service_role"
                ON public.%I
                FOR ALL
                USING (auth.role() = ''service_role'');
            ', table_record.table_name, table_record.table_name);
            
            RAISE NOTICE 'Políticas padrão configuradas para a tabela: %', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- =============================================
-- 5. CONFIGURAÇÕES FINAIS E VERIFICAÇÃO
-- =============================================

-- Garantir que as extensões necessárias estejam habilitadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- Conceder permissões para as funções auxiliares
ALTER FUNCTION public.is_admin() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

ALTER FUNCTION public.is_owner(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.is_owner(UUID) TO anon, authenticated, service_role;

-- =============================================
-- 6. VERIFICAÇÃO FINAL
-- =============================================

-- Verificar tabelas com RLS ativado
DO $$
BEGIN
    RAISE NOTICE '\n=== TABELAS COM RLS ATIVADO ===';
END $$;

SELECT 
    tablename AS "Tabela", 
    rowsecurity AS "RLS Ativado"
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar políticas criadas
DO $$
BEGIN
    RAISE NOTICE '\n=== POLÍTICAS CRIADAS ===';
END $$;

SELECT
    tablename AS "Tabela",
    policyname AS "Política",
    cmd AS "Operação",
    roles AS "Funções",
    qual AS "Condição"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mensagem de conclusão
DO $$
BEGIN
    RAISE NOTICE '\n✅ Configuração RLS concluída com sucesso!';
    RAISE NOTICE '   Verifique as tabelas e políticas criadas acima.';
    RAISE NOTICE '   Certifique-se de testar as permissões com diferentes tipos de usuários.';
END $$;

-- =============================================
-- 5. CONFIGURAÇÕES ADICIONAIS
-- =============================================

-- Garantir que as extensões necessárias estejam habilitadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- Configurar permissões para a função is_owner
ALTER FUNCTION public.is_owner(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.is_owner(UUID) TO anon, authenticated, service_role;

-- =============================================
-- 6. VERIFICAÇÃO FINAL
-- =============================================

-- Verificar tabelas com RLS ativado
SELECT 
    tablename, 
    rowsecurity AS has_row_security
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar políticas criadas
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
