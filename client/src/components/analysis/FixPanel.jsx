import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import CodeBlock from '../CodeBlock';
import DiffViewer from '../DiffViewer';

export default function FixPanel({ analysis }) {
  const result = analysis.result;
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suggested Fix
        </h4>
        <p className="text-sm text-slate-300">{result.suggestedFix}</p>
      </div>

      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Why This Fix Works</h4>
        <p className="text-sm text-slate-300 leading-relaxed">{result.whyItWorks}</p>
      </div>

      {result.correctedCode && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            Code Diff Before & After
          </h4>
          <DiffViewer oldCode={analysis.errorInput} newCode={result.correctedCode} language={analysis.language} />
        </div>
      )}

      {/* Alternative Solutions */}
      {result.alternativeSolutions?.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alternative Fixes</h4>
          <div className="space-y-4">
            {result.alternativeSolutions.map((alt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h5 className="font-bold text-sm text-indigo-300">{alt.title}</h5>
                <p className="text-sm text-slate-400">{alt.explanation}</p>
                {alt.code && <CodeBlock code={alt.code} language={analysis.language} title="Alternative Code" />}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong className="text-emerald-400">Pros:</strong> <span className="text-slate-300">{alt.advantages}</span></div>
                  <div><strong className="text-rose-400">Cons:</strong> <span className="text-slate-300">{alt.disadvantages}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.preventionTips?.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Future Prevention Tips
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.preventionTips.map((tip, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
