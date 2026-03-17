# Inventory System

This repository contains a monorepo with two applications:

- `clientapp`: Next.js frontend for the inventory system UI.
- `server`: Node.js/TypeScript API server with Prisma for the database layer.

## Repo Structure

- `clientapp/`  Frontend (Next.js)
- `server/`     Backend (Node.js + Prisma)

## Getting Started

### 1) Install dependencies

Frontend:

```powershell
cd clientapp
npm install
```

Backend:

```powershell
cd server
npm install
```

### 2) Configure environment variables

Create `.env` files based on your local setup. If you add example env files, keep them as `.env.example` and do not commit real secrets.

### 3) Run locally

Frontend:

```powershell
cd clientapp
npm run dev
```

Backend:

```powershell
cd server
npm run dev
```

## Notes

- Do not commit `node_modules` or real `.env` files.
- If you need database setup, check `server/prisma` for schema and seeds.