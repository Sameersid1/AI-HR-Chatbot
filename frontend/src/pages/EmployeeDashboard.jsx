import React, { useState } from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import { Coffee, CalendarHeart, Sparkles, BookOpen, Clock, X, BadgeHelp, HeartPulse } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const StatCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-stone-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState({ title: '', description: '', priority: 'Medium' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/tickets/create`, ticketData);
      setIsModalOpen(false);
      setTicketData({ title: '', description: '', priority: 'Medium' });
      alert("Ticket submitted successfully! HR will review it soon.");
    } catch (err) {
      alert("Error submitting ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-stone-50 min-h-screen">
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 flex items-center">
            Good Morning <Coffee className="ml-3 text-stone-400" size={28} />
          </h1>
          <p className="text-stone-500 mt-2">Here's what is happening in your workspace today.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center px-5 py-2.5 bg-white border border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-100 hover:border-stone-400 shadow-sm transition-all"
        >
          <BadgeHelp className="mr-2 text-rose-500" size={18} />
          Got an issue? Raise Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={CalendarHeart} title="Available Leaves" value="14 Days" colorClass="bg-rose-100 text-rose-600" />
        <StatCard icon={Sparkles} title="Upcoming Event" value="Townhall" colorClass="bg-indigo-100 text-indigo-600" />
        <StatCard icon={Clock} title="Active Requests" value="1 pending" colorClass="bg-orange-100 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white p-5 rounded-t-2xl border border-stone-200 border-b-0 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-800 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                 <img src="https://api.dicebear.com/7.x/notionists/svg?seed=hrbot" alt="HR Bot" className="w-6 h-6 rounded-full" />
              </span>
              HR Assistant
            </h2>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Online
            </span>
          </div>
          <div className="flex-1 bg-white border border-stone-200 rounded-b-2xl shadow-sm overflow-hidden z-10">
            <ChatInterface />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Quick Shortcuts</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
             <ul className="divide-y divide-stone-100">
               {['Company Directory', 'Request Leave', 'View Payslips', 'Health Benefits Info'].map((item, idx) => (
                 <li key={idx} className="p-4 hover:bg-stone-50 cursor-pointer transition-colors flex items-center text-sm font-medium text-stone-700">
                   <BookOpen size={16} className="mr-3 text-stone-400" />
                   {item}
                 </li>
               ))}
             </ul>
          </div>
          
          <div className="mt-8 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden">
            <HeartPulse className="absolute -bottom-4 -right-4 w-24 h-24 text-rose-200 opacity-50" />
            <h3 className="font-bold text-rose-900 mb-2 relative z-10">Employee Wellbeing</h3>
            <p className="text-sm text-rose-700 relative z-10 leading-relaxed mb-4">Don't forget to take short breaks! Use our AI assistant to learn about mental health leave policies.</p>
          </div>
        </div>
      </div>

      {/* Manual Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="text-lg font-bold text-stone-800">Raise a Support Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 bg-white p-1 rounded-full border border-stone-200 shadow-sm transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleManualTicket} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Short Title</label>
                  <input type="text" required value={ticketData.title} onChange={(e) => setTicketData({...ticketData, title: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="e.g. Payroll discrepancy" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Priority Level</label>
                  <select value={ticketData.priority} onChange={(e) => setTicketData({...ticketData, priority: e.target.value})} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none appearance-none">
                    <option value="Low">Low - Whenever possible</option>
                    <option value="Medium">Medium - Needs attention</option>
                    <option value="High">High - Blocking my work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Details</label>
                  <textarea required rows="4" value={ticketData.description} onChange={(e) => setTicketData({...ticketData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none" placeholder="Please describe your issue so our human HR team can help you..."></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-xl transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 flex items-center">
                  {isSubmitting ? 'Sending...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;
