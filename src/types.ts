export type NavTab = 
  | 'dashboard'
  | 'battery'
  | 'motor'
  | 'vehicle'
  | 'graphs'
  | 'history'
  | 'charging'
  | 'alerts'
  | 'gps'
  | 'can-logger'
  | 'ai-health'
  | 'settings';

export type DriveMode = 'eco' | 'normal' | 'sport';

export interface CellData {
  id: number;
  voltage: number; // in Volts, e.g. 3.924 V
  balancing: boolean;
  temperature: number; // in °C
  healthPct: number;
}

export interface BMSData {
  soc: number; // % (0 - 100)
  soh: number; // % (0 - 100)
  energyKwh: number; // kWh remaining, e.g. 74.5 kWh (out of 82 kWh nominal)
  capacityKwh: number; // e.g. 82.0 kWh
  totalVoltage: number; // V, sum of 20 cells, e.g. 78.4V or high pack series
  current: number; // A (negative = discharging, positive = charging)
  temperature: number; // °C
  cells: CellData[]; // 20 individual cells
  highestCellVoltage: number;
  lowestCellVoltage: number;
  deltaCellVoltage: number; // mV
  highestCellId: number;
  lowestCellId: number;
  cellBalancingActive: boolean;
  chargingStatus: 'discharging' | 'charging' | 'idle' | 'standby';
  remainingRangeKm: number;
  estimatedChargingMinutes: number;
  packIsolationResistance: number; // kOhm
  cycleCount: number;
}

export interface MotorData {
  rpm: number; // 0 - 14,000 RPM
  speedKmh: number; // 0 - 220 km/h
  torqueNm: number; // -150 to 450 Nm
  powerKw: number; // -45 to 280 kW
  temperature: number; // °C
  inverterTemp: number; // °C
  controllerStatus: 'Normal' | 'Thermal Derating' | 'Boost Ready' | 'Standby' | 'Fault';
  inverterEfficiency: number; // %
  pwmFrequencyKhz: number;
  regenLevel: number; // 0, 1, 2, 3
}

export interface VehicleData {
  powerOn: boolean;
  driveMode: DriveMode;
  odometerKm: number;
  tripDistanceKm: number;
  tripDurationSec: number;
  gps: {
    latitude: number;
    longitude: number;
    altitudeMeters: number;
    headingDeg: number;
    speedKmh: number;
    address: string;
    satelliteCount: number;
  };
  gear: 'P' | 'R' | 'N' | 'D';
  doorsLocked: boolean;
  frunkOpen: boolean;
  trunkOpen: boolean;
  headlights: 'off' | 'low' | 'high' | 'auto';
  tirePressurePsi: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface VehicleAlert {
  id: string;
  type: 
    | 'low_battery'
    | 'over_temperature'
    | 'over_voltage'
    | 'under_voltage'
    | 'cell_imbalance'
    | 'motor_fault'
    | 'emergency';
  title: string;
  message: string;
  severity: AlertSeverity;
  active: boolean;
  timestamp: string;
  value?: string;
  threshold?: string;
}

export interface TelemetryPoint {
  timestamp: string;
  voltage: number;
  current: number;
  temperature: number;
  speed: number;
  power: number;
  soc: number;
  consumptionWhKm: number;
}

export interface AnalyticsData {
  consumptionWhKm: number; // e.g. 158 Wh/km
  totalEnergyUsedKwh: number; // e.g. 14.2 kWh
  batteryEfficiencyPct: number; // e.g. 93.8%
  regenRecuperatedKwh: number;
  historyPoints: TelemetryPoint[];
}

export interface CANFrame {
  id: string; // e.g. 0x1806E5F4
  name: string;
  dlc: number; // 8
  data: string[]; // hex bytes ['3A', 'B2', '00', ...]
  timestamp: string;
  bus: 'CAN-0 (High Speed)' | 'CAN-1 (BMS Bus)';
  periodMs: number;
}

export interface ChargingSession {
  id: string;
  date: string;
  location: string;
  type: 'DC Fast' | 'AC Level 2';
  startSoc: number;
  endSoc: number;
  energyAddedKwh: number;
  durationMinutes: number;
  peakPowerKw: number;
  costUsd: number;
}

export interface TripSession {
  id: string;
  date: string;
  route: string;
  distanceKm: number;
  durationMinutes: number;
  avgSpeedKmh: number;
  energyUsedKwh: number;
  efficiencyWhKm: number;
  driveModeUsed: DriveMode;
}

export interface ChargingStation {
  id: string;
  name: string;
  network: string;
  distanceKm: number;
  address: string;
  powerKw: number;
  type: 'CCS / DC Ultra-Fast' | 'Tesla NACS' | 'Type 2 AC';
  totalStalls: number;
  availableStalls: number;
  pricePerKwh: number;
  latitude: number;
  longitude: number;
  status: 'available' | 'busy' | 'offline';
}

export interface ServiceItem {
  id: string;
  title: string;
  intervalKm: number;
  remainingKm: number;
  remainingDays: number;
  status: 'good' | 'due_soon' | 'overdue';
  description: string;
}

export interface AntiTheftStatus {
  armed: boolean;
  sirenActive: boolean;
  tiltSensorTriggered: boolean;
  geofenceRadiusKm: number;
  geofenceTriggered: boolean;
  remoteImmobilizerActive: boolean;
}
