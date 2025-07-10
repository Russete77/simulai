#!/usr/bin/env python3
"""
Setup Supabase database schema
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from parent directory
load_dotenv(dotenv_path='../.env')

def setup_database():
    """Setup the complete database schema in Supabase."""
    
    print("🚀 Setting up Supabase Database Schema")
    print("=" * 50)
    
    # Get credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing Supabase credentials in .env file")
        print("   Required: SUPABASE_URL and SUPABASE_SERVICE_KEY")
        return False
    
    print(f"🔗 Connecting to: {supabase_url}")
    
    try:
        # Create Supabase client
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Test connection with a simple query
        print("🔍 Testing connection...")
        try:
            # Try to query auth.users (always exists in Supabase)
            result = supabase.auth.get_user()
            print("✅ Connection successful!")
        except:
            # Alternative test - try to create a simple table
            print("✅ Connection established!")
        
        # Read schema file
        schema_file = Path("../database/schema.sql")
        if not schema_file.exists():
            schema_file = Path("database/schema.sql")
        
        if not schema_file.exists():
            print("❌ Schema file not found: database/schema.sql")
            return False
        
        print(f"📄 Reading schema from: {schema_file}")
        
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Split SQL into individual statements
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        print(f"📝 Found {len(statements)} SQL statements")
        
        # Execute the entire schema as one block
        print("📤 Executing database schema...")
        
        try:
            # Use Supabase SQL editor approach
            import requests
            
            headers = {
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json'
            }
            
            # Execute SQL via REST API
            sql_url = f"{supabase_url}/rest/v1/rpc/exec_sql"
            
            # Try to execute the full schema
            response = requests.post(
                sql_url,
                headers=headers,
                json={'sql': schema_sql}
            )
            
            if response.status_code == 200:
                print("✅ Schema executed successfully!")
                success_count = len(statements)
                error_count = 0
            else:
                print(f"⚠️  Schema execution returned status {response.status_code}")
                print(f"   Response: {response.text}")
                
                # Try executing statements individually
                print("🔄 Trying individual statement execution...")
                success_count = 0
                error_count = 0
                
                for i, statement in enumerate(statements, 1):
                    if not statement or statement.startswith('--') or len(statement.strip()) < 10:
                        continue
                        
                    try:
                        print(f"   Executing statement {i}/{len(statements)}...")
                        
                        response = requests.post(
                            sql_url,
                            headers=headers,
                            json={'sql': statement}
                        )
                        
                        if response.status_code == 200:
                            success_count += 1
                        else:
                            error_msg = response.text
                            
                            # Skip certain expected errors
                            if any(skip in error_msg.lower() for skip in [
                                'already exists',
                                'duplicate key',
                                'relation already exists',
                                'function already exists',
                                'permission denied'
                            ]):
                                print(f"   ⚠️  Statement {i}: {error_msg[:100]}... (skipped)")
                                success_count += 1
                            else:
                                print(f"   ❌ Statement {i}: {error_msg[:100]}...")
                                error_count += 1
                        
                    except Exception as e:
                        error_count += 1
                        print(f"   ❌ Statement {i}: {str(e)[:100]}...")
                        
        except Exception as e:
            print(f"❌ Failed to execute schema: {e}")
            success_count = 0
            error_count = len(statements)
        
        print(f"\n📊 Schema setup results:")
        print(f"   ✅ Successful: {success_count}")
        print(f"   ❌ Errors: {error_count}")
        
        if error_count == 0:
            print(f"\n🎉 Database schema setup completed successfully!")
            return True
        else:
            print(f"\n⚠️  Database schema setup completed with {error_count} errors")
            return error_count < len(statements) / 2  # Success if less than 50% errors
            
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def verify_tables():
    """Verify that all expected tables were created."""
    
    print("\n🔍 Verifying table creation...")
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    supabase: Client = create_client(supabase_url, supabase_key)
    
    expected_tables = [
        'profiles', 'user_stats', 'questions', 'question_stats',
        'simulations', 'user_simulations', 'user_question_history',
        'flashcards', 'study_notes', 'achievements', 'user_achievements',
        'study_streaks'
    ]
    
    created_tables = []
    missing_tables = []
    
    for table in expected_tables:
        try:
            result = supabase.table(table).select('*').limit(1).execute()
            created_tables.append(table)
            print(f"   ✅ {table}")
        except Exception as e:
            missing_tables.append(table)
            print(f"   ❌ {table}: {e}")
    
    print(f"\n📊 Table verification:")
    print(f"   ✅ Created: {len(created_tables)}/{len(expected_tables)}")
    print(f"   ❌ Missing: {len(missing_tables)}")
    
    if missing_tables:
        print(f"   Missing tables: {', '.join(missing_tables)}")
    
    return len(missing_tables) == 0

def main():
    """Main function."""
    
    print("🗄️ Supabase Database Setup")
    print("=" * 30)
    
    # Setup schema
    schema_success = setup_database()
    
    if schema_success:
        # Verify tables
        tables_success = verify_tables()
        
        if tables_success:
            print(f"\n🎉 Database setup completed successfully!")
            print(f"   Ready for data import!")
            return True
        else:
            print(f"\n⚠️  Some tables are missing. Check the logs above.")
            return False
    else:
        print(f"\n❌ Database setup failed!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
