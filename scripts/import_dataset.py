#!/usr/bin/env python3
"""
Import OAB dataset from Hugging Face to Supabase
"""

import os
import json
import pandas as pd
from datasets import load_dataset
from supabase import create_client, Client
from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
import re
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from parent directory
load_dotenv(dotenv_path='../.env')

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Service role key for admin operations
DATASET_NAME = "russ7/oab_exams_2011_2025_combined"

class OABDatasetImporter:
    def __init__(self):
        """Initialize the importer with Supabase client."""
        if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")
        
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        self.batch_size = 100
        self.imported_count = 0
        self.error_count = 0
        
    def load_dataset(self) -> pd.DataFrame:
        """Load the OAB dataset from Hugging Face."""
        print(f"🔄 Loading dataset: {DATASET_NAME}")
        
        try:
            dataset = load_dataset(DATASET_NAME)
            df = dataset['train'].to_pandas()
            
            print(f"✅ Dataset loaded successfully!")
            print(f"   - Total rows: {len(df)}")
            print(f"   - Columns: {list(df.columns)}")
            
            return df
            
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            raise
    
    def analyze_dataset_structure(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze the dataset structure to understand the data format."""
        print(f"\n🔍 Analyzing dataset structure...")
        
        # Show sample data
        print(f"\nSample data (first row):")
        for col in df.columns:
            value = df.iloc[0][col]
            if isinstance(value, str) and len(value) > 200:
                print(f"  {col}: {value[:200]}...")
            else:
                print(f"  {col}: {value}")
        
        # Analyze data types
        analysis = {
            'total_rows': len(df),
            'columns': list(df.columns),
            'dtypes': {col: str(dtype) for col, dtype in df.dtypes.items()},
            'sample_data': df.head(3).to_dict('records')
        }
        
        return analysis
    
    def clean_and_transform_data(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Clean and transform the dataset for Supabase import."""
        print(f"\n🧹 Cleaning and transforming data...")
        
        questions = []
        
        for idx, row in df.iterrows():
            try:
                # Extract question data based on common OAB dataset formats
                question_data = self._extract_question_data(row, idx)
                if question_data:
                    questions.append(question_data)
                    
            except Exception as e:
                print(f"⚠️  Error processing row {idx}: {e}")
                self.error_count += 1
                continue
        
        print(f"✅ Processed {len(questions)} questions successfully")
        print(f"⚠️  {self.error_count} errors encountered")
        
        return questions
    
    def _extract_question_data(self, row: pd.Series, idx: int) -> Optional[Dict[str, Any]]:
        """Extract and format question data from a dataset row."""
        
        # Common column mappings for OAB datasets
        column_mappings = {
            'question': ['question', 'pergunta', 'enunciado', 'text', 'question_text'],
            'options': ['options', 'alternativas', 'choices', 'opcoes'],
            'answer': ['answer', 'resposta', 'correct_answer', 'gabarito'],
            'explanation': ['explanation', 'explicacao', 'justificativa', 'comentario'],
            'category': ['category', 'categoria', 'materia', 'subject', 'area'],
            'year': ['year', 'ano', 'exam_year'],
            'phase': ['phase', 'fase', 'exam_phase'],
        }
        
        # Extract data using flexible column matching
        question_text = self._find_column_value(row, column_mappings['question'])
        options = self._find_column_value(row, column_mappings['options'])
        correct_answer = self._find_column_value(row, column_mappings['answer'])
        explanation = self._find_column_value(row, column_mappings['explanation'])
        category = self._find_column_value(row, column_mappings['category'])
        year = self._find_column_value(row, column_mappings['year'])
        phase = self._find_column_value(row, column_mappings['phase'])
        
        # Validate required fields
        if not question_text or not correct_answer:
            return None
        
        # Process options
        processed_options = self._process_options(options)
        if not processed_options:
            return None
        
        # Extract year from text if not found in dedicated column
        if not year and question_text:
            year_match = re.search(r'20\d{2}', str(question_text))
            if year_match:
                year = int(year_match.group())
        
        # Determine category from text if not provided
        if not category:
            category = self._infer_category(question_text)
        
        # Create question record
        question_data = {
            'id': str(uuid.uuid4()),
            'external_id': f"hf_{DATASET_NAME.split('/')[-1]}_{idx}",
            'question_text': str(question_text).strip(),
            'options': processed_options,
            'correct_answer': str(correct_answer).strip().upper(),
            'explanation': str(explanation).strip() if explanation else None,
            'category': str(category).strip() if category else 'Geral',
            'subcategory': None,
            'difficulty_level': 'medium',  # Default, will be calculated later
            'exam_year': int(year) if year and str(year).isdigit() else None,
            'exam_edition': str(phase).strip() if phase else None,
            'source': 'FGV',
            'tags': self._extract_tags(question_text, category),
            'is_active': True,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        return question_data
    
    def _find_column_value(self, row: pd.Series, possible_columns: List[str]) -> Any:
        """Find value from row using possible column names."""
        for col in possible_columns:
            for actual_col in row.index:
                # Convert actual_col to string to handle non-string column names
                actual_col_str = str(actual_col).lower()
                if col.lower() in actual_col_str:
                    value = row[actual_col]
                    if pd.notna(value) and str(value).strip():
                        return value
        return None
    
    def _process_options(self, options: Any) -> Optional[List[Dict[str, str]]]:
        """Process question options into standardized format."""
        if not options:
            return None
        
        try:
            # Handle Hugging Face dataset format with 'label' and 'text' keys
            if isinstance(options, dict) and 'label' in options and 'text' in options:
                # Convert NumPy arrays to Python lists if needed
                labels = list(options['label']) if hasattr(options['label'], '__iter__') else [options['label']]
                texts = list(options['text']) if hasattr(options['text'], '__iter__') else [options['text']]
                
                # Pair labels with texts
                processed = []
                for label, text in zip(labels, texts):
                    # Ensure label is a single character (A, B, C, etc.)
                    if isinstance(label, str) and len(label) == 1 and label.isalpha():
                        key = label.upper()
                    else:
                        # Fallback to A, B, C... if label is not a valid letter
                        key = chr(65 + len(processed))
                    
                    processed.append({"key": key, "text": str(text).strip()})
                
                return processed
            
            # If options is already a list/dict
            if isinstance(options, (list, dict)):
                if isinstance(options, dict):
                    return [{"key": k, "text": str(v)} for k, v in options.items()]
                else:
                    # Assume it's a list of options
                    processed = []
                    for i, option in enumerate(options):
                        key = chr(65 + i)  # A, B, C, D, E
                        processed.append({"key": key, "text": str(option).strip()})
                    return processed
            
            # If options is a string, try to parse it
            options_str = str(options)
            
            # Try to parse as JSON first
            try:
                parsed = json.loads(options_str)
                if isinstance(parsed, dict):
                    return [{"key": k, "text": str(v).strip()} for k, v in parsed.items()]
                elif isinstance(parsed, list):
                    processed = []
                    for i, option in enumerate(parsed):
                        key = chr(65 + i)
                        processed.append({"key": key, "text": str(option).strip()})
                    return processed
            except (json.JSONDecodeError, TypeError):
                pass
            
            # Try to parse structured text (A) option1 (B) option2 etc.
            pattern = r'\(([A-E])\)\s*([^(]+?)(?=\([A-E]\)|$)'
            matches = re.findall(pattern, options_str, re.IGNORECASE)
            
            if matches:
                processed = []
                for match in matches:
                    key = match[0].upper()
                    text = match[1].strip()
                    processed.append({"key": key, "text": text})
                return processed
            
            # Fallback: split by common delimiters
            delimiters = ['\n', ';', '|']
            for delimiter in delimiters:
                if delimiter in options_str:
                    parts = options_str.split(delimiter)
                    if len(parts) >= 2:
                        processed = []
                        for i, part in enumerate(parts[:5]):  # Max 5 options
                            part = part.strip()
                            if part:
                                key = chr(65 + i)
                                processed.append({"key": key, "text": part})
                        return processed if processed else None
            
            return None
            
        except Exception as e:
            print(f"Error processing options: {e}")
            return None
    
    def _infer_category(self, question_text: str) -> str:
        """Infer category from question text."""
        if not question_text:
            return 'Geral'
        
        # Convert to string before calling .lower() to handle cases where question_text is a number
        text_lower = str(question_text).lower()
        
        categories = {
            'Direito Civil': ['civil', 'contrato', 'propriedade', 'família', 'sucessões'],
            'Direito Penal': ['penal', 'crime', 'delito', 'pena', 'prisão'],
            'Direito Constitucional': ['constitucional', 'constituição', 'direitos fundamentais'],
            'Direito Administrativo': ['administrativo', 'servidor público', 'licitação'],
            'Direito Tributário': ['tributário', 'imposto', 'taxa', 'contribuição'],
            'Direito Processual Civil': ['processual civil', 'processo civil', 'procedimento'],
            'Direito Processual Penal': ['processual penal', 'processo penal', 'inquérito'],
            'Direito do Trabalho': ['trabalho', 'trabalhista', 'empregado', 'empregador'],
            'Direito Empresarial': ['empresarial', 'sociedade', 'falência', 'recuperação'],
            'Ética Profissional': ['ética', 'estatuto', 'oab', 'advogado']
        }
        
        for category, keywords in categories.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
        
        return 'Geral'
    
    def _extract_tags(self, question_text: str, category: str) -> List[str]:
        """Extract relevant tags from question text."""
        tags = []
        
        if category and category != 'Geral':
            tags.append(category.lower().replace(' ', '_'))
        
        # Add common legal terms as tags
        legal_terms = [
            'jurisprudência', 'súmula', 'lei', 'código', 'artigo',
            'princípio', 'doutrina', 'precedente', 'acórdão'
        ]
        
        if question_text:
            text_lower = str(question_text).lower()
            for term in legal_terms:
                if term in text_lower:
                    tags.append(term)
        
        return tags[:10]  # Limit to 10 tags
    
    def import_to_supabase(self, questions: List[Dict[str, Any]]) -> bool:
        """Import questions to Supabase in batches."""
        print(f"\n📤 Importing {len(questions)} questions to Supabase...")
        
        try:
            # Import in batches
            for i in range(0, len(questions), self.batch_size):
                batch = questions[i:i + self.batch_size]
                
                print(f"   Importing batch {i//self.batch_size + 1}/{(len(questions)-1)//self.batch_size + 1} ({len(batch)} questions)")
                
                # Insert batch
                result = self.supabase.table('questions').insert(batch).execute()
                
                if result.data:
                    self.imported_count += len(batch)
                    print(f"   ✅ Batch imported successfully")
                else:
                    print(f"   ❌ Batch import failed")
                    return False
            
            print(f"\n🎉 Import completed successfully!")
            print(f"   - Total imported: {self.imported_count} questions")
            
            return True
            
        except Exception as e:
            print(f"❌ Error importing to Supabase: {e}")
            return False
    
    def create_question_stats(self):
        """Create initial question stats records."""
        print(f"\n📊 Creating question statistics...")
        
        try:
            # Get all question IDs
            result = self.supabase.table('questions').select('id').execute()
            
            if result.data:
                stats_records = []
                for question in result.data:
                    stats_records.append({
                        'question_id': question['id'],
                        'total_attempts': 0,
                        'correct_attempts': 0,
                        'average_time_seconds': 0,
                        'difficulty_rating': 0.0,
                        'last_updated': datetime.utcnow().isoformat()
                    })
                
                # Insert stats in batches
                for i in range(0, len(stats_records), self.batch_size):
                    batch = stats_records[i:i + self.batch_size]
                    self.supabase.table('question_stats').insert(batch).execute()
                
                print(f"✅ Created statistics for {len(stats_records)} questions")
            
        except Exception as e:
            print(f"⚠️  Error creating question stats: {e}")
    
    def run_import(self):
        """Run the complete import process."""
        print(f"🚀 Starting OAB Dataset Import Process")
        print(f"=" * 50)
        
        try:
            # Load dataset
            df = self.load_dataset()
            
            # Analyze structure
            analysis = self.analyze_dataset_structure(df)
            
            # Save analysis
            output_dir = Path("data/import_logs")
            output_dir.mkdir(parents=True, exist_ok=True)
            
            with open(output_dir / f"dataset_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w", encoding="utf-8") as f:
                json.dump(analysis, f, indent=2, ensure_ascii=False, default=str)
            
            # Transform data
            questions = self.clean_and_transform_data(df)
            
            if not questions:
                print("❌ No questions to import")
                return False
            
            # Save processed data
            with open(output_dir / f"processed_questions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w", encoding="utf-8") as f:
                json.dump(questions[:10], f, indent=2, ensure_ascii=False, default=str)  # Save sample
            
            # Import to Supabase
            success = self.import_to_supabase(questions)
            
            if success:
                # Create question stats
                self.create_question_stats()
                
                print(f"\n🎉 Import process completed successfully!")
                print(f"   - Questions imported: {self.imported_count}")
                print(f"   - Errors: {self.error_count}")
                
                return True
            else:
                print(f"\n❌ Import process failed")
                return False
                
        except Exception as e:
            print(f"❌ Import process error: {e}")
            return False

def main():
    """Main function to run the import."""
    
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
    
    # Run import
    importer = OABDatasetImporter()
    success = importer.run_import()
    
    if success:
        print(f"\n✅ Dataset import completed successfully!")
    else:
        print(f"\n❌ Dataset import failed!")

if __name__ == "__main__":
    main()
