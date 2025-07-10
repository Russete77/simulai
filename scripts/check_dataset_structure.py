#!/usr/bin/env python3
"""
Check the structure of the dataset
"""

from datasets import load_dataset
import pandas as pd

def check_dataset():
    """Check the structure of the dataset."""
    print("🔍 Checking dataset structure...\n")
    
    # Load dataset
    dataset = load_dataset("russ7/oab_exams_2011_2025_combined")
    df = dataset['train'].to_pandas()
    
    # Print basic info
    print(f"Dataset shape: {df.shape}")
    print("\nColumns:")
    for col in df.columns:
        print(f"- {col} ({df[col].dtype})")
    
    # Print first row
    print("\nFirst row:")
    for col in df.columns:
        print(f"\n{col}:")
        print(df.iloc[0][col])

if __name__ == "__main__":
    check_dataset()
