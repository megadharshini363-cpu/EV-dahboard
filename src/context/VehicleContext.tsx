import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  NavTab,
  DriveMode,
  BMSData,
  MotorData,
  VehicleData,
  VehicleAlert,
  AnalyticsData,
  CANFrame,
  ChargingSession,
  TripSession,
  ChargingStation,
  ServiceItem,
  AntiTheftStatus,
  TelemetryPoint,
  CellData,
} from '../types';
import {
  INITIAL_BMS,
  INITIAL_MOTOR,
  INITIAL_VEHICLE,
  INITIAL_ALERTS,
  INITIAL_TELEMETRY_HISTORY,
  INITIAL_CHARGING_HISTORY,
  INITIAL_TRIP_HISTORY,
  INITIAL_CHARGING_STATIONS,
  INITIAL_SERVICE_ITEMS,
  INITIAL_ANTI_THEFT,
} from '../data/initialData';

interface VehicleContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  bms: BMSData;
  motor: MotorData;
  vehicle: VehicleData;
  alerts: VehicleAlert[];
  analytics: AnalyticsData;
  canFrames: CANFrame[];
  canBusLoadPct: number;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  isPluggedIn: boolean;
  setIsPluggedIn: (plugged: boolean) => void;
  chargingType: 'DC Fast' | 'AC Level 2';
  setChargingType: (type: 'DC Fast' | 'AC Level 2') => void;
  targetSocLimit: number;
  setTargetSocLimit: (limit: number) => void;
  antiTheft: AntiTheftStatus;
  chargingHistory: ChargingSession[];
  tripHistory: TripSession[];
  chargingStations: ChargingStation[];
  serviceItems: ServiceItem[];
  // Actions
  setDriveMode: (mode: DriveMode) => void;
  toggleVehiclePower: () => void;
  setThrottle: (val: number) => void; // 0 to 100
  setBrake: (val: number) => void; // 0 to 100
  throttleValue: number;
  brakeValue: number;
  triggerAlertTest: (type: VehicleAlert['type']) => void;
  acknowledgeAlert: (id: string) => void;
  clearAllAlerts: () => void;
  toggleAntiTheftArmed: () => void;
  toggleImmobilizer: () => void;
  triggerSirenTest: () => void;
  clearCanLog: () => void;
  exportCanLog: () => void;
  activeAlertsCount: number;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [bms, setBms] = useState<BMSData>(INITIAL_BMS);
  const [motor, setMotor] = useState<MotorData>(INITIAL_MOTOR);
  const [vehicle, setVehicle] = useState<VehicleData>(INITIAL_VEHICLE);
  const [alerts, setAlerts] = useState<VehicleAlert[]>(INITIAL_ALERTS);
  const [historyPoints, setHistoryPoints] = useState<TelemetryPoint[]>(INITIAL_TELEMETRY_HISTORY);
  const [canFrames, setCanFrames] = useState<CANFrame[]>([]);
  const [canBusLoadPct, setCanBusLoadPct] = useState<number>(28.4);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isPluggedIn, setIsPluggedIn] = useState<boolean>(false);
  const [chargingType, setChargingType] = useState<'DC Fast' | 'AC Level 2'>('DC Fast');
  const [targetSocLimit, setTargetSocLimit] = useState<number>(90);
  const [antiTheft, setAntiTheft] = useState<AntiTheftStatus>(INITIAL_ANTI_THEFT);
  
  const [chargingHistory] = useState<ChargingSession[]>(INITIAL_CHARGING_HISTORY);
  const [tripHistory] = useState<TripSession[]>(INITIAL_TRIP_HISTORY);
  const [chargingStations] = useState<ChargingStation[]>(INITIAL_CHARGING_STATIONS);
  const [serviceItems] = useState<ServiceItem[]>(INITIAL_SERVICE_ITEMS);

  const [throttleValue, setThrottle] = useState<number>(38);
  const [brakeValue, setBrake] = useState<number>(0);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter(a => a.active).length;
  }, [alerts]);

  // Set Drive Mode
  const setDriveMode = useCallback((mode: DriveMode) => {
    setVehicle(prev => ({ ...prev, driveMode: mode }));
  }, []);

  // Toggle Vehicle Power
  const toggleVehiclePower = useCallback(() => {
    setVehicle(prev => {
      const nextPower = !prev.powerOn;
      if (!nextPower) {
        setMotor(m => ({ ...m, speedKmh: 0, rpm: 0, torqueNm: 0, powerKw: 0 }));
        setThrottle(0);
      }
      return { ...prev, powerOn: nextPower };
    });
  }, []);

  // Alert simulation triggers
  const triggerAlertTest = useCallback((type: VehicleAlert['type']) => {
    setAlerts(prev => prev.map(a => {
      if (a.type === type) {
        return {
          ...a,
          active: !a.active,
          severity: !a.active ? 'critical' : 'info',
          timestamp: new Date().toLocaleTimeString(),
        };
      }
      return a;
    }));
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: false, severity: 'info' } : a));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, active: false, severity: 'info' })));
  }, []);

  const toggleAntiTheftArmed = useCallback(() => {
    setAntiTheft(prev => ({ ...prev, armed: !prev.armed, sirenActive: false }));
  }, []);

  const toggleImmobilizer = useCallback(() => {
    setAntiTheft(prev => ({ ...prev, remoteImmobilizerActive: !prev.remoteImmobilizerActive }));
  }, []);

  const triggerSirenTest = useCallback(() => {
    setAntiTheft(prev => ({ ...prev, sirenActive: !prev.sirenActive }));
  }, []);

  const clearCanLog = useCallback(() => {
    setCanFrames([]);
  }, []);

  const exportCanLog = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Bus,CAN_ID,Name,DLC,Data_Bytes\n"
      + canFrames.map(f => `${f.timestamp},${f.bus},${f.id},${f.name},${f.dlc},"${f.data.join(' ')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `can_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [canFrames]);

  // CAN Frame Generator Helper
  const generateCanFrames = useCallback((curBms: BMSData, curMotor: MotorData): CANFrame[] => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    
    // Hex representations
    const vTotalHex = Math.round(curBms.totalVoltage * 100).toString(16).padStart(4, '0').toUpperCase();
    const iHex = Math.round((curBms.current + 500) * 10).toString(16).padStart(4, '0').toUpperCase();
    const socHex = Math.round(curBms.soc * 2).toString(16).padStart(2, '0').toUpperCase();
    const tempHex = Math.round(curBms.temperature + 40).toString(16).padStart(2, '0').toUpperCase();
    const rpmHex = Math.round(curMotor.rpm).toString(16).padStart(4, '0').toUpperCase();
    const spdHex = Math.round(curMotor.speedKmh * 10).toString(16).padStart(4, '0').toUpperCase();
    const trqHex = Math.round((curMotor.torqueNm + 500) * 2).toString(16).padStart(4, '0').toUpperCase();

    return [
      {
        id: '0x1806E5F4',
        name: 'BMS_PACK_SUMMARY',
        dlc: 8,
        bus: 'CAN-1 (BMS Bus)',
        periodMs: 100,
        timestamp: timeStr,
        data: [vTotalHex.slice(0, 2), vTotalHex.slice(2, 4), iHex.slice(0, 2), iHex.slice(2, 4), socHex, tempHex, '00', '14'],
      },
      {
        id: '0x1807E5F4',
        name: 'BMS_CELLS_01_04',
        dlc: 8,
        bus: 'CAN-1 (BMS Bus)',
        periodMs: 200,
        timestamp: timeStr,
        data: curBms.cells.slice(0, 4).flatMap(c => {
          const mv = Math.round(c.voltage * 1000).toString(16).padStart(4, '0').toUpperCase();
          return [mv.slice(0, 2), mv.slice(2, 4)];
        }),
      },
      {
        id: '0x1808E5F4',
        name: 'BMS_CELLS_05_08',
        dlc: 8,
        bus: 'CAN-1 (BMS Bus)',
        periodMs: 200,
        timestamp: timeStr,
        data: curBms.cells.slice(4, 8).flatMap(c => {
          const mv = Math.round(c.voltage * 1000).toString(16).padStart(4, '0').toUpperCase();
          return [mv.slice(0, 2), mv.slice(2, 4)];
        }),
      },
      {
        id: '0x0C08A7F0',
        name: 'MCU_MOTOR_DYNAMICS',
        dlc: 8,
        bus: 'CAN-0 (High Speed)',
        periodMs: 50,
        timestamp: timeStr,
        data: [rpmHex.slice(0, 2), rpmHex.slice(2, 4), spdHex.slice(0, 2), spdHex.slice(2, 4), trqHex.slice(0, 2), trqHex.slice(2, 4), 'A1', '02'],
      },
    ];
  }, []);

  // Main Telemetry Simulator Loop (every 800ms)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // 1. Calculate Motor and Speed dynamics based on throttle, brake, mode, and vehicle power
      setMotor(prevMotor => {
        if (!vehicle.powerOn || antiTheft.remoteImmobilizerActive) {
          return {
            ...prevMotor,
            speedKmh: Math.max(0, prevMotor.speedKmh * 0.92),
            rpm: Math.max(0, prevMotor.rpm * 0.9),
            torqueNm: 0,
            powerKw: 0,
            controllerStatus: 'Standby',
          };
        }

        // Mode multiplier
        const modeMultiplier = vehicle.driveMode === 'sport' ? 1.4 : vehicle.driveMode === 'eco' ? 0.75 : 1.0;
        const maxSpeed = vehicle.driveMode === 'sport' ? 220 : vehicle.driveMode === 'eco' ? 130 : 175;
        
        let targetSpeed = 0;
        let targetTorque = 0;
        let targetPower = 0;

        if (brakeValue > 0) {
          // Braking & Regen
          targetSpeed = Math.max(0, prevMotor.speedKmh - (brakeValue * 0.8));
          targetTorque = -Math.min(140, brakeValue * 1.5);
          targetPower = -Math.min(45, (Math.abs(targetTorque) * prevMotor.speedKmh) / 250);
        } else if (throttleValue > 0) {
          // Driving
          const throttleRatio = throttleValue / 100;
          targetSpeed = Math.min(maxSpeed, prevMotor.speedKmh + (throttleRatio * 3.5 * modeMultiplier) - (prevMotor.speedKmh * 0.015));
          targetTorque = Math.round(throttleRatio * 420 * modeMultiplier);
          targetPower = Number(((targetTorque * Math.max(10, targetSpeed)) / 300).toFixed(1));
        } else {
          // Coasting / Mild regen
          targetSpeed = Math.max(0, prevMotor.speedKmh - 1.2);
          targetTorque = -18;
          targetPower = -2.5;
        }

        const newSpeed = Math.max(0, Math.round(prevMotor.speedKmh * 0.75 + targetSpeed * 0.25));
        const newRpm = Math.round((newSpeed * 65) + (Math.sin(Date.now() / 800) * 20));
        const newTorque = Math.round(prevMotor.torqueNm * 0.7 + targetTorque * 0.3);
        const newPower = Number((prevMotor.powerKw * 0.7 + targetPower * 0.3).toFixed(1));
        
        // Temperature fluctuations
        const targetTemp = 35 + (newPower * 0.25) + (vehicle.driveMode === 'sport' ? 6 : 0);
        const newMotorTemp = Number((prevMotor.temperature * 0.98 + targetTemp * 0.02).toFixed(1));

        return {
          ...prevMotor,
          speedKmh: newSpeed,
          rpm: Math.max(0, newRpm),
          torqueNm: newTorque,
          powerKw: newPower,
          temperature: newMotorTemp,
          controllerStatus: newMotorTemp > 65 ? 'Thermal Derating' : vehicle.driveMode === 'sport' ? 'Boost Ready' : 'Normal',
        };
      });

      // 2. Update BMS state
      setBms(prevBms => {
        let currentDraw = 0;
        let nextSoc = prevBms.soc;
        let chargingStatus: 'discharging' | 'charging' | 'idle' | 'standby' = 'idle';

        if (isPluggedIn) {
          chargingStatus = 'charging';
          const chargeRateKw = chargingType === 'DC Fast' ? 140 : 11;
          currentDraw = (chargeRateKw * 1000) / prevBms.totalVoltage; // Positive A
          if (nextSoc < targetSocLimit) {
            nextSoc = Math.min(targetSocLimit, nextSoc + (chargingType === 'DC Fast' ? 0.08 : 0.015));
          } else {
            chargingStatus = 'standby';
            currentDraw = 1.2; // trickle
          }
        } else if (vehicle.powerOn) {
          if (motor.powerKw > 0) {
            chargingStatus = 'discharging';
            currentDraw = -((motor.powerKw * 1000) / prevBms.totalVoltage); // Negative A
            nextSoc = Math.max(0, nextSoc - 0.008);
          } else if (motor.powerKw < 0) {
            // Regen recuperation
            chargingStatus = 'charging';
            currentDraw = (Math.abs(motor.powerKw) * 1000) / prevBms.totalVoltage;
            nextSoc = Math.min(100, nextSoc + 0.003);
          }
        }

        // Cell voltages update: 20 cells
        // Under load: slight sag. Under charge: slight rise.
        const baseNominal = 3.65 + (nextSoc / 100) * 0.50; // 3.65V at 0% to 4.15V at 100%
        const loadDelta = (currentDraw / 200) * 0.035;

        const updatedCells: CellData[] = prevBms.cells.map((cell, idx) => {
          // Slight natural cell micro-variation
          const cellOffset = (Math.sin(idx * 1.7) * 0.007) - (idx === 12 ? 0.006 : 0) + (idx === 2 ? 0.005 : 0);
          const rawV = baseNominal + loadDelta + cellOffset;
          const vClamped = Math.max(3.0, Math.min(4.25, Number(rawV.toFixed(3))));
          
          // Check if cell is being actively balanced
          const isBalancing = vClamped > 4.10 || (Math.abs(vClamped - baseNominal) > 0.008 && prevBms.cellBalancingActive);

          return {
            ...cell,
            voltage: vClamped,
            balancing: isBalancing,
            temperature: Number((prevBms.temperature + (Math.sin(idx) * 0.4)).toFixed(1)),
          };
        });

        // Compute highest, lowest, and delta
        let highest = updatedCells[0].voltage;
        let lowest = updatedCells[0].voltage;
        let highestId = 1;
        let lowestId = 1;

        updatedCells.forEach(c => {
          if (c.voltage > highest) {
            highest = c.voltage;
            highestId = c.id;
          }
          if (c.voltage < lowest) {
            lowest = c.voltage;
            lowestId = c.id;
          }
        });

        const deltaMv = Math.round((highest - lowest) * 1000);
        const sumVolts = Number(updatedCells.reduce((acc, c) => acc + c.voltage, 0).toFixed(2));
        const currentRemainingKwh = Number(((nextSoc / 100) * prevBms.capacityKwh).toFixed(1));
        const estRange = Math.round((currentRemainingKwh / 0.165)); // ~165 Wh/km
        const estMinutes = isPluggedIn && nextSoc < targetSocLimit 
          ? Math.max(1, Math.round(((targetSocLimit - nextSoc) / (chargingType === 'DC Fast' ? 2.2 : 0.25))))
          : 0;

        return {
          ...prevBms,
          soc: Number(nextSoc.toFixed(1)),
          energyKwh: currentRemainingKwh,
          totalVoltage: sumVolts,
          current: Number(currentDraw.toFixed(1)),
          cells: updatedCells,
          highestCellVoltage: highest,
          lowestCellVoltage: lowest,
          deltaCellVoltage: deltaMv,
          highestCellId: highestId,
          lowestCellId: lowestId,
          cellBalancingActive: deltaMv > 10,
          chargingStatus,
          remainingRangeKm: estRange,
          estimatedChargingMinutes: estMinutes,
        };
      });

      // 3. Update Vehicle odo and trip
      setVehicle(prevV => {
        if (!prevV.powerOn || motor.speedKmh === 0) return prevV;
        const distDelta = (motor.speedKmh / 3600) * 0.8; // km in 0.8s
        return {
          ...prevV,
          odometerKm: Number((prevV.odometerKm + distDelta).toFixed(2)),
          tripDistanceKm: Number((prevV.tripDistanceKm + distDelta).toFixed(2)),
          tripDurationSec: prevV.tripDurationSec + 1,
          gps: {
            ...prevV.gps,
            speedKmh: motor.speedKmh,
            headingDeg: (prevV.gps.headingDeg + (motor.speedKmh > 0 ? 0.3 : 0)) % 360,
          }
        };
      });

      // 4. Record history analytics point (keep last 30 points)
      setHistoryPoints(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newPoint: TelemetryPoint = {
          timestamp: timeStr,
          voltage: bms.totalVoltage,
          current: bms.current,
          temperature: bms.temperature,
          speed: motor.speedKmh,
          power: motor.powerKw,
          soc: bms.soc,
          consumptionWhKm: motor.speedKmh > 5 ? Math.round(145 + Math.abs(motor.powerKw) * 1.8) : 158,
        };
        return [...prev.slice(-29), newPoint];
      });

      // 5. Stream CAN Frames (keep last 50 frames)
      const newFrames = generateCanFrames(bms, motor);
      setCanFrames(prev => [...newFrames, ...prev].slice(0, 60));
      setCanBusLoadPct(Number((24 + (motor.speedKmh > 0 ? 12 : 4) + (Math.sin(Date.now() / 2000) * 3)).toFixed(1)));

    }, 800);

    return () => clearInterval(interval);
  }, [isSimulating, vehicle.powerOn, vehicle.driveMode, throttleValue, brakeValue, isPluggedIn, chargingType, targetSocLimit, antiTheft.remoteImmobilizerActive, bms, motor, generateCanFrames]);

  const analytics: AnalyticsData = useMemo(() => {
    return {
      consumptionWhKm: motor.speedKmh > 5 ? Math.round(152 + (vehicle.driveMode === 'sport' ? 35 : vehicle.driveMode === 'eco' ? -18 : 0)) : 158,
      totalEnergyUsedKwh: Number((vehicle.tripDistanceKm * 0.158).toFixed(1)),
      batteryEfficiencyPct: Number((94.2 - (motor.speedKmh > 100 ? 2.4 : 0)).toFixed(1)),
      regenRecuperatedKwh: Number((vehicle.tripDistanceKm * 0.038).toFixed(1)),
      historyPoints,
    };
  }, [motor.speedKmh, vehicle.driveMode, vehicle.tripDistanceKm, historyPoints]);

  return (
    <VehicleContext.Provider
      value={{
        activeTab,
        setActiveTab,
        bms,
        motor,
        vehicle,
        alerts,
        analytics,
        canFrames,
        canBusLoadPct,
        isSimulating,
        setIsSimulating,
        isPluggedIn,
        setIsPluggedIn,
        chargingType,
        setChargingType,
        targetSocLimit,
        setTargetSocLimit,
        antiTheft,
        chargingHistory,
        tripHistory,
        chargingStations,
        serviceItems,
        setDriveMode,
        toggleVehiclePower,
        setThrottle,
        setBrake,
        throttleValue,
        brakeValue,
        triggerAlertTest,
        acknowledgeAlert,
        clearAllAlerts,
        toggleAntiTheftArmed,
        toggleImmobilizer,
        triggerSirenTest,
        clearCanLog,
        exportCanLog,
        activeAlertsCount,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
