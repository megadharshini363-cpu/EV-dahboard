import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Bell, 
  BellOff, 
  CheckCircle2, 
  Zap, 
  Thermometer, 
  Scale, 
  Cpu, 
  Flame, 
  Power,
  RotateCcw
} from 'lucide-react';
import { VehicleAlert } from '../../types';

export const AlertsView: React.FC = () => {
  const { 
    alerts, 
    triggerAlertTest, 
    acknowledgeAlert, 
    clearAllAlerts, 
    activeAlertsCount,
    bms,
    motor
  } = useVehicle();

  const healthScore = Math.max(0, 100 - (activeAlertsCount * 18));

  const getAlertIcon = (type: VehicleAlert['type']) => {
    switch (type) {
      case 'low_battery':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'over_temperature':
        return <Thermometer className="w-5 h-5 text-rose-400" />;
      case 'over_voltage':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'under_voltage':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'cell_imbalance':
        return <Scale className="w-5 h-5 text-cyan-400" />;
      case 'motor_fault':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Master Safety System Status Header */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            activeAlertsCount === 0 
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse'
          }`}>
            {activeAlertsCount === 0 ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-cyber text-slate-100">
                Safety & BMS Diagnostic Monitoring Center
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-telemetry ${
                activeAlertsCount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {activeAlertsCount === 0 ? 'ALL ENVELOPES NOMINAL' : `${activeAlertsCount} ACTIVE WARNING(S)`}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry mt-0.5">
              ISO 26262 ASIL-D Compliant • Continuous Hardware Watchdog • 10ms Fail-Safe Cutoff
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          {activeAlertsCount > 0 && (
            <button
              onClick={clearAllAlerts}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-cyber font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Acknowledge All</span>
            </button>
          )}

          <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-telemetry">
            <span className="text-[10px] text-slate-400 uppercase block">System Health</span>
            <span className={`text-base font-bold font-cyber ${
              healthScore > 85 ? 'text-emerald-400' : healthScore > 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {healthScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 7 Required Safety Alerts Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold font-cyber text-slate-200">
            Safety Monitoring Nodes & Trigger Test Controls
          </h4>
          <span className="text-xs text-slate-400 font-telemetry">
            Click "Simulate Fault" to test system response in real-time
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const isCritical = alert.active;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical
                    ? 'bg-rose-950/25 border-rose-500/60 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isCritical ? 'bg-rose-500/20 border border-rose-500/40' : 'bg-slate-800/80'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold font-cyber text-slate-100">
                          {alert.title}
                        </h5>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border font-telemetry ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {isCritical ? 'ALERT ACTIVE' : 'NOMINAL'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-telemetry mt-1 leading-snug">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Threshold & telemetry row */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-telemetry">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>
                      Live Value: <strong className="text-slate-200">{alert.value || 'N/A'}</strong>
                    </span>
                    <span>
                      Safety Threshold: <strong className="text-slate-200">{alert.threshold || 'N/A'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.active && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                      >
                        Mute
                      </button>
                    )}
                    <button
                      onClick={() => triggerAlertTest(alert.type)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold font-cyber transition-all ${
                        alert.active
                          ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {alert.active ? 'Clear Fault' : 'Simulate Fault'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Hardware Pyrofuse Section */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900/60 to-slate-950/80 border border-rose-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold font-cyber text-rose-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            High Voltage Pyrotechnic Disconnect Switch (Pyrofuse)
          </h4>
          <p className="text-xs text-slate-400 font-telemetry mt-1">
            Physical millimeter isolation of battery pack within 2ms in the event of catastrophic collision or overcurrent.
          </p>
        </div>

        <button
          onClick={() => triggerAlertTest('emergency')}
          className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/50 font-cyber font-bold text-xs tracking-wider transition-all"
        >
          {alerts.find(a => a.type === 'emergency')?.active ? 'RESET PYROFUSE LOOP' : 'TEST HARDWARE E-STOP'}
        </button>
      </div>
    </div>
  );
};
