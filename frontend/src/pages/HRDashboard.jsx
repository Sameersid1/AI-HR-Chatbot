import React, { useState, useRef } from 'react';
import TicketList from '../components/tickets/TicketList';
import { Users, LayoutDashboard, Flag, UserPlus, UploadCloud, FileText } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const StatCard = ({ icon: Icon, title, value, subtitle, gradientFrom, gradientTo }) => (
  <div className={`rounded-2xl p-6 shadow-sm border border-stone-100 relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
    <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
      <Icon size={120} />
    </div>
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center mb-4 text-stone-800 shadow-sm border border-white/50">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-stone-700/80 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-end space-x-2">
          <p className="text-3xl font-extrabold text-stone-900">{value}</p>
          <p className="text-sm font-semibold text-stone-600 mb-1">{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Employee Form State
  const [empData, setEmpData] = useState({ name: '', email: '', password: '', department: 'Engineering', role: 'Employee' });
  const [empStatus, setEmpStatus] = useState({ loading: false, message: '', isError: false });

  // Policy Form State
  const [policyFile, setPolicyFile] = useState(null);
  const [policyStatus, setPolicyStatus] = useState({ loading: false, message: '', isError: false });
  const fileInputRef = useRef(null);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setEmpStatus({ loading: true, message: '', isError: false });
    try {
      await axios.post(`${API_URL}/api/auth/register`, empData);
      setEmpStatus({ loading: false, message: 'Employee account created securely!', isError: false });
      setEmpData({ name: '', email: '', password: '', department: 'Engineering', role: 'Employee' });
      setTimeout(() => setEmpStatus({ loading: false, message: '', isError: false }), 4000);
    } catch (err) {
      setEmpStatus({ loading: false, message: err.response?.data?.message || 'Failed to create employee', isError: true });
    }
  };

  const handleUploadPolicy = async (e) => {
    e.preventDefault();
    if (!policyFile) {
      return setPolicyStatus({ loading: false, message: 'Please select a file first', isError: true });
    }
    
    setPolicyStatus({ loading: true, message: '', isError: false });
    const formData = new FormData();
    formData.append('document', policyFile);

    try {
      await axios.post(`${API_URL}/api/policy/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPolicyStatus({ loading: false, message: 'Policy successfully integrated with AI constraints!', isError: false });
      setPolicyFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setPolicyStatus({ loading: false, message: 'Failed to ingest document.', isError: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 bg-stone-50 min-h-screen border-x border-stone-200">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Manager Central</h1>
          <p className="text-stone-500 mt-2 text-sm max-w-xl">Oversee active queues, provision secure employee access, and maintain the company's AI knowledge base.</p>
        </div>
        
        <div className="flex mt-6 md:mt-0 bg-white p-1.5 rounded-xl border border-stone-200 shadow-sm">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-stone-500 hover:text-stone-700'}`}>Overview</button>
          <button onClick={() => setActiveTab('employees')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'employees' ? 'bg-indigo-50 text-indigo-700' : 'text-stone-500 hover:text-stone-700'}`}>Employees</button>
          <button onClick={() => setActiveTab('policy')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'policy' ? 'bg-indigo-50 text-indigo-700' : 'text-stone-500 hover:text-stone-700'}`}>System Policy</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-stone-800">
            <StatCard icon={Users} title="Active Team" value="1,245" subtitle="members" gradientFrom="from-blue-100" gradientTo="to-indigo-50" />
            <StatCard icon={LayoutDashboard} title="Issues Resolved" value="84" subtitle="this week" gradientFrom="from-emerald-100" gradientTo="to-green-50" />
            <StatCard icon={Flag} title="AI Escalations" value="12" subtitle="pending" gradientFrom="from-rose-100" gradientTo="to-orange-50" />
          </div>
          <TicketList />
        </>
      )}

      {activeTab === 'employees' && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 max-w-2xl text-stone-800">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-4"><UserPlus size={24}/></div>
            <div>
              <h2 className="text-xl font-bold">Provision New Employee</h2>
              <p className="text-sm text-stone-500">Create a secure portal account. Public registration is locked.</p>
            </div>
          </div>

          {empStatus.message && (
            <div className={`p-4 mb-6 rounded-xl border text-sm font-medium ${empStatus.isError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
              {empStatus.message}
            </div>
          )}

          <form onSubmit={handleCreateEmployee} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
                <input type="text" required value={empData.name} onChange={e => setEmpData({...empData, name: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Company Email</label>
                <input type="email" required value={empData.email} onChange={e => setEmpData({...empData, email: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Temporary Password</label>
              <input type="text" required value={empData.password} onChange={e => setEmpData({...empData, password: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50" placeholder="Minimum 6 characters" minLength="6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Department</label>
                <select value={empData.department} onChange={e => setEmpData({...empData, department: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50">
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>HR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">System Constraint Role</label>
                <select value={empData.role} onChange={e => setEmpData({...empData, role: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50">
                  <option value="Employee">Standard Employee</option>
                  <option value="HR">HR Manager</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={empStatus.loading} className="mt-4 px-6 py-3 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-900 transition-colors disabled:opacity-70 flex items-center">
              {empStatus.loading ? 'Provisioning...' : 'Generate Account'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'policy' && (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 max-w-2xl text-stone-800">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl mr-4"><FileText size={24}/></div>
            <div>
              <h2 className="text-xl font-bold">Inject Universal Policy</h2>
              <p className="text-sm text-stone-500">Upload central guidelines. The AI will strictly RAG-constrain answers using this document.</p>
            </div>
          </div>

          {policyStatus.message && (
             <div className={`p-4 mb-6 rounded-xl border text-sm font-medium ${policyStatus.isError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
               {policyStatus.message}
             </div>
          )}

          <form onSubmit={handleUploadPolicy} className="space-y-6">
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors">
              <UploadCloud size={48} className="text-stone-400 mb-4" />
              <p className="text-sm font-semibold text-stone-700 mb-1">Drag and drop your policy file</p>
              <p className="text-xs text-stone-500 mb-4">Supported formats: PDF or Plain Text (.txt)</p>
              <label className="cursor-pointer px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-medium text-stone-700 shadow-sm hover:text-indigo-600">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.txt,text/plain,application/pdf"
                  ref={fileInputRef}
                  onChange={(e) => setPolicyFile(e.target.files[0])}
                />
              </label>
              {policyFile && (
                <div className="mt-4 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs rounded-full font-semibold">
                  Selected: {policyFile.name}
                </div>
              )}
            </div>

            <button type="submit" disabled={policyStatus.loading || !policyFile} className="px-6 py-3 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-900 transition-colors disabled:opacity-70 flex items-center">
              {policyStatus.loading ? 'Extracting & Encoding...' : 'Inject Policy to AI Network'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default HRDashboard;
