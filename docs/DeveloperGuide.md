# Developer Guide

## Project Overview
This document provides an overview of the Manufacturing Management System, a comprehensive solution for streamlining production, order tracking, and inventory management.

## Getting Started
### Prerequisites
- Node.js
- PostgreSQL

### Installation
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up the environment variables as per `.env.example`.
4. Run the development server with `npm run dev`.

## Project Structure
- `src/app`: Contains the main application code.
- `src/components`: Reusable React components.
- `prisma`: Database schema and migrations.

## Key Technologies
- **Next.js**: React framework for building web applications.
- **TypeScript**: Superset of JavaScript for type safety.
- **Tailwind CSS**: Utility-first CSS framework.
- **Prisma**: ORM for database interactions.

## State and Form Management
- **TanStack React Query**: Manages server state.
- **React Hooks**: Manages client state.
- **React Hook Form**: Handles form validation and submission.

## API Endpoints
- `/api/orders`: CRUD operations for orders.
- `/api/customers`: CRUD operations for customers.

## Database Schema
- Overview of models: User, Customer, Order, Dispatch, Design, ProductionStage.

## Authentication and Authorization
- **NextAuth.js**: Handles authentication with credentials provider.
- **RBAC**: Role-Based Access Control for authorization.

## Deployment Instructions
- Deploy using Vercel or similar platforms.
- Configure environment variables for production.

## Testing and CI/CD
- Use Jest and React Testing Library for testing.
- Set up CI/CD pipelines with GitHub Actions.
