import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { Gauge } from '../common/Gauge';
import { MetricCard } from '../common/MetricCard';
import { LiveSvgChart } from '../common/LiveSvgChart';
import { 
  Battery, 
  Zap, 
  Thermometer, 
  Gauge as SpeedIcon, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  TrendingUp, 
  Flame, 
  Navigation as NavIcon, 
  ShieldCheck,
  Power,
  RotateCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    bms, 
    motor, 
    vehicle, 
    alerts, 
    analytics, 
    setDriveMode, 
    toggleVehiclePower,
    setActiveTab,
    isPluggedIn
  } = useVehicle();

  const activeAlerts = alerts.filter(a => a.active);

  return (
    <div className="space-y-5">
      {/* Active Alerts Banner if any */}
      {activeAlerts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 backdrop-blur-md flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-200 font-cyber flex items-center gap-2">
                <span>SYSTEM WARNING: {activeAlerts.length} CRITICAL ALERT(S) ACTIVE</span>
              </div>
              <p className="text-xs text-rose-300/80 font-telemetry">
                {activeAlerts.map(a => a.title).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 text-xs font-bold font-cyber hover:bg-rose-400 transition-colors"
          >
            Review Diagnostic
          </button>
        </div>
      )}

      {/* Hero Cockpit Section: Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Speedometer & Motor Dial (5 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <SpeedIcon className="w-4 h-4 text-cyan-400" />
              Vehicle Speed & Motor
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
              motor.speedKmh > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {motor.speedKmh > 0 ? 'CRUISING' : 'STOPPED'}
            </span>
          </div>

          {/* Speed Gauge */}
          <div className="my-1 flex justify-center">
            <Gauge
              value={motor.speedKmh}
              min={0}
              max={220}
              unit="km/h"
              label="Vehicle Speed"
              subtitle={`${motor.rpm.toLocaleString()} RPM`}
              colorType={vehicle.driveMode === 'sport' ? 'amber' : vehicle.driveMode === 'eco' ? 'emerald' : 'cyan'}
              size={210}
            />
          </div>

          {/* Sub metrics: Torque & Power */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-xs font-telemetry">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">MOTOR TORQUE</span>
              <span className="text-lg font-bold font-cyber text-slate-200">
                {motor.torqueNm} <span className="text-xs font-normal text-slate-400">Nm</span>
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">MOTOR POWER</span>
              <span className="text-lg font-bold font-cyber text-slate-200">
                {motor.powerKw} <span className="text-xs font-normal text-slate-400">kW</span>
              </span>
            </div>
          </div>
        </div>

        {/* Battery SOC & Energy Hub (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-emerald-400" />
              State of Charge (SOC)
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
              isPluggedIn 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isPluggedIn ? '⚡ CHARGING' : bms.chargingStatus.toUpperCase()}
            </span>
          </div>

          {/* SOC Gauge */}
          <div className="my-1 flex justify-center">
            <Gauge
              value={Number(bms.soc.toFixed(1))}
              min={0}
              max={100}
              unit="%"
              label="Battery SOC"
              subtitle={`SOH: ${bms.soh}% • Energy: ${bms.energyKwh} kWh`}
              colorType={bms.soc < 20 ? 'rose' : bms.soc < 50 ? 'amber' : 'emerald'}
              size={210}
            />
          </div>

          {/* Sub metrics: Range & SOH */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-xs font-telemetry">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">EST. RANGE</span>
              <span className="text-lg font-bold font-cyber text-emerald-400">
                {bms.remainingRangeKm} <span className="text-xs font-normal text-slate-400">km</span>
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">BATTERY SOH</span>
              <span className="text-lg font-bold font-cyber text-cyan-400">
                {bms.soh} <span className="text-xs font-normal text-slate-400">%</span>
              </span>
            </div>
          </div>
        </div>

        {/* 20-Cell Quick Telemetry & Status Matrix (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                20-Cell Battery Matrix
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-telemetry">
                <CheckCircle2 className="w-3 h-3" />
                20 Cells Connected
              </span>
            </div>

            {/* Quick Cell Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-telemetry mb-3">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PACK VOLT</span>
                <span className="text-sm font-bold font-cyber text-slate-100">{bms.totalVoltage}V</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PACK AMPS</span>
                <span className={`text-sm font-bold font-cyber ${bms.current >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {bms.current > 0 ? `+${bms.current}` : bms.current}A
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">DELTA</span>
                <span className="text-sm font-bold font-cyber text-amber-400">{bms.deltaCellVoltage} mV</span>
              </div>
            </div>

            {/* 20 Cells Visual Mini Grid */}
            <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              {bms.cells.map((cell) => {
                const isHighest = cell.id === bms.highestCellId;
                const isLowest = cell.id === bms.lowestCellId;
                return (
                  <div
                    key={cell.id}
                    className={`p-1.5 rounded-lg border text-center transition-all ${
                      isHighest
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : isLowest
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                        : cell.balancing
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400 leading-none">C{cell.id}</div>
                    <div className="text-[11px] font-bold font-telemetry leading-tight mt-0.5">
                      {cell.voltage.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-xs font-telemetry">
            <span className="text-slate-400">
              Balancing: <span className="text-emerald-400 font-bold">{bms.cellBalancingActive ? 'Active' : 'Standby'}</span>
            </span>
            <button
              onClick={() => setActiveTab('battery')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              Detailed BMS View →
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Real-Time Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Voltage"
          value={bms.totalVoltage}
          unit="V"
          icon={<Zap className="w-3.5 h-3.5" />}
          badge={{ text: 'Nominal', variant: 'cyan' }}
          subtitle="20S Series Pack"
          color="cyan"
        />
        <MetricCard
          title="Pack Current"
          value={bms.current > 0 ? `+${bms.current}` : bms.current}
          unit="A"
          icon={<Activity className="w-3.5 h-3.5" />}
          badge={{ 
            text: bms.current > 0 ? 'Charging' : bms.current < 0 ? 'Discharge' : 'Zero', 
            variant: bms.current >= 0 ? 'emerald' : 'cyan' 
          }}
          subtitle={`Flow: ${Math.abs(Number(((bms.current * bms.totalVoltage) / 1000).toFixed(1)))} kW`}
          color={bms.current >= 0 ? 'emerald' : 'cyan'}
        />
        <MetricCard
          title="Battery Temp"
          value={bms.temperature}
          unit="°C"
          icon={<Thermometer className="w-3.5 h-3.5" />}
          badge={{ text: 'Cooling OK', variant: 'emerald' }}
          subtitle="Optimal: 20-35°C"
          color="emerald"
        />
        <MetricCard
          title="Motor Temp"
          value={motor.temperature}
          unit="°C"
          icon={<Flame className="w-3.5 h-3.5" />}
          badge={{ text: motor.controllerStatus, variant: motor.temperature > 65 ? 'amber' : 'emerald' }}
          subtitle={`Inverter: ${motor.inverterTemp}°C`}
          color={motor.temperature > 65 ? 'amber' : 'cyan'}
        />
        <MetricCard
          title="Consumption"
          value={analytics.consumptionWhKm}
          unit="Wh/km"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          badge={{ text: `${vehicle.driveMode.toUpperCase()}`, variant: 'blue' }}
          subtitle={`Total: ${analytics.totalEnergyUsedKwh} kWh`}
          color="blue"
        />
        <MetricCard
          title="Odometer"
          value={vehicle.odometerKm.toLocaleString()}
          unit="km"
          icon={<RotateCw className="w-3.5 h-3.5" />}
          badge={{ text: `Trip: ${vehicle.tripDistanceKm}km`, variant: 'slate' }}
          subtitle="GPS Logged"
          color="purple"
        />
      </div>

      {/* Row 3: Live Graphs & Drive Mode Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Real-time Battery Voltage Graph (6 cols) */}
        <div className="lg:col-span-6">
          <LiveSvgChart
            data={analytics.historyPoints}
            dataKey="voltage"
            label="Real-Time Battery Voltage"
            unit="V"
            color="cyan"
            height={190}
          />
        </div>

        {/* Real-time Current Graph (6 cols) */}
        <div className="lg:col-span-6">
          <LiveSvgChart
            data={analytics.historyPoints}
            dataKey="current"
            label="Real-Time Current (A)"
            unit="A"
            color={bms.current >= 0 ? 'emerald' : 'blue'}
            height={190}
          />
        </div>
      </div>
    </div>
  );
};
