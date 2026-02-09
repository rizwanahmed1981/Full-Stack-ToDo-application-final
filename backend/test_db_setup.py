#!/usr/bin/env python3
"""Test script to verify database setup works correctly."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from sqlmodel import create_engine, SQLModel
from todo_app.models.task import Task

def test_database_setup():
    """Test that database setup works."""
    # Create in-memory SQLite database for testing
    DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(DATABASE_URL, echo=True)

    # Create tables
    SQLModel.metadata.create_all(engine)

    print("Database setup test passed!")
    return True

if __name__ == "__main__":
    test_database_setup()