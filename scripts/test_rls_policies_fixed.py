#!/usr/bin/env python3
"""
Test Row Level Security (RLS) policies in Supabase.
"""

import os
import sys
import time
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase.client import ClientOptions

# Load environment variables from .test.env in the same directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.test.env'))

def get_supabase_client() -> Client:
    """Initialize and return a Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    
    if not url or not key:
        print("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")
        sys.exit(1)
        
    return create_client(url, key)

class RLSTester:
    """Class to test RLS policies in Supabase."""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        self.test_users = []
    
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
    
    def sign_in_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Sign in a user with email and password."""
        try:
            print(f"🔑 Attempting to sign in user: {email}")
            
            # Sign in with email and password
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if not hasattr(auth_response, 'user') or not auth_response.user:
                print("❌ No user in auth response")
                if hasattr(auth_response, 'error'):
                    print(f"  - Auth error: {auth_response.error}")
                return None
            
            if not hasattr(auth_response, 'session') or not auth_response.session:
                print("❌ No session in auth response")
                return None
                
            access_token = auth_response.session.access_token
            user_id = auth_response.user.id
            
            print(f"  - User ID: {user_id}")
            print(f"  - Access token: {access_token[:10]}...")
            
            # Create a new client with the user's access token
            client_options = ClientOptions({
                "headers": {
                    "Authorization": f"Bearer {access_token}",
                    "apikey": os.getenv("SUPABASE_ANON_KEY")
                },
                "auto_refresh_token": False
            })
            
            user_client = create_client(
                os.getenv("SUPABASE_URL"),
                os.getenv("SUPABASE_ANON_KEY"),
                client_options
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
                # Get a question to try to update
                questions = client.table('questions').select('id').limit(1).execute()
                if not questions.data:
                    print("  ⚠️  No questions found to test update")
                    return
                
                question_id = questions.data[0]['id']
                
                # Try to update the question (should fail for regular users)
                response = client.table('questions').update({"category": "Test"}).eq("id", question_id).execute()
                print("  ❌ Should not be able to update questions (security issue!)")
            except Exception as e:
                if "permission denied" in str(e).lower():
                    print("  ✅ Cannot update questions (as expected)")
                else:
                    print(f"  ❌ Unexpected error when updating questions: {str(e)}")
    
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
            self.test_authenticated_access(user, "regular")
            
            # Test admin access if applicable
            # Uncomment the following line if this user should have admin privileges
            # self.test_admin_access(user)
            
        else:
            print("❌ Failed to sign in with provided credentials")
        
        print("\n✅ RLS Tests Completed!")

if __name__ == "__main__":
    tester = RLSTester()
    tester.run_tests()
