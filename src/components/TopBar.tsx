import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { 
  Menu, 
  MapPin, 
  Clock, 
  Battery, 
  ShieldAlert, 
  Zap, 
  Radio, 
  Power,
  Compass
} from 'lucide-react';

interface TopBarProps {
  setMobileOpen: (open: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ setMobileOpen }) => {
  const { 
    activeTab, 
    vehicle, 
    bms, 
    activeAlertsCount,
    setDriveMode,
    toggleVehiclePower,
    triggerAlertTest
  } = useVehicle();

  const titleMap: Record<string, string> = {
    dashboard: 'Cockpit Overview',
    battery: 'BMS & 20-Cell Telemetry',
    motor: 'Motor Controller & Inverter',
    vehicle: 'Vehicle Dynamics & TPMS',
    graphs: 'Real-Time Telemetry Analytics',
    history: 'Trip & Charging Logs',
    charging: 'EV Supercharge Hub',
    alerts: 'Safety & System Diagnostic Alerts',
    gps: 'GPS Navigation & Charging Stations',
    'can-logger': 'CAN Raw Data Bus Sniffer',
    'ai-health': 'AI Predictive Battery Health',
    settings: 'System Configuration & Bus Settings',
  };

  const modeBadge = {
    eco: { text: 'Eco 🌿', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    normal: { text: 'Normal', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    sport: { text: 'Sport ⚡', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  }[vehicle.driveMode];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile menu toggle & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-cyber text-slate-100 tracking-wide">
              {titleMap[activeTab] || 'Smart EV Control'}
            </h2>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${modeBadge.bg} font-telemetry`}>
              {modeBadge.text}
            </span>
          </div>
          <p className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-telemetry">
            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate max-w-xs">{vehicle.gps.address}</span>
          </p>
        </div>
      </div>

      {/* Right: Quick telemetry stats */}
      <div className="flex items-center gap-3">
        {/* Remaining Range Quick Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-telemetry">
          <Battery className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase text-slate-400 leading-none">Est. Range</span>
            <span className="font-bold text-slate-200 leading-tight">
              {bms.remainingRangeKm} <span className="text-[10px] text-slate-400">km</span>
            </span>
          </div>
        </div>

        {/* SOC Quick Dial */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-telemetry">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={bms.soc < 20 ? '#f43f5e' : bms.soc < 50 ? '#f59e0b' : '#06b6d4'}
                strokeWidth="4"
                strokeDasharray={`${bms.soc}, 100`}
              />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase text-slate-400 leading-none">SOC</span>
            <span className="font-bold text-slate-200 leading-tight">
              {bms.soc.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <button
          id="btn-emergency-stop"
          onClick={() => triggerAlertTest('emergency')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold font-cyber tracking-wider transition-all shadow-sm shadow-rose-500/20 active:scale-95"
          title="Simulate Emergency Cutoff pyrofuse trip"
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="hidden md:inline">E-STOP</span>
        </button>
      </div>
    </header>
  );
};
