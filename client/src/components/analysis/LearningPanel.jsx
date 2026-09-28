import React from 'react';
import { BookOpen } from 'lucide-react';

export default function LearningPanel({ analysis }) {
  const teachMe = analysis.result.teachMe;

  if (!teachMe || !teachMe.concept) {
    return <div className="p-6 text-center text-slate-400 border border-slate-800 rounded-xl border-dashed">No learning materials available for this issue.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
        <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5" /> Core Concept: {teachMe.concept}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{teachMe.simpleExplanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
          <h4 className="font-bold text-sm text-rose-400">Why the original code failed</h4>
          <p className="text-sm text-slate-300">{teachMe.whyCodeFailed}</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
          <h4 className="font-bold text-sm text-emerald-400">Real World Usage</h4>
          <p className="text-sm text-slate-300">{teachMe.realWorldUsage}</p>
        </div>
      </div>

      {teachMe.commonMistakes?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Common Mistakes</h4>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            {teachMe.commonMistakes.map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {teachMe.levels && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deep Dive</h4>
          <div className="space-y-3">
            {teachMe.levels.beginner && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800"><span className="text-xs font-bold text-emerald-400 block mb-1">Beginner</span><span className="text-sm text-slate-300">{teachMe.levels.beginner}</span></div>
            )}
            {teachMe.levels.intermediate && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800"><span className="text-xs font-bold text-amber-400 block mb-1">Intermediate</span><span className="text-sm text-slate-300">{teachMe.levels.intermediate}</span></div>
            )}
            {teachMe.levels.advanced && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800"><span className="text-xs font-bold text-rose-400 block mb-1">Advanced</span><span className="text-sm text-slate-300">{teachMe.levels.advanced}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
