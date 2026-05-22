import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, AlertCircle, HelpCircle } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/chat/history');
        const formatted = data.map(m => ({
          text: m.content,
          sender: m.sender,
          isFallback: m.isFallback,
          relatedTicketId: m.relatedTicketId
        }));
        setMessages(formatted);
      } catch (err) {
        console.error('Error fetching chat history', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputTitle.trim() || loading) return;

    const userMessage = { text: inputTitle, sender: 'User' };
    setMessages(prev => [...prev, userMessage]);
    const query = inputTitle;
    setInputTitle('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/chat/ask', { query });
      
      const botMessage = {
        text: data.chatResponse.content,
        sender: 'AI',
        isFallback: data.ticketCreated,
        ticketDetails: data.ticketDetails
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Network error occurred while connecting our servers.", sender: 'AI' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white">
      {/* Messages Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-stone-50 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-stone-400 mt-16 px-4">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center border border-stone-100 shadow-sm mb-4 opacity-70">
               <HelpCircle size={32} className="text-stone-300" />
            </div>
            <p className="font-medium text-stone-600">I'm your HR buddy.</p>
            <p className="text-sm mt-1">Ask me anything about company guidelines, time-off, or benefits!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.sender === 'User' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1 shadow-sm ${msg.sender === 'User' ? 'ml-3' : 'mr-3 bg-white'}`}>
                {msg.sender === 'User' ? 
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=user" alt="You" /> : 
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=hrbot" alt="HR" className="p-1" />
                }
              </div>
              
              <div className="flex flex-col">
                <span className={`text-[11px] font-semibold text-stone-400 mb-1 ${msg.sender === 'User' ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.sender === 'User' ? 'You' : 'HR Buddy'}
                </span>
                <div className={`px-5 py-3 shadow-sm ${msg.sender === 'User' ? 'bg-stone-800 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-stone-700 border border-stone-200 rounded-2xl rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
                
                {msg.isFallback && (
                  <div className="mt-2 bg-orange-50 border border-orange-100 rounded-xl p-3.5 text-sm flex items-start shadow-sm ml-1">
                    <AlertCircle className="text-orange-500 mr-2.5 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-orange-800">
                      <strong className="font-semibold text-orange-900 block mb-0.5">We've got our humans on it!</strong>
                      <p className="opacity-90">I've forwarded this question directly to our actual HR team to assist you properly.</p>
                      {msg.ticketDetails && (
                        <div className="mt-2 text-xs font-mono bg-white/60 px-2 py-1 inline-block rounded border border-orange-200/50">
                          Ref: #{msg.ticketDetails._id.slice(-6)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="flex max-w-[85%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1 shadow-sm mr-3 bg-white">
                 <img src="https://api.dicebear.com/7.x/notionists/svg?seed=hrbot" alt="HR" className="p-1" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-stone-400 mb-1 ml-1">HR Buddy is typing</span>
                <div className="px-5 py-4 bg-white border border-stone-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1.5 w-16">
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-100">
        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-full pr-2 pl-2 focus-within:ring-2 focus-within:ring-rose-500/50 focus-within:border-rose-500 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm text-stone-800 placeholder:text-stone-400"
            placeholder="Type your message..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputTitle.trim() || loading}
            className={`p-2 rounded-full flex items-center justify-center transition-all shadow-sm
              ${!inputTitle.trim() || loading ? 'bg-stone-100 text-stone-300' : 'bg-stone-800 text-white hover:bg-stone-700 hover:scale-105 active:scale-95'}`}
          >
            <Send size={16} className={inputTitle.trim() ? "ml-0.5" : ""} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
