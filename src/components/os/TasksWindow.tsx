import React, { useState, useEffect } from 'react';
import { TaskManager, CoroutineTask } from '../../engine/taskManager';
import { Activity, Play, Pause, Trash2, Plus, Server, Cpu, Layers } from 'lucide-react';

export const TasksWindow: React.FC = () => {
  const [tasks, setTasks] = useState<CoroutineTask[]>(TaskManager.getTasks());
  const [metrics, setMetrics] = useState(TaskManager.getSystemMetrics());
  const [newTaskName, setNewTaskName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks([...TaskManager.getTasks()]);
      setMetrics(TaskManager.getSystemMetrics());
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (id: string) => {
    TaskManager.toggleTask(id);
    setTasks([...TaskManager.getTasks()]);
    setMetrics(TaskManager.getSystemMetrics());
  };

  const handleKill = (id: string) => {
    TaskManager.killTask(id);
    setTasks([...TaskManager.getTasks()]);
    setMetrics(TaskManager.getSystemMetrics());
  };

  const handleSpawn = () => {
    if (!newTaskName.trim()) return;
    TaskManager.spawnTask(newTaskName.trim());
    setTasks([...TaskManager.getTasks()]);
    setMetrics(TaskManager.getSystemMetrics());
    setNewTaskName('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Metrics Banner */}
      <div className="bg-[#14141A] border-b border-[#26262E] p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
        <div className="bg-[#191920] p-2 rounded border border-[#26262E]">
          <div className="text-[10px] text-gray-500 uppercase font-semibold">Running Tasks</div>
          <div className="text-base font-bold text-[#4ADE80] mt-0.5">
            {metrics.runningCount} <span className="text-xs font-normal text-gray-400">/ {metrics.totalCount}</span>
          </div>
        </div>

        <div className="bg-[#191920] p-2 rounded border border-[#26262E]">
          <div className="text-[10px] text-gray-500 uppercase font-semibold">Total CPU Load</div>
          <div className="text-base font-bold text-[#38BDF8] mt-0.5">
            {metrics.cpuPercent}%
          </div>
        </div>

        <div className="bg-[#191920] p-2 rounded border border-[#26262E]">
          <div className="text-[10px] text-gray-500 uppercase font-semibold">Memory Heap</div>
          <div className="text-base font-bold text-[#A78BFA] mt-0.5">
            {metrics.memoryMb} MB
          </div>
        </div>

        <div className="bg-[#191920] p-2 rounded border border-[#26262E]">
          <div className="text-[10px] text-gray-500 uppercase font-semibold">Scheduler Mode</div>
          <div className="text-base font-bold text-yellow-400 mt-0.5">
            HTCondor
          </div>
        </div>
      </div>

      {/* Task Controls Header */}
      <div className="bg-[#16161C] border-b border-[#26262E] px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span className="font-semibold text-gray-200">Asyncio Event Loop &amp; Coroutine Table</span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-2 py-1 rounded text-[10.5px] font-semibold cursor-pointer transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Spawn Coroutine</span>
        </button>
      </div>

      {/* Spawn Task Drawer */}
      {isAdding && (
        <div className="bg-[#1B1B22] border-b border-[#26262E] p-3 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="e.g. crawler.fetch_pml_specs"
            className="flex-1 bg-[#101014] border border-[#2D2D35] px-2.5 py-1 text-xs text-white rounded focus:outline-none focus:border-[#38BDF8]"
          />
          <button
            onClick={handleSpawn}
            className="bg-[#10B981] hover:bg-[#059669] text-white px-3 py-1 rounded text-xs font-semibold cursor-pointer"
          >
            Launch
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="text-gray-400 hover:text-white px-2 text-xs"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Coroutines Table */}
      <div className="flex-1 overflow-y-auto p-3">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#26262E] text-[10px] uppercase text-gray-500">
              <th className="pb-2 font-semibold">Coroutine</th>
              <th className="pb-2 font-semibold">State</th>
              <th className="pb-2 font-semibold">CPU</th>
              <th className="pb-2 font-semibold">Memory</th>
              <th className="pb-2 font-semibold">Priority</th>
              <th className="pb-2 font-semibold">Shadow Host</th>
              <th className="pb-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1D1D24] text-[11px]">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#14141A] transition-colors">
                <td className="py-2.5 font-medium text-gray-200">
                  <div>{task.name}</div>
                  <div className="text-[9.5px] text-gray-500 font-mono">{task.coroutineFunction}</div>
                </td>
                <td className="py-2.5">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                      task.state === 'RUNNING'
                        ? 'bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30'
                        : task.state === 'WAIT_IO'
                        ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-700/30 text-gray-400'
                    }`}
                  >
                    {task.state}
                  </span>
                </td>
                <td className="py-2.5 text-gray-300 font-mono">{task.cpuPercent}%</td>
                <td className="py-2.5 text-gray-400 font-mono">{(task.memoryKb / 1024).toFixed(1)} MB</td>
                <td className="py-2.5">
                  <span className="text-[10px] text-gray-400 bg-[#1F1F26] px-1.5 py-0.5 rounded">
                    {task.priority}
                  </span>
                </td>
                <td className="py-2.5 text-gray-500 font-mono text-[10px]">{task.shadowHost || 'local'}</td>
                <td className="py-2.5 text-right space-x-1">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className="p-1 hover:bg-[#252530] text-gray-300 hover:text-white rounded cursor-pointer transition-colors"
                    title={task.state === 'RUNNING' ? 'Suspend coroutine' : 'Resume coroutine'}
                  >
                    {task.state === 'RUNNING' ? <Pause className="w-3.5 h-3.5 text-yellow-400" /> : <Play className="w-3.5 h-3.5 text-[#4ADE80]" />}
                  </button>
                  <button
                    onClick={() => handleKill(task.id)}
                    className="p-1 hover:bg-[#252530] text-gray-400 hover:text-red-400 rounded cursor-pointer transition-colors"
                    title="Terminate process"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
