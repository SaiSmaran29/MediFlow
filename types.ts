
export enum Role {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PHARMACIST = 'PHARMACIST',
  DIAGNOSTIC = 'DIAGNOSTIC'
}

export enum ActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ActionType {
  PRESCRIPTION = 'PRESCRIPTION',
  DIAGNOSTIC_REQUEST = 'DIAGNOSTIC_REQUEST',
  CARE_INSTRUCTION = 'CARE_INSTRUCTION',
  VITAL_CHECK = 'VITAL_CHECK',
  REFERRAL = 'REFERRAL'
}

export interface ClinicalAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  department: Role;
  status: ActionStatus;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  results?: any;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  admissionDate: string;
  roomNumber: string;
  attendingDoctor: string;
  diagnosis: string;
  actions: ClinicalAction[];
  vitals: {
    timestamp: string;
    bp: string;
    heartRate: number;
    temp: number;
    oxygen: number;
  }[];
}

export interface AppState {
  patients: Patient[];
  activePatientId: string | null;
  currentUserRole: Role;
}
