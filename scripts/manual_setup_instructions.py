#!/usr/bin/env python3
"""
Generate manual setup instructions for Supabase
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_setup_instructions():
    """Generate step-by-step instructions for manual Supabase setup."""
    
    print("📋 Manual Supabase Database Setup Instructions")
    print("=" * 60)
    
    supabase_url = os.getenv("SUPABASE_URL")
    
    if not supabase_url:
        print("❌ SUPABASE_URL not found in .env file")
        return
    
    print(f"🔗 Supabase Project: {supabase_url}")
    print()
    
    # Read schema file
    schema_file = Path("../database/schema.sql")
    if not schema_file.exists():
        schema_file = Path("database/schema.sql")
    
    if not schema_file.exists():
        print("❌ Schema file not found: database/schema.sql")
        return
    
    with open(schema_file, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    print("🚀 STEP-BY-STEP SETUP INSTRUCTIONS:")
    print()
    
    print("1️⃣  **Open Supabase Dashboard**")
    print(f"   - Go to: {supabase_url}")
    print("   - Login to your account")
    print()
    
    print("2️⃣  **Open SQL Editor**")
    print("   - Click on 'SQL Editor' in the left sidebar")
    print("   - Click 'New Query' button")
    print()
    
    print("3️⃣  **Execute Database Schema**")
    print("   - Copy the ENTIRE content from: database/schema.sql")
    print("   - Paste it into the SQL Editor")
    print("   - Click 'Run' button (or Ctrl+Enter)")
    print()
    
    print("4️⃣  **Verify Tables Created**")
    print("   - Go to 'Table Editor' in the left sidebar")
    print("   - You should see these tables:")
    
    expected_tables = [
        'profiles', 'user_stats', 'questions', 'question_stats',
        'simulations', 'user_simulations', 'user_question_history',
        'flashcards', 'study_notes', 'achievements', 'user_achievements',
        'study_streaks'
    ]
    
    for i, table in enumerate(expected_tables, 1):
        print(f"     {i:2d}. ✅ {table}")
    
    print()
    print("5️⃣  **Test Connection**")
    print("   - Run this command to test:")
    print("   python validate_database.py")
    print()
    
    # Save schema to a separate file for easy copying
    output_file = "supabase_schema_to_copy.sql"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Simulai OAB Database Schema\n")
        f.write("-- Copy this entire content to Supabase SQL Editor\n")
        f.write("-- Generated automatically - do not edit manually\n\n")
        f.write(schema_sql)
    
    print(f"📄 **Schema file created for easy copying:**")
    print(f"   File: {output_file}")
    print(f"   Size: {len(schema_sql)} characters")
    print()
    
    print("🔧 **Alternative: Use Supabase CLI**")
    print("   If you have Supabase CLI installed:")
    print("   1. supabase login")
    print("   2. supabase link --project-ref YOUR_PROJECT_ID")
    print("   3. supabase db push")
    print()
    
    print("⚠️  **Common Issues & Solutions:**")
    print()
    print("   🚫 'permission denied' errors:")
    print("      - Make sure you're logged in as project owner")
    print("      - Some RLS policies might need manual adjustment")
    print()
    print("   🚫 'relation already exists' errors:")
    print("      - These are normal if running schema multiple times")
    print("      - You can ignore these warnings")
    print()
    print("   🚫 'function does not exist' errors:")
    print("      - Make sure to run the ENTIRE schema at once")
    print("      - Functions are defined before they're used")
    print()
    
    print("✅ **After successful setup, you can:**")
    print("   - Import OAB dataset: python import_dataset.py")
    print("   - Validate database: python validate_database.py")
    print("   - Start developing the API endpoints")
    print()
    
    print("🎯 **Goal: 12 tables + 5,605 OAB questions ready for use!**")

def main():
    generate_setup_instructions()

if __name__ == "__main__":
    main()
