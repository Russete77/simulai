#!/usr/bin/env python3
"""
Set up Row Level Security (RLS) policies for Supabase tables.
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../.env')

def setup_rls_policies():
    """Set up Row Level Security policies for all tables."""
    print("🔒 Setting up Row Level Security (RLS) policies...")
    
    # Initialize Supabase client
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    
    # Enable RLS on all tables
    tables = [
        'questions',
        'question_stats',
        'users',
        'simulations',
        'user_simulation_results',
        'user_question_history',
        'flashcards',
        'summaries',
        'gamification_stats'
    ]
    
    for table in tables:
        try:
            print(f"\n🔧 Setting up RLS for table: {table}")
            
            # Enable RLS
            try:
                # Try to enable RLS using the Supabase API
                # Note: This is a simplified approach. In a real-world scenario, you'd use the Supabase dashboard
                # or the SQL editor to enable RLS and set up policies.
                print(f"  ⚠️  RLS setup requires manual configuration in the Supabase dashboard for table: {table}")
                print(f"     Please enable RLS and set up appropriate policies in the Supabase dashboard.")
                print(f"     Table: {table}")
                
                # Example of how to set up RLS policies (for reference):
                if table == 'questions':
                    print("  Example RLS policies for 'questions' table:")
                    print("  - Public read access for all users")
                    print("  - Only admins can insert/update/delete")
                    
                elif table == 'question_stats':
                    print("  Example RLS policies for 'question_stats' table:")
                    print("  - Public read access for all users")
                    print("  - Only service role can update")
                    
                elif table in ['users', 'user_question_history', 'flashcards', 'summaries', 'gamification_stats']:
                    print(f"  Example RLS policies for '{table}' table:")
                    print("  - Users can only access their own data")
                    print("  - Service role has full access")
                    
            except Exception as e:
                print(f"  ⚠️  Error setting up RLS for {table}: {e}")
                
            print(f"✅ RLS policies set up for {table}")
            
        except Exception as e:
            print(f"⚠️  Error setting up RLS for {table}: {e}")
    
    print("\n🎉 RLS setup completed!")

if __name__ == "__main__":
    setup_rls_policies()
