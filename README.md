# BabbageBox Frontend

This is the frontend UI for BabbageBox, a local AI chat application built with Vue 3, TypeScript, and Vite.

## Features

- Modern chat interface with real-time messaging
- Model selector for switching between different LLMs at runtime
- Text-to-speech integration with Supertonic TTS
- Memory management and conversation history
- Responsive design with glassmorphism UI
- Per-message model attribution
- Loading states and error handling

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Navigate to the Babbagebox-Frontend directory.

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Building for Production

Build the app for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Components

- **ChatBox**: Main chat interface with message display and input
- **ModelSelector**: Dropdown to select and switch LLM models
- **Supertonic**: TTS controls and audio playback
- **MemoryManager**: Memory and conversation management
- **LogsViewer**: View application logs
- **McpSearch**: MCP search interface

## Backend Integration

The frontend communicates with the BabbageBox backend API at `http://localhost:8000`. Ensure the backend is running before starting the frontend.

## Environment

- Vue 3 with Composition API
- TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- Font Awesome for icons
