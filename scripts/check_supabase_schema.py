#!/usr/bin/env python3
"""
Check the current schema in Supabase.
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../.env')

def check_supabase_schema():
    """Check the current database schema in Supabase."""
    print("🔍 Checking Supabase database schema...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    try:
        # Get list of tables using the tables endpoint
        print("\n📋 Database tables:")
        
        # List all tables by trying to access them
        # This is a workaround since we can't directly query information_schema
        tables = ['questions', 'question_stats', 'users', 'simulations', 'user_simulation_results', 
                 'user_question_history', 'flashcards', 'summaries', 'gamification_stats']
        
        # Check which tables actually exist
        existing_tables = []
        for table in tables:
            try:
                # Try to get a single row to check if table exists
                result = supabase.table(table).select('*').limit(1).execute()
                if hasattr(result, 'data'):
                    existing_tables.append(table)
            except Exception as e:
                if 'not found' in str(e):
                    continue
                else:
                    print(f"  ⚠️  Error checking table {table}: {e}")
        
        if not existing_tables:
            print("❌ No tables found in the database")
            return
        
        tables = existing_tables
        
        for table in tables:
            print(f"\n📊 Table: {table}")
            print("-" * 50)
            
            try:
                # Try to get a single row to infer the structure
                result = supabase.table(table).select('*').limit(1).execute()
                
                if result.data:
                    print("Sample row structure:")
                    for key, value in result.data[0].items():
                        value_type = type(value).__name__
                        print(f"  - {key} ({value_type}): {str(value)[:100]}{'...' if len(str(value)) > 100 else ''}")
                    
                    # Get total count
                    count_result = supabase.table(table).select('*', count='exact').execute()
                    if hasattr(count_result, 'count'):
                        print(f"  Total rows: {count_result.count}")
                    elif hasattr(count_result, 'data') and hasattr(count_result.data[0], 'count'):
                        print(f"  Total rows: {count_result.data[0]['count']}")
                else:
                    print("  (Table is empty)")
                    
            except Exception as e:
                print(f"  ⚠️  Error checking table {table}: {e}")
        
        # Check for RLS (Row Level Security) - we can't check this directly, but we can try to access tables with and without auth
        print("\n🔐 Note: Row Level Security (RLS) status cannot be checked directly via API.")
        print("  To check RLS, visit the Supabase dashboard -> Authentication -> Policies")
        
    except Exception as e:
        print(f"❌ Error checking database schema: {e}")
        raise

if __name__ == "__main__":
    check_supabase_schema()
