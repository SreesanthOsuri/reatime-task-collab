
import React, { useState } from 'react';
import { Board } from '../types';

interface BoardListProps {
  boards: Board[];
  onCreateBoard: (title: string) => void;
  onSelectBoard: (id: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({ boards, onCreateBoard, onSelectBoard }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onCreateBoard(newTitle.trim());
      setNewTitle('');
      setShowCreate(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Your Boards</h1>
          <p className="text-gray-500 mt-1">Select a workspace to begin collaborating.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-6 py-3 bg-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl active:scale-95"
        >
          <i className="fa-solid fa-plus"></i> New Board
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map(board => (
          <div 
            key={board.id}
            onClick={() => onSelectBoard(board.id)}
            className="group h-48 bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-black hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <i className="fa-solid fa-arrow-right-long text-gray-400"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{board.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{board.members.length} member{board.members.length !== 1 ? 's' : ''}</p>
            <div className="mt-auto flex items-center gap-2">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Last activity 2m ago</span>
            </div>
          </div>
        ))}

        {boards.length === 0 && !showCreate && (
          <div className="col-span-full py-20 text-center bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200">
             <i className="fa-solid fa-layer-group text-4xl text-gray-300 mb-4"></i>
             <p className="text-gray-500 font-medium">You don't have any boards yet.</p>
             <button 
              onClick={() => setShowCreate(true)}
              className="text-black font-bold mt-2 hover:underline"
             >
               Create your first one
             </button>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">Create New Board</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Board Title</label>
                <input 
                  autoFocus
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Marketing Plan"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
