
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BoardView from './components/BoardView';
import Auth from './components/Auth';
import BoardList from './components/BoardList';
import { dbService } from './services/dbService';
import { AppState, User, Board, List, Task } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sreesanth Osuri', email: 'sreesanth@hintro.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sreesanth' },
  { id: 'u2', name: 'Jamie Chen', email: 'jamie@hintro.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie' },
  { id: 'u3', name: 'Sam Taylor', email: 'sam@hintro.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(dbService.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = dbService.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const handleLogin = (email: string) => {
    // Basic logic to find user or create mock
    const user = MOCK_USERS.find(u => u.email === email) || {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    const newState = { ...state, currentUser: user };
    dbService.saveState(newState);
    setState(newState);
  };

  const handleLogout = () => {
    const newState = { ...state, currentUser: null };
    dbService.saveState(newState);
    setState(newState);
    setActiveBoardId(null);
  };

  const handleCreateBoard = (title: string) => {
    if (!state.currentUser) return;
    const newBoard: Board = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      ownerId: state.currentUser.id,
      members: [state.currentUser.id]
    };
    const newState = { ...state, boards: [...state.boards, newBoard] };
    dbService.saveState(newState);
    setState(newState);
    handleAddActivity(newBoard.id, `created the board "${title}"`);
  };

  const handleUpdateTasks = (newTasks: Task[]) => {
    const newState = { ...state, tasks: newTasks };
    dbService.saveState(newState);
    setState(newState);
  };

  const handleUpdateLists = (newLists: List[]) => {
    const newState = { ...state, lists: newLists };
    dbService.saveState(newState);
    setState(newState);
  };

  const handleAddActivity = (boardId: string, action: string) => {
    if (state.currentUser) {
      dbService.addActivity(boardId, state.currentUser.id, action);
      setState(dbService.getState());
    }
  };

  if (!state.currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const activeBoard = state.boards.find(b => b.id === activeBoardId);

  return (
    <Layout 
      user={state.currentUser} 
      onLogout={handleLogout} 
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onHome={() => setActiveBoardId(null)}
    >
      {!activeBoardId ? (
        <BoardList 
          boards={state.boards} 
          onCreateBoard={handleCreateBoard} 
          onSelectBoard={setActiveBoardId} 
        />
      ) : activeBoard ? (
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveBoardId(null)} className="text-gray-400 hover:text-black transition-colors">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h2 className="text-xl font-bold">{activeBoard.title}</h2>
              <div className="h-4 w-px bg-gray-200"></div>
              <div className="flex -space-x-2">
                {MOCK_USERS.map(u => (
                  <img key={u.id} src={u.avatar} className="w-7 h-7 rounded-full border-2 border-white ring-1 ring-gray-100" title={u.name} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md">
                <i className="fa-solid fa-filter mr-1"></i> Filter
              </button>
            </div>
          </div>
          <BoardView 
            board={activeBoard}
            lists={state.lists.filter(l => l.boardId === activeBoard.id)}
            tasks={state.tasks.filter(t => t.boardId === activeBoard.id)}
            users={MOCK_USERS}
            activities={state.activities.filter(a => a.boardId === activeBoard.id)}
            searchQuery={searchQuery}
            onUpdateTasks={(newTasks) => {
                // Merge board tasks back into global task list
                const otherTasks = state.tasks.filter(t => t.boardId !== activeBoard.id);
                handleUpdateTasks([...otherTasks, ...newTasks]);
            }}
            onUpdateLists={(newLists) => {
                const otherLists = state.lists.filter(l => l.boardId !== activeBoard.id);
                handleUpdateLists([...otherLists, ...newLists]);
            }}
            onAddActivity={(action) => handleAddActivity(activeBoard.id, action)}
          />
        </div>
      ) : null}
    </Layout>
  );
};

export default App;
