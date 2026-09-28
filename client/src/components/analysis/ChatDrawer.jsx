import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import axios from 'axios';

export default function ChatDrawer({ analysis, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (analysis && analysis.chatHistory) {
      setMessages(analysis.chatHistory);
    }
  }, [analysis]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !analysis) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', message: userMsg }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/analyses/${analysis._id}/chat`, { userMessage: userMsg }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data.data); // Replace entirely with updated history
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', message: 'Error: Failed to reach AI assistant. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-50 transform transition-transform duration-300">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <h3 className="text-white font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> AI Follow-up Chat
        </h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080b12]">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-10">
            Ask any follow-up questions about this bug analysis.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>
            <div className={`p-3 rounded-2xl text-sm max-w-[75%] ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
              {msg.message}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><Bot className="w-4 h-4 text-indigo-400" /></div>
            <div className="p-4 rounded-2xl bg-slate-800 rounded-tl-none"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-[#080b12] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" disabled={!input.trim() || loading} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50 flex-shrink-0">
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
