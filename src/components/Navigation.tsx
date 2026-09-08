import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { NavTab } from '../types';
import {
  LayoutDashboard,
  BatteryCharging,
  Gauge,
  Car,
  LineChart,
  History,
  Zap,
  AlertTriangle,
  Navigation as NavIcon,
  Terminal,
  Cpu,
  Settings,
  Shield,
  Radio
} from 'lucide-react';

interface NavigationProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, activeAlertsCount, canBusLoadPct, bms } = useVehicle();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number; badgeVariant?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'battery', label: 'Battery', icon: <BatteryCharging className="w-4 h-4" />, badge: `${bms.soc.toFixed(0)}%`, badgeVariant: 'cyan' },
    { id: 'motor', label: 'Motor', icon: <Gauge className="w-4 h-4" /> },
    { id: 'vehicle', label: 'Vehicle', icon: <Car className="w-4 h-4" /> },
    { id: 'graphs', label: 'Graphs', icon: <LineChart className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'charging', label: 'Charging', icon: <Zap className="w-4 h-4" /> },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: <AlertTriangle className="w-4 h-4" />, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined, 
      badgeVariant: 'rose' 
    },
    { id: 'gps', label: 'GPS & Location', icon: <NavIcon className="w-4 h-4" /> },
    { id: 'can-logger', label: 'CAN Logger', icon: <Terminal className="w-4 h-4" />, badge: `${canBusLoadPct.toFixed(0)}%`, badgeVariant: 'slate' },
    { id: 'ai-health', label: 'AI Health', icon: <Cpu className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-950/95 lg:bg-slate-950/70 border-r border-slate-800/80 flex flex-col backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
              <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight font-cyber text-slate-100 flex items-center gap-1.5">
                NEXUS <span className="text-cyan-400">EV</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-telemetry">
                Smart BMS & MCU
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-telemetry">
            Vehicle Telemetry
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-semibold'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span className="font-cyber text-[13px]">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      item.badgeVariant === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : item.badgeVariant === 'cyan'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* CAN Bus Hardware Status Footer */}
        <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs font-telemetry">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              CAN-0 / CAN-1 Active
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">500 kbps</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${canBusLoadPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Bus Load: {canBusLoadPct}%</span>
            <span>20 Cells Synced</span>
          </div>
        </div>
      </aside>
    </>
  );
};
