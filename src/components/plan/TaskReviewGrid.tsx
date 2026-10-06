import React from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';
import { Plus, Trash2, Sliders, Shield, AlertCircle, HardHat, SunMedium, Settings2 } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>{t.taskReviewTitle}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              {tasks.length} {language === 'hi' ? 'कार्य' : 'Tasks'}
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.taskReviewSubtitle}
          </p>
        </div>

        <button
          onClick={handleAddTask}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addManualTask}</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
          <AlertCircle className="w-7 h-7 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'वर्तमान योजना में कोई कार्य नहीं है।' : 'No tasks in current plan.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
            >
              {/* Header: Name & Remove */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">#{idx + 1}</span>
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleUpdateTask(task.id, { name: e.target.value })}
                    className="text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-500 flex-1 max-w-sm"
                  />
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded transition cursor-pointer"
                  title="Remove task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Clear Functional Groups: TASK | EXPOSURE | OPERATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1. TASK BASICS */}
                <div className="p-2.5 rounded bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <HardHat className="w-3 h-3 text-slate-400" />
                    <span>{language === 'hi' ? 'कार्य विवरण (Task)' : 'Task Details'}</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.locationLabel}</label>
                      <input
                        type="text"
                        value={task.location}
                        onChange={(e) => handleUpdateTask(task.id, { location: e.target.value })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.workersLabel}</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={task.workers}
                        onChange={(e) => handleUpdateTask(task.id, { workers: parseInt(e.target.value, 10) || 1 })}
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.durationLabel}</label>
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
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.plannedStartLabel}</label>
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
                        className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. EXPOSURE CHARACTERISTICS */}
                <div className="p-2.5 rounded bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <SunMedium className="w-3 h-3 text-amber-500" />
                    <span>{language === 'hi' ? 'पर्यावरणीय जोखिम (Exposure)' : 'Exposure Factors'}</span>
                  </span>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.environmentLabel}</label>
                      <select
                        value={task.indoorOutdoor}
                        onChange={(e) => handleUpdateTask(task.id, { indoorOutdoor: e.target.value as any })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="outdoor">{language === 'hi' ? 'खुला मैदान (Outdoor)' : 'Outdoor'}</option>
                        <option value="indoor">{language === 'hi' ? 'अंदर / बेसमेंट (Indoor)' : 'Indoor'}</option>
                        <option value="semi-indoor">{language === 'hi' ? 'अर्ध-छाया (Semi-Indoor)' : 'Semi-Indoor'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.dustLabel}</label>
                      <select
                        value={task.dustPotential}
                        onChange={(e) => handleUpdateTask(task.id, { dustPotential: e.target.value as any })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="high">{language === 'hi' ? 'अधिक (GRAP III प्रतिबंध)' : 'High (C&D Curb Trigger)'}</option>
                        <option value="moderate">{language === 'hi' ? 'मध्यम' : 'Moderate'}</option>
                        <option value="low">{language === 'hi' ? 'कम' : 'Low'}</option>
                        <option value="none">{language === 'hi' ? 'शून्य' : 'None'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{language === 'hi' ? 'श्रम तीव्रता (Intensity)' : 'Intensity'}</label>
                      <select
                        value={task.intensity}
                        onChange={(e) => handleUpdateTask(task.id, { intensity: e.target.value as any })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="heavy">{language === 'hi' ? 'भारी शारीरिक श्रम (Heavy)' : 'Heavy Labor'}</option>
                        <option value="moderate">{language === 'hi' ? 'मध्यम श्रम' : 'Moderate'}</option>
                        <option value="light">{language === 'hi' ? 'हल्का कार्य' : 'Light'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. OPERATIONAL CONSTRAINTS */}
                <div className="p-2.5 rounded bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    <Settings2 className="w-3 h-3 text-sky-500" />
                    <span>{language === 'hi' ? 'परिचालन शर्तें (Operations)' : 'Operational Rules'}</span>
                  </span>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.movableLabel}</label>
                      <select
                        value={task.movable ? 'true' : 'false'}
                        onChange={(e) => handleUpdateTask(task.id, { movable: e.target.value === 'true' })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="true">{language === 'hi' ? 'हाँ (समय बदल सकते हैं)' : 'Yes (Movable Window)'}</option>
                        <option value="false">{language === 'hi' ? 'नहीं (निश्चित समय)' : 'No (Locked Slot)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{t.priorityLabel}</label>
                      <select
                        value={task.priority}
                        onChange={(e) => handleUpdateTask(task.id, { priority: e.target.value as any })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="critical">{language === 'hi' ? 'अति महत्वपूर्ण (Critical)' : 'Critical'}</option>
                        <option value="high">{language === 'hi' ? 'उच्च (High)' : 'High'}</option>
                        <option value="normal">{language === 'hi' ? 'सामान्य' : 'Normal'}</option>
                        <option value="low">{language === 'hi' ? 'कम' : 'Low'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">{language === 'hi' ? 'निर्भरता (Dependencies)' : 'Preceding Task'}</label>
                      <select
                        value={task.dependencies[0] || ''}
                        onChange={(e) => handleUpdateTask(task.id, { dependencies: e.target.value ? [e.target.value] : [] })}
                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="">{language === 'hi' ? 'कोई नहीं' : 'None (Independent)'}</option>
                        {tasks.filter(t => t.id !== task.id).map(t => (
                          <option key={t.id} value={t.id}>
                            Must follow: {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation CTA */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{language === 'hi' ? 'टास्क सेटिंग्स के आधार पर शेड्यूलिंग इंजन सुरक्षा विश्लेषण करेगा।' : 'Safety optimization engine will evaluate based on configured constraints.'}</span>
        </span>

        <button
          onClick={() => executeReplan()}
          disabled={isOptimizing || tasks.length === 0}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-subtle cursor-pointer disabled:opacity-50"
        >
          {isOptimizing ? t.evaluatingConstraints : t.replanMyDay}
        </button>
      </div>
    </div>
  );
}
