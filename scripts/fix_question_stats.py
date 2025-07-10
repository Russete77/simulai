#!/usr/bin/env python3
"""
Fix question_stats table by moving questions to the correct table.
"""

import os
from supabase import create_client
from dotenv import load_dotenv
from typing import List, Dict, Any
import json
from datetime import datetime

# Load environment variables
load_dotenv(dotenv_path='../.env')

class QuestionStatsFixer:
    def __init__(self):
        """Initialize the fixer with Supabase client."""
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")
        
        self.supabase = create_client(self.supabase_url, self.supabase_key)
        self.batch_size = 100
        self.migrated_count = 0
        self.error_count = 0
    
    def get_questions_in_stats(self) -> List[Dict[str, Any]]:
        """Get questions that were incorrectly stored in question_stats."""
        print("🔍 Finding questions in question_stats table...")
        
        try:
            # Get all records from question_stats that have question data
            result = self.supabase.table('question_stats') \
                .select('*') \
                .execute()
            
            questions_in_stats = []
            for record in result.data:
                # Check if this record has question data (not just stats)
                if 'question_text' in record and record['question_text']:
                    questions_in_stats.append(record)
            
            print(f"✅ Found {len(questions_in_stats)} questions in question_stats table")
            return questions_in_stats
            
        except Exception as e:
            print(f"❌ Error fetching questions from question_stats: {e}")
            return []
    
    def migrate_questions(self, questions: List[Dict[str, Any]]) -> bool:
        """Migrate questions from question_stats to questions table."""
        if not questions:
            print("ℹ️ No questions to migrate")
            return True
        
        print(f"🚚 Migrating {len(questions)} questions to questions table...")
        
        try:
            # Prepare questions for insertion
            questions_to_insert = []
            for question in questions:
                # Create a new question record
                question_data = {
                    'id': question.get('question_id', str(uuid.uuid4())),
                    'question_text': question.get('question_text', ''),
                    'options': question.get('options', []),
                    'correct_answer': question.get('correct_answer', ''),
                    'explanation': question.get('explanation', ''),
                    'category': question.get('category', 'Geral'),
                    'difficulty_level': question.get('difficulty_level', 'medium'),
                    'exam_year': question.get('exam_year'),
                    'source': question.get('source', 'FGV'),
                    'is_active': True,
                    'created_at': datetime.utcnow().isoformat(),
                    'updated_at': datetime.utcnow().isoformat()
                }
                questions_to_insert.append(question_data)
            
            # Insert in batches
            for i in range(0, len(questions_to_insert), self.batch_size):
                batch = questions_to_insert[i:i + self.batch_size]
                self.supabase.table('questions').upsert(batch).execute()
                self.migrated_count += len(batch)
                print(f"   ✅ Migrated batch {i//self.batch_size + 1}/{(len(questions_to_insert)-1)//self.batch_size + 1} ({len(batch)} questions)")
            
            print(f"✅ Successfully migrated {self.migrated_count} questions")
            return True
            
        except Exception as e:
            print(f"❌ Error migrating questions: {e}")
            self.error_count += 1
            return False
    
    def cleanup_question_stats(self):
        """Clean up question_stats table by removing question data."""
        print("🧹 Cleaning up question_stats table...")
        
        try:
            # Update all question_stats records to remove question data
            result = self.supabase.table('question_stats') \
                .update({
                    'question_text': None,
                    'options': None,
                    'correct_answer': None,
                    'explanation': None,
                    'category': None,
                    'difficulty_level': None,
                    'exam_year': None,
                    'source': None
                }) \
                .neq('question_text', None) \
                .execute()
            
            print(f"✅ Cleaned up {len(result.data) if result.data else 0} records in question_stats table")
            
        except Exception as e:
            print(f"⚠️  Error cleaning up question_stats: {e}")
    
    def run_fix(self):
        """Run the complete fix process."""
        print("🔧 Starting Question Stats Fix")
        print("=" * 50)
        
        try:
            # Find questions in question_stats
            questions = self.get_questions_in_stats()
            
            if not questions:
                print("ℹ️ No questions found in question_stats table")
                return True
            
            # Migrate questions to questions table
            success = self.migrate_questions(questions)
            
            if success:
                # Clean up question_stats
                self.cleanup_question_stats()
                
                print(f"\n✅ Fix completed successfully!")
                print(f"   - Questions migrated: {self.migrated_count}")
                print(f"   - Errors: {self.error_count}")
                
                return True
            else:
                print("\n❌ Fix failed")
                return False
                
        except Exception as e:
            print(f"❌ Fix process error: {e}")
            return False

def main():
    """Main function to run the fix."""
    # Check environment variables
    if not os.getenv("SUPABASE_URL"):
        print("❌ SUPABASE_URL environment variable is required")
        print("   Set it in your .env file or environment")
        return
    
    if not os.getenv("SUPABASE_SERVICE_KEY"):
        print("❌ SUPABASE_SERVICE_KEY environment variable is required")
        print("   Set it in your .env file or environment")
        print("   Use the service_role key from Supabase dashboard")
        return
    
    # Run fix
    fixer = QuestionStatsFixer()
    success = fixer.run_fix()
    
    if success:
        print("\n✅ Question stats fix completed successfully!")
    else:
        print("\n❌ Question stats fix failed!")

if __name__ == "__main__":
    import uuid  # Import uuid module here to avoid circular imports
    main()
