# Poste-Pionnier-2025-2026

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, Self, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
pnpm run db:push
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.
Use the Expo Go app to run the mobile application.

## Run The Whole Project

### Local development

To start the whole monorepo locally:

```bash
pnpm run dev
```

This runs the development apps configured through Turbo.

### Full project with Docker

To start the full project with PostgreSQL, web/API, Prisma setup, and Expo:

```bash
pnpm run docker:dev
```

This command:

- starts PostgreSQL
- runs `pnpm install`
- runs `pnpm db:generate`
- runs `pnpm db:push`
- starts `pnpm dev`

In short:

- `pnpm run dev` = whole monorepo locally
- `pnpm run docker:dev` = whole project plus database through Docker

With `pnpm run docker:dev`, this starts:

- PostgreSQL on `5432`
- Web/API on `http://localhost:3001`
- Expo/Metro on `8081` with Expo ports `19000`, `19001`, and `19002`

If you use Expo Go on a real device, make sure the device can reach your machine on the local network. The Docker helper script already injects your local IP through `HOST_IP`, so the recommended command is:

```bash
pnpm run docker:dev
```

If you run the containers manually instead of the npm script, you must provide a reachable server URL yourself, for example:

```bash
HOST_IP=YOUR_LOCAL_IP docker compose up --build
```

For simulators running on the same machine, the default `http://localhost:3001` is usually enough.


## Project Structure

```
Poste-Pionnier-2025-2026/
├── apps/
│   └── web/         # Fullstack application (React + TanStack Start)
│   ├── native/      # Mobile application (React Native, Expo)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run dev:native`: Start the React Native/Expo development server
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:studio`: Open database studio UI


