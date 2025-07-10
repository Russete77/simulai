#!/usr/bin/env python3
"""
Generate missing question stats records.
"""

import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv(dotenv_path='../.env')

def generate_missing_stats():
    """Generate missing question stats records."""
    print("🔍 Starting generation of missing question stats...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    try:
        # Get all question IDs
        questions_result = supabase.table('questions').select('id').execute()
        question_ids = {q['id'] for q in questions_result.data}
        print(f"   - Found {len(question_ids)} questions")
        
        # Get all question_ids that already have stats
        stats_result = supabase.table('question_stats').select('question_id').execute()
        stats_question_ids = {s['question_id'] for s in stats_result.data if s.get('question_id')}
        print(f"   - Found {len(stats_question_ids)} questions with existing stats")
        
        # Find question IDs without stats
        missing_ids = question_ids - stats_question_ids
        print(f"   - Found {len(missing_ids)} questions without stats")
        
        if not missing_ids:
            print("✅ All questions already have stats")
            return
        
        # Prepare stats records
        stats_to_insert = []
        for question_id in missing_ids:
            stats_to_insert.append({
                'question_id': question_id,
                'total_attempts': 0,
                'correct_attempts': 0,
                'average_time_seconds': 0,
                'difficulty_rating': 0.0,
                'last_updated': datetime.utcnow().isoformat()
            })
        
        # Insert in batches
        print(f"📥 Inserting stats for {len(stats_to_insert)} questions...")
        batch_size = 100
        inserted_count = 0
        
        for i in range(0, len(stats_to_insert), batch_size):
            batch = stats_to_insert[i:i + batch_size]
            result = supabase.table('question_stats').insert(batch).execute()
            if hasattr(result, 'data') and result.data:
                inserted_count += len(result.data)
            print(f"   - Inserted batch {i//batch_size + 1}/{(len(stats_to_insert)-1)//batch_size + 1} ({len(batch)} records)")
        
        print(f"✅ Successfully inserted stats for {inserted_count} questions")
        
    except Exception as e:
        print(f"❌ Error during stats generation: {e}")
        raise

if __name__ == "__main__":
    generate_missing_stats()
