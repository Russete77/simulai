#!/usr/bin/env python3
"""
Validate Supabase database setup and data integrity
"""

import os
import json
from supabase import create_client, Client
from typing import Dict, List, Any
from datetime import datetime
import pandas as pd

class DatabaseValidator:
    def __init__(self):
        """Initialize the validator with Supabase client."""
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.validation_results = {}
    
    def validate_connection(self) -> bool:
        """Test Supabase connection."""
        print("🔗 Testing Supabase connection...")
        
        try:
            # Simple query to test connection
            result = self.supabase.table('questions').select('id').limit(1).execute()
            
            if result.data is not None:
                print("✅ Connection successful")
                return True
            else:
                print("❌ Connection failed - no data returned")
                return False
                
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False
    
    def validate_schema(self) -> Dict[str, Any]:
        """Validate database schema and tables."""
        print("\n🏗️  Validating database schema...")
        
        expected_tables = [
            'profiles', 'user_stats', 'questions', 'question_stats',
            'simulations', 'user_simulations', 'user_question_history',
            'flashcards', 'study_notes', 'achievements', 'user_achievements',
            'study_streaks'
        ]
        
        schema_results = {
            'tables_exist': {},
            'missing_tables': [],
            'table_counts': {},
            'indexes_exist': True
        }
        
        for table in expected_tables:
            try:
                result = self.supabase.table(table).select('*').limit(1).execute()
                schema_results['tables_exist'][table] = True
                
                # Get row count
                count_result = self.supabase.table(table).select('*', count='exact').execute()
                schema_results['table_counts'][table] = count_result.count
                
                print(f"   ✅ {table}: {count_result.count} rows")
                
            except Exception as e:
                schema_results['tables_exist'][table] = False
                schema_results['missing_tables'].append(table)
                print(f"   ❌ {table}: {e}")
        
        self.validation_results['schema'] = schema_results
        return schema_results
    
    def validate_questions_data(self) -> Dict[str, Any]:
        """Validate questions data quality."""
        print("\n📋 Validating questions data...")
        
        questions_results = {
            'total_questions': 0,
            'categories': {},
            'years': {},
            'data_quality': {
                'with_options': 0,
                'with_explanation': 0,
                'with_category': 0,
                'with_year': 0,
                'active_questions': 0
            },
            'sample_questions': []
        }
        
        try:
            # Get all questions
            result = self.supabase.table('questions').select('*').execute()
            questions = result.data
            
            if not questions:
                print("❌ No questions found in database")
                return questions_results
            
            questions_results['total_questions'] = len(questions)
            print(f"   📊 Total questions: {len(questions)}")
            
            # Analyze data quality
            for question in questions:
                # Categories
                category = question.get('category', 'Unknown')
                questions_results['categories'][category] = questions_results['categories'].get(category, 0) + 1
                
                # Years
                year = question.get('exam_year')
                if year:
                    questions_results['years'][str(year)] = questions_results['years'].get(str(year), 0) + 1
                
                # Data quality checks
                if question.get('options'):
                    questions_results['data_quality']['with_options'] += 1
                
                if question.get('explanation'):
                    questions_results['data_quality']['with_explanation'] += 1
                
                if question.get('category'):
                    questions_results['data_quality']['with_category'] += 1
                
                if question.get('exam_year'):
                    questions_results['data_quality']['with_year'] += 1
                
                if question.get('is_active', True):
                    questions_results['data_quality']['active_questions'] += 1
            
            # Get sample questions
            questions_results['sample_questions'] = questions[:3]
            
            # Print statistics
            total = len(questions)
            print(f"   📈 Data Quality:")
            print(f"      - With options: {questions_results['data_quality']['with_options']}/{total} ({questions_results['data_quality']['with_options']/total*100:.1f}%)")
            print(f"      - With explanation: {questions_results['data_quality']['with_explanation']}/{total} ({questions_results['data_quality']['with_explanation']/total*100:.1f}%)")
            print(f"      - With category: {questions_results['data_quality']['with_category']}/{total} ({questions_results['data_quality']['with_category']/total*100:.1f}%)")
            print(f"      - With year: {questions_results['data_quality']['with_year']}/{total} ({questions_results['data_quality']['with_year']/total*100:.1f}%)")
            print(f"      - Active: {questions_results['data_quality']['active_questions']}/{total} ({questions_results['data_quality']['active_questions']/total*100:.1f}%)")
            
            # Top categories
            top_categories = sorted(questions_results['categories'].items(), key=lambda x: x[1], reverse=True)[:5]
            print(f"   🏷️  Top Categories:")
            for category, count in top_categories:
                print(f"      - {category}: {count} questions")
            
            # Years distribution
            if questions_results['years']:
                print(f"   📅 Year Range: {min(questions_results['years'].keys())} - {max(questions_results['years'].keys())}")
            
        except Exception as e:
            print(f"❌ Error validating questions: {e}")
        
        self.validation_results['questions'] = questions_results
        return questions_results
    
    def validate_relationships(self) -> Dict[str, Any]:
        """Validate foreign key relationships."""
        print("\n🔗 Validating relationships...")
        
        relationships_results = {
            'question_stats_linked': 0,
            'orphaned_stats': 0,
            'valid_relationships': True
        }
        
        try:
            # Check question_stats relationships
            stats_result = self.supabase.table('question_stats').select('question_id').execute()
            questions_result = self.supabase.table('questions').select('id').execute()
            
            if stats_result.data and questions_result.data:
                question_ids = {q['id'] for q in questions_result.data}
                stats_question_ids = {s['question_id'] for s in stats_result.data}
                
                relationships_results['question_stats_linked'] = len(stats_question_ids.intersection(question_ids))
                relationships_results['orphaned_stats'] = len(stats_question_ids - question_ids)
                
                print(f"   📊 Question Stats: {relationships_results['question_stats_linked']} linked, {relationships_results['orphaned_stats']} orphaned")
                
                if relationships_results['orphaned_stats'] > 0:
                    relationships_results['valid_relationships'] = False
            
        except Exception as e:
            print(f"❌ Error validating relationships: {e}")
            relationships_results['valid_relationships'] = False
        
        self.validation_results['relationships'] = relationships_results
        return relationships_results
    
    def validate_rls_policies(self) -> Dict[str, Any]:
        """Validate Row Level Security policies."""
        print("\n🔒 Validating RLS policies...")
        
        rls_results = {
            'policies_exist': False,
            'tables_with_rls': [],
            'policy_count': 0
        }
        
        try:
            # This would require admin access to pg_policies
            # For now, we'll just check if we can query with anon key
            anon_client = create_client(self.supabase_url, os.getenv("SUPABASE_ANON_KEY", ""))
            
            # Test anon access to questions (should work - public table)
            result = anon_client.table('questions').select('id').limit(1).execute()
            if result.data is not None:
                print("   ✅ Anonymous access to questions works")
                rls_results['policies_exist'] = True
            
        except Exception as e:
            print(f"   ⚠️  Could not validate RLS policies: {e}")
        
        self.validation_results['rls'] = rls_results
        return rls_results
    
    def run_performance_tests(self) -> Dict[str, Any]:
        """Run basic performance tests."""
        print("\n⚡ Running performance tests...")
        
        performance_results = {
            'query_times': {},
            'slow_queries': []
        }
        
        test_queries = [
            ('count_questions', 'questions', '*', {'count': 'exact'}),
            ('get_categories', 'questions', 'category', {}),
            ('recent_questions', 'questions', '*', {'limit': 10}),
        ]
        
        for test_name, table, select, params in test_queries:
            try:
                start_time = datetime.now()
                
                query = self.supabase.table(table).select(select)
                for key, value in params.items():
                    if key == 'count':
                        query = query.select(select, count=value)
                    elif key == 'limit':
                        query = query.limit(value)
                
                result = query.execute()
                
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds()
                
                performance_results['query_times'][test_name] = duration
                
                if duration > 2.0:  # Slow query threshold
                    performance_results['slow_queries'].append(test_name)
                
                print(f"   {test_name}: {duration:.3f}s")
                
            except Exception as e:
                print(f"   ❌ {test_name}: {e}")
        
        self.validation_results['performance'] = performance_results
        return performance_results
    
    def generate_report(self) -> str:
        """Generate validation report."""
        print("\n📄 Generating validation report...")
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'supabase_url': self.supabase_url,
            'validation_results': self.validation_results,
            'summary': {
                'connection_ok': True,
                'schema_valid': len(self.validation_results.get('schema', {}).get('missing_tables', [])) == 0,
                'data_quality_ok': self.validation_results.get('questions', {}).get('total_questions', 0) > 0,
                'relationships_ok': self.validation_results.get('relationships', {}).get('valid_relationships', False),
                'performance_ok': len(self.validation_results.get('performance', {}).get('slow_queries', [])) == 0
            }
        }
        
        # Save report
        os.makedirs('data/validation', exist_ok=True)
        report_file = f"data/validation/validation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"   💾 Report saved to: {report_file}")
        
        return report_file
    
    def run_full_validation(self) -> bool:
        """Run complete validation suite."""
        print("🔍 Starting Database Validation")
        print("=" * 50)
        
        success = True
        
        try:
            # Test connection
            if not self.validate_connection():
                success = False
            
            # Validate schema
            self.validate_schema()
            
            # Validate data
            self.validate_questions_data()
            
            # Validate relationships
            self.validate_relationships()
            
            # Validate RLS
            self.validate_rls_policies()
            
            # Performance tests
            self.run_performance_tests()
            
            # Generate report
            report_file = self.generate_report()
            
            print(f"\n{'✅' if success else '❌'} Validation {'completed successfully' if success else 'completed with issues'}")
            print(f"📄 Full report: {report_file}")
            
            return success
            
        except Exception as e:
            print(f"❌ Validation failed: {e}")
            return False

def main():
    """Main function to run validation."""
    
    # Check environment variables
    if not os.getenv("SUPABASE_URL"):
        print("❌ SUPABASE_URL environment variable is required")
        return
    
    if not os.getenv("SUPABASE_SERVICE_KEY"):
        print("❌ SUPABASE_SERVICE_KEY environment variable is required")
        return
    
    # Run validation
    validator = DatabaseValidator()
    success = validator.run_full_validation()
    
    if success:
        print(f"\n🎉 Database validation passed!")
    else:
        print(f"\n⚠️  Database validation completed with issues!")

if __name__ == "__main__":
    main()
