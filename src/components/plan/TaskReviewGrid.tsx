import React from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';
import { Plus, Trash2, Sliders, Shield, AlertCircle } from 'lucide-react';

export function TaskReviewGrid() {
  const { tasks, setTasks, executeReplan, isOptimizing } = useApp();

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-manual-${Date.now().toString().slice(-4)}`,
      name: 'New Site Task',
      location: 'Tower B Exterior',
      workers: 6,
      duration: 2,
      indoorOutdoor: 'outdoor',
      dustPotential: 'moderate',
      intensity: 'moderate',
      airExposure: 'high',
      heatExposure: 'high',
      movable: true,
      priority: 'normal',
      dependencies: [],
      preferredStartTime: '09:00',
      originalStartTime: '09:00',
      originalEndTime: '11:00',
      status: 'continue',
      recommendedControls: ['Standard PPE', 'N95 Respirator']
    };
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span>Structured Tasks Review & Constraint Configuration</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              {tasks.length} Activities
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verify trade parameters before passing to the deterministic scheduling optimizer.
          </p>
        </div>

        <button
          onClick={handleAddTask}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Manual Task</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No tasks in current plan. Type a plan above or add a task manually.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                {/* Title and Location Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Task Name</label>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => handleUpdateTask(task.id, { name: e.target.value })}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Location / Sector</label>
                    <input
                      type="text"
                      value={task.location}
                      onChange={(e) => handleUpdateTask(task.id, { location: e.target.value })}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition self-end md:self-center"
                  title="Remove task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Task Attributes Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-1 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Workers</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={task.workers}
                    onChange={(e) => handleUpdateTask(task.id, { workers: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs font-mono px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={task.duration}
                    onChange={(e) => {
                      const dur = parseInt(e.target.value, 10) || 1;
                      const startH = parseInt(task.originalStartTime.split(':')[0], 10);
                      const endH = Math.min(19, startH + dur);
                      handleUpdateTask(task.id, { 
                        duration: dur,
                        originalEndTime: `${endH.toString().padStart(2, '0')}:00`
                      });
                    }}
                    className="w-full text-xs font-mono px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Planned Start</label>
                  <input
                    type="time"
                    value={task.originalStartTime}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const startH = parseInt(newStart.split(':')[0], 10);
                      const endH = Math.min(19, startH + task.duration);
                      handleUpdateTask(task.id, { 
                        originalStartTime: newStart,
                        originalEndTime: `${endH.toString().padStart(2, '0')}:00`
                      });
                    }}
                    className="w-full text-xs font-mono px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Environment</label>
                  <select
                    value={task.indoorOutdoor}
                    onChange={(e) => handleUpdateTask(task.id, { indoorOutdoor: e.target.value as any })}
                    className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="outdoor">Outdoor</option>
                    <option value="indoor">Indoor</option>
                    <option value="semi-indoor">Semi-Indoor</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Dust Potential</label>
                  <select
                    value={task.dustPotential}
                    onChange={(e) => handleUpdateTask(task.id, { dustPotential: e.target.value as any })}
                    className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="high">High (C&D Curb)</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Movable</label>
                  <select
                    value={task.movable ? 'true' : 'false'}
                    onChange={(e) => handleUpdateTask(task.id, { movable: e.target.value === 'true' })}
                    className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="true">Yes (Can Shift)</option>
                    <option value="false">No (Fixed Slot)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Priority</label>
                  <select
                    value={task.priority}
                    onChange={(e) => handleUpdateTask(task.id, { priority: e.target.value as any })}
                    className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Confirmation CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Configured tasks will be processed through deterministic environmental hazard & CAQM curbs.</span>
        </div>

        <button
          onClick={() => executeReplan()}
          disabled={isOptimizing || tasks.length === 0}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md min-h-[44px] cursor-pointer"
        >
          {isOptimizing ? 'Evaluating Constraints...' : 'REPLAN MY DAY'}
        </button>
      </div>
    </div>
  );
}
