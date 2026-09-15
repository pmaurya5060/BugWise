import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CodeBlock from '../components/CodeBlock';
import {
  Search,
  Filter,
  History,
  Trash2,
  Eye,
  Calendar,
  Code2,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

const LANGUAGES = [
  'All',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'PHP',
  'SQL',
  'Other'
];

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  
  const [activeItem, setActiveItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, [selectedLanguage]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedLanguage !== 'All') {
        params.language = selectedLanguage;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await api.get('/analyses', { params });
      if (response.data.success) {
        setAnalyses(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analysis history');
    } fontFinally: {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnalyses();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis from your history?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await api.delete(`/analyses/${id}`);
      if (response.data.success) {
        setAnalyses(analyses.filter((a) => a._id !== id));
        if (activeItem?._id === id) {
          setActiveItem(null);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete analysis');
    } finally {
      setDeletingId(null);
    }
  };

  const copyDetailExplanation = () => {
    if (!activeItem || !activeItem.result) return;
    const res = activeItem.result;
    const text = `AI Bug Analysis Report (${activeItem.language})\nSummary: ${res.summary}\nRoot Cause: ${res.rootCause}\nSuggested Fix: ${res.suggestedFix}\nCorrected Code:\n${res.correctedCode}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <History className="w-7 h-7 text-indigo-400" />
              Analysis History
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review and search all previous bug analyses tied to your account.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stack traces, errors, or root causes..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
          </form>

          {/* Language Pills / Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400">Loading analysis history...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
            {error}
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass-panel p-12 border border-slate-800 text-center space-y-4">
            <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 w-fit mx-auto">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Analyses Found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {searchTerm || selectedLanguage !== 'All'
                ? 'No saved analyses match your active search filters.'
                : 'You have not analyzed any bugs yet. Use the Bug Analyzer dashboard to create your first analysis.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((item) => (
              <div
                key={item._id}
                className="glass-panel p-5 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-semibold">
                      {item.language}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base line-clamp-2 leading-snug">
                    {item.result?.summary || 'Analysis Record'}
                  </h3>

                  <p className="text-xs text-slate-400 font-mono line-clamp-3 bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                    {item.errorInput}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setActiveItem(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20 border border-indigo-500/30 text-xs font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>

                  <button
                    onClick={(e) => handleDelete(item._id, e)}
                    disabled={deletingId === item._id}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete analysis"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Detail View */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-700 shadow-2xl relative space-y-6">
              
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                    {activeItem.language}
                  </span>
                  <span className="text-xs text-slate-500">
                    Created {new Date(activeItem.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white pt-1">
                  {activeItem.result?.summary}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-[#080b12] border border-slate-800 font-mono text-xs text-slate-300">
                <p className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Submitted Error / Snippet:</p>
                <pre className="whitespace-pre-wrap">{activeItem.errorInput}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">What Went Wrong</h4>
                  <p className="text-sm text-slate-300">{activeItem.result?.whatWentWrong}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Root Cause</h4>
                  <p className="text-sm text-slate-300">{activeItem.result?.rootCause}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Suggested Fix</h4>
                <p className="text-sm text-slate-300">{activeItem.result?.suggestedFix}</p>
                {activeItem.result?.correctedCode && (
                  <CodeBlock
                    code={activeItem.result.correctedCode}
                    language={activeItem.language}
                    title="Corrected Solution"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={copyDetailExplanation}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-400" />
                      <span>Copy Report</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
