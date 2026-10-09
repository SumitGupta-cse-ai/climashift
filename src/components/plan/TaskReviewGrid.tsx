import React from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';
import { Plus, Trash2, Sliders, Shield, AlertCircle, HardHat, SunMedium, Settings2, Users, Clock, MapPin } from 'lucide-react';

export function TaskReviewGrid() {
  const { tasks, setTasks, executeReplan, isOptimizing, t, language } = useApp();

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-manual-${Date.now().toString().slice(-4)}`,
      name: language === 'hi' ? 'नया साइट कार्य' : 'New Construction Task',
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
    <div className="bg-[#FFFFFF] dark:bg-[#0D1B2A] border border-[#E4E7EC] dark:border-[#26384C] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EC] dark:border-[#26384C] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF8F2] dark:bg-[#0E3A31] flex items-center justify-center text-[#16B878]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#171A1F] dark:text-[#F5F7FA]">
                {t.taskReviewTitle}
              </h2>
              <p className="text-xs text-[#667085] dark:text-[#A7B2C1]">
                {t.taskReviewSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-md bg-[#F7F8FA] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] font-mono font-medium border border-[#E4E7EC] dark:border-[#26384C]">
            {tasks.length} {language === 'hi' ? 'कार्य' : 'Tasks Configured'}
          </span>

          <button
            onClick={handleAddTask}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#16B878] hover:bg-[#139c65] transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addManualTask}</span>
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#E4E7EC] dark:border-[#26384C] rounded-xl space-y-2">
          <AlertCircle className="w-8 h-8 text-[#667085] dark:text-[#A7B2C1] mx-auto" />
          <p className="text-xs text-[#667085] dark:text-[#A7B2C1]">
            {language === 'hi' ? 'वर्तमान योजना में कोई कार्य नहीं है।' : 'No tasks in current plan. Parse a plan above or add a manual task.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-[#E4E7EC] dark:border-[#26384C] bg-[#F7F8FA] dark:bg-[#07111C] space-y-3"
            >
              {/* Row 1: Index, Task Name, Remove */}
              <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EC] dark:border-[#26384C]/60 pb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded bg-[#E4E7EC] dark:bg-[#122235] text-[#667085] dark:text-[#A7B2C1] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleUpdateTask(task.id, { name: e.target.value })}
                    className="text-sm font-semibold text-[#171A1F] dark:text-[#F5F7FA] bg-transparent border-b border-dashed border-[#E4E7EC] dark:border-[#26384C] focus:border-[#16B878] focus:outline-none flex-1 max-w-md transition px-1 py-0.5"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-[#667085] dark:text-[#A7B2C1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.movable}
                      onChange={(e) => handleUpdateTask(task.id, { movable: e.target.checked })}
                      className="rounded border-[#26384C] text-[#16B878] focus:ring-[#16B878] h-3.5 w-3.5"
                    />
                    <span>{language === 'hi' ? 'पुनर्निर्धारणीय (Movable)' : 'Movable'}</span>
                  </label>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-[#667085] hover:text-[#D94A4A] p-1.5 rounded-md transition cursor-pointer"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                {/* Location */}
                <div>
                  <label className="text-[11px] font-medium text-[#667085] dark:text-[#A7B2C1] block mb-1">
                    {language === 'hi' ? 'स्थान' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={task.location}
                    onChange={(e) => handleUpdateTask(task.id, { location: e.target.value })}
                    className="w-full text-xs font-medium p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  />
                </div>

                {/* Workers */}
                <div>
                  <label className="text-[11px] font-medium text-[#667085] dark:text-[#A7B2C1] block mb-1">
                    {language === 'hi' ? 'श्रमिक' : 'Crew Size'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={task.workers}
                    onChange={(e) => handleUpdateTask(task.id, { workers: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs font-mono font-medium p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[11px] font-medium text-[#667085] dark:text-[#A7B2C1] block mb-1">
                    {language === 'hi' ? 'अवधि (घंटे)' : 'Duration (hrs)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={task.duration}
                    onChange={(e) => handleUpdateTask(task.id, { duration: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs font-mono font-medium p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  />
                </div>

                {/* Planned Start Time */}
                <div>
                  <label className="text-[11px] font-medium text-[#667085] dark:text-[#A7B2C1] block mb-1">
                    {language === 'hi' ? 'शुरुआत समय' : 'Planned Start'}
                  </label>
                  <input
                    type="time"
                    value={task.originalStartTime}
                    onChange={(e) => {
                      const start = e.target.value;
                      const [h, m] = start.split(':').map(Number);
                      const endH = (h + task.duration) % 24;
                      const end = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                      handleUpdateTask(task.id, { originalStartTime: start, originalEndTime: end });
                    }}
                    className="w-full text-xs font-mono font-medium p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  />
                </div>

                {/* Exposure Environment */}
                <div>
                  <label className="text-[11px] font-medium text-[#667085] dark:text-[#A7B2C1] block mb-1">
                    {language === 'hi' ? 'परिवेश' : 'Environment'}
                  </label>
                  <select
                    value={task.indoorOutdoor}
                    onChange={(e) => handleUpdateTask(task.id, { indoorOutdoor: e.target.value as 'indoor' | 'outdoor' })}
                    className="w-full text-xs font-medium p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  >
                    <option value="outdoor">Outdoor</option>
                    <option value="indoor">Indoor</option>
                  </select>
                </div>

                {/* Dust Generation */}
                <div>
                  <label className="text-[11px] font-medium text-[#667085] dark:text-[#A7B2C1] block mb-1">
                    {language === 'hi' ? 'धूल उत्पादन' : 'Dust Level'}
                  </label>
                  <select
                    value={task.dustPotential}
                    onChange={(e) => handleUpdateTask(task.id, { dustPotential: e.target.value as 'none' | 'low' | 'moderate' | 'high' })}
                    className="w-full text-xs font-medium p-2 rounded-lg border border-[#E4E7EC] dark:border-[#26384C] bg-[#FFFFFF] dark:bg-[#0D1B2A] text-[#171A1F] dark:text-[#F5F7FA] focus:outline-none focus:border-[#16B878]"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High (Dust Curb)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
