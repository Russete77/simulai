#!/usr/bin/env python3
"""
Set up database indexes for better query performance.
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../.env')

def setup_database_indexes():
    """Set up indexes for better query performance."""
    print("📊 Setting up database indexes...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    # Index definitions
    indexes = [
        # Questions table
        {
            'table': 'questions',
            'name': 'idx_questions_category',
            'columns': 'category',
            'description': 'Speed up category-based filtering'
        },
        {
            'table': 'questions',
            'name': 'idx_questions_difficulty',
            'columns': 'difficulty_level',
            'description': 'Speed up difficulty-based filtering'
        },
        {
            'table': 'questions',
            'name': 'idx_questions_exam_year',
            'columns': 'exam_year',
            'description': 'Speed up filtering by exam year'
        },
        
        # Question Stats table
        {
            'table': 'question_stats',
            'name': 'idx_question_stats_question_id',
            'columns': 'question_id',
            'description': 'Speed up lookups by question_id',
            'unique': True
        },
        {
            'table': 'question_stats',
            'name': 'idx_question_stats_difficulty',
            'columns': 'difficulty_rating',
            'description': 'Speed up difficulty-based queries'
        },
        
        # User-related indexes
        {
            'table': 'user_question_history',
            'name': 'idx_user_question_history_user_question',
            'columns': 'user_id, question_id',
            'description': 'Speed up lookups by user and question',
            'unique': True
        },
        {
            'table': 'user_question_history',
            'name': 'idx_user_question_history_last_attempted',
            'columns': 'user_id, last_attempted_at',
            'description': 'Speed up queries for recent attempts'
        },
        
        # Simulations
        {
            'table': 'simulations',
            'name': 'idx_simulations_user',
            'columns': 'user_id',
            'description': 'Speed up lookups by user'
        },
        
        # Flashcards
        {
            'table': 'flashcards',
            'name': 'idx_flashcards_user',
            'columns': 'user_id, last_reviewed_at',
            'description': 'Speed up flashcard review queries'
        },
        
        # Gamification
        {
            'table': 'gamification_stats',
            'name': 'idx_gamification_user',
            'columns': 'user_id',
            'description': 'Speed up gamification lookups by user',
            'unique': True
        }
    ]
    
    for idx in indexes:
        try:
            table = idx['table']
            index_name = idx['name']
            columns = idx['columns']
            is_unique = 'UNIQUE' if idx.get('unique', False) else ''
            
            print(f"\n🔧 Creating index {index_name} on {table}({columns})...")
            
            # Check if index already exists by querying the table directly
            try:
                # Try to query the table with a simple select to see if it exists
                result = supabase.table(table).select('*').limit(1).execute()
                
                # If we get here, the table exists, now check if the index exists
                # We'll try to create the index and handle the error if it already exists
                try:
                    # Execute the create index statement
                    create_query = f"""
                    CREATE {is_unique} INDEX {index_name}
                    ON public.{table} ({columns});
                    """
                    
                    # Use raw SQL execution
                    supabase.rpc('execute_sql', {'query': create_query}).execute()
                    print(f"  ✅ Created index {index_name}")
                    
                except Exception as e:
                    if 'already exists' in str(e):
                        print(f"  ℹ️  Index {index_name} already exists, skipping...")
                    else:
                        raise e
                        
            except Exception as e:
                print(f"  ⚠️  Table {table} does not exist or cannot be accessed: {e}")
            
        except Exception as e:
            print(f"  ⚠️  Error creating index {idx.get('name', 'unknown')}: {e}")
    
    print("\n🎉 Database indexes setup completed!")

if __name__ == "__main__":
    setup_database_indexes()
