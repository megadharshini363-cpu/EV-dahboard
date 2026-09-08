import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { MetricCard } from '../common/MetricCard';
import { Gauge } from '../common/Gauge';
import { 
  Battery, 
  BatteryCharging, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Thermometer, 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  Scale, 
  Clock, 
  Layers,
  Sparkles,
  Sliders
} from 'lucide-react';

export const BatteryView: React.FC = () => {
  const { 
    bms, 
    isPluggedIn, 
    setIsPluggedIn, 
    chargingType, 
    setChargingType,
    targetSocLimit,
    setTargetSocLimit
  } = useVehicle();

  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);

  const selectedCell = selectedCellId ? bms.cells.find(c => c.id === selectedCellId) : null;

  return (
    <div className="space-y-6">
      {/* 20 Cells Connected Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/40 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-cyber text-slate-100">
                20 Cells Connected & Synchronized
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-telemetry">
                BMS OK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry">
              High-Speed CAN-1 BMS Master Unit • LTC6813 AFE Chipset • 100 Hz Cell Sampling
            </p>
          </div>
        </div>

        {/* Quick Pack Vital Callouts */}
        <div className="flex items-center gap-4 text-xs font-telemetry flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Total Voltage</span>
            <span className="text-sm font-bold text-cyan-400 font-cyber">{bms.totalVoltage} V</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Pack Current</span>
            <span className={`text-sm font-bold font-cyber ${bms.current >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {bms.current > 0 ? `+${bms.current}` : bms.current} A
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Cell Balancing</span>
            <span className="text-sm font-bold text-amber-400 font-cyber">
              {bms.cellBalancingActive ? 'ACTIVE (13 mV Δ)' : 'BALANCED'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Battery Metrics Grid (SOC, SOH, Energy, Voltage, Current, Temp, Cells, Range, Charging Time) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Battery SOC"
          value={bms.soc.toFixed(1)}
          unit="%"
          icon={<Battery className="w-3.5 h-3.5" />}
          badge={{ text: 'State of Charge', variant: 'cyan' }}
          subtitle={`Usable: ${bms.energyKwh} kWh`}
          color="cyan"
        />
        <MetricCard
          title="Battery SOH"
          value={bms.soh}
          unit="%"
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          badge={{ text: 'Excellent', variant: 'emerald' }}
          subtitle={`${bms.cycleCount} Charge Cycles`}
          color="emerald"
        />
        <MetricCard
          title="Battery Energy"
          value={bms.energyKwh}
          unit="kWh"
          icon={<Zap className="w-3.5 h-3.5" />}
          badge={{ text: `Cap: ${bms.capacityKwh}kWh`, variant: 'blue' }}
          subtitle={`Pack Series: 20S`}
          color="blue"
        />
        <MetricCard
          title="Battery Temp"
          value={bms.temperature}
          unit="°C"
          icon={<Thermometer className="w-3.5 h-3.5" />}
          badge={{ text: 'Liquid Cooled', variant: 'emerald' }}
          subtitle="Envelope: 15-45°C"
          color="emerald"
        />
        <MetricCard
          title="Remaining Range"
          value={bms.remainingRangeKm}
          unit="km"
          icon={<Activity className="w-3.5 h-3.5" />}
          badge={{ text: 'Dynamic EPA', variant: 'cyan' }}
          subtitle="At current consumption"
          color="cyan"
        />
        <MetricCard
          title="Est. Charge Time"
          value={isPluggedIn ? `${bms.estimatedChargingMinutes}` : 'N/A'}
          unit={isPluggedIn ? 'min' : ''}
          icon={<Clock className="w-3.5 h-3.5" />}
          badge={{ 
            text: isPluggedIn ? `To ${targetSocLimit}%` : 'Unplugged', 
            variant: isPluggedIn ? 'emerald' : 'slate' 
          }}
          subtitle={isPluggedIn ? `${chargingType}` : 'Ready to charge'}
          color={isPluggedIn ? 'emerald' : 'purple'}
        />
      </div>

      {/* Extreme Voltage & Cell Balancing Callout Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Highest Cell Voltage */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              Highest Cell Voltage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-cyber text-amber-300">
                {bms.highestCellVoltage.toFixed(3)}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase font-telemetry">V</span>
            </div>
            <span className="text-xs text-amber-400/80 font-telemetry">
              Cell #{bms.highestCellId} (Upper Boundary)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <span className="text-xs font-bold font-cyber">C{bms.highestCellId}</span>
          </div>
        </div>

        {/* Lowest Cell Voltage */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
              Lowest Cell Voltage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-cyber text-blue-300">
                {bms.lowestCellVoltage.toFixed(3)}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase font-telemetry">V</span>
            </div>
            <span className="text-xs text-blue-400/80 font-telemetry">
              Cell #{bms.lowestCellId} (Lower Boundary)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <span className="text-xs font-bold font-cyber">C{bms.lowestCellId}</span>
          </div>
        </div>

        {/* Voltage Delta / Imbalance */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              Cell Voltage Delta
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-cyber text-slate-100">
                {bms.deltaCellVoltage}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase font-telemetry">mV</span>
            </div>
            <span className="text-xs text-emerald-400 font-telemetry">
              Normal (&lt; 50 mV)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Cell Balancing Status */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Cell Balancing Status
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold font-cyber text-emerald-300">
                {bms.cellBalancingActive ? 'ACTIVE BALANCING' : 'IDLE / EQUALIZED'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-telemetry">
              Passive bleed shunt active on 3 cells
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
        </div>
      </div>

      {/* 20 Individual Cell Voltage Grid (Cell 1 to Cell 20) */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold font-cyber text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              20 Individual Cell Telemetry Matrix (Cell 1 to Cell 20)
            </h3>
            <p className="text-xs text-slate-400 font-telemetry">
              Real-time per-cell voltage sensor channels with active balancing circuit flags
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-telemetry">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500/60" />
              Highest (C{bms.highestCellId})
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500/60" />
              Lowest (C{bms.lowestCellId})
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500/60" />
              Balancing Shunt Active
            </span>
          </div>
        </div>

        {/* The 20 Cell Grid: Clean 4x5 or 5x4 Grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {bms.cells.map((cell) => {
            const isHighest = cell.id === bms.highestCellId;
            const isLowest = cell.id === bms.lowestCellId;
            // Normal range 3.0V to 4.2V
            const fillPct = Math.min(100, Math.max(0, ((cell.voltage - 3.2) / (4.2 - 3.2)) * 100));

            return (
              <div
                key={cell.id}
                onClick={() => setSelectedCellId(cell.id)}
                className={`relative p-3 rounded-xl border transition-all cursor-pointer select-none hover:scale-[1.02] ${
                  isHighest
                    ? 'bg-amber-950/25 border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : isLowest
                    ? 'bg-blue-950/25 border-blue-500/50 shadow-sm shadow-blue-500/10'
                    : cell.balancing
                    ? 'bg-cyan-950/20 border-cyan-500/40'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Top: Cell identifier & Balancing badge */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-cyber font-bold text-slate-300 flex items-center gap-1">
                    Cell {cell.id < 10 ? `0${cell.id}` : cell.id}
                  </span>
                  {cell.balancing ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-telemetry animate-pulse">
                      BAL
                    </span>
                  ) : isHighest ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-telemetry">
                      MAX
                    </span>
                  ) : isLowest ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-telemetry">
                      MIN
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-telemetry">OK</span>
                  )}
                </div>

                {/* Voltage Digital Display */}
                <div className="flex items-baseline gap-1 my-1">
                  <span className={`text-xl font-bold font-cyber tracking-tight ${
                    isHighest ? 'text-amber-300' : isLowest ? 'text-blue-300' : 'text-slate-100'
                  }`}>
                    {cell.voltage.toFixed(3)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 font-telemetry">V</span>
                </div>

                {/* Voltage Mini Progress Bar */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isHighest
                        ? 'bg-amber-400'
                        : isLowest
                        ? 'bg-blue-400'
                        : cell.balancing
                        ? 'bg-cyan-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>

                {/* Bottom details: Temp & SOH */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-telemetry mt-2">
                  <span>{cell.temperature}°C</span>
                  <span>{cell.healthPct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charging Simulation & Target Limit Control */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div>
          <h4 className="text-sm font-bold font-cyber text-slate-100 flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-cyan-400" />
            BMS Charge Management & Balancing
          </h4>
          <p className="text-xs text-slate-400 font-telemetry mt-1">
            Configure target SOC limit to optimize battery cycle life and activate cell equalizing.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-telemetry">
            <span className="text-slate-400">Target SOC Limit:</span>
            <span className="font-bold text-cyan-400">{targetSocLimit}%</span>
          </div>
          <input
            type="range"
            aria-label="Target State of Charge Limit"
            min="50"
            max="100"
            step="5"
            value={targetSocLimit}
            onChange={(e) => setTargetSocLimit(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-telemetry">
            <span>50% (Storage)</span>
            <span>80% (Daily Commute)</span>
            <span>100% (Trip)</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsPluggedIn(!isPluggedIn)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-cyber transition-all flex items-center gap-2 ${
              isPluggedIn
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
          >
            <BatteryCharging className="w-4 h-4" />
            {isPluggedIn ? 'Disconnect Charger' : 'Connect Charger'}
          </button>
        </div>
      </div>
    </div>
  );
};
