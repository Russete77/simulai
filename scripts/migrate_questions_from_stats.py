#!/usr/bin/env python3
"""
Migrate questions from question_stats to questions table.
"""

import os
import json
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime
import uuid

# Load environment variables
load_dotenv(dotenv_path='../.env')

def migrate_questions():
    """Migrate questions from question_stats to questions table."""
    print("🚀 Starting migration of questions from question_stats to questions table...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    try:
        # Get all records from question_stats that have question data
        result = supabase.table('question_stats') \
            .select('*') \
            .not_.is_('question_text', 'null') \
            .execute()
        
        if not result.data:
            print("✅ No questions found in question_stats table")
            return
        
        print(f"🔍 Found {len(result.data)} questions in question_stats table")
        
        # Prepare questions for migration
        questions_to_insert = []
        stats_to_update = []
        
        for record in result.data:
            try:
                # Check if this question already exists in questions table
                existing_question = supabase.table('questions') \
                    .select('id') \
                    .eq('external_id', record.get('external_id', '')) \
                    .execute()
                
                if existing_question.data:
                    print(f"   ⚠️  Question with external_id {record.get('external_id')} already exists in questions table")
                    continue
                
                # Create question data
                question_data = {
                    'id': record.get('question_id', str(uuid.uuid4())),
                    'external_id': record.get('external_id', f'migrated_{record.get("id")}'),
                    'question_text': record.get('question_text', ''),
                    'options': record.get('options', []),
                    'correct_answer': record.get('correct_answer', ''),
                    'explanation': record.get('explanation', ''),
                    'category': record.get('category', 'Geral'),
                    'subcategory': record.get('subcategory'),
                    'difficulty_level': record.get('difficulty_level', 'medium'),
                    'exam_year': record.get('exam_year'),
                    'exam_edition': record.get('exam_edition'),
                    'source': record.get('source', 'FGV'),
                    'tags': record.get('tags', []),
                    'is_active': True,
                    'created_at': record.get('created_at', datetime.utcnow().isoformat()),
                    'updated_at': datetime.utcnow().isoformat()
                }
                
                questions_to_insert.append(question_data)
                
                # Keep track of the mapping between old and new IDs
                stats_to_update.append({
                    'old_id': record['id'],
                    'new_question_id': question_data['id']
                })
                
            except Exception as e:
                print(f"⚠️  Error processing record {record.get('id')}: {e}")
                continue
        
        if not questions_to_insert:
            print("ℹ️  No questions to migrate")
            return
        
        print(f"📥 Preparing to migrate {len(questions_to_insert)} questions...")
        
        # Insert questions in batches
        batch_size = 50
        migrated_count = 0
        
        for i in range(0, len(questions_to_insert), batch_size):
            batch = questions_to_insert[i:i + batch_size]
            result = supabase.table('questions').insert(batch).execute()
            
            if hasattr(result, 'data') and result.data:
                migrated_count += len(result.data)
                print(f"   ✅ Migrated batch {i//batch_size + 1}/{(len(questions_to_insert)-1)//batch_size + 1} ({len(batch)} questions)")
            else:
                print(f"   ❌ Failed to migrate batch {i//batch_size + 1}")
        
        print(f"\n🎉 Successfully migrated {migrated_count} questions to questions table")
        
        # Update question_stats to remove question data and keep only stats
        print("\n🧹 Cleaning up question_stats table...")
        
        for stat in stats_to_update:
            try:
                supabase.table('question_stats') \
                    .update({
                        'question_text': None,
                        'options': None,
                        'correct_answer': None,
                        'explanation': None,
                        'category': None,
                        'subcategory': None,
                        'difficulty_level': None,
                        'exam_year': None,
                        'exam_edition': None,
                        'source': None,
                        'tags': None,
                        'is_active': None,
                        'updated_at': datetime.utcnow().isoformat()
                    }) \
                    .eq('id', stat['old_id']) \
                    .execute()
                
            except Exception as e:
                print(f"⚠️  Error cleaning up question_stats record {stat['old_id']}: {e}")
        
        print("✅ Cleanup completed")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        raise

if __name__ == "__main__":
    migrate_questions()
