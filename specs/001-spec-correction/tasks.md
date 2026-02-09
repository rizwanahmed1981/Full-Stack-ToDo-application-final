# Implementation Tasks: Corrected Todo App with Persistent Storage

**Feature**: Persistent Todo Application with PostgreSQL Backend
**Branch**: `001-spec-correction` | **Date**: 2026-02-09
**Spec**: specs/001-spec-correction/spec.md | **Plan**: specs/001-spec-correction/plan.md

## Overview

This document outlines the implementation tasks for the persistent todo application with PostgreSQL backend. The tasks are organized in dependency order to enable incremental development and testing, with each user story forming a complete, independently testable increment.

## Implementation Strategy

- **MVP First**: Implement User Story 1 (Add and List Tasks with Persistent Storage) as the minimum viable product
- **Incremental Delivery**: Build upon the MVP with User Stories 2 and 3 in priority order
- **Test-First Approach**: Write tests before implementation for each component
- **Layered Architecture**: Develop in layers (models → services → API → integration)

## Dependencies

User stories are designed to be largely independent, but share foundational components:
- US2 (Complete and Update Tasks) depends on US1 (Add and List Tasks) foundational elements
- US3 (Delete Tasks) depends on US1 (Add and List Tasks) foundational elements

## Parallel Execution Opportunities

- Unit tests can be developed in parallel with implementation
- Contract tests can be developed in parallel with API implementation
- Database models can be developed in parallel with service layer

---

## Phase 1: Setup

Initialize project structure and dependencies for the todo application.

- [x] T001 Create project directory structure per implementation plan in src/todo_app/
- [x] T002 Initialize Python project with uv and create pyproject.toml
- [x] T003 [P] Install dependencies: FastAPI, SQLModel, psycopg2-binary, pytest
- [x] T004 Set up PostgreSQL database connection configuration
- [x] T005 Create initial test directory structure in tests/

## Phase 2: Foundational Components

Build foundational components that all user stories depend on.

- [x] T010 [P] Create Task model in src/todo_app/models/task.py following data model specification
- [x] T011 [P] Create database session management in src/todo_app/database/session.py
- [x] T012 [P] Create TodoService in src/todo_app/services/todo_service.py with basic CRUD methods
- [x] T013 [P] Create main FastAPI application in src/todo_app/main.py
- [x] T014 [P] Create API router in src/todo_app/api/v1/router.py
- [x] T015 [P] Create conftest.py for pytest fixtures in tests/conftest.py
- [x] T016 [P] Create base test files for models, services, and API in tests/

## Phase 3: User Story 1 - Add and List Tasks with Persistent Storage (Priority: P1)

As a user, I want to add tasks to my todo list and view them so that I can keep track of what I need to do, with the assurance that my tasks persist across application restarts.

### Independent Test Criteria
Can be fully tested by adding tasks, restarting the application, and verifying tasks are still present, delivering the fundamental value of task management with persistence.

- [x] T020 [P] [US1] Create POST /tasks endpoint in src/todo_app/api/v1/tasks.py
- [x] T021 [P] [US1] Create GET /tasks endpoint in src/todo_app/api/v1/tasks.py
- [x] T022 [US1] Implement create_task method in TodoService
- [x] T023 [US1] Implement get_tasks method in TodoService
- [x] T024 [US1] Add Task model validation rules as specified in data model
- [x] T025 [US1] Connect API endpoints to service methods
- [x] T026 [US1] Create unit tests for Task model in tests/unit/test_models/
- [x] T027 [US1] Create unit tests for TodoService create_task and get_tasks methods in tests/unit/test_services/
- [x] T028 [US1] Create integration tests for POST /tasks and GET /tasks endpoints in tests/integration/test_api/
- [x] T029 [US1] Create contract tests for POST /tasks and GET /tasks endpoints in tests/contract/
- [x] T030 [US1] Test persistence by adding tasks, restarting application, and verifying tasks remain

## Phase 4: User Story 2 - Complete and Update Tasks (Priority: P2)

As a user, I want to mark tasks as complete and update task descriptions so that I can track my progress and modify tasks as needed, with changes persisting across application restarts.

### Independent Test Criteria
Can be fully tested by marking tasks as complete and updating task descriptions, and verifying changes persist after restart, delivering the ability to manage task status and content with persistence.

- [x] T035 [P] [US2] Create PATCH /tasks/{id} endpoint in src/todo_app/api/v1/tasks.py
- [x] T036 [P] [US2] Create PUT /tasks/{id} endpoint in src/todo_app/api/v1/tasks.py
- [x] T037 [US2] Implement toggle_task_completion method in TodoService
- [x] T038 [US2] Implement update_task method in TodoService
- [x] T039 [US2] Connect API endpoints to service methods
- [x] T040 [US2] Create unit tests for toggle_task_completion and update_task methods in tests/unit/test_services/
- [x] T041 [US2] Create integration tests for PATCH /tasks/{id} and PUT /tasks/{id} endpoints in tests/integration/test_api/
- [x] T042 [US2] Create contract tests for PATCH /tasks/{id} and PUT /tasks/{id} endpoints in tests/contract/
- [x] T043 [US2] Test persistence of updates by modifying tasks, restarting application, and verifying changes remain

## Phase 5: User Story 3 - Delete Tasks (Priority: P3)

As a user, I want to remove tasks from my todo list so that I can clean up completed or unwanted tasks, with the deletion being permanent and persistent.

### Independent Test Criteria
Can be fully tested by deleting tasks and verifying they no longer appear in the list after restart, delivering the ability to manage list content with permanent removal.

- [x] T045 [P] [US3] Create DELETE /tasks/{id} endpoint in src/todo_app/api/v1/tasks.py
- [x] T046 [US3] Implement delete_task method in TodoService
- [x] T047 [US3] Connect API endpoint to service method
- [x] T048 [US3] Create unit tests for delete_task method in tests/unit/test_services/
- [x] T049 [US3] Create integration tests for DELETE /tasks/{id} endpoint in tests/integration/test_api/
- [x] T050 [US3] Create contract tests for DELETE /tasks/{id} endpoint in tests/contract/
- [x] T051 [US3] Test permanent deletion by removing tasks, restarting application, and verifying they remain deleted

## Phase 6: Error Handling and Edge Cases

Implement proper error handling and edge case management across all endpoints.

- [x] T055 [P] Implement error handling for non-existent task IDs
- [x] T056 [P] Implement validation for empty task titles during creation
- [x] T057 Handle empty list scenario in GET /tasks endpoint
- [x] T058 Implement validation for invalid task ID formats
- [x] T059 Implement database connection error handling
- [x] T060 Handle concurrent modification scenarios
- [x] T061 Create tests for all error handling scenarios

## Phase 7: Polish & Cross-Cutting Concerns

Final touches to ensure the application meets all requirements and quality standards.

- [x] T065 Add automatic timestamp updates to Task model (created_at, updated_at)
- [x] T066 Implement database transaction management for data integrity
- [x] T067 Add database indexes as specified in data model
- [x] T068 Create comprehensive README with API documentation
- [x] T069 Perform performance testing to ensure <200ms response times
- [x] T070 Run complete test suite to ensure all functionality works together
- [x] T071 Verify all constitution requirements are met
- [x] T072 Prepare final implementation for review