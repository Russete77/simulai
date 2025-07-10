#!/usr/bin/env python3
"""
Check the Hugging Face OAB dataset.
"""

from datasets import load_dataset
import pandas as pd

def check_hf_dataset():
    """Load and analyze the OAB dataset from Hugging Face."""
    print("🔍 Loading OAB dataset from Hugging Face...")
    
    try:
        # Load the dataset
        dataset = load_dataset("russ7/oab_exams_2011_2025_combined")
        
        # Print dataset info
        print("\n📊 Dataset info:")
        print(dataset)
        
        # Check each split
        for split_name, split_data in dataset.items():
            print(f"\n📋 Split: {split_name}")
            print(f"   Number of examples: {len(split_data)}")
            
            # Convert to pandas for easier analysis
            df = pd.DataFrame(split_data)
            
            # Print column names and types
            print("\n   Columns and types:")
            print(df.dtypes)
            
            # Print first few rows
            print("\n   First few rows:")
            print(df.head())
            
            # Check for missing values
            print("\n   Missing values per column:")
            print(df.isnull().sum())
            
            # Check unique values in categorical columns
            print("\n   Unique values in categorical columns:")
            for column in df.select_dtypes(include=['object']).columns:
                print(f"   - {column}: {df[column].nunique()} unique values")
                if df[column].nunique() < 10:  # Print unique values if not too many
                    print(f"     Values: {df[column].unique().tolist()}")
        
        return dataset
        
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        raise

if __name__ == "__main__":
    check_hf_dataset()
