import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Info, Sparkles, History, Loader2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MonacoEditor from '../components/MonacoEditor';
import OverviewPanel from '../components/analysis/OverviewPanel';
import FixPanel from '../components/analysis/FixPanel';
import SecurityPerformancePanel from '../components/analysis/SecurityPerformancePanel';
import TestsPanel from '../components/analysis/TestsPanel';
import LearningPanel from '../components/analysis/LearningPanel';
import InterviewPanel from '../components/analysis/InterviewPanel';
import ChatDrawer from '../components/analysis/ChatDrawer';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Other'];
const TABS = ['Overview', 'Fix & Diff', 'Security & Perf', 'Tests', 'Learning', 'Interview'];

const DashboardPage = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [errorInput, setErrorInput] = useState('');
  const [context, setContext] = useState({ goal: '', expected: '', actual: '', relevantCode: '' });
  const [showContext, setShowContext] = useState(false);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [copiedExp, setCopiedExp] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!errorInput.trim()) return;

    setAnalyzing(true);
    setError('');
    setCurrentAnalysis(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/analyses',
        { language, errorInput, context },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentAnalysis(response.data.data);
      setActiveTab('Overview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze bug. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const copyFullExplanation = () => {
    if (!currentAnalysis) return;
    const textToCopy = `Summary: ${currentAnalysis.result.summary}\n\nRoot Cause: ${currentAnalysis.result.rootCause}\n\nSuggested Fix:\n${currentAnalysis.result.suggestedFix}\n\nCode:\n${currentAnalysis.result.correctedCode}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedExp(true);
    setTimeout(() => setCopiedExp(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#02040a] relative overflow-x-hidden pt-[72px] selection:bg-indigo-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        <div className="absolute top-[-10%] w-[120vw] h-[50vh] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-violet-900/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              Bug Analyzer Dashboard
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">AI Active</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Submit code errors or stack traces to generate structured root-cause explanations and solutions.</p>
          </div>
          <Link to="/history" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-sm font-medium transition-colors">
            <History className="w-4 h-4 text-indigo-400" /> View Analysis History
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleAnalyze} className="glass-panel p-6 border border-slate-800 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Programming Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 font-medium focus:border-indigo-500 focus:outline-none">
                  {LANGUAGES.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Stack Trace / Error / Code Input *</span>
                  <span className="text-[11px] text-slate-500 font-normal">Monaco Editor</span>
                </label>
                <MonacoEditor 
                  value={errorInput} 
                  onChange={(val) => setErrorInput(val || '')} 
                  language={language}
                  height="250px"
                />
              </div>

              <div>
                <button type="button" onClick={() => setShowContext(!showContext)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {showContext ? 'Hide Optional Context' : '+ Add Optional Debugging Context'}
                </button>
              </div>

              {showContext && (
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <input type="text" value={context.goal} onChange={(e) => setContext({ ...context, goal: e.target.value })} placeholder="Goal: e.g. Fetch users" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" />
                  <input type="text" value={context.expected} onChange={(e) => setContext({ ...context, expected: e.target.value })} placeholder="Expected Behavior" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" />
                  <input type="text" value={context.actual} onChange={(e) => setContext({ ...context, actual: e.target.value })} placeholder="Actual Behavior" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200" />
                </div>
              )}

              <button type="submit" disabled={analyzing} className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {analyzing ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Analyzing Bug with AI...</span></> : <><Sparkles className="w-5 h-5" /><span>Analyze Bug</span></>}
              </button>
            </form>

            {error && <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-sm text-rose-400">{error}</div>}
          </div>

          <div className="lg:col-span-7">
            {currentAnalysis ? (
              <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Floating Chat Button */}
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4" /> Follow-up
                </button>

                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/50 p-2 pr-24 scrollbar-hide">
                  {TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'Overview' && <OverviewPanel analysis={currentAnalysis} />}
                  {activeTab === 'Fix & Diff' && <FixPanel analysis={currentAnalysis} />}
                  {activeTab === 'Security & Perf' && <SecurityPerformancePanel analysis={currentAnalysis} />}
                  {activeTab === 'Tests' && <TestsPanel analysis={currentAnalysis} />}
                  {activeTab === 'Learning' && <LearningPanel analysis={currentAnalysis} />}
                  {activeTab === 'Interview' && <InterviewPanel analysis={currentAnalysis} />}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500"><Terminal className="w-10 h-10" /></div>
                <h3 className="text-xl font-bold text-white">No Analysis Selected</h3>
                <p className="text-sm text-slate-400 max-w-md">Select a language, paste your stack trace or error log on the left panel, and click <strong className="text-slate-200">Analyze Bug</strong> to generate an instant root cause report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Drawer Phase 16 */}
      <ChatDrawer analysis={currentAnalysis} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
export default DashboardPage;
