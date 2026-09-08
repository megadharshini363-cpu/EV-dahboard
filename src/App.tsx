import React from 'react';
import { VehicleProvider, useVehicle } from './context/VehicleContext';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { DriveSimulatorBar } from './components/common/DriveSimulatorBar';
import { DashboardView } from './components/views/DashboardView';
import { BatteryView } from './components/views/BatteryView';
import { MotorView } from './components/views/MotorView';
import { VehicleView } from './components/views/VehicleView';
import { GraphsView } from './components/views/GraphsView';
import { HistoryView } from './components/views/HistoryView';
import { ChargingView } from './components/views/ChargingView';
import { AlertsView } from './components/views/AlertsView';
import { GpsLocationView } from './components/views/GpsLocationView';
import { CanLoggerView } from './components/views/CanLoggerView';
import { AiHealthView } from './components/views/AiHealthView';
import { SettingsView } from './components/views/SettingsView';

const MainDashboardContent: React.FC = () => {
  const { activeTab } = useVehicle();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'battery':
        return <BatteryView />;
      case 'motor':
        return <MotorView />;
      case 'vehicle':
        return <VehicleView />;
      case 'graphs':
        return <GraphsView />;
      case 'history':
        return <HistoryView />;
      case 'charging':
        return <ChargingView />;
      case 'alerts':
        return <AlertsView />;
      case 'gps':
        return <GpsLocationView />;
      case 'can-logger':
        return <CanLoggerView />;
      case 'ai-health':
        return <AiHealthView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Left-Side Navigation Bar */}
      <Navigation />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-28">
          {renderActiveView()}
        </main>

        {/* Floating Drive Simulator Bar for testing pedal, brake, gear, and simulation speed */}
        <DriveSimulatorBar />
      </div>
    </div>
  );
};

export function App() {
  return (
    <VehicleProvider>
      <MainDashboardContent />
    </VehicleProvider>
  );
}

export default App;
