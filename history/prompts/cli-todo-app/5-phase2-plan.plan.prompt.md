---
id: 5
title: Phase 2 Architecture Plan
stage: plan
date: 2026-01-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: cli-todo-app
branch: 001-cli-todo-app
user: ecomw
command: /sp.plan
labels: ["plan", "architecture", "fullstack", "backend", "frontend"]
links:
  spec: specs/001-cli-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-cli-todo-app/plan.md
tests:
 - null
---

## Prompt

You are @system-architect. We are moving to **Phase 2: Full Stack**.

**New Architecture:**
1. **Database:** Replace the In-Memory list with **SQLModel + Neon PostgreSQL**.
2. **Backend:** Transform the CLI service into a **FastAPI** application.
3. **Frontend:** Create a **Next.js** application in a `/frontend` directory.
4. **Persistence:** Tasks must stay in the DB even after the server restarts.

**Folder Strategy:**
- Move current logic to `backend/src`.
- Create `frontend/` for the React app.

**Action:** Update `specs/speckit.plan` with this multi-tier architecture.

## Response snapshot

Successfully updated the implementation plan for Phase 2 full-stack architecture:
- Transitioned from in-memory storage to persistent PostgreSQL database with SQLModel
- Changed from CLI interface to FastAPI backend with REST API
- Added Next.js frontend directory structure
- Updated technical context with new technologies (FastAPI, SQLModel, Next.js)
- Revised project structure to separate backend and frontend
- Maintained all constitution compliance requirements

## Outcome

- ✅ Impact: Completed Phase 2 architecture plan with full-stack design
- 🧪 Tests: N/A
- 📁 Files: Updated specs/001-cli-todo-app/plan.md with new architecture
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Successfully transitioned from CLI to full-stack web application while maintaining all requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A