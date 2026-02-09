#!/usr/bin/env python3
"""Test script to verify database connection works."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from sqlmodel import create_engine, SQLModel
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Test database connection
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")
print(f"Using database URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

    # Test connection
    with engine.connect() as conn:
        conn.execute("SELECT 1")
        print("✅ Database connection successful!")

    # Test table creation
    from todo_app.models.task import Task
    SQLModel.metadata.create_all(engine)
    print("✅ Tables created successfully!")

except Exception as e:
    print(f"❌ Database connection failed: {e}")
    sys.exit(1)

print("All database tests passed!")