import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { LiveSvgChart } from '../common/LiveSvgChart';
import { MetricCard } from '../common/MetricCard';
import { 
  LineChart, 
  Zap, 
  Activity, 
  Thermometer, 
  TrendingUp, 
  RotateCcw, 
  Clock, 
  Gauge,
  Percent,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const GraphsView: React.FC = () => {
  const { analytics, bms, motor, vehicle } = useVehicle();
  const [selectedRange, setSelectedRange] = useState<'30s' | '2m' | '5m' | '15m'>('30s');

  return (
    <div className="space-y-6">
      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Energy Consumption"
          value={analytics.consumptionWhKm}
          unit="Wh/km"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          badge={{ text: 'Real-Time', variant: 'cyan' }}
          subtitle={`Mode: ${vehicle.driveMode.toUpperCase()}`}
          color="cyan"
        />
        <MetricCard
          title="Total Energy Used"
          value={analytics.totalEnergyUsedKwh}
          unit="kWh"
          icon={<Zap className="w-3.5 h-3.5" />}
          badge={{ text: `Trip: ${vehicle.tripDistanceKm}km`, variant: 'blue' }}
          subtitle="Net traction energy"
          color="blue"
        />
        <MetricCard
          title="Battery Efficiency"
          value={analytics.batteryEfficiencyPct}
          unit="%"
          icon={<Percent className="w-3.5 h-3.5" />}
          badge={{ text: 'Round-Trip', variant: 'emerald' }}
          subtitle="Coulombic efficiency >99%"
          color="emerald"
        />
        <MetricCard
          title="Regen Recuperated"
          value={analytics.regenRecuperatedKwh}
          unit="kWh"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          badge={{ text: '+18% Range', variant: 'purple' }}
          subtitle="Kinetic energy recaptured"
          color="purple"
        />
      </div>

      {/* Control bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-telemetry">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <span className="font-cyber font-bold text-slate-200">
            Real-Time High-Resolution CAN Bus Telemetry Graphs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Time Window:</span>
          {(['30s', '2m', '5m', '15m'] as const).map((rng) => (
            <button
              key={rng}
              onClick={() => setSelectedRange(rng)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedRange === rng
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {rng}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Battery Voltage Graph & Current Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="mb-2">
            <h4 className="text-sm font-bold font-cyber text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              1. Real-Time Battery Voltage Graph
            </h4>
            <p className="text-[11px] text-slate-400 font-telemetry">
              Continuous pack voltage trend across 20-series cells with sag/recovery tracking
            </p>
          </div>
          <LiveSvgChart
            data={analytics.historyPoints}
            dataKey="voltage"
            label="Pack Voltage (V)"
            unit="V"
            color="cyan"
            height={220}
          />
        </div>

        <div>
          <div className="mb-2">
            <h4 className="text-sm font-bold font-cyber text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              2. Real-Time Current Graph (A)
            </h4>
            <p className="text-[11px] text-slate-400 font-telemetry">
              Discharge under acceleration (negative A) and charge/regen recuperation (positive A)
            </p>
          </div>
          <LiveSvgChart
            data={analytics.historyPoints}
            dataKey="current"
            label="Pack Current (A)"
            unit="A"
            color={bms.current >= 0 ? 'emerald' : 'blue'}
            height={220}
          />
        </div>
      </div>

      {/* Temperature Graph & Energy / Speed Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="mb-2">
            <h4 className="text-sm font-bold font-cyber text-slate-200 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              3. Battery & Powertrain Temperature Graph (°C)
            </h4>
            <p className="text-[11px] text-slate-400 font-telemetry">
              Real-time thermal sensor readings tracking cell module thermistors and coolant loop
            </p>
          </div>
          <LiveSvgChart
            data={analytics.historyPoints}
            dataKey="temperature"
            label="Module Temperature (°C)"
            unit="°C"
            color="amber"
            height={220}
          />
        </div>

        <div>
          <div className="mb-2">
            <h4 className="text-sm font-bold font-cyber text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              4. Instantaneous Energy Consumption (Wh/km)
            </h4>
            <p className="text-[11px] text-slate-400 font-telemetry">
              Dynamic energy burn per kilometer calculated from GPS velocity and inverter power
            </p>
          </div>
          <LiveSvgChart
            data={analytics.historyPoints}
            dataKey="consumptionWhKm"
            label="Energy Consumption (Wh/km)"
            unit="Wh/km"
            color="purple"
            height={220}
          />
        </div>
      </div>
    </div>
  );
};
