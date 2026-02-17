
import React, { useState } from 'react';
import { Board, List, Task, User, Activity } from '../types';
import TaskModal from './TaskModal';

interface BoardViewProps {
  board: Board;
  lists: List[];
  tasks: Task[];
  users: User[];
  activities: Activity[];
  searchQuery: string;
  onUpdateTasks: (tasks: Task[]) => void;
  onUpdateLists: (lists: List[]) => void;
  onAddActivity: (action: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ 
  board, lists, tasks, users, activities, searchQuery, 
  onUpdateTasks, onUpdateLists, onAddActivity 
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addingToListId, setAddingToListId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filtering Logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (listId: string) => {
    if (!draggedTaskId) return;
    const task = tasks.find(t => t.id === draggedTaskId);
    if (!task || task.listId === listId) {
      setDraggedTaskId(null);
      return;
    }

    const newTasks = tasks.map(t => 
      t.id === draggedTaskId ? { ...t, listId } : t
    );
    onUpdateTasks(newTasks);
    onAddActivity(`Moved task "${task.title}" to ${lists.find(l => l.id === listId)?.title}`);
    setDraggedTaskId(null);
  };

  const handleAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      boardId: board.id,
      listId: addingToListId!,
      title: taskData.title || '',
      description: taskData.description || '',
      assigneeId: taskData.assigneeId,
      priority: taskData.priority || 'medium',
      createdAt: Date.now(),
    };
    onUpdateTasks([...tasks, newTask]);
    onAddActivity(`Created task "${newTask.title}"`);
    setAddingToListId(null);
  };

  const handleEditTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;
    const newTasks = tasks.map(t => 
      t.id === editingTask.id ? { ...t, ...taskData } : t
    );
    onUpdateTasks(newTasks);
    onAddActivity(`Updated task "${editingTask.title}"`);
    setEditingTask(null);
  };

  const handleUpdateAssignee = (taskId: string, assigneeId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newTasks = tasks.map(t => 
      t.id === taskId ? { ...t, assigneeId: assigneeId || undefined } : t
    );
    onUpdateTasks(newTasks);
    
    const userName = users.find(u => u.id === assigneeId)?.name || 'Unassigned';
    onAddActivity(`Assigned "${task.title}" to ${userName}`);
  };

  const handleUpdatePriority = (taskId: string, priority: Task['priority']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newTasks = tasks.map(t => 
      t.id === taskId ? { ...t, priority } : t
    );
    onUpdateTasks(newTasks);
    onAddActivity(`Changed priority of "${task.title}" to ${priority}`);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
    onAddActivity(`Deleted task "${taskToDelete?.title}"`);
  };

  const handleAddList = () => {
    const title = prompt('List title:');
    if (!title) return;
    const newList: List = {
      id: Math.random().toString(36).substr(2, 9),
      boardId: board.id,
      title,
      order: lists.length
    };
    onUpdateLists([...lists, newList]);
    onAddActivity(`Created list "${title}"`);
  };

  const getUser = (id?: string) => users.find(u => u.id === id);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Board Secondary Header / Filter Bar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority Filter:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['all', 'high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all ${
                    priorityFilter === p 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {priorityFilter !== 'all' && (
            <button 
              onClick={() => setPriorityFilter('all')}
              className="text-[10px] font-bold text-blue-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="text-[11px] font-medium text-slate-400">
          Showing <span className="text-slate-900 font-bold">{filteredTasks.length}</span> of <span className="text-slate-900 font-bold">{tasks.length}</span> tasks
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6 flex items-start gap-6">
        {lists.sort((a, b) => a.order - b.order).map(list => (
          <div 
            key={list.id} 
            className={`w-80 shrink-0 flex flex-col max-h-full rounded-xl transition-colors bg-slate-100/60 border border-slate-200 p-3`}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-blue-50/50');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('bg-blue-50/50');
            }}
            onDrop={(e) => {
              e.currentTarget.classList.remove('bg-blue-50/50');
              handleDrop(list.id);
            }}
          >
            <div className="px-2 py-2 flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-slate-500 truncate uppercase tracking-widest">{list.title}</h3>
              <div className="flex items-center gap-2">
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {filteredTasks.filter(t => t.listId === list.id).length}
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar pb-2">
              {filteredTasks.filter(t => t.listId === list.id).map(task => {
                const assignee = getUser(task.assigneeId);
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group ring-1 ring-transparent hover:ring-black/5"
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="relative group/priority">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider cursor-pointer border ${
                          task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {task.priority}
                        </span>
                        <select
                          value={task.priority}
                          onChange={(e) => handleUpdatePriority(task.id, e.target.value as Task['priority'])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          title="Change Priority"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}
                          className="text-slate-300 hover:text-blue-500"
                        >
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                          className="text-slate-300 hover:text-red-500"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </div>

                    <h4 className="text-[14px] font-bold text-slate-800 mb-1.5 leading-tight group-hover:text-black transition-colors">{task.title}</h4>
                    <p className="text-[12px] text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">{task.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                      <div className="relative group/assignee">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <div className="relative">
                            {assignee ? (
                              <img 
                                src={assignee.avatar} 
                                alt={assignee.name}
                                className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 shadow-sm"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                                <i className="fa-solid fa-user-plus text-[10px]"></i>
                              </div>
                            )}
                          </div>
                          <select
                            value={task.assigneeId || ''}
                            onChange={(e) => handleUpdateAssignee(task.id, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title="Change Assignee"
                          >
                            <option value="">Unassigned</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                          </select>
                          <span className="text-[11px] font-bold text-slate-400 group-hover/assignee:text-slate-800 transition-colors">
                            {assignee ? assignee.name.split(' ')[0] : 'Assign'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                        <i className="fa-regular fa-clock"></i>
                        {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setAddingToListId(list.id)}
              className="mt-3 w-full py-2.5 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 hover:bg-white hover:text-black rounded-xl border-2 border-transparent hover:border-slate-200 transition-all hover:shadow-sm"
            >
              <i className="fa-solid fa-plus"></i> NEW TASK
            </button>
          </div>
        ))}

        <button 
          onClick={handleAddList}
          className="w-80 shrink-0 bg-slate-100/40 hover:bg-slate-100 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 h-fit transition-all text-slate-400 font-bold text-xs flex items-center justify-center gap-3 tracking-widest uppercase"
        >
          <i className="fa-solid fa-plus"></i> New Section
        </button>
      </div>

      {/* Activity Panel */}
      <div className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 z-40 ${isActivityPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b flex items-center justify-between bg-slate-50">
          <h3 className="font-bold flex items-center gap-2 text-slate-800 text-sm tracking-tight">
            <i className="fa-solid fa-bolt-lightning text-amber-500"></i> Activity Feed
          </h3>
          <button onClick={() => setIsActivityPanelOpen(false)} className="text-slate-400 hover:text-black transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-32 p-5 space-y-6">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <i className="fa-solid fa-inbox text-4xl mb-4"></i>
              <p className="text-xs font-bold uppercase tracking-widest">Quiet for now</p>
            </div>
          ) : (
            activities.map(act => (
              <div key={act.id} className="text-[12px] flex gap-3 group relative">
                <div className="relative z-10">
                  <img 
                    src={getUser(act.userId)?.avatar} 
                    className="w-8 h-8 rounded-full border border-slate-100 shadow-sm shrink-0"
                    alt=""
                  />
                </div>
                <div className="flex-1">
                  <p className="text-slate-600 leading-snug">
                    <span className="font-bold text-slate-900">{getUser(act.userId)?.name || 'System'}</span> {act.action}
                  </p>
                  <p className="text-slate-300 font-bold text-[10px] mt-1 flex items-center gap-1 uppercase tracking-tighter">
                    <i className="fa-regular fa-clock"></i>
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Toggle for Activity */}
      <button 
        onClick={() => setIsActivityPanelOpen(!isActivityPanelOpen)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 flex items-center justify-center ${
          isActivityPanelOpen ? 'bg-white text-slate-900 border border-slate-200' : 'bg-black text-white'
        }`}
      >
        <i className={`fa-solid ${isActivityPanelOpen ? 'fa-chevron-right' : 'fa-history text-lg'}`}></i>
      </button>

      {/* Modals */}
      {(addingToListId || editingTask) && (
        <TaskModal 
          task={editingTask || undefined}
          onClose={() => { setAddingToListId(null); setEditingTask(null); }}
          onSave={editingTask ? handleEditTask : handleAddTask}
          users={users}
        />
      )}
    </div>
  );
};

export default BoardView;
