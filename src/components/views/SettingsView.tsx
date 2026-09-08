import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { 
  Settings, 
  ShieldAlert, 
  Wrench, 
  Terminal, 
  Radio, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  Key, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Bell
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    antiTheft, 
    toggleAntiTheftArmed, 
    toggleImmobilizer, 
    triggerSirenTest, 
    serviceItems,
    canBusLoadPct 
  } = useVehicle();

  const [canBitrate, setCanBitrate] = useState<'250 kbps' | '500 kbps' | '1000 kbps'>('500 kbps');
  const [speedUnit, setSpeedUnit] = useState<'km/h' | 'mph'>('km/h');
  const [tempUnit, setTempUnit] = useState<'°C' | '°F'>('°C');
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold font-cyber text-slate-100">
              Vehicle Settings, CAN Bus & Security Center
            </h3>
            <p className="text-xs text-slate-400 font-telemetry">
              Calibrate bus speeds, anti-theft immobilizer systems, and inspect maintenance schedules.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-telemetry">
          ECU FW: v4.28.1-PROD
        </span>
      </div>

      {/* Theft Detection & Anti-Theft Alert Section (6. Advanced Features) */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${antiTheft.armed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-cyber text-slate-100 flex items-center gap-2">
                Theft Detection & Anti-Theft Perimeter System
              </h4>
              <p className="text-xs text-slate-400 font-telemetry">
                Active perimeter geofencing, tilt/lift accelerometers, and remote high-voltage battery cutoff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAntiTheftArmed}
              className={`px-4 py-2 rounded-xl text-xs font-cyber font-bold transition-all flex items-center gap-2 ${
                antiTheft.armed
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {antiTheft.armed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{antiTheft.armed ? 'SYSTEM ARMED' : 'DISARMED'}</span>
            </button>

            <button
              onClick={triggerSirenTest}
              className={`px-3 py-2 rounded-xl text-xs font-cyber font-bold transition-all ${
                antiTheft.sirenActive
                  ? 'bg-rose-500 text-slate-950 animate-bounce'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {antiTheft.sirenActive ? 'SIREN ACTIVE' : 'TEST SIREN'}
            </button>
          </div>
        </div>

        {/* Anti-Theft Status Sensors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-telemetry">
          {/* Tilt & Lift Sensor */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Tilt & Tow Sensor</span>
              <span className="text-sm font-bold font-cyber text-slate-200">
                {antiTheft.tiltSensorTriggered ? 'TRIGGERED' : 'NORMAL (0.1° TILT)'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Dual-axis accelerometer active</span>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          {/* Geofence Perimeter */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">GPS Geofence Perimeter</span>
              <span className="text-sm font-bold font-cyber text-slate-200">
                {antiTheft.geofenceTriggered ? 'BREACH DETECTED' : `LOCKED (5.0 KM RADIUS)`}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Base: Palo Alto HQ</span>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          {/* Remote HV Killswitch / Immobilizer */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Remote HV Immobilizer</span>
              <span className={`text-sm font-bold font-cyber ${antiTheft.remoteImmobilizerActive ? 'text-rose-400' : 'text-slate-200'}`}>
                {antiTheft.remoteImmobilizerActive ? 'PACK IMMOBILIZED' : 'STANDBY READY'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cell contactors interlock</span>
            </div>
            <button
              onClick={toggleImmobilizer}
              className={`px-2 py-1 rounded text-[10px] font-bold font-cyber ${
                antiTheft.remoteImmobilizerActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-slate-100'
              }`}
            >
              {antiTheft.remoteImmobilizerActive ? 'Unlock' : 'Lock'}
            </button>
          </div>
        </div>
      </div>

      {/* Service and Maintenance Reminders (6. Advanced Features) */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="text-sm font-bold font-cyber text-slate-100">
                Service & Preventative Maintenance Tracker
              </h4>
              <p className="text-xs text-slate-400 font-telemetry">
                Next scheduled workshop inspection based on real vehicle telemetry
              </p>
            </div>
          </div>
          <span className="text-xs text-cyan-400 font-telemetry font-bold">
            2 Items Due Soon
          </span>
        </div>

        <div className="space-y-3">
          {serviceItems.map((item) => {
            const isDueSoon = item.status === 'due_soon';
            const progress = Math.max(0, Math.min(100, ((item.intervalKm - item.remainingKm) / item.intervalKm) * 100));

            return (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-telemetry">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 font-cyber text-sm">{item.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                      isDueSoon
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {isDueSoon ? `DUE IN ${item.remainingDays} DAYS` : 'NOMINAL'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.description}</p>
                </div>

                <div className="w-full md:w-56 flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Remaining: {item.remainingKm.toLocaleString()} km</span>
                    <span className="font-bold text-slate-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isDueSoon ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAN Bus Hardware Settings & Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CAN Bus Configuration */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold font-cyber text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              CAN Bus Interface Config
            </span>
            <span className="text-[10px] text-emerald-400 font-telemetry">Transceiver: TJA1051T</span>
          </div>

          <div className="space-y-3 text-xs font-telemetry">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Nominal Bitrate</span>
              <div className="flex gap-1">
                {(['250 kbps', '500 kbps', '1000 kbps'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setCanBitrate(b)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      canBitrate === b ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-300">CAN-1 BMS Sampling Rate</span>
              <span className="text-slate-100 font-bold">100 Hz (10 ms)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-300">CAN-0 Motor MCU Feedback</span>
              <span className="text-slate-100 font-bold">1000 Hz (1 ms)</span>
            </div>
          </div>
        </div>

        {/* Display Units & Audio Feedback */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold font-cyber text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Measurement Units & UI Preferences
            </span>
            <span className="text-[10px] text-slate-400 font-telemetry">UI Profile: High-Contrast</span>
          </div>

          <div className="space-y-3 text-xs font-telemetry">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Speed / Distance Units</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSpeedUnit('km/h')}
                  className={`px-3 py-1 rounded text-[11px] font-bold ${speedUnit === 'km/h' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                >
                  Metric (km/h)
                </button>
                <button
                  onClick={() => setSpeedUnit('mph')}
                  className={`px-3 py-1 rounded text-[11px] font-bold ${speedUnit === 'mph' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                >
                  Imperial (mph)
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-300">Temperature Units</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setTempUnit('°C')}
                  className={`px-3 py-1 rounded text-[11px] font-bold ${tempUnit === '°C' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => setTempUnit('°F')}
                  className={`px-3 py-1 rounded text-[11px] font-bold ${tempUnit === '°F' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-300">Audio Alarm Tone Synthesis</span>
              <button
                onClick={() => setAudioFeedback(!audioFeedback)}
                className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 ${
                  audioFeedback ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {audioFeedback ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{audioFeedback ? 'Enabled' : 'Muted'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
