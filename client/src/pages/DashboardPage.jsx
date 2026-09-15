import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CodeBlock from '../components/CodeBlock';
import {
  Sparkles,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  History,
  Loader2,
  ChevronDown,
  Info,
  ShieldCheck,
  ListChecks,
  ArrowRight
} from 'lucide-react';

const LANGUAGES = [
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

const DashboardPage = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [errorInput, setErrorInput] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState({
    goal: '',
    expected: '',
    actual: '',
    relevantCode: ''
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [copiedExp, setCopiedExp] = useState(false);

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await api.get('/analyses');
      if (response.data.success) {
        setRecentAnalyses(response.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load recent analyses:', err);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!errorInput.trim()) {
      setApiError('Please enter a stack trace, error log, or code snippet.');
      return;
    }

    try {
      setAnalyzing(true);
      setCurrentAnalysis(null);

      const response = await api.post('/analyses', {
        language,
        errorInput,
        context
      });

      if (response.data.success) {
        setCurrentAnalysis(response.data.data);
        fetchRecentAnalyses();
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Failed to complete analysis. Please try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const copyFullExplanation = () => {
    if (!currentAnalysis || !currentAnalysis.result) return;
    const res = currentAnalysis.result;

    const text = `AI Bug Explainer Report (${currentAnalysis.language})
------------------------------------------------
SUMMARY:
${res.summary}

WHAT WENT WRONG:
${res.whatWentWrong}

ROOT CAUSE:
${res.rootCause}

LIKELY CAUSES:
${res.likelyCauses.map(c => `- ${c}`).join('\n')}

STEP-BY-STEP DEBUGGING:
${res.debuggingSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

SUGGESTED FIX:
${res.suggestedFix}

CORRECTED CODE:
${res.correctedCode}

WHY THIS FIX WORKS:
${res.whyItWorks}

PREVENTION TIPS:
${res.preventionTips.map(p => `- ${p}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedExp(true);
    setTimeout(() => setCopiedExp(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              Bug Analyzer Dashboard
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                AI Active
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Submit code errors or stack traces to generate structured root-cause explanations and solutions.
            </p>
          </div>
          <Link
            to="/history"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-sm font-medium transition-colors"
          >
            <History className="w-4 h-4 text-indigo-400" />
            View Analysis History
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form & Input Section (5 cols or full on mobile) */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleAnalyze} className="glass-panel p-6 border border-slate-800 space-y-5">
              
              {/* Language Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Programming Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Main Code/Error Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Stack Trace / Error / Code Input *</span>
                  <span className="text-[11px] text-slate-500 font-normal">Raw terminal log or code</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  placeholder={`Paste error log, exception trace, or buggy snippet here...
Example:
Uncaught TypeError: Cannot read property 'map' of undefined at Component.jsx:15`}
                  className="w-full bg-[#080b12] border border-slate-800 rounded-xl p-4 text-sm font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
                />
              </div>

              {/* Optional Context Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowContext(!showContext)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 focus:outline-none"
                >
                  <Info className="w-3.5 h-3.5" />
                  {showContext ? 'Hide Optional Context' : '+ Add Optional Debugging Context'}
                </button>
              </div>

              {/* Optional Context Inputs */}
              {showContext && (
                <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      What were you trying to achieve?
                    </label>
                    <input
                      type="text"
                      value={context.goal}
                      onChange={(e) => setContext({ ...context, goal: e.target.value })}
                      placeholder="e.g. Fetch user profiles and display in a grid"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Expected Behavior
                      </label>
                      <input
                        type="text"
                        value={context.expected}
                        onChange={(e) => setContext({ ...context, expected: e.target.value })}
                        placeholder="e.g. Array of 10 users"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Actual Behavior
                      </label>
                      <input
                        type="text"
                        value={context.actual}
                        onChange={(e) => setContext({ ...context, actual: e.target.value })}
                        placeholder="e.g. Throws TypeError in console"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Relevant Code Snippet
                    </label>
                    <textarea
                      rows={3}
                      value={context.relevantCode}
                      onChange={(e) => setContext({ ...context, relevantCode: e.target.value })}
                      placeholder="Paste surrounding function or component code..."
                      className="w-full bg-[#080b12] border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Bug with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Bug</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Recent Analyses Sidebar */}
            <div className="glass-panel p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Recent Analyses</span>
                <Link to="/history" className="text-indigo-400 hover:underline text-[11px]">View All</Link>
              </h3>
              {recentAnalyses.length === 0 ? (
                <p className="text-xs text-slate-500 py-2 italic">No previous analyses yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentAnalyses.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setCurrentAnalysis(item)}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-200 block truncate">
                          {item.result?.summary || item.errorInput}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono">
                        {item.language}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Results Output Section (7 cols or full) */}
          <div className="lg:col-span-7">
            {analyzing ? (
              <div className="glass-panel p-12 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]">
                <div className="p-4 rounded-full bg-indigo-600/10 text-indigo-400 animate-pulse">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Generating AI Root Cause Breakdown</h3>
                <p className="text-sm text-slate-400 max-w-md">
                  Analyzing syntax tree, executing pattern matching, and structuring step-by-step fix for {language}...
                </p>
              </div>
            ) : currentAnalysis ? (
              <div className="glass-panel p-6 sm:p-8 border border-slate-800 space-y-6 animate-fadeIn">
                
                {/* Analysis Header & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                        {currentAnalysis.language}
                      </span>
                      <span className="text-xs text-slate-500">
                        Analyzed {new Date(currentAnalysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      {currentAnalysis.result.summary}
                    </h2>
                  </div>

                  <button
                    onClick={copyFullExplanation}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex-shrink-0"
                  >
                    {copiedExp ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied Full Report</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-indigo-400" />
                        <span>Copy Report</span>
                      </>
                    )}
                  </button>
                </div>

                {/* What Went Wrong & Root Cause */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> What Went Wrong
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentAnalysis.result.whatWentWrong}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Root Cause
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentAnalysis.result.rootCause}
                    </p>
                  </div>
                </div>

                {/* Likely Causes */}
                {currentAnalysis.result.likelyCauses?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Likely Triggering Factors
                    </h4>
                    <ul className="space-y-1.5">
                      {currentAnalysis.result.likelyCauses.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Step-by-Step Debugging Approach */}
                {currentAnalysis.result.debuggingSteps?.length > 0 && (
                  <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-emerald-400" />
                      Step-by-Step Debugging Plan
                    </h4>
                    <ol className="space-y-2">
                      {currentAnalysis.result.debuggingSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Suggested Fix & Corrected Code */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Suggested Fix & Corrected Snippet
                  </h4>
                  <p className="text-sm text-slate-300">
                    {currentAnalysis.result.suggestedFix}
                  </p>

                  {currentAnalysis.result.correctedCode && (
                    <CodeBlock
                      code={currentAnalysis.result.correctedCode}
                      language={currentAnalysis.language}
                      title={`Corrected ${currentAnalysis.language} Solution`}
                    />
                  )}
                </div>

                {/* Why It Works */}
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Why This Fix Works
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentAnalysis.result.whyItWorks}
                  </p>
                </div>

                {/* Prevention Tips */}
                {currentAnalysis.result.preventionTips?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      Future Prevention Tips
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentAnalysis.result.preventionTips.map((tip, idx) => (
                        <li key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div className="glass-panel p-12 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]">
                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                  <Terminal className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">No Analysis Selected</h3>
                <p className="text-sm text-slate-400 max-w-md">
                  Select a language, paste your stack trace or error log on the left panel, and click <strong className="text-slate-200">Analyze Bug</strong> to generate an instant root cause report.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
