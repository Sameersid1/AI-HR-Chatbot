import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Ticket as TicketIcon, Search, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { API_URL } from '../../config';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/tickets`);
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const socket = io(`${API_URL}`);
    socket.on('newTicket', () => fetchTickets());
    return () => socket.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High':
      case 'Critical': return <AlertCircle size={16} className="text-rose-500 mr-2" />;
      case 'Medium': return <Clock size={16} className="text-orange-500 mr-2" />;
      default: return <CheckCircle size={16} className="text-emerald-500 mr-2" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h3 className="font-bold text-stone-800 text-lg flex items-center">
          <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3 border border-indigo-100">
            <TicketIcon size={16} />
          </span>
          Active Support Queue
        </h3>
        <div className="relative w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search tickets by name..." 
            className="w-full sm:w-72 pl-10 pr-4 py-2 border border-stone-200 bg-stone-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors placeholder:text-stone-400"
          />
          <Search className="absolute left-3 top-2.5 text-stone-400" size={16} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
              <th className="px-6 py-4 font-semibold">Issue Details</th>
              <th className="px-6 py-4 font-semibold">Employee</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-stone-400">Loading tickets...</td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-16">
                  <div className="mx-auto w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="text-stone-300 w-8 h-8" />
                  </div>
                  <p className="text-stone-500 font-medium text-lg">You're all caught up!</p>
                  <p className="text-stone-400 text-sm mt-1">No pending tickets in the queue.</p>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-stone-50/80 transition-colors group">
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-semibold text-stone-800 truncate">{ticket.title}</div>
                    <div className="text-xs text-stone-500 mt-1 line-clamp-1">{ticket.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mr-3 shadow-sm border border-indigo-200">
                        {ticket.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-stone-700">{ticket.userId?.name || 'Unknown User'}</div>
                        <div className="text-[11px] text-stone-400 font-medium">{ticket.userId?.department || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-stone-600">
                      {getPriorityIcon(ticket.priority)}
                      {ticket.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 border rounded-md text-xs font-bold tracking-wide uppercase ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-stone-500">
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100">
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;
