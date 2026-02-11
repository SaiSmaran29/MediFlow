
import React from 'react';
import { Patient, Role, ActionStatus } from '../types';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Activity,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  patients: Patient[];
  currentRole: Role;
  onPatientSelect: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, currentRole, onPatientSelect }) => {
  const allActions = patients.flatMap(p => p.actions);
  const pendingActions = allActions.filter(a => a.status === ActionStatus.PENDING || a.status === ActionStatus.IN_PROGRESS);
  const deptActions = pendingActions.filter(a => a.department === currentRole || currentRole === Role.DOCTOR);

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Tasks', value: pendingActions.length, icon: <Activity size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed Today', value: allActions.filter(a => a.status === ActionStatus.COMPLETED).length, icon: <CheckCircle size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Urgent Requests', value: allActions.filter(a => a.title.toLowerCase().includes('urgent') || a.description.toLowerCase().includes('stat')).length, icon: <Clock size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hospital Workflow</h1>
          <p className="text-slate-500 mt-1">Real-time clinical coordination status for {currentRole} portal.</p>
        </div>
        <div className="hidden md:block bg-white border rounded-xl px-4 py-2 shadow-sm text-sm">
          <span className="text-slate-400">System Status: </span>
          <span className="text-green-600 font-semibold flex items-center gap-1 inline-flex">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgent/Pending for Current Role */}
        <div className="bg-white rounded-2xl border shadow-sm flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Your Department's Queue</h3>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold">
              {deptActions.length} Pending
            </span>
          </div>
          <div className="flex-1 p-6 overflow-y-auto max-h-[400px]">
            {deptActions.length > 0 ? (
              <div className="space-y-4">
                {deptActions.map((action) => {
                  const patient = patients.find(p => p.actions.some(a => a.id === action.id));
                  return (
                    <div 
                      key={action.id} 
                      onClick={() => patient && onPatientSelect(patient.id)}
                      className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-bold text-blue-600 mb-1">{patient?.name} (Room {patient?.roomNumber})</p>
                        <h4 className="font-semibold text-slate-800 group-hover:text-blue-700">{action.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{action.description}</p>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <CheckCircle size={48} className="mb-4 opacity-20" />
                <p>All tasks cleared!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Patient Activity */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="font-bold text-slate-800">Recent Admissions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {patients.map((patient) => (
                <div 
                  key={patient.id}
                  onClick={() => onPatientSelect(patient.id)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{patient.name}</h4>
                    <p className="text-xs text-slate-500">{patient.diagnosis}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{patient.roomNumber}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Room No.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
