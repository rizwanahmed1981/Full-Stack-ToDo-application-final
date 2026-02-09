# Tasks: CLI Todo App

**Input**: Design documents from `/specs/001-cli-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Python project with typer and rich dependencies
- [ ] T003 [P] Configure linting and formatting tools

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup in-memory data storage infrastructure
- [ ] T005 [P] Implement basic CLI framework with typer
- [ ] T006 [P] Setup testing framework with pytest
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---
## Phase 3: User Story 1 - Add and List Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable basic task creation and viewing functionality

**Independent Test**: Can be fully tested by adding tasks and listing them, delivering the fundamental value of task management.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for add command in tests/contract/test_add.py
- [ ] T011 [P] [US1] Contract test for list command in tests/contract/test_list.py
- [ ] T012 [P] [US1] Integration test for add/list user journey in tests/integration/test_add_list.py

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create Task model in src/todo_app/models/task.py
- [ ] T014 [P] [US1] Create TodoService in src/todo_app/services/todo_service.py
- [ ] T015 [US1] Implement CLI main entry point in src/todo_app/cli/main.py
- [ ] T016 [US1] Add add command functionality
- [ ] T017 [US1] Add list command functionality
- [ ] T018 [US1] Add validation and error handling
- [ ] T019 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---
## Phase 4: User Story 2 - Complete and Update Tasks (Priority: P2)

**Goal**: Enable task completion and modification functionality

**Independent Test**: Can be fully tested by marking tasks as complete and updating task descriptions, delivering the ability to manage task status and content.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T020 [P] [US2] Contract test for complete command in tests/contract/test_complete.py
- [ ] T021 [P] [US2] Contract test for update command in tests/contract/test_update.py
- [ ] T022 [P] [US2] Integration test for complete/update user journey in tests/integration/test_complete_update.py

### Implementation for User Story 2

- [ ] T023 [US2] Implement complete command functionality
- [ ] T024 [US2] Implement update command functionality
- [ ] T025 [US2] Integrate with User Story 1 components (if needed)
- [ ] T026 [US2] Add validation and error handling for complete/update operations

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---
## Phase 5: User Story 3 - Delete Tasks (Priority: P3)

**Goal**: Enable task removal functionality

**Independent Test**: Can be fully tested by deleting tasks and verifying they no longer appear in the list, delivering the ability to manage list content.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T027 [P] [US3] Contract test for delete command in tests/contract/test_delete.py
- [ ] T028 [P] [US3] Integration test for delete user journey in tests/integration/test_delete.py

### Implementation for User Story 3

- [ ] T029 [US3] Implement delete command functionality
- [ ] T030 [US3] Integrate with User Story 1/2 components (if needed)
- [ ] T031 [US3] Add validation and error handling for delete operations

**Checkpoint**: All user stories should now be independently functional

---
## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T999 [P] Documentation updates in docs/
- [ ] T998 [P] Code cleanup and refactoring
- [ ] T997 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T996 [P] Run quickstart.md validation
- [ ] T995 [P] Final testing and validation

---
## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---
## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for add command in tests/contract/test_add.py"
Task: "Contract test for list command in tests/contract/test_list.py"
Task: "Integration test for add/list user journey in tests/integration/test_add_list.py"

# Launch all models for User Story 1 together:
Task: "Create Task model in src/todo_app/models/task.py"
Task: "Create TodoService in src/todo_app/services/todo_service.py"
```

---
## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---
## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence