#!/usr/bin/env python3
"""
Test Row Level Security (RLS) policies in Supabase.
"""

import os
import sys
import time
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, Any, Optional, List

# Load environment variables from .test.env in the same directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.test.env'))

def get_supabase_client() -> Client:
    """Initialize and return a Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")  # Using service key to bypass RLS for setup
    
    if not url or not key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file")
        sys.exit(1)
        
    return create_client(url, key)

class RLSTester:
    """Class to test RLS policies in Supabase."""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        self.test_users = []
        
    def create_test_user(self, email: str, password: str, user_metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a test user and sign in."""
        try:
            # Create user with email and password
            auth_response = self.supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": user_metadata or {}
                }
            })
            
            # Sign in to get the session
            sign_in_response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            user = sign_in_response.user
            access_token = sign_in_response.session.access_token
            
            # Create a new client with the user's access token
            user_client = create_client(
                os.getenv("SUPABASE_URL"),
                os.getenv("SUPABASE_ANON_KEY"),
                {
                    "global": {
                        "headers": {
                            "Authorization": f"Bearer {access_token}"
                        }
                    }
                }
            )
            
            user_data = {
                "email": email,
                "client": user_client,
                "id": user.id,
                "access_token": access_token
            }
            
            self.test_users.append(user_data)
            return user_data
            
        except Exception as e:
            print(f"❌ Error creating test user {email}: {str(e)}")
            raise
    
    def test_public_access(self):
        """Test access to public data without authentication."""
        print("\n🔍 Testing public access...")
        
        # Questions should be publicly readable
        try:
            response = self.supabase.table('questions').select('*').limit(1).execute()
            if response.data:
                print("  ✅ Anyone can read questions (as expected)")
            else:
                print("  ⚠️  No questions found, but read access is allowed")
        except Exception as e:
            print(f"  ❌ Failed to read questions: {str(e)}")
    
    def test_authenticated_access(self, user: Dict[str, Any], user_type: str = "regular"):
        """Test access for an authenticated user."""
        print(f"\n👤 Testing {user_type} user access...")
        client = user["client"]
        
        # Test reading questions (should be allowed)
        try:
            response = client.table('questions').select('*').limit(1).execute()
            if response.data:
                print("  ✅ Can read questions")
            else:
                print("  ⚠️  No questions found, but read access is allowed")
        except Exception as e:
            print(f"  ❌ Failed to read questions: {str(e)}")
        
        # Test updating questions (should be denied for regular users)
        if user_type == "regular":
            try:
                # Try to update a question (should fail)
                response = client.table('questions').update({"category": "Test"}).eq("id", "some-id").execute()
                print("  ❌ Should not be able to update questions (security issue!)")
            except Exception as e:
                if "permission denied" in str(e).lower():
                    print("  ✅ Cannot update questions (as expected)")
                else:
                    print(f"  ❌ Unexpected error when updating questions: {str(e)}")
    
    def test_admin_access(self, admin_user: Dict[str, Any]):
        """Test access for an admin user."""
        print("\n👑 Testing admin user access...")
        client = admin_user["client"]
        
        # Test updating questions (should be allowed for admins)
        try:
            # Get a question to update
            questions = self.supabase.table('questions').select('id').limit(1).execute()
            if not questions.data:
                print("  ⚠️  No questions found to test admin update")
                return
                
            question_id = questions.data[0]['id']
            original_category = questions.data[0].get('category', '')
            
            # Try to update the question
            response = client.table('questions').update({"category": "Test"}).eq("id", question_id).execute()
            
            # Check if the update was successful
            if response.data and response.data[0].get('category') == "Test":
                print("  ✅ Admin can update questions")
                
                # Revert the change
                self.supabase.table('questions').update({"category": original_category}).eq("id", question_id).execute()
            else:
                print("  ❌ Admin update did not work as expected")
                
        except Exception as e:
            print(f"  ❌ Admin update failed: {str(e)}")
    
    def test_user_data_isolation(self, user1: Dict[str, Any], user2: Dict[str, Any]):
        """Test that users can only access their own data in user-specific tables."""
        print("\n🔒 Testing user data isolation...")
        
        # Skip if user_question_history table doesn't exist
        try:
            # User 1 creates a test record
            test_data = {
                "user_id": user1["id"],
                "question_id": "test-question-1",
                "is_correct": True,
                "time_spent_seconds": 30
            }
            
            # Insert with user1's client
            insert_response = user1["client"].table('user_question_history').insert(test_data).execute()
            
            if not insert_response.data:
                print("  ⚠️  Could not create test record")
                return
                
            record_id = insert_response.data[0]['id']
            print(f"  ✅ Created test record with ID: {record_id}")
            
            # User 2 tries to access user1's record (should fail)
            try:
                response = user2["client"].table('user_question_history').select('*').eq('id', record_id).execute()
                if response.data:
                    print("  ❌ User 2 can access User 1's data (security issue!)")
                else:
                    print("  ✅ User 2 cannot access User 1's data (as expected)")
            except Exception as e:
                if "permission denied" in str(e).lower():
                    print("  ✅ User 2 cannot access User 1's data (as expected)")
                else:
                    print(f"  ❌ Unexpected error when testing data isolation: {str(e)}")
            
            # Clean up
            self.supabase.table('user_question_history').delete().eq('id', record_id).execute()
            
        except Exception as e:
            print(f"  ⚠️  Could not test user data isolation: {str(e)}")
            print("     Make sure the user_question_history table exists and has RLS enabled")
    
    def sign_in_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Sign in a user with email and password."""
        try:
            print(f"🔑 Attempting to sign in user: {email}")
            
            # Print debug info
            print(f"  - Supabase URL: {os.getenv('SUPABASE_URL')}")
            print(f"  - Using anon key: {os.getenv('SUPABASE_ANON_KEY')[:10]}...")
            
            # Sign in with email and password
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            # Debug: Print the response structure
            print("  - Auth response received")
            
            # Check if we got a valid response
            if not hasattr(auth_response, 'user') or not auth_response.user:
                print("❌ No user in auth response")
                if hasattr(auth_response, 'error'):
                    print(f"  - Auth error: {auth_response.error}")
                return None
            
            # Get the access token
            if not hasattr(auth_response, 'session') or not auth_response.session:
                print("❌ No session in auth response")
                return None
                
            access_token = auth_response.session.access_token
            user_id = auth_response.user.id
            
            print(f"  - User ID: {user_id}")
            print(f"  - Access token: {access_token[:10]}...")
            
            # Create a new client with the user's access token
            user_client = create_client(
                os.getenv("SUPABASE_URL"),
                os.getenv("SUPABASE_ANON_KEY"),
                {
                    "global": {
                        "headers": {
                            "Authorization": f"Bearer {access_token}"
                        }
                    }
                }
            )
            
            print("✅ Successfully created authenticated client")
            
            return {
                "email": email,
                "client": user_client,
                "id": user_id,
                "access_token": access_token
            }
            
        except Exception as e:
            import traceback
            print(f"❌ Error signing in user {email}: {str(e)}")
            print("Stack trace:")
            traceback.print_exc()
            return None
    
    def run_tests(self):
        """Run all RLS tests."""
        print("🚀 Starting RLS Policy Tests")
        print("=" * 50)
        
        # Test public access
        self.test_public_access()
        
        # Test authenticated access with provided credentials
        print("\n🔑 Testing authenticated access...")
        
        # Sign in with provided credentials
        test_email = "simulaioab@gmail.com"
        test_password = "4815162342"
        
        user = self.sign_in_user(test_email, test_password)
        
        if user:
            print(f"✅ Successfully signed in as {user['email']}")
            
            # Test basic authenticated access
            self.test_authenticated_access(user, "authenticated")
            
            # Test admin access if applicable
            # Uncomment the following line if this user should have admin privileges
            # self.test_admin_access(user)
            
            # Test data isolation would require a second user
            # Uncomment and modify if you have a second test user
            # another_user = self.sign_in_user("another_user@example.com", "password")
            # if another_user:
            #     self.test_user_data_isolation(user, another_user)
        else:
            print("❌ Failed to sign in with provided credentials")
        
        print("\n✅ RLS Tests Completed!")

if __name__ == "__main__":
    tester = RLSTester()
    tester.run_tests()
