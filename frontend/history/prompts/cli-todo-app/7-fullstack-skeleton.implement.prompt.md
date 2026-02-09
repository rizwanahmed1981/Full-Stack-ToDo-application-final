---
id: 7
title: Full Stack Skeleton Implementation
stage: green
date: 2026-01-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: cli-todo-app
branch: 001-cli-todo-app
user: ecomw
command: /sp.implement
labels: ["implement", "fullstack", "backend", "frontend", "api"]
links:
  spec: specs/001-cli-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - backend/pyproject.toml
 - backend/src/todo_app/main.py
 - backend/src/todo_app/models/task.py
 - backend/src/todo_app/services/todo_service.py
 - backend/README.md
 - frontend/src/app/page.tsx
 - frontend/README.md
tests:
 - null
---

## Prompt

You are @fullstack-developer.

**Execution Steps:**
1. **Restructure:** - Move current CLI files into a new `backend/` folder.
   - Run `uv init` inside `backend/` if needed.
2. **Backend (FastAPI):**
   - Add `fastapi`, `sqlmodel`, and `psycopg2-binary` to the backend.
   - Create `backend/main.py` to serve the API.
   - Use a local SQLite `database.db` for now to avoid connection issues, but keep the code ready for Postgres.
3. **Frontend (Next.js):**
   - Outside the backend folder, run `npx create-next-app@latest frontend --typescript --tailwind --eslint`.
   - Build a simple `page.tsx` that fetches tasks from `http://localhost:8000/tasks`.

**Action:** Build the Full Stack skeleton now.

## Response snapshot

Successfully implemented the full stack skeleton for the Todo App:
- Restructured CLI code into backend/ directory with proper project structure
- Created FastAPI backend with SQLModel ORM for PostgreSQL/SQLite database
- Implemented complete API endpoints (GET, POST, PATCH, PUT, DELETE)
- Built Next.js frontend with TypeScript and Tailwind CSS
- Created integrated task management UI that communicates with backend API
- Set up proper database schema with SQLite support for local development
- Added comprehensive README files for both backend and frontend

## Outcome

- ✅ Impact: Completed full stack skeleton with working backend API and frontend UI
- 🧪 Tests: N/A
- 📁 Files: Created all required backend and frontend files
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks for full stack
- 🧠 Reflection: Successfully transitioned from CLI to full-stack web application with persistent storage

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Connect to actual PostgreSQL database