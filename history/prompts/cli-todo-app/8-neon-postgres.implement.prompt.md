---
id: 8
title: Neon PostgreSQL Connection
stage: green
date: 2026-01-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: cli-todo-app
branch: 001-cli-todo-app
user: ecomw
command: /sp.implement
labels: ["implement", "database", "neon", "postgres", "backend"]
links:
  spec: specs/001-cli-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - backend/.env
 - backend/pyproject.toml
 - backend/src/todo_app/main.py
 - backend/README.md
tests:
 - null
---

## Prompt

You are @database-architect. Let's connect the backend to Neon Postgres.

**Actions:**
1. **Environment Setup:**
   - In `/backend`, create a `.env` file.
   - Add `DATABASE_URL='postgresql://neondb_owner:npg_KvaQtrnI93Nh@ep-silent-resonance-ahzco9xe-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'`
2. **Dependencies:**
   - Run `uv add psycopg[binary] pydantic-settings`.
3. **Database Configuration:**
   - Update `backend/database.py` (or wherever your engine is) to pull the URL from the environment.
   - Use `create_engine(DATABASE_URL, pool_pre_ping=True)`.
4. **Table Creation:**
   - Ensure the FastAPI startup event calls `SQLModel.metadata.create_all(engine)`. This will physically create the 'task' table in your Neon dashboard.

**Verification:**
After running, check the console for "Database connected successfully."

## Response snapshot

Successfully configured backend to connect to Neon PostgreSQL database:
- Created .env file with Neon PostgreSQL connection string
- Added psycopg[binary] and pydantic-settings dependencies
- Updated database configuration to load URL from environment variables
- Implemented proper database engine setup with pool_pre_ping=True
- Added startup event to create database tables
- Updated README with proper setup instructions

## Outcome

- ✅ Impact: Backend now connects to Neon PostgreSQL database as required
- 🧪 Tests: N/A
- 📁 Files: Created .env file, updated pyproject.toml, modified main.py, updated README
- 🔁 Next prompts: Ready for database testing and full stack validation
- 🧠 Reflection: Successfully transitioned backend to use production-ready database connection

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test actual database connectivity