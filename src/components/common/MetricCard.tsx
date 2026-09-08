import React from 'react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate' | 'blue';
  };
  subtitle?: string;
  color?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'blue' | 'purple';
  trend?: string;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  unit,
  icon,
  badge,
  subtitle,
  color = 'cyan',
  trend,
  className = '',
  onClick,
}) => {
  const colorMap = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 bg-cyan-950/10',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-950/10',
    amber: 'border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-950/10',
    rose: 'border-rose-500/20 hover:border-rose-500/40 text-rose-400 bg-rose-950/10',
    blue: 'border-blue-500/20 hover:border-blue-500/40 text-blue-400 bg-blue-950/10',
    purple: 'border-purple-500/20 hover:border-purple-500/40 text-purple-400 bg-purple-950/10',
  }[color];

  const badgeMap = {
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-4 rounded-xl bg-slate-900/60 border backdrop-blur-md transition-all duration-200 group ${colorMap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Subtle futuristic corner highlight */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-500/40 rounded-tr-lg group-hover:border-cyan-400 transition-colors" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
          <span className="p-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
            {icon}
          </span>
          {title}
        </span>
        {badge && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeMap[badge.variant]} font-telemetry`}>
            {badge.text}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl lg:text-3xl font-bold font-cyber text-slate-100 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-slate-400 font-telemetry uppercase">
            {unit}
          </span>
        )}
        {trend && (
          <span className="ml-auto text-xs font-medium text-slate-400 font-telemetry">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-slate-300 flex items-center gap-1 font-telemetry border-t border-slate-800/80 pt-1.5">
          {subtitle}
        </div>
      )}
    </div>
  );
};
