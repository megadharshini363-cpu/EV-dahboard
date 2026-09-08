import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { MetricCard } from '../common/MetricCard';
import { Gauge } from '../common/Gauge';
import { 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Zap, 
  Thermometer, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const AiHealthView: React.FC = () => {
  const { bms } = useVehicle();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastScanDate, setLastScanDate] = useState<string>('Today at 09:30 AM');
  const [analysisProgress, setAnalysisProgress] = useState<number>(100);

  const runDiagnostics = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 20;
      setAnalysisProgress(cur);
      if (cur >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setLastScanDate(new Date().toLocaleTimeString());
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Hero AI Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-cyan-950/40 border border-purple-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-cyber text-slate-100">
                AI Neural Battery Health & Longevity Predictor
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-telemetry">
                Trained on 4.2M EV Fleet Cycles
              </span>
            </div>
            <p className="text-xs text-slate-400 font-telemetry mt-1">
              Physics-informed neural network evaluating SEI layer growth, lithium plating risk, and impedance spectroscopy.
            </p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={isAnalyzing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-cyber font-bold text-xs tracking-wider transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? `ANALYZING (${analysisProgress}%)` : 'RUN DEEP AI SCAN'}</span>
        </button>
      </div>

      {/* Progress Bar when analyzing */}
      {isAnalyzing && (
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-purple-500/30">
          <div
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
      )}

      {/* Primary Degradation & Longevity Forecast Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Current SOH */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Current Battery SOH
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Grade: A+
            </span>
          </div>

          <Gauge
            value={bms.soh}
            min={50}
            max={100}
            unit="%"
            label="State of Health"
            subtitle={`${bms.cycleCount} Equivalent Full Cycles`}
            colorType="emerald"
            size={220}
          />

          <div className="w-full text-center text-xs font-telemetry text-slate-400 mt-2 pt-3 border-t border-slate-800">
            Capacity retention: <span className="text-emerald-400 font-bold">80.5 kWh / 82.0 kWh</span>
          </div>
        </div>

        {/* 5-Year Forecast */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              5-Year Forecast (150,000 km)
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
              High Confidence (96%)
            </span>
          </div>

          <Gauge
            value={91.4}
            min={50}
            max={100}
            unit="%"
            label="Projected SOH"
            subtitle="Based on current daily usage pattern"
            colorType="cyan"
            size={220}
          />

          <div className="w-full text-center text-xs font-telemetry text-slate-400 mt-2 pt-3 border-t border-slate-800">
            Estimated degradation rate: <span className="text-cyan-400 font-bold">1.3% / year</span>
          </div>
        </div>

        {/* 10-Year Longevity Forecast */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              10-Year End-of-Life Target
            </span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
              Warranty Compliant
            </span>
          </div>

          <Gauge
            value={84.8}
            min={50}
            max={100}
            unit="%"
            label="10-Year SOH"
            subtitle="Exceeds 70% 8-year warranty limit"
            colorType="purple"
            size={220}
          />

          <div className="w-full text-center text-xs font-telemetry text-slate-400 mt-2 pt-3 border-t border-slate-800">
            Remaining Useful Life: <span className="text-purple-400 font-bold">1,858 Full Cycles</span>
          </div>
        </div>
      </div>

      {/* Detailed AI Diagnostics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Internal Impedance"
          value="0.85"
          unit="mΩ/cell"
          icon={<Activity className="w-3.5 h-3.5" />}
          badge={{ text: 'Ultra Low', variant: 'emerald' }}
          subtitle="Minimal ohmic heating"
          color="emerald"
        />
        <MetricCard
          title="Electrolyte Score"
          value="96"
          unit="/100"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          badge={{ text: 'Pristine', variant: 'cyan' }}
          subtitle="No dendritic formation"
          color="cyan"
        />
        <MetricCard
          title="Thermal Stress"
          value="1.18"
          unit="x"
          icon={<Thermometer className="w-3.5 h-3.5" />}
          badge={{ text: 'Low Stress', variant: 'blue' }}
          subtitle="Active cooling effective"
          color="blue"
        />
        <MetricCard
          title="Lithium Plating Risk"
          value="0.04"
          unit="%"
          icon={<Zap className="w-3.5 h-3.5" />}
          badge={{ text: 'Near Zero', variant: 'emerald' }}
          subtitle="Safe fast charging window"
          color="emerald"
        />
      </div>

      {/* AI Doctor Recommendations & Actionable Insights */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-sm font-bold font-cyber text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Diagnostic Insights & Pack Optimization Directives
          </h4>
          <span className="text-xs text-slate-400 font-telemetry">
            Last scan: {lastScanDate}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-telemetry text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1.5 font-cyber">
                <CheckCircle2 className="w-4 h-4" /> 1. Maintain 80% Daily Limit
              </span>
              <p className="text-slate-400 leading-relaxed">
                Your current daily commuting habit utilizes only 22% of capacity. Capping daily charge to 80% will extend overall cathode crystal life by +2.4 years.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">Impact: +180 Cycles</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="font-bold text-cyan-400 block mb-1 flex items-center gap-1.5 font-cyber">
                <CheckCircle2 className="w-4 h-4" /> 2. Cell Balancing Convergence
              </span>
              <p className="text-slate-400 leading-relaxed">
                Passive shunt balancing on Cell #13 and #7 is functioning properly. A scheduled full 100% calibration cycle is recommended within the next 45 days.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">Impact: Zero Delta Drift</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="font-bold text-purple-400 block mb-1 flex items-center gap-1.5 font-cyber">
                <CheckCircle2 className="w-4 h-4" /> 3. Thermal Preconditioning
              </span>
              <p className="text-slate-400 leading-relaxed">
                When targeting 150kW+ DC Fast chargers in the navigation system, always enable Battery Pre-Conditioning 15 minutes prior to arrival to prevent cold-charging plating.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block">Impact: -38% Anode Stress</span>
          </div>
        </div>
      </div>
    </div>
  );
};
