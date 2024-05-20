export interface DataItem {
    COUNT: number;
    ERROR_CODE: string;
  }

export interface DataItemMonthly {
  COUNT: number;
  ERROR_CODE: string;
  MONTH: string;
}

export interface ScanData {
  AVG: number;
  SCAN_TYPE: string;
}

export interface OutputData {
  Name: string;
  Observations: string;
  Actions: string;
  Components: string;
  Urgency: string;
  Impact: string;
}

export interface RefineData {
  name: string;
  data: [number, number][];
}

export interface PrevDataItem {
  COUNT: number;
  REASON: string;
}

export interface MaintenanceCodes {
  COUNT: number;
  MAINTENANCE_CODE: string;
}