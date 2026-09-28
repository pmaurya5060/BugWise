import React from 'react';
import { AlertTriangle, Sparkles, ListChecks } from 'lucide-react';

export default function OverviewPanel({ analysis }) {
  const result = analysis.result;
  
  return (
    <div className="space-y-6">
      {/* What Went Wrong & Root Cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> What Went Wrong
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{result.whatWentWrong}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Root Cause
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{result.rootCause}</p>
        </div>
      </div>

      {/* Root Cause Visual Timeline */}
      {analysis.rootCauseChain?.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Root Cause Timeline</h4>
          <div className="flex flex-col space-y-2">
            {analysis.rootCauseChain.map((node, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-300 font-bold">{idx + 1}</div>
                  {idx !== analysis.rootCauseChain.length - 1 && <div className="w-px h-6 bg-slate-700 my-1"></div>}
                </div>
                <div className="pt-0.5 text-sm text-slate-300">{node}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Likely Causes */}
      {result.likelyCauses?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Likely Triggering Factors</h4>
          <ul className="space-y-1.5">
            {result.likelyCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Debugging Steps */}
      {result.debuggingSteps?.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-emerald-400" /> Step-by-Step Debugging Plan
          </h4>
          <ol className="space-y-2">
            {result.debuggingSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
