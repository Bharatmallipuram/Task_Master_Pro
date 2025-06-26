# Task Management Application

## Overview

This is a modern task management web application built with a full-stack architecture. The application allows users to create, organize, and track tasks with project categorization, priority levels, and due dates. It features a clean, responsive interface with drag-and-drop functionality for task reordering.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for robust form handling
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui
- **Animations**: Framer Motion for smooth interactions and drag-and-drop

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging and error handling middleware

### Database & ORM
- **Database**: PostgreSQL (configured for production with Neon)
- **ORM**: Drizzle ORM for type-safe database queries
- **Schema**: Defined in shared TypeScript files for consistency
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Data Models
- **Projects**: Categorization system with name and color coding
- **Tasks**: Core entities with title, description, priority, status, due dates, and project associations
- **Schema Validation**: Zod schemas for runtime type checking and API validation

### Storage Layer
- **Interface**: Abstract IStorage interface for data operations
- **Implementation**: In-memory storage (MemStorage) for development
- **Database Integration**: Ready for PostgreSQL integration via Drizzle ORM

### UI Components
- **Task Management**: Task creation, editing, deletion with modal interfaces
- **Filtering**: Multi-dimensional filtering by priority, status, project, and search
- **Progress Tracking**: Visual progress indicators and completion statistics
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Data Flow

1. **Client Requests**: React components trigger API calls via TanStack Query
2. **API Layer**: Express routes handle HTTP requests with validation
3. **Business Logic**: Storage layer processes data operations
4. **Database**: Drizzle ORM manages PostgreSQL interactions
5. **Response**: JSON data flows back through the stack to update UI

## External Dependencies

### UI & Styling
- **shadcn/ui**: Complete UI component system
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible primitive components
- **Lucide React**: Icon library

### Data & State Management
- **TanStack Query**: Server state synchronization
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: Production bundling
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Build Tool**: Vite with React plugin for hot module replacement
- **Development Server**: Express with Vite middleware integration
- **Database**: In-memory storage with option for local PostgreSQL

### Production Environment
- **Build Process**: Vite builds client assets, ESBuild bundles server
- **Deployment Target**: Autoscale deployment via Replit
- **Database**: PostgreSQL via Neon with connection pooling
- **Static Assets**: Served from dist/public directory

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Port Configuration**: Server runs on port 5000, external port 80
- **Build Commands**: Separate build and start scripts for production

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.