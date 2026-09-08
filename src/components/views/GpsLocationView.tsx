import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { 
  MapPin, 
  Compass, 
  Navigation as NavIcon, 
  Zap, 
  Layers, 
  Radio, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Crosshair, 
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { ChargingStation } from '../../types';

export const GpsLocationView: React.FC = () => {
  const { vehicle, chargingStations, bms } = useVehicle();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(chargingStations[0]);
  const [filterType, setFilterType] = useState<'all' | 'fast' | 'nacs'>('all');
  const [preconditioning, setPreconditioning] = useState<boolean>(false);

  const filteredStations = chargingStations.filter(s => {
    if (filterType === 'fast') return s.powerKw >= 150;
    if (filterType === 'nacs') return s.type.includes('NACS');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top GPS Telematics Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-cyber text-slate-100">
                GNSS Dual-Frequency RTK Positioning
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-telemetry">
                FIX: 3D DGPS (0.1m ACCURACY)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry">
              {vehicle.gps.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-telemetry">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">COORDINATES</span>
            <span className="font-bold text-slate-200">
              {vehicle.gps.latitude.toFixed(4)}°N, {Math.abs(vehicle.gps.longitude).toFixed(4)}°W
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">HEADING</span>
            <span className="font-bold text-cyan-400 font-cyber">{Math.round(vehicle.gps.headingDeg)}° WNW</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Futuristic Vector Map (7 cols) + Nearby Charging Stations (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Futuristic Interactive Vector Map Canvas (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 z-10">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <NavIcon className="w-4 h-4 text-cyan-400" />
              Cyber Vector Navigation Map
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Speed: {vehicle.gps.speedKmh} km/h
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Alt: {vehicle.gps.altitudeMeters}m
              </span>
            </div>
          </div>

          {/* Futuristic Simulated Vector Map Screen */}
          <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center select-none">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-grid-cyber opacity-60" />

            {/* Simulated Neon Road Vectors */}
            <svg className="absolute inset-0 w-full h-full opacity-75 pointer-events-none">
              <defs>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Grid Arterials */}
              <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#1e293b" strokeWidth="2" />
              <line x1="20%" y1="80%" x2="80%" y2="80%" stroke="#1e293b" strokeWidth="2" />
              <line x1="25%" y1="10%" x2="25%" y2="90%" stroke="#1e293b" strokeWidth="2" />
              <line x1="75%" y1="10%" x2="75%" y2="90%" stroke="#1e293b" strokeWidth="2" />

              {/* Expressway Route Curve */}
              <path
                d="M 50 320 C 180 280, 240 180, 320 180 S 480 80, 540 50"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 50 320 C 180 280, 240 180, 320 180 S 480 80, 540 50"
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 4"
              />

              {/* Navigation Waypoint Markers */}
              {chargingStations.map((station, i) => {
                const cx = 120 + (i * 90);
                const cy = 90 + ((i % 3) * 75);
                const isSel = selectedStation?.id === station.id;

                return (
                  <g key={station.id} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSel ? 10 : 7}
                      fill={isSel ? '#06b6d4' : '#1e293b'}
                      stroke={isSel ? '#ffffff' : '#38bdf8'}
                      strokeWidth={2}
                    />
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      fill={isSel ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {station.powerKw}kW
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Current Vehicle Position Beacon */}
            <div className="absolute z-20 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 animate-ping absolute -inset-0" />
                <div className="w-9 h-9 rounded-full bg-cyan-500/40 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <NavIcon 
                    className="w-5 h-5 text-slate-950 font-bold transform -rotate-45"
                  />
                </div>
              </div>
              <div className="mt-2 px-2 py-0.5 rounded-full bg-slate-900/90 border border-cyan-500/60 text-[10px] font-bold font-cyber text-cyan-300">
                MY EV ({vehicle.gps.speedKmh} km/h)
              </div>
            </div>

            {/* Compass Overlay Top Right */}
            <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-telemetry text-xs">
              <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-cyber text-sm mx-auto">
                N
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">{Math.round(vehicle.gps.headingDeg)}°</span>
            </div>

            {/* Radar Scanline Animation */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-telemetry text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Waypoints Live Synced</span>
            </div>
          </div>
        </div>

        {/* Nearby Charging Stations List & Pre-Conditioning (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold font-cyber text-slate-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Nearby Charging Stations
                </h4>
                <p className="text-[11px] text-slate-400 font-telemetry">
                  Real-time station occupancy & power delivery
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-telemetry">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded ${filterType === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('fast')}
                  className={`px-2 py-0.5 rounded ${filterType === 'fast' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  150kW+
                </button>
                <button
                  onClick={() => setFilterType('nacs')}
                  className={`px-2 py-0.5 rounded ${filterType === 'nacs' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  NACS
                </button>
              </div>
            </div>

            {/* Stations scrollable list */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredStations.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/25 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold font-cyber text-slate-100 block">
                          {st.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-telemetry block truncate max-w-[200px]">
                          {st.address}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-telemetry shrink-0 ${
                        st.availableStalls > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {st.availableStalls}/{st.totalStalls} Stalls
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-telemetry">
                      <span className="text-cyan-400 font-bold">{st.powerKw} kW • {st.type}</span>
                      <span className="text-slate-300 font-medium">{st.distanceKm} km • ${st.pricePerKwh}/kWh</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Battery Preconditioning Card */}
          {selectedStation && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-telemetry block">
                    Preheat Pack for Fast Charge
                  </span>
                  <span className="text-xs font-bold font-cyber text-slate-200">
                    {preconditioning ? 'Thermal Loop Warming to 35°C' : 'Standby (Optimal ~32°C)'}
                  </span>
                </div>
                <button
                  onClick={() => setPreconditioning(!preconditioning)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cyber font-bold transition-all ${
                    preconditioning
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
                  }`}
                >
                  {preconditioning ? 'Active Warmup' : 'Preheat Battery'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
