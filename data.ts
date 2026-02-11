
import { Patient, ActionType, ActionStatus, Role } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-1001',
    name: 'Eleanor Vance',
    age: 42,
    gender: 'Female',
    bloodGroup: 'A+',
    admissionDate: '2024-05-15 08:30',
    roomNumber: '402-A',
    attendingDoctor: 'Dr. Sarah Mitchell',
    diagnosis: 'Acute Abdominal Pain - Post Operative Observation',
    vitals: [
      { timestamp: '08:00', bp: '120/80', heartRate: 72, temp: 98.6, oxygen: 98 },
      { timestamp: '10:00', bp: '118/76', heartRate: 75, temp: 98.4, oxygen: 97 },
      { timestamp: '12:00', bp: '122/82', heartRate: 70, temp: 99.1, oxygen: 99 },
    ],
    actions: [
      {
        id: 'A-001',
        type: ActionType.CARE_INSTRUCTION,
        title: 'NPO (Nothing by Mouth)',
        description: 'Patient must remain NPO until further notice from surgical team.',
        department: Role.NURSE,
        status: ActionStatus.IN_PROGRESS,
        requestedBy: 'Dr. Sarah Mitchell',
        requestedAt: '2024-05-15 09:00',
      },
      {
        id: 'A-002',
        type: ActionType.PRESCRIPTION,
        title: 'Morphine 5mg IV',
        description: 'For pain management, every 4-6 hours as needed.',
        department: Role.PHARMACIST,
        status: ActionStatus.PENDING,
        requestedBy: 'Dr. Sarah Mitchell',
        requestedAt: '2024-05-15 09:15',
      },
      {
        id: 'A-003',
        type: ActionType.DIAGNOSTIC_REQUEST,
        title: 'Full Abdominal CT Scan',
        description: 'Rule out post-op internal hemorrhage or complications.',
        department: Role.DIAGNOSTIC,
        status: ActionStatus.COMPLETED,
        requestedBy: 'Dr. Sarah Mitchell',
        requestedAt: '2024-05-15 08:45',
        completedAt: '2024-05-15 11:30',
        results: 'No active hemorrhage detected. Some localized inflammation observed.'
      }
    ]
  },
  {
    id: 'P-1002',
    name: 'Arthur Miller',
    age: 68,
    gender: 'Male',
    bloodGroup: 'O-',
    admissionDate: '2024-05-14 14:15',
    roomNumber: '315-B',
    attendingDoctor: 'Dr. James Wilson',
    diagnosis: 'Congestive Heart Failure Exacerbation',
    vitals: [
      { timestamp: '06:00', bp: '145/95', heartRate: 88, temp: 98.2, oxygen: 94 },
      { timestamp: '09:00', bp: '140/92', heartRate: 84, temp: 98.4, oxygen: 95 },
    ],
    actions: [
      {
        id: 'A-004',
        type: ActionType.VITAL_CHECK,
        title: 'Hourly Oxygen Saturation Check',
        description: 'Maintain SpO2 > 94% with supplemental O2 if needed.',
        department: Role.NURSE,
        status: ActionStatus.IN_PROGRESS,
        requestedBy: 'Dr. James Wilson',
        requestedAt: '2024-05-14 15:00',
      }
    ]
  }
];
