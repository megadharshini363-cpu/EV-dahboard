import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { Gauge } from '../common/Gauge';
import { MetricCard } from '../common/MetricCard';
import { 
  Gauge as SpeedIcon, 
  Activity, 
  Flame, 
  Zap, 
  RotateCw, 
  Cpu, 
  ShieldCheck, 
  TrendingUp,
  Radio,
  Sliders,
  AlertCircle
} from 'lucide-react';

export const MotorView: React.FC = () => {
  const { 
    motor, 
    vehicle, 
    throttleValue, 
    setThrottle, 
    brakeValue, 
    setBrake,
    setDriveMode 
  } = useVehicle();

  return (
    <div className="space-y-6">
      {/* Header Overview Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <RotateCw className="w-6 h-6 animate-spin" style={{ animationDuration: motor.speedKmh > 0 ? `${Math.max(0.5, 300 / (motor.speedKmh + 1))}s` : '0s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-cyber text-slate-100">
                Permanent Magnet Synchronous Motor (PMSM)
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-telemetry ${
                motor.controllerStatus === 'Normal'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : motor.controllerStatus === 'Boost Ready'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {motor.controllerStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry">
              Field-Oriented Control (FOC) Inverter • Dual SiC MOSFET Power Stages • CAN-0 1000 Hz Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-telemetry">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">PWM Switching</span>
            <span className="text-sm font-bold text-slate-200 font-cyber">{motor.pwmFrequencyKhz} kHz</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Inverter Efficiency</span>
            <span className="text-sm font-bold text-emerald-400 font-cyber">{motor.inverterEfficiency}%</span>
          </div>
        </div>
      </div>

      {/* Main Twin Gauges: Speed & RPM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Speedometer */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 backdrop-blur-md flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <SpeedIcon className="w-4 h-4 text-cyan-400" />
              Vehicle Speed (km/h)
            </span>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              GPS Synchronized
            </span>
          </div>

          <Gauge
            value={motor.speedKmh}
            min={0}
            max={220}
            unit="km/h"
            label="Vehicle Speed"
            subtitle={`Gear: ${vehicle.gear}`}
            colorType={vehicle.driveMode === 'sport' ? 'amber' : 'cyan'}
            size={240}
          />

          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center font-telemetry text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">0-100 KM/H</span>
              <span className="font-bold text-slate-200">3.6s</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TOP SPEED</span>
              <span className="font-bold text-slate-200">220 km/h</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">GEAR</span>
              <span className="font-bold text-cyan-400 font-cyber">{vehicle.gear}</span>
            </div>
          </div>
        </div>

        {/* Motor RPM Tachometer */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 backdrop-blur-md flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-emerald-400" />
              Motor RPM Tachometer
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Rotor Hall Sensors OK
            </span>
          </div>

          <Gauge
            value={motor.rpm}
            min={0}
            max={14000}
            unit="RPM"
            label="Rotor Speed"
            subtitle={`Gear Ratio: 9.73:1 Single Speed`}
            colorType={motor.rpm > 10000 ? 'rose' : motor.rpm > 6000 ? 'amber' : 'emerald'}
            size={240}
          />

          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center font-telemetry text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">MAX RPM</span>
              <span className="font-bold text-slate-200">14,000</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">REDLINE</span>
              <span className="font-bold text-rose-400">12,500</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">POLE PAIRS</span>
              <span className="font-bold text-slate-200">8 Poles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motor Power, Torque, and Thermal Vital Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Motor Torque"
          value={motor.torqueNm}
          unit="Nm"
          icon={<Activity className="w-3.5 h-3.5" />}
          badge={{ text: motor.torqueNm < 0 ? 'Regen Braking' : 'Drive Torque', variant: motor.torqueNm < 0 ? 'emerald' : 'cyan' }}
          subtitle="Max peak: 450 Nm"
          color={motor.torqueNm < 0 ? 'emerald' : 'cyan'}
        />
        <MetricCard
          title="Motor Power"
          value={motor.powerKw}
          unit="kW"
          icon={<Zap className="w-3.5 h-3.5" />}
          badge={{ text: `${Math.round(motor.powerKw * 1.341)} HP`, variant: 'blue' }}
          subtitle="Peak continuous: 220 kW"
          color="blue"
        />
        <MetricCard
          title="Motor Temp"
          value={motor.temperature}
          unit="°C"
          icon={<Flame className="w-3.5 h-3.5" />}
          badge={{ text: motor.temperature > 70 ? 'Derating Warning' : 'Nominal', variant: motor.temperature > 70 ? 'rose' : 'emerald' }}
          subtitle="Stator winding sensor"
          color={motor.temperature > 70 ? 'rose' : 'emerald'}
        />
        <MetricCard
          title="Controller Status"
          value={motor.controllerStatus}
          icon={<Cpu className="w-3.5 h-3.5" />}
          badge={{ text: `Inv: ${motor.inverterTemp}°C`, variant: 'slate' }}
          subtitle="SiC power inverter stage"
          color="purple"
        />
      </div>

      {/* Interactive Motor Dyno & Throttle Test Bench */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold font-cyber text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Dynamic Motor Test Bench (Throttle & Regenerative Braking)
            </h4>
            <p className="text-xs text-slate-400 font-telemetry">
              Simulate accelerator pedal and brake regeneration to test torque curves and motor response.
            </p>
          </div>
          <span className="text-xs font-telemetry text-cyan-400">
            Real-time physics calculation active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Throttle slider */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-telemetry">
              <span className="text-slate-300 font-medium">Accelerator Pedal (Throttle)</span>
              <span className="font-bold text-cyan-400 font-cyber text-sm">{throttleValue}%</span>
            </div>
            <input
              type="range"
              aria-label="Accelerator Pedal Slider"
              min="0"
              max="100"
              value={throttleValue}
              onChange={(e) => {
                setThrottle(Number(e.target.value));
                if (Number(e.target.value) > 0) setBrake(0);
              }}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-telemetry">
              <span>0% (Idle)</span>
              <span>50% (Cruise)</span>
              <span>100% (Full Launch)</span>
            </div>
          </div>

          {/* Regen Brake slider */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-telemetry">
              <span className="text-slate-300 font-medium">Regen Brake Pedal</span>
              <span className="font-bold text-rose-400 font-cyber text-sm">{brakeValue}%</span>
            </div>
            <input
              type="range"
              aria-label="Regen Brake Pedal Slider"
              min="0"
              max="100"
              value={brakeValue}
              onChange={(e) => {
                setBrake(Number(e.target.value));
                if (Number(e.target.value) > 0) setThrottle(0);
              }}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-telemetry">
              <span>0% (Free Roll)</span>
              <span>50% (Medium Regen)</span>
              <span>100% (Max Deceleration)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
