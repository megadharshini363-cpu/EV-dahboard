import React from 'react';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  size?: number;
  strokeWidth?: number;
  colorType?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue' | 'gradient';
  subtitle?: string;
  icon?: React.ReactNode;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  min,
  max,
  unit,
  label,
  size = 200,
  strokeWidth = 14,
  colorType = 'cyan',
  subtitle,
  icon,
}) => {
  // Semi-circle gauge (240 degree sweep from 150 deg to 390 deg)
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min);

  // 240-degree arc: start at 150° (5π/6), end at 390° (13π/6)
  const startAngle = 150;
  const totalAngle = 240;
  const currentAngle = startAngle + percentage * totalAngle;

  // Polar to Cartesian
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(x, y, r, end);
    const endPoint = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return [
      'M', startPoint.x, startPoint.y,
      'A', r, r, 0, largeArcFlag, 0, endPoint.x, endPoint.y
    ].join(' ');
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, startAngle + totalAngle);
  const progressArc = describeArc(center, center, radius, startAngle, Math.max(startAngle + 0.5, currentAngle));

  const colorStyles = {
    cyan: { stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', text: 'text-cyan-400' },
    emerald: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400' },
    amber: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400' },
    rose: { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', text: 'text-rose-400' },
    blue: { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', text: 'text-blue-400' },
    gradient: { stroke: 'url(#gaugeGradient)', glow: 'rgba(6, 182, 212, 0.4)', text: 'text-cyan-400' },
  }[colorType];

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size * 0.88} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id={`glow-${colorType}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={colorStyles.glow} />
          </filter>
        </defs>

        {/* Outer subtle ring track */}
        <path
          d={backgroundArc}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Ticks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const tickAngle = startAngle + (i / 8) * totalAngle;
          const p1 = polarToCartesian(center, center, radius + strokeWidth * 0.7, tickAngle);
          const p2 = polarToCartesian(center, center, radius + strokeWidth * 1.2, tickAngle);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#334155"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Active Progress Arc */}
        <path
          d={progressArc}
          fill="none"
          stroke={colorStyles.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#glow-${colorType})`}
          className="transition-all duration-300 ease-out"
        />

        {/* Pointer indicator bead */}
        {percentage > 0.02 && (
          <circle
            cx={polarToCartesian(center, center, radius, currentAngle).x}
            cy={polarToCartesian(center, center, radius, currentAngle).y}
            r={strokeWidth * 0.55}
            fill="#ffffff"
            filter={`url(#glow-${colorType})`}
            className="transition-all duration-300 ease-out"
          />
        )}
      </svg>

      {/* Center Value and Labels */}
      <div 
        className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
        style={{ top: size * 0.28 }}
      >
        {icon && <div className="text-slate-400 mb-1">{icon}</div>}
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl lg:text-4xl font-extrabold tracking-tight font-cyber ${colorStyles.text}`}>
            {value}
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-telemetry">
            {unit}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-300 mt-0.5 tracking-wide">
          {label}
        </span>
        {subtitle && (
          <span className="text-[11px] text-slate-400 font-telemetry">
            {subtitle}
          </span>
        )}
      </div>

      {/* Min & Max Labels */}
      <div className="w-full flex justify-between px-6 text-[10px] text-slate-400 font-telemetry -mt-3">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
