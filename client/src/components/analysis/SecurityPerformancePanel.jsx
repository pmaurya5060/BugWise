import React from 'react';
import { Shield, Zap, CheckCircle } from 'lucide-react';
import CodeBlock from '../CodeBlock';

export default function SecurityPerformancePanel({ analysis }) {
  const security = analysis.result.securityScan;
  const performance = analysis.result.performanceScan;

  return (
    <div className="space-y-8">
      {/* Security Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-400" /> Security Analysis
        </h3>
        {security?.hasIssues && security.issues?.length > 0 ? (
          <div className="space-y-3">
            {security.issues.map((issue, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    issue.severity === 'High' || issue.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                    issue.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>{issue.severity}</span>
                  <h4 className="font-semibold text-sm text-slate-200">{issue.issue}</h4>
                </div>
                <p className="text-sm text-slate-400">{issue.explanation}</p>
                <div className="text-sm text-emerald-400 bg-emerald-950/20 p-2 rounded-lg mt-2 border border-emerald-500/20">
                  <strong>Mitigation:</strong> {issue.mitigation}
                </div>
              </div>
            ))}
            {security.disclaimer && <p className="text-xs text-slate-500 italic mt-2">{security.disclaimer}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">No obvious security vulnerabilities detected in the analyzed snippet.</span>
          </div>
        )}
      </div>

      {/* Performance Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Performance Scan
        </h3>
        {performance?.hasIssues && performance.findings?.length > 0 ? (
          <div className="space-y-4">
            {performance.findings.map((finding, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-sm text-amber-300">{finding.problem}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong className="text-slate-400">Complexity:</strong> <span className="text-slate-300">{finding.complexity}</span></div>
                  <div><strong className="text-slate-400">Impact:</strong> <span className="text-slate-300">{finding.whyItMatters}</span></div>
                </div>
                <p className="text-sm text-slate-300 pt-2 border-t border-slate-800">
                  <strong>Improvement:</strong> {finding.improvement}
                </p>
                {finding.optimizedCode && <CodeBlock code={finding.optimizedCode} language={analysis.language} title="Optimized Suggestion" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">No significant performance bottlenecks identified.</span>
          </div>
        )}
      </div>
    </div>
  );
}
