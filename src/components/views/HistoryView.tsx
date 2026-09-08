import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { 
  History, 
  BatteryCharging, 
  Car, 
  Download, 
  Calendar, 
  MapPin, 
  Zap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Gauge,
  Sparkles
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { chargingHistory, tripHistory } = useVehicle();
  const [activeTab, setActiveTab] = useState<'charging' | 'trips'>('charging');

  const totalChargingKwh = chargingHistory.reduce((acc, c) => acc + c.energyAddedKwh, 0);
  const totalTripKm = tripHistory.reduce((acc, t) => acc + t.distanceKm, 0);
  const avgEfficiency = Math.round(tripHistory.reduce((acc, t) => acc + t.efficiencyWhKm, 0) / tripHistory.length);

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Switcher */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-cyber text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Vehicle Telematics & History Logbook
          </h3>
          <p className="text-xs text-slate-400 font-telemetry">
            Immutable log of fast charging sessions, power curves, and trip energy consumption.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('charging')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cyber font-semibold transition-all ${
              activeTab === 'charging'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BatteryCharging className="w-4 h-4" />
            <span>Charging History</span>
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-cyber font-semibold transition-all ${
              activeTab === 'trips'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Trip History</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-telemetry block">
              Lifetime Energy Added
            </span>
            <span className="text-2xl font-bold font-cyber text-cyan-400">
              {totalChargingKwh.toFixed(1)} <span className="text-xs text-slate-400">kWh</span>
            </span>
            <span className="text-[11px] text-slate-500 block font-telemetry mt-0.5">Across {chargingHistory.length} sessions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-telemetry block">
              Total Logged Distance
            </span>
            <span className="text-2xl font-bold font-cyber text-emerald-400">
              {totalTripKm.toFixed(1)} <span className="text-xs text-slate-400">km</span>
            </span>
            <span className="text-[11px] text-slate-500 block font-telemetry mt-0.5">Across {tripHistory.length} logged routes</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-telemetry block">
              Fleet Average Efficiency
            </span>
            <span className="text-2xl font-bold font-cyber text-purple-400">
              {avgEfficiency} <span className="text-xs text-slate-400">Wh/km</span>
            </span>
            <span className="text-[11px] text-slate-500 block font-telemetry mt-0.5">Optimal EV benchmark (&lt;165 Wh/km)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {activeTab === 'charging' ? (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold font-cyber text-slate-200">
              Recent EV Charging Sessions
            </h4>
            <span className="text-xs text-slate-400 font-telemetry">
              Showing last {chargingHistory.length} sessions
            </span>
          </div>

          <table className="w-full text-left text-xs font-telemetry">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-3">Date & Time</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">SOC Delta</th>
                <th className="pb-3 px-3">Energy (kWh)</th>
                <th className="pb-3 px-3">Duration</th>
                <th className="pb-3 px-3">Peak Power</th>
                <th className="pb-3 px-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {chargingHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-200">{item.date}</td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      {item.location}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.type === 'DC Fast'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-cyber">
                    <span className="text-slate-400">{item.startSoc}%</span>
                    <span className="text-cyan-400 mx-1">➔</span>
                    <span className="text-emerald-400 font-bold">{item.endSoc}%</span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-100 font-cyber">
                    +{item.energyAddedKwh} kWh
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{item.durationMinutes} min</td>
                  <td className="py-3.5 px-3 text-amber-400 font-semibold">{item.peakPowerKw} kW</td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-100 font-cyber">
                    ${item.costUsd.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold font-cyber text-slate-200">
              Trip Distance & Efficiency Logbook
            </h4>
            <span className="text-xs text-slate-400 font-telemetry">
              Showing last {tripHistory.length} trips
            </span>
          </div>

          <table className="w-full text-left text-xs font-telemetry">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-3">Trip / Date</th>
                <th className="pb-3 px-3">Route Name</th>
                <th className="pb-3 px-3">Distance</th>
                <th className="pb-3 px-3">Duration</th>
                <th className="pb-3 px-3">Avg Speed</th>
                <th className="pb-3 px-3">Energy Used</th>
                <th className="pb-3 px-3">Efficiency</th>
                <th className="pb-3 px-3 text-right">Drive Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tripHistory.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-200">{trip.date}</td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">{trip.route}</td>
                  <td className="py-3.5 px-3 font-bold font-cyber text-cyan-400">{trip.distanceKm} km</td>
                  <td className="py-3.5 px-3 text-slate-300">{trip.durationMinutes} min</td>
                  <td className="py-3.5 px-3 text-slate-300">{trip.avgSpeedKmh} km/h</td>
                  <td className="py-3.5 px-3 font-cyber text-slate-100">{trip.energyUsedKwh} kWh</td>
                  <td className="py-3.5 px-3">
                    <span className="font-cyber font-bold text-emerald-400">
                      {trip.efficiencyWhKm} <span className="text-[10px] text-slate-400 font-normal">Wh/km</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      trip.driveModeUsed === 'eco'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : trip.driveModeUsed === 'sport'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {trip.driveModeUsed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
