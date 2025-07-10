-- =====================================================
-- DATABASE MAINTENANCE FUNCTIONS
-- =====================================================

-- Enable/disable triggers for a table
CREATE OR REPLACE FUNCTION public.disable_triggers(table_name TEXT)
RETURNS VOID AS $$
DECLARE
    stmt TEXT;
BEGIN
    stmt := 'ALTER TABLE ' || table_name || ' DISABLE TRIGGER ALL';
    EXECUTE stmt;
    RAISE NOTICE 'Disabled all triggers for table: %', table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.enable_triggers(table_name TEXT)
RETURNS VOID AS $$
DECLARE
    stmt TEXT;
BEGIN
    stmt := 'ALTER TABLE ' || table_name || ' ENABLE TRIGGER ALL';
    EXECUTE stmt;
    RAISE NOTICE 'Enabled all triggers for table: %', table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Truncate table with foreign key checks
CREATE OR REPLACE FUNCTION public.truncate_table(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE 'TRUNCATE TABLE ' || table_name || ' CASCADE';
    RAISE NOTICE 'Truncated table: %', table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset sequences for a table
CREATE OR REPLACE FUNCTION public.reset_sequence(table_name TEXT, column_name TEXT)
RETURNS VOID AS $$
DECLARE
    seq_name TEXT;
    max_id BIGINT;
BEGIN
    -- Get the sequence name
    SELECT pg_get_serial_sequence(table_name, column_name) INTO seq_name;
    
    -- Get the maximum ID
    EXECUTE 'SELECT COALESCE(MAX(' || column_name || '), 0) + 1 FROM ' || table_name INTO max_id;
    
    -- Reset the sequence
    IF seq_name IS NOT NULL THEN
        EXECUTE 'ALTER SEQUENCE ' || seq_name || ' RESTART WITH ' || max_id;
        RAISE NOTICE 'Reset sequence % for %.% to %', seq_name, table_name, column_name, max_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.disable_triggers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enable_triggers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.truncate_table(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_sequence(TEXT, TEXT) TO authenticated;
