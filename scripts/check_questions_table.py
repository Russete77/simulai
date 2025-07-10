#!/usr/bin/env python3
"""
Check the content of the questions table.
"""

import os
import json
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../.env')

def check_questions_table():
    """Check the content of the questions table."""
    print("🔍 Checking questions table...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    try:
        # Get total count of questions
        count_result = supabase.table('questions').select('id', count='exact').execute()
        total_questions = count_result.count if hasattr(count_result, 'count') else 'unknown'
        print(f"📊 Total questions in database: {total_questions}")
        
        # Get a few sample questions
        result = supabase.table('questions').select('*').limit(5).execute()
        
        if not result.data:
            print("❌ No questions found in the database")
            return
        
        print("\n📋 Sample questions:")
        for i, question in enumerate(result.data, 1):
            print(f"\n📌 Question {i} (ID: {question.get('id')})")
            print(f"   Text: {question.get('question_text', '')[:100]}...")
            print(f"   Category: {question.get('category', 'N/A')}")
            print(f"   Year: {question.get('exam_year', 'N/A')}")
            print(f"   Options: {len(question.get('options', []))} options")
            print(f"   Correct Answer: {question.get('correct_answer', 'N/A')}")
            
            if 'options' in question and question['options']:
                print("   First option:")
                print(f"      {question['options'][0]}")
        
    except Exception as e:
        print(f"❌ Error checking questions table: {e}")
        raise

if __name__ == "__main__":
    check_questions_table()
