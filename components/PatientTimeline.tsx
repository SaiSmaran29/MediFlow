
import React from 'react';
import { Patient, ClinicalAction, ActionStatus, Role, ActionType } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Pill, 
  FlaskConical, 
  Activity, 
  ClipboardList,
  UserCheck
} from 'lucide-react';

interface TimelineProps {
  patient: Patient;
  onUpdateActionStatus: (actionId: string, newStatus: ActionStatus) => void;
  currentRole: Role;
}

const PatientTimeline: React.FC<TimelineProps> = ({ patient, onUpdateActionStatus, currentRole }) => {
  const sortedActions = [...patient.actions].sort((a, b) => 
    new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case ActionStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case ActionStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ActionStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ActionStatus.CANCELLED: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case ActionType.PRESCRIPTION: return <Pill size={16} />;
      case ActionType.DIAGNOSTIC_REQUEST: return <FlaskConical size={16} />;
      case ActionType.VITAL_CHECK: return <Activity size={16} />;
      case ActionType.CARE_INSTRUCTION: return <ClipboardList size={16} />;
      case ActionType.REFERRAL: return <UserCheck size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {sortedActions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No clinical actions recorded yet.
        </div>
      ) : (
        sortedActions.map((action, index) => (
          <div key={action.id} className="relative pl-8">
            {/* Connector Line */}
            {index !== sortedActions.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-slate-200" />
            )}
            
            {/* Timeline Dot */}
            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${
              action.status === ActionStatus.COMPLETED ? 'bg-green-500 text-white' : 
              action.status === ActionStatus.IN_PROGRESS ? 'bg-blue-500 text-white' : 'bg-slate-300 text-white'
            }`}>
              {getActionIcon(action.type)}
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-800">{action.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(action.status)}`}>
                    {action.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  {action.requestedAt}
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-3">{action.description}</p>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-slate-400">By: <span className="text-slate-600 font-medium">{action.requestedBy}</span></span>
                  <span className="text-slate-400">Dept: <span className="text-slate-600 font-medium">{action.department}</span></span>
                </div>

                {/* Status Toggle (Visible only if user is in that dept or is Doctor) */}
                {(currentRole === Role.DOCTOR || currentRole === action.department) && action.status !== ActionStatus.COMPLETED && (
                  <div className="flex gap-2">
                    {action.status === ActionStatus.PENDING && (
                      <button 
                        onClick={() => onUpdateActionStatus(action.id, ActionStatus.IN_PROGRESS)}
                        className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200"
                      >
                        Start Work
                      </button>
                    )}
                    {action.status === ActionStatus.IN_PROGRESS && (
                      <button 
                        onClick={() => onUpdateActionStatus(action.id, ActionStatus.COMPLETED)}
                        className="text-[11px] font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded border border-green-200"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                )}
              </div>

              {action.results && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Results/Notes</p>
                  <p className="text-sm text-slate-700 italic">{action.results}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientTimeline;
