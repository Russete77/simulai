#!/usr/bin/env python3
"""
Clean up orphaned records in question_stats table.
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../.env')

def clean_orphaned_stats():
    """Clean up orphaned records in question_stats table."""
    print("🔍 Starting orphaned stats cleanup...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    try:
        # Find orphaned records (question_stats without a matching question)
        print("🔎 Finding orphaned records in question_stats...")
        
        # Get all question_ids from questions table
        questions_result = supabase.table('questions').select('id').execute()
        question_ids = {q['id'] for q in questions_result.data}
        print(f"   - Found {len(question_ids)} valid questions")
        
        # Get all question_ids from question_stats
        stats_result = supabase.table('question_stats').select('question_id').execute()
        stats_question_ids = {s['question_id'] for s in stats_result.data if s.get('question_id')}
        print(f"   - Found {len(stats_question_ids)} question references in question_stats")
        
        # Find orphaned question_ids (in stats but not in questions)
        orphaned_ids = stats_question_ids - question_ids
        print(f"   - Found {len(orphaned_ids)} orphaned records")
        
        if not orphaned_ids:
            print("✅ No orphaned records found")
            return
        
        # Delete orphaned records in batches
        print(f"🗑️  Deleting {len(orphaned_ids)} orphaned records...")
        batch_size = 100
        deleted_count = 0
        
        # Convert to list for batching
        orphaned_list = list(orphaned_ids)
        
        for i in range(0, len(orphaned_list), batch_size):
            batch = orphaned_list[i:i + batch_size]
            # Delete records where question_id is in the current batch
            result = supabase.table('question_stats') \
                .delete() \
                .in_('question_id', batch) \
                .execute()
            
            if hasattr(result, 'data') and result.data:
                deleted_count += len(result.data)
            
            print(f"   - Deleted batch {i//batch_size + 1}/{(len(orphaned_list)-1)//batch_size + 1} ({len(batch)} records)")
        
        print(f"✅ Successfully deleted {deleted_count} orphaned records")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        raise

if __name__ == "__main__":
    clean_orphaned_stats()
