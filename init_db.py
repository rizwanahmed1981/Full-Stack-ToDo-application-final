#!/usr/bin/env python3
"""
Script to initialize the database tables
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend/src'))

from sqlmodel import SQLModel, create_engine
from todo_app.models.task import Task
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_db():
    # Get database URL from environment variable
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")
    
    # Create the database engine
    engine = create_engine(DATABASE_URL)

    # Create all tables
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()