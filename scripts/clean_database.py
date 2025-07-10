#!/usr/bin/env python3
"""
Clean database tables before reimporting data
"""

import os
import time
from supabase import create_client
from dotenv import load_dotenv
from typing import List, Optional

class DatabaseCleaner:
    def __init__(self):
        """Initialize the cleaner with Supabase client."""
        load_dotenv(dotenv_path='../.env')
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")
        
        self.supabase = create_client(self.supabase_url, self.supabase_key)
    
    def clean_table(self, table_name: str) -> bool:
        """Delete all rows from a table using pagination to avoid timeouts."""
        print(f"🧹 Cleaning table: {table_name}")
        
        try:
            # First, try to disable triggers if the function exists
            try:
                self.supabase.rpc('disable_triggers', {'table_name': table_name}).execute()
            except Exception as e:
                print(f"⚠️  Could not disable triggers (function may not exist): {e}")
            
            # Delete in batches to avoid timeouts
            batch_size = 100
            total_deleted = 0
            
            while True:
                # Get a batch of IDs to delete
                result = self.supabase.table(table_name) \
                    .select('id', count='exact') \
                    .limit(batch_size) \
                    .execute()
                
                if not result.data:
                    break
                
                # Extract IDs
                ids = [item['id'] for item in result.data]
                
                if not ids:
                    break
                
                # Delete the batch
                self.supabase.table(table_name).delete().in_('id', ids).execute()
                total_deleted += len(ids)
                print(f"  🗑️  Deleted {total_deleted} rows from {table_name}")
                
                # Small delay to avoid overwhelming the database
                time.sleep(0.5)
            
            print(f"✅ Successfully cleaned table: {table_name} (total: {total_deleted} rows)")
            return True
            
        except Exception as e:
            print(f"❌ Error cleaning table {table_name}: {e}")
            return False
            
        finally:
            # Always try to re-enable triggers
            try:
                self.supabase.rpc('enable_triggers', {'table_name': table_name}).execute()
            except Exception as e:
                print(f"⚠️  Could not re-enable triggers: {e}")
    
    def clean_tables(self, tables: List[str]) -> bool:
        """Clean multiple tables in the correct order."""
        success = True
        for table in tables:
            if not self.clean_table(table):
                success = False
        return success

def main():
    """Main function to clean the database."""
    print("🔍 Starting Database Cleanup")
    print("=" * 50)
    
    try:
        cleaner = DatabaseCleaner()
        
        # Clean tables in reverse order of dependencies
        success = cleaner.clean_tables(['question_stats', 'questions'])
        
        if success:
            print("\n✨ Database cleanup completed successfully!")
            return True
        else:
            print("\n⚠️  Database cleanup completed with some errors")
            return False
        
    except Exception as e:
        print(f"\n❌ Database cleanup failed: {e}")
        return False

if __name__ == "__main__":
    main()
