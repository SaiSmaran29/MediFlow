
import React from 'react';
import { Role } from '../types';
import { 
  Users, 
  Stethoscope, 
  Activity, 
  Pill, 
  FlaskConical, 
  ClipboardList,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeView: 'dashboard' | 'patients';
  onViewChange: (view: 'dashboard' | 'patients') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, onRoleChange, activeView, onViewChange }) => {
  const roles = [
    { id: Role.DOCTOR, name: 'Doctor', icon: <Stethoscope size={20} /> },
    { id: Role.NURSE, name: 'Nurse', icon: <Activity size={20} /> },
    { id: Role.PHARMACIST, name: 'Pharmacy', icon: <Pill size={20} /> },
    { id: Role.DIAGNOSTIC, name: 'Diagnostics', icon: <FlaskConical size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Activity size={24} />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">MediFlow</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</h3>
          <button 
            onClick={() => onViewChange('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => onViewChange('patients')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'patients' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={20} />
            Patients
          </button>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Departmental Access</h3>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${currentRole === role.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {role.icon}
              {role.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {currentRole.substring(0, 1)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{currentRole} Portal</p>
            <p className="text-[10px] text-slate-500 truncate">System Access Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
