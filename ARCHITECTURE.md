
# Hintro Collab - Engineering Architecture

## 1. System Overview
Hintro Collab is a high-performance Single Page Application (SPA) built for real-time task management. It follows a "Local-First" architectural pattern with real-time synchronization via browser APIs.

## 2. Frontend Architecture
- **Framework**: React 19 (Strict Mode)
- **Styling**: Tailwind CSS (Utility-first)
- **State Management**: React Hooks (`useState`, `useEffect`) combined with a custom Event-Bus service (`dbService`).
- **Real-time Sync**: Uses `BroadcastChannel` API to synchronize state across multiple browser tabs/windows without a central server backend (Simulated WebSocket).

## 3. Database Schema (Conceptual)
The system uses a relational-inspired JSON schema persisted in `LocalStorage`:

### `Users`
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `avatar`: URL

### `Boards`
- `id`: UUID (Primary Key)
- `title`: String
- `ownerId`: UUID (FK -> Users)
- `members`: Array<UUID> (FK -> Users)

### `Lists`
- `id`: UUID (Primary Key)
- `boardId`: UUID (FK -> Boards)
- `title`: String
- `order`: Integer

### `Tasks`
- `id`: UUID (Primary Key)
- `listId`: UUID (FK -> Lists)
- `boardId`: UUID (FK -> Boards)
- `title`: String
- `description`: Text
- `assigneeId`: UUID (FK -> Users)
- `priority`: Enum (low, medium, high)
- `createdAt`: Timestamp

## 4. API Contract (Mock)
- `GET /api/state`: Returns full `AppState`.
- `POST /api/boards`: Creates a new board.
- `PUT /api/tasks/:id`: Updates task details or moves list.
- `DELETE /api/tasks/:id`: Removes a task.

## 5. Scalability Considerations
- **Normalization**: Data is stored flatly in `lists` and `tasks` arrays to avoid deeply nested updates.
- **Optimistic Updates**: UI updates immediately before synchronization messages are sent.
- **Pagination**: Search-based filtering acts as primary data retrieval optimization for large boards.
