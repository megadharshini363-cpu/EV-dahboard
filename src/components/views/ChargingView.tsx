import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { Gauge } from '../common/Gauge';
import { MetricCard } from '../common/MetricCard';
import { 
  Zap, 
  BatteryCharging, 
  Clock, 
  Thermometer, 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  Plug, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const ChargingView: React.FC = () => {
  const { 
    bms, 
    isPluggedIn, 
    setIsPluggedIn, 
    chargingType, 
    setChargingType, 
    targetSocLimit, 
    setTargetSocLimit,
    chargingStations,
    setActiveTab
  } = useVehicle();

  const currentPowerKw = isPluggedIn 
    ? (chargingType === 'DC Fast' ? 142 : 11.2)
    : 0;

  return (
    <div className="space-y-6">
      {/* Charging Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-blue-950/40 border border-cyan-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isPluggedIn 
              ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 animate-pulse shadow-lg shadow-cyan-500/20' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <BatteryCharging className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-cyber text-slate-100">
                {isPluggedIn ? `Active Charging (${chargingType})` : 'Charge Port Ready'}
              </h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border font-telemetry ${
                isPluggedIn 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isPluggedIn ? 'FLOWING' : 'IDLE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry mt-1">
              CCS Combo 2 / NACS Compatible • Liquid-cooled HV Cable • 800V Architecture
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPluggedIn(!isPluggedIn)}
            className={`px-5 py-2.5 rounded-xl font-cyber font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-lg ${
              isPluggedIn
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 shadow-rose-500/10'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            <Plug className="w-4 h-4" />
            <span>{isPluggedIn ? 'STOP & UNPLUG' : 'PLUG IN CHARGER'}</span>
          </button>
        </div>
      </div>

      {/* Primary Charging Gauges & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SOC & Target Gauge (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 backdrop-blur-md flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Charging Status & Limit
            </span>
            <span className="text-xs font-mono text-cyan-400">
              Limit: {targetSocLimit}%
            </span>
          </div>

          <Gauge
            value={Number(bms.soc.toFixed(1))}
            min={0}
            max={100}
            unit="%"
            label="Current SOC"
            subtitle={`Target: ${targetSocLimit}% • ${bms.energyKwh} kWh / ${bms.capacityKwh} kWh`}
            colorType={isPluggedIn ? 'emerald' : 'cyan'}
            size={230}
          />

          <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-center font-telemetry text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">EST. TIME TO TARGET</span>
              <span className="text-lg font-bold font-cyber text-slate-100">
                {isPluggedIn ? `${bms.estimatedChargingMinutes} min` : 'Unplugged'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ADDED RANGE</span>
              <span className="text-lg font-bold font-cyber text-emerald-400">
                +{Math.round((bms.soc / 100) * 480)} km
              </span>
            </div>
          </div>
        </div>

        {/* Charge Controls & Power Configuration (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 backdrop-blur-md flex flex-col justify-between space-y-5">
          <div>
            <h4 className="text-sm font-bold font-cyber text-slate-200 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Charging Rate & Power Source Selection
            </h4>
            <p className="text-xs text-slate-400 font-telemetry">
              Switch between DC Ultra-Fast high-power charger and AC Level 2 home wallbox.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setChargingType('DC Fast')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  chargingType === 'DC Fast'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-cyber font-bold text-sm">DC Ultra-Fast</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    150 - 350 kW
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-telemetry leading-snug">
                  High-current direct DC pack feed. 10% to 80% in ~24 minutes.
                </p>
              </button>

              <button
                onClick={() => setChargingType('AC Level 2')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  chargingType === 'AC Level 2'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-cyber font-bold text-sm">AC Wallbox</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    11 - 22 kW
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-telemetry leading-snug">
                  On-board inverter AC charging for overnight home or office depot.
                </p>
              </button>
            </div>
          </div>

          {/* Target SOC Limit Slider */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-telemetry">
              <span className="text-slate-300 font-medium">Charge Limit Cap</span>
              <span className="font-bold text-cyan-400 font-cyber text-sm">{targetSocLimit}%</span>
            </div>
            <input
              type="range"
              aria-label="Charge Limit Cap Slider"
              min="50"
              max="100"
              step="5"
              value={targetSocLimit}
              onChange={(e) => setTargetSocLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-telemetry">
              <span>50% (Long storage)</span>
              <span className="text-emerald-400 font-semibold">80% (Battery Health Recommended)</span>
              <span>100% (Full Trip)</span>
            </div>
          </div>

          {/* Real-time charging telemetry stats */}
          <div className="grid grid-cols-3 gap-3 text-xs font-telemetry">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">CHARGING POWER</span>
              <span className="text-base font-bold font-cyber text-cyan-400">{currentPowerKw} kW</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">CURRENT VOLTAGE</span>
              <span className="text-base font-bold font-cyber text-slate-200">{bms.totalVoltage} V</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">CHARGING CURRENT</span>
              <span className="text-base font-bold font-cyber text-emerald-400">
                {isPluggedIn ? `+${bms.current}` : '0.0'} A
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Fast Charging Stations Quick Preview */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold font-cyber text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Nearby High-Power EV Charging Hubs
            </h4>
            <p className="text-xs text-slate-400 font-telemetry">
              Real-time stall availability and power delivery within 10 km
            </p>
          </div>
          <button
            onClick={() => setActiveTab('gps')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold font-telemetry flex items-center gap-1"
          >
            Explore Interactive Map →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {chargingStations.slice(0, 3).map((station) => (
            <div key={station.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-cyber text-slate-100 truncate max-w-[180px]">
                    {station.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-telemetry">
                    {station.availableStalls}/{station.totalStalls} Stalls
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-telemetry truncate">{station.address}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-xs font-telemetry">
                <span className="text-cyan-400 font-bold">{station.powerKw} kW • {station.distanceKm} km</span>
                <span className="text-slate-300">${station.pricePerKwh}/kWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
