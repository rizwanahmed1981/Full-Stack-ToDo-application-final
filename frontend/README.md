# Todo App Frontend

Frontend application for the Todo application built with Next.js.

## Features

- Modern UI with Tailwind CSS
- Responsive design
- Real-time task management
- Integration with backend API
- Search tasks by keyword in title and description
- Filter tasks by status (active/completed), priority (low, medium, high, critical), or date range
- Combined search and filter functionality
- Debounced search input for optimal performance

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Development

This project uses:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`. Make sure the backend is running before starting the frontend.

## Project Structure

```
frontend/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   └── lib/           # Utility functions
├── public/           # Static assets
└── styles/           # Global styles
```
