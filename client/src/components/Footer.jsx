import React from 'react';
import { Bug, Terminal, ShieldCheck, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#080b12] text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-base">AI Bug Explainer</p>
              <p className="text-xs text-slate-500">Automated root-cause analysis for modern developers.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> React & Express</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> OpenAI AI Pipeline</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> JWT Auth</span>
          </div>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AI Bug Explainer. Production Portfolio Project.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
