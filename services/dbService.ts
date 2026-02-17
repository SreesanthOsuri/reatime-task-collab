
import { AppState, Board, List, Task, Activity, User } from '../types';

const STORAGE_KEY = 'hintro_collab_v1';
const SYNC_CHANNEL = 'hintro_sync_channel';

const defaultState: AppState = {
  currentUser: null,
  boards: [],
  lists: [],
  tasks: [],
  activities: []
};

// Initialize BroadcastChannel for real-time simulation
const bc = new BroadcastChannel(SYNC_CHANNEL);

export const dbService = {
  getState: (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  },

  saveState: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    bc.postMessage({ type: 'UPDATE_STATE', state });
  },

  subscribe: (callback: (state: AppState) => void) => {
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_STATE') {
        callback(event.data.state);
      }
    };
    bc.addEventListener('message', handler);
    return () => bc.removeEventListener('message', handler);
  },

  addActivity: (boardId: string, userId: string, action: string) => {
    const state = dbService.getState();
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      boardId,
      userId,
      action,
      timestamp: Date.now()
    };
    state.activities = [newActivity, ...state.activities].slice(0, 100);
    dbService.saveState(state);
  }
};
