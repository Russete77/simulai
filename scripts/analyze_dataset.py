#!/usr/bin/env python3
"""
Script to analyze the OAB dataset from Hugging Face
and prepare it for Supabase import.
"""

import pandas as pd
from datasets import load_dataset
import json
from typing import Dict, List, Any
import os
from pathlib import Path

def analyze_oab_dataset():
    """Analyze the OAB dataset structure and content."""
    
    print("🔍 Loading OAB dataset from Hugging Face...")
    
    try:
        # Load the dataset
        dataset = load_dataset("russ7/oab_exams_2011_2025_combined")
        
        print(f"✅ Dataset loaded successfully!")
        print(f"📊 Dataset info:")
        print(f"   - Total rows: {len(dataset['train'])}")
        print(f"   - Columns: {dataset['train'].column_names}")
        
        # Convert to pandas for easier analysis
        df = dataset['train'].to_pandas()
        
        print(f"\n📋 Dataset structure:")
        print(df.info())
        
        print(f"\n🔍 Sample data (first 3 rows):")
        for i in range(min(3, len(df))):
            print(f"\n--- Row {i+1} ---")
            for col in df.columns:
                value = df.iloc[i][col]
                if isinstance(value, str) and len(value) > 100:
                    print(f"{col}: {value[:100]}...")
                else:
                    print(f"{col}: {value}")
        
        # Analyze data types and unique values
        print(f"\n📈 Data analysis:")
        for col in df.columns:
            unique_count = df[col].nunique()
            null_count = df[col].isnull().sum()
            print(f"   {col}:")
            print(f"     - Type: {df[col].dtype}")
            print(f"     - Unique values: {unique_count}")
            print(f"     - Null values: {null_count}")
            
            # Show sample unique values for categorical columns
            if unique_count < 20 and unique_count > 1:
                print(f"     - Sample values: {list(df[col].unique()[:10])}")
        
        # Save sample data for schema design
        sample_data = df.head(10).to_dict('records')
        
        # Create output directory
        output_dir = Path("data/samples")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save sample data
        with open(output_dir / "oab_sample.json", "w", encoding="utf-8") as f:
            json.dump(sample_data, f, indent=2, ensure_ascii=False, default=str)
        
        # Save full dataset info
        dataset_info = {
            "total_rows": len(df),
            "columns": list(df.columns),
            "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "unique_counts": {col: int(df[col].nunique()) for col in df.columns},
            "null_counts": {col: int(df[col].isnull().sum()) for col in df.columns}
        }
        
        with open(output_dir / "dataset_info.json", "w", encoding="utf-8") as f:
            json.dump(dataset_info, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Sample data saved to: {output_dir}")
        print(f"   - oab_sample.json (10 sample records)")
        print(f"   - dataset_info.json (dataset metadata)")
        
        return df, dataset_info
        
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return None, None

def suggest_database_schema(df: pd.DataFrame, dataset_info: Dict[str, Any]):
    """Suggest database schema based on dataset analysis."""
    
    print(f"\n🏗️  Suggested Database Schema:")
    print(f"=" * 50)
    
    # Analyze the structure to suggest schema
    schema_suggestions = []
    
    for col in df.columns:
        col_type = df[col].dtype
        unique_count = dataset_info['unique_counts'][col]
        null_count = dataset_info['null_counts'][col]
        
        # Suggest PostgreSQL type based on pandas dtype
        if col_type == 'object':
            if unique_count < 50:  # Likely categorical
                pg_type = "VARCHAR(255)"
            else:
                pg_type = "TEXT"
        elif col_type in ['int64', 'int32']:
            pg_type = "INTEGER"
        elif col_type in ['float64', 'float32']:
            pg_type = "DECIMAL"
        elif col_type == 'bool':
            pg_type = "BOOLEAN"
        else:
            pg_type = "TEXT"
        
        # Add constraints
        constraints = []
        if null_count == 0:
            constraints.append("NOT NULL")
        if col.lower() in ['id', 'question_id']:
            constraints.append("PRIMARY KEY" if col.lower() == 'id' else "UNIQUE")
        
        schema_suggestions.append({
            'column': col,
            'type': pg_type,
            'constraints': constraints,
            'unique_values': unique_count,
            'null_count': null_count
        })
    
    # Print schema suggestion
    print("CREATE TABLE oab_questions (")
    for i, suggestion in enumerate(schema_suggestions):
        constraints_str = " ".join(suggestion['constraints'])
        comma = "," if i < len(schema_suggestions) - 1 else ""
        print(f"    {suggestion['column']} {suggestion['type']} {constraints_str}{comma}")
    print(");")
    
    # Save schema suggestion
    output_dir = Path("data/samples")
    with open(output_dir / "suggested_schema.json", "w", encoding="utf-8") as f:
        json.dump(schema_suggestions, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Schema suggestion saved to: {output_dir}/suggested_schema.json")

if __name__ == "__main__":
    print("🚀 Starting OAB Dataset Analysis...")
    
    df, dataset_info = analyze_oab_dataset()
    
    if df is not None:
        suggest_database_schema(df, dataset_info)
        print(f"\n✅ Analysis complete!")
    else:
        print(f"\n❌ Analysis failed!")
