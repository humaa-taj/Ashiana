# Ashiana — Buying & Renting Housing Platform

## Tech Stack

- **Frontend:** Next.js, TypeScript, Chakra UI
- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL + TypeORM

## Prerequisites

- Node.js v18+
- PostgreSQL installed and running

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd ashiana
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in your DB credentials
npm run start:dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Running

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:3001 |
