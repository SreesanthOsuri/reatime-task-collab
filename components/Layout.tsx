
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  onHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, searchQuery, onSearch, onHome }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onHome}
            className="bg-black text-white p-2 rounded-lg font-black tracking-tighter text-sm hover:scale-105 transition-transform"
          >
            HINTRO
          </button>
          <nav className="hidden md:flex items-center gap-4">
            <button onClick={onHome} className="text-sm font-bold text-gray-900 hover:text-black">Boards</button>
            <button className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">Templates</button>
          </nav>
        </div>

        <div className="flex-1 max-w-xl px-12">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"></i>
            <input
              type="text"
              placeholder="Search in board..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-black rounded-xl py-2 pl-10 pr-4 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
              <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
            </div>
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-100" />
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-400 hover:text-red-600 transition-colors p-2"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
