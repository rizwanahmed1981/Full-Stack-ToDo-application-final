# Implementation Plan: CLI Todo App

**Branch**: `001-cli-todo-app` | **Date**: 2026-01-03 | **Spec**: specs/001-cli-todo-app/spec.md

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a full-stack todo application with a PostgreSQL database backend, FastAPI REST API, and Next.js frontend. The application will replace in-memory storage with persistent SQLModel + Neon PostgreSQL storage, enabling task persistence across server restarts. The CLI interface will be transformed into a web-based application with full CRUD operations.

## Technical Context

**Language/Version**: Python 3.14+ (per constitution requirement)
**Primary Dependencies**: FastAPI (backend), SQLModel (ORM), Next.js (frontend), Neon PostgreSQL (database)
**Storage**: PostgreSQL database with SQLModel ORM (persistent storage)
**Testing**: pytest for backend tests, Jest/React Testing Library for frontend tests (per constitution test-first principle)
**Target Platform**: Web application (browser-based)
**Project Type**: Full-stack web application (backend + frontend)
**Performance Goals**: API responses under 200ms, database queries under 50ms
**Constraints**: <500ms page load time, <100MB memory usage, persistent storage
**Scale/Scope**: Multi-user web application with persistent data storage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Python Version Standard (I): Using Python 3.14+ as required
- ✅ Package Management with uv (II): Will use uv for dependency management
- ✅ Project Structure Standards (III): Will follow src/tests/specs organization
- ✅ Tooling Requirements (IV): Will use uv init and uv add for dependencies
- ✅ Test-First (V): Will implement TDD with pytest and Jest
- ✅ Integration Testing (VI): Will include integration tests for API and frontend

## Project Structure

### Documentation (this feature)

```text
specs/001-cli-todo-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── todo_app/
│   │   ├── __init__.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── task.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── todo_service.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── tasks.py
│   │   │       └── router.py
│   │   └── main.py
│   └── __init__.py
├── tests/
│   ├── unit/
│   │   ├── test_models/
│   │   └── test_services/
│   ├── integration/
│   │   └── test_api/
│   └── contract/
├── pyproject.toml
└── README.md

frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── utils/
│   ├── public/
│   └── styles/
├── tests/
├── package.json
└── README.md
```

**Structure Decision**: Full-stack architecture with backend (FastAPI) and frontend (Next.js) separated into distinct directories. Backend handles API and database logic, frontend handles user interface and interactions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |