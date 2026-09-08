import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { 
  Power, 
  Zap, 
  Leaf, 
  Flame, 
  Play, 
  Pause, 
  AlertTriangle, 
  BatteryCharging, 
  Sliders, 
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldAlert
} from 'lucide-react';
import { DriveMode, VehicleAlert } from '../../types';

export const DriveSimulatorBar: React.FC = () => {
  const {
    vehicle,
    bms,
    motor,
    setDriveMode,
    toggleVehiclePower,
    throttleValue,
    setThrottle,
    brakeValue,
    setBrake,
    isPluggedIn,
    setIsPluggedIn,
    chargingType,
    setChargingType,
    isSimulating,
    setIsSimulating,
    triggerAlertTest,
    activeAlertsCount,
    clearAllAlerts,
    antiTheft,
    triggerSirenTest,
  } = useVehicle();

  const [expanded, setExpanded] = useState<boolean>(true);
  const [selectedAlertToTrigger, setSelectedAlertToTrigger] = useState<VehicleAlert['type']>('cell_imbalance');

  const alertOptions: { label: string; type: VehicleAlert['type'] }[] = [
    { label: 'Low Battery Alert', type: 'low_battery' },
    { label: 'Over Temperature Alert', type: 'over_temperature' },
    { label: 'Over Voltage Alert', type: 'over_voltage' },
    { label: 'Under Voltage Alert', type: 'under_voltage' },
    { label: 'Cell Imbalance Alert', type: 'cell_imbalance' },
    { label: 'Motor Fault Alert', type: 'motor_fault' },
    { label: 'Emergency Alert', type: 'emergency' },
  ];

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-2 text-xs transition-all z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick vehicle status & Power switch */}
        <div className="flex items-center gap-3">
          <button
            id="btn-vehicle-power"
            onClick={toggleVehiclePower}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-cyber font-bold transition-all ${
              vehicle.powerOn 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Vehicle Power System"
          >
            <Power className="w-4 h-4" />
            <span>{vehicle.powerOn ? 'SYSTEM: READY' : 'SYSTEM: OFF'}</span>
          </button>

          {/* Drive Mode Selector: Eco 🌿 | Normal | Sport ⚡ */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800" role="group" aria-label="Drive Mode Selector">
            <button
              id="btn-mode-eco"
              onClick={() => setDriveMode('eco')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                vehicle.driveMode === 'eco'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌿</span>
              <span>Eco</span>
            </button>
            <button
              id="btn-mode-normal"
              onClick={() => setDriveMode('normal')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                vehicle.driveMode === 'normal'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Normal</span>
            </button>
            <button
              id="btn-mode-sport"
              onClick={() => setDriveMode('sport')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                vehicle.driveMode === 'sport'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚡</span>
              <span>Sport</span>
            </button>
          </div>

          {/* Charging Plug Simulator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              id="btn-toggle-charging"
              onClick={() => setIsPluggedIn(!isPluggedIn)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                isPluggedIn
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>{isPluggedIn ? 'Charging: Active' : 'Plug In Charger'}</span>
            </button>
            {isPluggedIn && (
              <select
                aria-label="Charging Speed Type"
                value={chargingType}
                onChange={(e) => setChargingType(e.target.value as 'DC Fast' | 'AC Level 2')}
                className="bg-slate-900 text-cyan-300 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-telemetry"
              >
                <option value="DC Fast">DC Fast (150kW)</option>
                <option value="AC Level 2">AC (11kW)</option>
              </select>
            )}
          </div>
        </div>

        {/* Right: Pedals & Interactive Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Throttle & Brake controls */}
          <div className="flex items-center gap-3 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-telemetry">Throttle</span>
              <input
                type="range"
                aria-label="Throttle Pedal Percentage"
                min="0"
                max="100"
                value={throttleValue}
                onChange={(e) => {
                  setThrottle(Number(e.target.value));
                  if (Number(e.target.value) > 0) setBrake(0);
                }}
                className="w-18 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[11px] font-telemetry text-cyan-400 w-7 text-right">
                {throttleValue}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
              <span className="text-[11px] text-slate-400 font-telemetry">Regen/Brake</span>
              <input
                type="range"
                aria-label="Brake and Regenerative Braking Percentage"
                min="0"
                max="100"
                value={brakeValue}
                onChange={(e) => {
                  setBrake(Number(e.target.value));
                  if (Number(e.target.value) > 0) setThrottle(0);
                }}
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className="text-[11px] font-telemetry text-rose-400 w-7 text-right">
                {brakeValue}%
              </span>
            </div>
          </div>

          {/* Test Alert Simulator Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ml-1" />
            <select
              aria-label="Test Safety Alert Trigger"
              value={selectedAlertToTrigger}
              onChange={(e) => setSelectedAlertToTrigger(e.target.value as VehicleAlert['type'])}
              className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] font-telemetry"
            >
              {alertOptions.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              id="btn-trigger-alert-test"
              onClick={() => triggerAlertTest(selectedAlertToTrigger)}
              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 font-semibold text-[11px] transition-colors"
            >
              Toggle
            </button>
            {activeAlertsCount > 0 && (
              <button
                id="btn-clear-all-alerts"
                onClick={clearAllAlerts}
                className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-slate-200 underline"
                title="Clear all active alerts"
              >
                Clear ({activeAlertsCount})
              </button>
            )}
          </div>

          {/* Telemetry Pause/Resume */}
          <button
            id="btn-toggle-sim"
            onClick={() => setIsSimulating(!isSimulating)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
