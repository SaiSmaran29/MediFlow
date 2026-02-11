
import React, { useState, useCallback } from 'react';
import { Role, Patient, AppState, ActionStatus, ActionType } from './types';
import { INITIAL_PATIENTS } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientDetails from './components/PatientDetails';
import { Search, Bell, Settings, User } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    patients: INITIAL_PATIENTS,
    activePatientId: null,
    currentUserRole: Role.DOCTOR,
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'patients'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (role: Role) => {
    setState(prev => ({ ...prev, currentUserRole: role }));
  };

  const handlePatientSelect = (id: string) => {
    setState(prev => ({ ...prev, activePatientId: id }));
  };

  const handleBackToDashboard = () => {
    setState(prev => ({ ...prev, activePatientId: null }));
  };

  const handleAddAction = (patientId: string, action: any) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.map(p => 
        p.id === patientId ? { ...p, actions: [action, ...p.actions] } : p
      )
    }));
  };

  const handleUpdateActionStatus = (patientId: string, actionId: string, newStatus: ActionStatus) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.map(p => 
        p.id === patientId ? { 
          ...p, 
          actions: p.actions.map(a => 
            a.id === actionId ? { 
              ...a, 
              status: newStatus, 
              completedAt: newStatus === ActionStatus.COMPLETED ? new Date().toLocaleString() : a.completedAt 
            } : a
          ) 
        } : p
      )
    }));
  };

  const filteredPatients = state.patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePatient = state.patients.find(p => p.id === state.activePatientId);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar 
        currentRole={state.currentUserRole} 
        onRoleChange={handleRoleChange} 
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setState(prev => ({ ...prev, activePatientId: null }));
        }}
      />

      <main className="flex-1 ml-64 p-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between mb-10">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients, medical IDs..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <Settings size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">Hospital Admin</p>
                <p className="text-[10px] text-slate-500">{state.currentUserRole}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>

        {activePatient ? (
          <PatientDetails 
            patient={activePatient} 
            onBack={handleBackToDashboard} 
            currentRole={state.currentUserRole}
            onAddAction={handleAddAction}
            onUpdateActionStatus={handleUpdateActionStatus}
          />
        ) : activeView === 'dashboard' ? (
          <Dashboard 
            patients={state.patients} 
            currentRole={state.currentUserRole} 
            onPatientSelect={handlePatientSelect} 
          />
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Patient Directory</h1>
                <p className="text-sm text-slate-500">Currently managing {filteredPatients.length} patients.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPatients.map(patient => (
                <div 
                  key={patient.id} 
                  onClick={() => handlePatientSelect(patient.id)}
                  className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{patient.name}</h3>
                        <p className="text-xs text-slate-400">ID: {patient.id} • {patient.roomNumber}</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                      STABLE
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Diagnosis</span>
                      <span className="text-slate-700 font-medium truncate ml-4 max-w-[150px]">{patient.diagnosis}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Pending Actions</span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        {patient.actions.filter(a => a.status !== ActionStatus.COMPLETED).length}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[8px] font-bold text-blue-600">
                        +2
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

export default App;
