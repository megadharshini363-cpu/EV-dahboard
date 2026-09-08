import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { 
  Terminal, 
  Download, 
  Trash2, 
  Pause, 
  Play, 
  Filter, 
  Search, 
  Radio, 
  Cpu, 
  Database,
  ArrowDown,
  Layers
} from 'lucide-react';
import { CANFrame } from '../../types';

export const CanLoggerView: React.FC = () => {
  const { 
    canFrames, 
    canBusLoadPct, 
    clearCanLog, 
    exportCanLog, 
    isSimulating, 
    setIsSimulating 
  } = useVehicle();

  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<CANFrame | null>(null);

  const filteredFrames = canFrames.filter(f => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return f.id.toLowerCase().includes(q) || f.name.toLowerCase().includes(q) || f.bus.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top CAN Hardware Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-cyber text-slate-100">
                CAN 2.0B / CAN-FD Raw Data Bus Sniffer
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-telemetry">
                SOCKETCAN: can0 / can1 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry">
              500 kbps Nominal Bitrate • Dual-channel automotive transceiver • Real-time frame parser
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-cyber font-bold transition-all flex items-center gap-1.5 ${
              isSimulating 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Pause Stream' : 'Resume'}</span>
          </button>

          <button
            onClick={clearCanLog}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-cyber font-bold transition-colors flex items-center gap-1.5"
            title="Clear buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={exportCanLog}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-cyber font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bus Load Meter & Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between font-telemetry">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Bus Load (CAN-0/1)</span>
            <span className="text-xl font-bold font-cyber text-cyan-400">{canBusLoadPct}%</span>
          </div>
          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${canBusLoadPct}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-telemetry">
          <span className="text-[10px] text-slate-400 uppercase block">Captured Frames</span>
          <span className="text-xl font-bold font-cyber text-slate-100">{canFrames.length} Frames</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-telemetry">
          <span className="text-[10px] text-slate-400 uppercase block">Bitrate / Timing</span>
          <span className="text-xl font-bold font-cyber text-emerald-400">500 kbps (87.5% SJW)</span>
        </div>

        {/* Filter Input */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Filter by ID (0x18...) or name..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-telemetry text-slate-200 outline-none placeholder-slate-500"
          />
        </div>
      </div>

      {/* CAN Stream Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800/80 p-5 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold font-cyber text-slate-200 uppercase tracking-wider">
              Live CAN Frame Buffer ({filteredFrames.length} displayed)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-telemetry">
            Click any frame to inspect DBC decoded payload
          </span>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs font-telemetry">
            <thead className="sticky top-0 bg-slate-900/90 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Interface</th>
                <th className="py-2.5 px-3">CAN ID</th>
                <th className="py-2.5 px-3">Message Identifier</th>
                <th className="py-2.5 px-3">DLC</th>
                <th className="py-2.5 px-3">Data Bytes [Hex D0 - D7]</th>
                <th className="py-2.5 px-3 text-right">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredFrames.map((frame, idx) => {
                const isSelected = selectedFrame?.timestamp === frame.timestamp && selectedFrame?.id === frame.id;

                return (
                  <tr
                    key={`${frame.timestamp}-${idx}`}
                    onClick={() => setSelectedFrame(frame)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-cyan-200'
                        : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{frame.timestamp}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        frame.bus.includes('CAN-1') 
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {frame.bus.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-amber-300 font-cyber">{frame.id}</td>
                    <td className="py-2 px-3 font-medium text-slate-200">{frame.name}</td>
                    <td className="py-2 px-3 text-slate-400">{frame.dlc}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1.5 font-mono text-[11px]">
                        {frame.data.map((byte, bIdx) => (
                          <span
                            key={bIdx}
                            className="px-1 py-0.2 rounded bg-slate-900 text-cyan-400 border border-slate-800 font-semibold"
                          >
                            {byte}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">{frame.periodMs}ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Frame Payload Inspector */}
      {selectedFrame && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h4 className="text-sm font-bold font-cyber text-cyan-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              DBC Signal Decoder: {selectedFrame.name} ({selectedFrame.id})
            </h4>
            <span className="text-xs text-slate-400 font-telemetry">
              Captured at {selectedFrame.timestamp}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-telemetry">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">RAW HEX BYTES</span>
              <span className="font-mono text-slate-100 font-bold">{selectedFrame.data.join(' ')}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">BUS PROTOCOL</span>
              <span className="font-mono text-cyan-400 font-bold">{selectedFrame.bus}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CYCLIC RATE</span>
              <span className="font-mono text-emerald-400 font-bold">{1000 / selectedFrame.periodMs} Hz</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CHECKSUM / STATUS</span>
              <span className="font-mono text-slate-200 font-bold">CRC-16 VALID</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
