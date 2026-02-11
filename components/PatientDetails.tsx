
import React, { useState, useEffect } from 'react';
import { Patient, Role, ActionType, ActionStatus } from '../types';
import { 
  ArrowLeft, 
  Plus, 
  Activity, 
  BrainCircuit, 
  FileText, 
  History,
  TrendingUp,
  User
} from 'lucide-react';
import PatientTimeline from './PatientTimeline';
import { summarizePatientStatus } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientDetailsProps {
  patient: Patient;
  onBack: () => void;
  currentRole: Role;
  onAddAction: (patientId: string, action: any) => void;
  onUpdateActionStatus: (patientId: string, actionId: string, newStatus: ActionStatus) => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ 
  patient, 
  onBack, 
  currentRole, 
  onAddAction, 
  onUpdateActionStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'vitals' | 'notes'>('timeline');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  // New action form state
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    type: ActionType.CARE_INSTRUCTION,
    department: Role.NURSE
  });

  useEffect(() => {
    // Generate AI summary when viewing details
    const fetchSummary = async () => {
      setLoadingAi(true);
      const summary = await summarizePatientStatus(patient);
      setAiSummary(summary);
      setLoadingAi(false);
    };
    fetchSummary();
  }, [patient.id]);

  const handleCreateAction = () => {
    onAddAction(patient.id, {
      ...newAction,
      id: `A-${Math.random().toString(36).substr(2, 9)}`,
      status: ActionStatus.PENDING,
      requestedBy: `Dr. ${currentRole === Role.DOCTOR ? 'Current' : 'On-Duty'}`,
      requestedAt: new Date().toLocaleString()
    });
    setShowActionModal(false);
    setNewAction({
      title: '',
      description: '',
      type: ActionType.CARE_INSTRUCTION,
      department: Role.NURSE
    });
  };

  const getDeptForAction = (type: ActionType): Role => {
    switch (type) {
      case ActionType.PRESCRIPTION: return Role.PHARMACIST;
      case ActionType.DIAGNOSTIC_REQUEST: return Role.DIAGNOSTIC;
      default: return Role.NURSE;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
            <p className="text-slate-500 text-sm">ID: {patient.id} • Room {patient.roomNumber} • {patient.age}y {patient.gender}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {currentRole === Role.DOCTOR && (
            <button 
              onClick={() => setShowActionModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md shadow-blue-100"
            >
              <Plus size={18} />
              New Clinical Action
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Vitals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Group</p>
              <p className="text-xl font-bold text-slate-800">{patient.bloodGroup}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Admission</p>
              <p className="text-sm font-bold text-slate-800">{new Date(patient.admissionDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Heart Rate</p>
              <p className="text-xl font-bold text-rose-600">{patient.vitals[patient.vitals.length - 1].heartRate} bpm</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Oxygen Sat.</p>
              <p className="text-xl font-bold text-blue-600">{patient.vitals[patient.vitals.length - 1].oxygen}%</p>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <FileText size={18} className="text-blue-500" />
              Primary Diagnosis
            </h3>
            <p className="text-slate-600 leading-relaxed">{patient.diagnosis}</p>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${activeTab === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <History size={18} />
                Care Timeline
              </button>
              <button 
                onClick={() => setActiveTab('vitals')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${activeTab === 'vitals' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <TrendingUp size={18} />
                Vital Trends
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'timeline' ? (
                <PatientTimeline 
                  patient={patient} 
                  currentRole={currentRole}
                  onUpdateActionStatus={(actionId, status) => onUpdateActionStatus(patient.id, actionId, status)} 
                />
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patient.vitals}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="heartRate" stroke="#e11d48" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="oxygen" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-600" />
                      <span className="text-xs text-slate-500">Heart Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="text-xs text-slate-500">Oxygen %</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary & Care Team */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-lg shadow-blue-100 text-white relative overflow-hidden">
            <BrainCircuit className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BrainCircuit size={20} />
              AI Clinical Summary
            </h3>
            {loadingAi ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-4/6"></div>
              </div>
            ) : (
              <div className="text-sm text-blue-50 leading-relaxed whitespace-pre-wrap">
                {aiSummary}
              </div>
            )}
            <p className="mt-4 text-[10px] text-blue-200 italic">Generated based on real-time activity and vitals.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-slate-400" />
              Primary Care Provider
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                SM
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{patient.attendingDoctor}</p>
                <p className="text-xs text-slate-500">Department Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">New Clinical Action</h3>
              <p className="text-sm text-slate-500">Initiate a request for {patient.name}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Action Type</label>
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAction.type}
                  onChange={(e) => {
                    const type = e.target.value as ActionType;
                    setNewAction({ ...newAction, type, department: getDeptForAction(type) });
                  }}
                >
                  <option value={ActionType.CARE_INSTRUCTION}>Care Instruction (Nursing)</option>
                  <option value={ActionType.PRESCRIPTION}>Prescription (Pharmacy)</option>
                  <option value={ActionType.DIAGNOSTIC_REQUEST}>Diagnostic Request (Lab/Imaging)</option>
                  <option value={ActionType.REFERRAL}>Specialist Referral</option>
                  <option value={ActionType.VITAL_CHECK}>Specific Vital Monitor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Morning Meds, CBC Blood Test..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Details & Instructions</label>
                <textarea 
                  rows={3}
                  placeholder="Specific dosage, timing, or clinical goal..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Routing Information</p>
                <p className="text-xs text-blue-800">This request will be automatically routed to the <span className="font-bold">{newAction.department}</span> department.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
              <button 
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateAction}
                disabled={!newAction.title || !newAction.description}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-blue-100 transition-all"
              >
                Create Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
