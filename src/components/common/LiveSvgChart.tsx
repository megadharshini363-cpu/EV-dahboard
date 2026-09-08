import React, { useState } from 'react';
import { TelemetryPoint } from '../../types';

interface LiveSvgChartProps {
  data: TelemetryPoint[];
  dataKey: keyof TelemetryPoint;
  label: string;
  unit: string;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  height?: number;
  fixedMin?: number;
  fixedMax?: number;
  showArea?: boolean;
}

export const LiveSvgChart: React.FC<LiveSvgChartProps> = ({
  data,
  dataKey,
  label,
  unit,
  color = 'cyan',
  height = 180,
  fixedMin,
  fixedMax,
  showArea = true,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-44 text-slate-400 text-xs font-telemetry">
        Awaiting CAN telemetry stream...
      </div>
    );
  }

  const values = data.map(d => Number(d[dataKey]));
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);

  const minValue = fixedMin !== undefined ? fixedMin : Math.floor(rawMin * 0.98);
  const maxValue = fixedMax !== undefined ? fixedMax : Math.ceil(rawMax * 1.02);
  const valueRange = maxValue - minValue === 0 ? 1 : maxValue - minValue;

  const width = 600;
  const padding = { top: 20, right: 30, bottom: 25, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Generate points
  const points = data.map((d, i) => {
    const val = Number(d[dataKey]);
    const x = padding.left + (i / Math.max(1, data.length - 1)) * plotWidth;
    const y = padding.top + plotHeight - ((val - minValue) / valueRange) * plotHeight;
    return { x, y, val, timestamp: d.timestamp };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`
    : '';

  const colorConfig = {
    cyan: { stroke: '#06b6d4', fill: 'url(#grad-cyan)', dot: '#22d3ee', glow: 'rgba(6, 182, 212, 0.4)' },
    emerald: { stroke: '#10b981', fill: 'url(#grad-emerald)', dot: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' },
    amber: { stroke: '#f59e0b', fill: 'url(#grad-amber)', dot: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' },
    rose: { stroke: '#f43f5e', fill: 'url(#grad-rose)', dot: '#fb7185', glow: 'rgba(244, 63, 94, 0.4)' },
    blue: { stroke: '#3b82f6', fill: 'url(#grad-blue)', dot: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' },
    purple: { stroke: '#a855f7', fill: 'url(#grad-purple)', dot: '#c084fc', glow: 'rgba(168, 85, 247, 0.4)' },
  }[color];

  const currentValue = data[data.length - 1] ? Number(data[data.length - 1][dataKey]) : 0;
  const hoveredPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <div className="relative w-full rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-telemetry">
            {label}
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-telemetry">
            Live 800ms
          </span>
        </div>
        <div className="flex items-baseline gap-1 font-telemetry">
          <span className="text-base font-bold text-slate-100 font-cyber">
            {hoveredPoint ? hoveredPoint.val : currentValue}
          </span>
          <span className="text-xs text-slate-400">{unit}</span>
          {hoveredPoint && (
            <span className="text-[10px] text-slate-400 ml-2">@{hoveredPoint.timestamp}</span>
          )}
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorConfig.stroke} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colorConfig.stroke} stopOpacity="0.0" />
            </linearGradient>
            <filter id={`chart-glow-${color}`} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={colorConfig.glow} />
            </filter>
          </defs>

          {/* Horizontal Grid lines (3 levels) */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padding.top + plotHeight * pct;
            const val = maxValue - pct * valueRange;
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          {showArea && (
            <path
              d={areaD}
              fill={colorConfig.fill}
              className="transition-all duration-300 ease-out"
            />
          )}

          {/* Main stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#chart-glow-${color})`}
            className="transition-all duration-300 ease-out"
          />

          {/* Interactive Mouse Hover Overlay Columns */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={p.x - plotWidth / (points.length * 2)}
              y={padding.top}
              width={plotWidth / points.length}
              height={plotHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(idx)}
            />
          ))}

          {/* Current / Hovered pulse dot */}
          {hoveredPoint ? (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={padding.top + plotHeight}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill={colorConfig.dot}
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          ) : points.length > 0 && (
            <g>
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="4.5"
                fill={colorConfig.dot}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="animate-pulse"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Footer timestamps */}
      <div className="flex justify-between px-2 text-[10px] text-slate-400 font-telemetry mt-1">
        <span>{data[0]?.timestamp || 'T-0'}</span>
        <span>Current Stream: {data[data.length - 1]?.timestamp || 'Live'}</span>
      </div>
    </div>
  );
};
