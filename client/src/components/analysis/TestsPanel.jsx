import React from 'react';
import { TestTube2 } from 'lucide-react';
import CodeBlock from '../CodeBlock';

export default function TestsPanel({ analysis }) {
  const test = analysis.result.regressionTest;
  
  if (!test || !test.testCode) {
    return (
      <div className="p-6 text-center text-slate-400 border border-slate-800 rounded-xl border-dashed">
        No regression test generated for this issue.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          {test.framework} Test
        </span>
        <h3 className="text-sm font-bold text-slate-200">Regression Test Suite</h3>
      </div>
      
      <p className="text-sm text-slate-300">
        <strong>Verifies:</strong> {test.verifies}
      </p>

      {test.edgeCases?.length > 0 && (
        <div className="text-sm text-slate-400">
          <strong>Covers edge cases:</strong> {test.edgeCases.join(', ')}
        </div>
      )}

      <CodeBlock code={test.testCode} language={analysis.language} title="Regression Test Code" />
    </div>
  );
}
