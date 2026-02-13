# InsightFlow (MongoDB-backed)

InsightFlow is a Next.js workspace/chat application with persistence in **MongoDB** (via Mongoose).

## Prerequisites

- Node.js 20+
- A MongoDB instance (local or cloud)

## Environment variables

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/insightflow
```

`MONGODB_URI` is required. The app will fail at startup if it is missing.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data model

Mongo collections are organized as:

- `projects`
- `modules` (linked to project by `projectId`)
- `chats` (linked to module by `moduleId`, includes embedded `messages`)

## API overview

- `GET/POST /api/projects`
- `PATCH/DELETE /api/projects/:projectId`
- `GET/POST /api/projects/:projectId/modules`
- `PATCH/DELETE /api/modules/:moduleId`
- `GET/POST /api/modules/:moduleId/chats`
- `GET/PATCH/POST/DELETE /api/chats/:chatId`

`POST /api/chats/:chatId` appends a message to a chat and persists it in MongoDB.
