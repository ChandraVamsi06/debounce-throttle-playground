import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce, throttle } from 'lodash';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // --- State ---
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('none');
  const [delay, setDelay] = useState(1000);
  const [logs, setLogs] = useState([]); 
  const [startTime, setStartTime] = useState(null);

  // --- Helpers ---
  const addLog = useCallback((type) => {
    const now = Date.now();
    setStartTime(prev => prev || now);
    const timestampStr = new Date().toLocaleTimeString();
    const id = now + Math.random(); 

    setLogs((prev) => {
        const newLog = { id, type, timestamp: timestampStr, rawTime: now };
        return [newLog, ...prev];
    });
  }, []);

  const executeFunction = useCallback(() => {
    addLog('Executed');
  }, [addLog]);

  // --- Lodash Wrappers ---
  const debouncedHandler = useMemo(
    () => debounce(executeFunction, delay),
    [delay, executeFunction]
  );

  const throttledHandler = useMemo(
    () => throttle(executeFunction, delay),
    [delay, executeFunction]
  );

  useEffect(() => {
    return () => {
      debouncedHandler.cancel();
      throttledHandler.cancel();
    };
  }, [debouncedHandler, throttledHandler]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    addLog('Raw Input');

    if (mode === 'none') {
      executeFunction();
    } else if (mode === 'debounce') {
      debouncedHandler();
    } else if (mode === 'throttle') {
      throttledHandler();
    }
  };

  const handleReset = () => {
    setInputText('');
    setMode('none');
    setDelay(1000);
    setLogs([]);
    setStartTime(null);
    debouncedHandler.cancel();
    throttledHandler.cancel();
  };

  // --- Challenge Requirement ---
  useEffect(() => {
    window.getChartData = () => {
      const rawEvents = logs
        .filter(l => l.type === 'Raw Input')
        .map(l => ({ time: l.rawTime, value: 'Raw Input' }));
      const executedEvents = logs
        .filter(l => l.type === 'Executed')
        .map(l => ({ time: l.rawTime, value: 'Executed' }));
      return { rawEvents, executedEvents };
    };
  }, [logs]);

  // --- Chart Config (Light Theme) ---
  const chartData = {
    labels: logs.length > 0 ? logs.map(l => ((l.rawTime - (startTime || l.rawTime)) / 1000).toFixed(1)) : [],
    datasets: [
      {
        label: 'Raw Input',
        data: logs.filter(l => l.type === 'Raw Input').map(l => ({
            x: ((l.rawTime - (startTime || l.rawTime)) / 1000).toFixed(1),
            y: 1
        })),
        borderColor: '#94a3b8', // Slate 400 (Gray)
        backgroundColor: 'rgba(148, 163, 184, 0.5)',
        pointRadius: 6,
        showLine: false,
      },
      {
        label: 'Executed',
        data: logs.filter(l => l.type === 'Executed').map(l => ({
            x: ((l.rawTime - (startTime || l.rawTime)) / 1000).toFixed(1),
            y: 0
        })),
        borderColor: '#2563eb', // Blue 600
        backgroundColor: '#2563eb',
        pointRadius: 8,
        pointStyle: 'rectRot',
        showLine: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        display: true,
        title: { display: true, text: 'Seconds Elapsed', color: '#64748b' },
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' } // Light grid lines
      },
      y: {
        display: false,
        min: -0.5,
        max: 1.5,
      }
    },
    plugins: {
      legend: {
        labels: { color: '#475569' } // Dark text
      }
    }
  };

  return (
    // MAIN BACKGROUND: Light Slate (Clean)
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER: White with shadow */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
             </svg>
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">Debounce & Throttle</h1>
             <p className="text-xs text-slate-500 font-medium">Performance Playground</p>
           </div>
        </div>
        <button
            data-testid="reset-button"
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
            Reset System
        </button>
      </header>

      {/* LAYOUT CONTAINER: Centered, Max Width */}
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
        
        {/* GRID LAYOUT: Matches your diagram (Left Col, Right Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
            
            {/* === LEFT COLUMN: Config + Viz === */}
            <div className="flex flex-col gap-6 h-full">
                
                {/* 1. CONFIGURATION CARD (Top Left) */}
                <div data-testid="control-panel" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Configuration
                    </h2>
                    
                    <div className="space-y-6">
                        {/* Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Test Input Stream</label>
                            <input
                                type="text"
                                data-testid="text-input"
                                value={inputText}
                                onChange={handleChange} 
                                placeholder="Type something here..."
                                className="w-full bg-slate-50 text-slate-900 p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mode Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Strategy Mode</label>
                                <div className="space-y-2">
                                    {['none', 'debounce', 'throttle'].map((m) => (
                                        <label 
                                            key={m} 
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                mode === m 
                                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' 
                                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="mode"
                                                value={m}
                                                data-testid={`mode-selector-${m}`}
                                                checked={mode === m}
                                                onChange={(e) => {
                                                    setMode(e.target.value);
                                                    debouncedHandler.cancel();
                                                    throttledHandler.cancel();
                                                }}
                                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <span className={`block text-sm font-medium capitalize ${mode === m ? 'text-blue-700' : 'text-slate-700'}`}>
                                                    {m}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Delay Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-slate-700">Delay Time</label>
                                    <span data-testid="delay-label" className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono font-bold border border-slate-200">
                                        {delay}ms
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <input
                                        type="range"
                                        data-testid="delay-slider"
                                        min="0"
                                        max="5000"
                                        step="100"
                                        value={delay}
                                        onChange={(e) => setDelay(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="mt-3 text-xs text-slate-500">
                                        {mode === 'debounce' && '⏳ Waits for silence before running.'}
                                        {mode === 'throttle' && '⏱️ Runs at a steady pace.'}
                                        {mode === 'none' && '⚡ Runs immediately.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. VISUALIZATION CARD (Bottom Left - Fills space) */}
                <div data-testid="visualization-panel" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Visualization
                        </h2>
                        {/* <div className="flex gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2 text-slate-500">
                                <span className="w-2 h-2 bg-slate-400 rounded-full"></span> Raw Input
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                                <span className="w-2 h-2 bg-blue-600 rounded-sm rotate-45"></span> Executed
                            </div>
                        </div> */}
                    </div>
                    
                    <div data-testid="visualization-chart" className="flex-1 w-full relative bg-slate-50 rounded-lg border border-slate-100 p-2">
                        <Line options={chartOptions} data={chartData} />
                        {logs.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <span className="text-sm">Chart waiting for data...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* === RIGHT COLUMN: System Log (Full Height) === */}
            <div className="h-full">
                <div data-testid="log-panel" className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
                    {/* Log Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-800"></span> System Log
                        </h2>
                        <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full text-xs font-medium">
                            {logs.length} events
                        </span>
                    </div>

                    {/* Log Body - Dark Terminal Style for contrast, or keep light? Let's use Dark for logs as it's cleaner for code-like data */}
                    <div className="flex-1 bg-[#1e293b] p-0 overflow-y-auto custom-scrollbar font-mono text-xs">
                        <div data-testid="log-output" className="flex flex-col min-h-full">
                            {logs.length === 0 && (
                                <div className="p-8 text-center text-slate-500 italic">
                                    // System ready...<br/>
                                    // Waiting for input events...
                                </div>
                            )}
                            {logs.map((log) => (
                                <div 
                                    key={log.id} 
                                    data-testid={log.type === 'Raw Input' ? 'log-entry-raw' : 'log-entry-executed'}
                                    className={`px-6 py-3 border-b border-slate-700/50 flex gap-4 items-center ${
                                        log.type === 'Raw Input' 
                                        ? 'text-slate-400 hover:bg-slate-800/50' 
                                        : 'text-emerald-400 bg-emerald-500/10 border-l-4 border-l-emerald-500 pl-[20px]'
                                    }`}
                                >
                                    <span className="opacity-40 min-w-[70px] text-[10px] tracking-wide">{log.timestamp}</span>
                                    <span className="flex-1 font-medium">{log.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default App;