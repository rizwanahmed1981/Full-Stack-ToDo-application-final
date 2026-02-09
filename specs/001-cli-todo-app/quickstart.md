# Quickstart: CLI Todo App

## Setup

1. Ensure Python 3.14+ is installed
2. Install project dependencies:
   ```bash
   uv init
   uv add typer rich pytest
   ```

## Usage

### Add a task
```bash
python -m todo_app add "Buy groceries"
```

### List all tasks
```bash
python -m todo_app list
```

### Complete a task
```bash
python -m todo_app complete 1
```

### Update a task
```bash
python -m todo_app update 1 "Buy groceries and cook dinner"
```

### Delete a task
```bash
python -m todo_app delete 1
```

## Development

### Run tests
```bash
pytest
```

### Run the CLI application
```bash
python -m src.todo_app.cli.main
```