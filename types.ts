
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Task {
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description: string;
  assigneeId?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  ownerId: string;
  members: string[]; // User IDs
}

export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  action: string;
  timestamp: number;
}

export interface AppState {
  currentUser: User | null;
  boards: Board[];
  lists: List[];
  tasks: Task[];
  activities: Activity[];
}
