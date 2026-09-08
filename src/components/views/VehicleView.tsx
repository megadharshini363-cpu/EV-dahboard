import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { MetricCard } from '../common/MetricCard';
import { 
  Car, 
  Power, 
  MapPin, 
  Compass, 
  RotateCw, 
  Clock, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Gauge, 
  Wind, 
  Sparkles,
  Zap,
  Leaf,
  Flame,
  Radio
} from 'lucide-react';
import { DriveMode } from '../../types';

export const VehicleView: React.FC = () => {
  const { 
    vehicle, 
    setDriveMode, 
    toggleVehiclePower, 
    motor, 
    bms 
  } = useVehicle();

  const driveModes: { id: DriveMode; name: string; icon: string; description: string; color: string; border: string; bg: string; stats: string }[] = [
    {
      id: 'eco',
      name: 'Eco Mode 🌿',
      icon: '🌿',
      description: 'Maximizes range through smoother acceleration, higher regen braking, and optimized HVAC efficiency.',
      color: 'text-emerald-400',
      border: 'border-emerald-500',
      bg: 'bg-emerald-950/20',
      stats: 'Top Speed: 130 km/h • Max Range +14%',
    },
    {
      id: 'normal',
      name: 'Normal Mode',
      icon: '⚖️',
      description: 'Balanced performance, linear throttle response, and standard regenerative recuperation for everyday driving.',
      color: 'text-cyan-400',
      border: 'border-cyan-500',
      bg: 'bg-cyan-950/20',
      stats: 'Top Speed: 175 km/h • Standard Profile',
    },
    {
      id: 'sport',
      name: 'Sport Mode ⚡',
      icon: '⚡',
      description: 'Unlocks full 450 Nm torque instant delivery, sharpened steering response, and boost inverter cooling.',
      color: 'text-amber-400',
      border: 'border-amber-500',
      bg: 'bg-amber-950/20',
      stats: 'Top Speed: 220 km/h • 0-100 in 3.6s',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Vehicle Power & Master Status Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleVehiclePower}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-cyber font-bold transition-all shadow-lg ${
              vehicle.powerOn
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Vehicle Power"
          >
            <Power className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-cyber text-slate-100">
                Vehicle System State: {vehicle.powerOn ? 'POWER ON (DRIVE READY)' : 'POWER OFF (PARKED)'}
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-telemetry ${
                vehicle.powerOn 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {vehicle.gear} - GEAR
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry mt-0.5">
              Nexus Intelligent EV Platform • CAN Bus Network V4.2 • Firmware Build 2026.09
            </p>
          </div>
        </div>

        {/* Quick Odometer & Trip Counters */}
        <div className="flex items-center gap-3 text-xs font-telemetry">
          <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Total Odometer</span>
            <span className="text-base font-bold font-cyber text-slate-100">
              {vehicle.odometerKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Current Trip</span>
            <span className="text-base font-bold font-cyber text-cyan-400">
              {vehicle.tripDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
            </span>
          </div>
        </div>
      </div>

      {/* Drive Mode Selector (Eco Mode 🌿, Normal Mode, Sport Mode ⚡) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-cyber text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Drive Mode Selector
            </h3>
            <p className="text-xs text-slate-400 font-telemetry">
              Select driving profile to re-tune motor torque delivery, speed limits, and regeneration.
            </p>
          </div>
          <span className="text-xs font-telemetry text-slate-400">
            Active: <span className="font-bold text-slate-200 capitalize">{vehicle.driveMode} Mode</span>
          </span>
        </div>

        {/* Drive Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {driveModes.map((mode) => {
            const isActive = vehicle.driveMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setDriveMode(mode.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden select-none ${
                  isActive
                    ? `${mode.bg} ${mode.border} ring-2 ring-cyan-500/20 shadow-lg`
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active Indicator Chip */}
                {isActive && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold font-telemetry flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    ACTIVE MODE
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl">{mode.icon}</span>
                  <h4 className={`text-base font-bold font-cyber ${isActive ? mode.color : 'text-slate-200'}`}>
                    {mode.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 font-telemetry leading-relaxed mb-4">
                  {mode.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-telemetry text-slate-300 font-medium">
                  {mode.stats}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPS Location & Telematics Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GPS Coordinates & Position Card (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Real-Time GPS Location & Telematics
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-telemetry">
              {vehicle.gps.satelliteCount} GNSS Satellites
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-telemetry">Current Street Address</span>
              <p className="text-sm font-bold font-cyber text-slate-100">
                {vehicle.gps.address}
              </p>
            </div>
          </div>

          {/* Detailed coordinate readings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-telemetry">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">LATITUDE</span>
              <span className="font-bold text-slate-200">{vehicle.gps.latitude.toFixed(4)}° N</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">LONGITUDE</span>
              <span className="font-bold text-slate-200">{Math.abs(vehicle.gps.longitude).toFixed(4)}° W</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">HEADING</span>
              <span className="font-bold text-slate-200">{Math.round(vehicle.gps.headingDeg)}° WNW</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ALTITUDE</span>
              <span className="font-bold text-slate-200">{vehicle.gps.altitudeMeters} m</span>
            </div>
          </div>
        </div>

        {/* Tire Pressure TPMS & Chassis Vital (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-400" />
              TPMS Tire Pressure Monitoring
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-telemetry">
              All Nominal
            </span>
          </div>

          {/* TPMS 4-wheel chassis representation */}
          <div className="grid grid-cols-2 gap-3 my-3">
            {/* Front Left */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-telemetry">
              <span className="text-[10px] text-slate-400 block">FRONT LEFT</span>
              <span className="text-base font-bold font-cyber text-emerald-400">
                {vehicle.tirePressurePsi.frontLeft} PSI
              </span>
              <span className="text-[10px] text-slate-500 block">28°C • Good</span>
            </div>
            {/* Front Right */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-telemetry">
              <span className="text-[10px] text-slate-400 block">FRONT RIGHT</span>
              <span className="text-base font-bold font-cyber text-emerald-400">
                {vehicle.tirePressurePsi.frontRight} PSI
              </span>
              <span className="text-[10px] text-slate-500 block">28°C • Good</span>
            </div>
            {/* Rear Left */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-telemetry">
              <span className="text-[10px] text-slate-400 block">REAR LEFT</span>
              <span className="text-base font-bold font-cyber text-emerald-400">
                {vehicle.tirePressurePsi.rearLeft} PSI
              </span>
              <span className="text-[10px] text-slate-500 block">29°C • Good</span>
            </div>
            {/* Rear Right */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center font-telemetry">
              <span className="text-[10px] text-slate-400 block">REAR RIGHT</span>
              <span className="text-base font-bold font-cyber text-emerald-400">
                {vehicle.tirePressurePsi.rearRight} PSI
              </span>
              <span className="text-[10px] text-slate-500 block">29°C • Good</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-telemetry text-center pt-2 border-t border-slate-800">
            Recommended Cold Pressure: 39 - 41 PSI
          </div>
        </div>
      </div>
    </div>
  );
};
