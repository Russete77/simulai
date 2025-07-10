#!/usr/bin/env python3
"""
Check the structure of database tables.
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../.env')

def get_table_structure(table_name):
    """Get the structure of a table."""
    print(f"\n🔍 Structure of {table_name} table:")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    try:
        # Get a single record to see the structure
        result = supabase.table(table_name).select('*').limit(1).execute()
        
        if not result.data:
            print(f"   Table {table_name} is empty")
            return
        
        # Print column names and sample values
        record = result.data[0]
        print(f"   Columns and sample values:")
        for key, value in record.items():
            value_preview = str(value)[:100] + ('...' if len(str(value)) > 100 else '')
            print(f"   - {key}: {value_preview}")
        
        return record.keys()
        
    except Exception as e:
        print(f"❌ Error checking {table_name} table: {e}")
        return None

def compare_tables():
    """Compare the structure of questions and question_stats tables."""
    print("🔍 Comparing tables structure...")
    
    # Get structure of both tables
    questions_cols = get_table_structure('questions')
    stats_cols = get_table_structure('question_stats')
    
    if questions_cols and stats_cols:
        # Find common columns
        common_cols = set(questions_cols) & set(stats_cols)
        print(f"\n✅ Common columns: {', '.join(common_cols)}")
        
        # Find columns only in questions
        only_questions = set(questions_cols) - set(stats_cols)
        print(f"\n📝 Only in questions: {', '.join(only_questions)}")
        
        # Find columns only in question_stats
        only_stats = set(stats_cols) - set(questions_cols)
        print(f"\n📊 Only in question_stats: {', '.join(only_stats)}")

if __name__ == "__main__":
    compare_tables()
