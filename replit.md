# LocalizeGuy

## Overview

LocalizeGuy is a monolithic single-page React application designed for generating AI-powered translations. Users can input text with context, leverage Google's Gemini AI API to generate translations for multiple cultures/locales, and manage their supported cultures list. The application focuses on providing a modern, professional UI/UX for localization workflows with YAML output format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Type Safety**: Full TypeScript implementation with Zod for runtime validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and request validation

### Component Structure
- **Input Section**: Text and context input with validation
- **Output Section**: YAML-formatted display with copy/download functionality
- **Cultures Panel**: Dynamic culture management with add/remove capabilities
- **UI Components**: Reusable shadcn/ui components (buttons, inputs, dialogs, etc.)

### Data Flow
1. User inputs text and context in the Input Section
2. Selected cultures from the Cultures Panel are sent with the translation request
3. Frontend calls `/api/translate` endpoint with validated request data
4. Backend processes request through Gemini AI API
5. Translations are returned and formatted as YAML in the Output Section
6. Users can copy to clipboard or download the YAML file

### AI Integration
- **Provider**: Google Gemini 2.0 Flash model via @google/genai package
- **Request Flow**: Structured prompts with system instructions for localization context
- **Response Handling**: JSON-structured translations converted to YAML format
- **Error Handling**: Comprehensive error boundaries and user feedback

### Development Tools
- **Build System**: Vite with hot reload and development optimizations
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer
- **Package Management**: npm with lockfile for dependency consistency

## External Dependencies

### Core AI Service
- **Google Gemini AI**: Primary translation engine using @google/genai package
- **Authentication**: Requires GEMINI_API_KEY environment variable

### Database & Session Storage
- **Neon Database**: PostgreSQL hosting via @neondatabase/serverless
- **Session Store**: connect-pg-simple for PostgreSQL-backed Express sessions
- **ORM**: Drizzle with drizzle-kit for migrations and schema management

### UI & Design System
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **shadcn/ui**: Pre-built component library with Tailwind styling
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

### Development & Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **js-yaml**: YAML parsing and stringification for output formatting

### Validation & Type Safety
- **Zod**: Runtime type validation for API requests and responses
- **TypeScript**: Static type checking throughout the application
- **@hookform/resolvers**: Form validation integration with Zod schemas