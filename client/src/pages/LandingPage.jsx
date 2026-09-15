import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bug,
  Sparkles,
  Zap,
  Code2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Cpu,
  Layers,
  Terminal,
  FileCode,
  ListChecks,
  HelpCircle
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      title: "Instant Root Cause Analysis",
      description: "Cut debugging time by 80%. AI immediately isolates why your execution failed, distinguishing confirmed root causes from likely triggers."
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
      title: "Ready-to-Use Corrected Code",
      description: "Receive clean, language-preserved code snippets with copy support without unnecessary framework rewrites."
    },
    {
      icon: <ListChecks className="w-6 h-6 text-emerald-400" />,
      title: "Actionable Debugging Steps",
      description: "Follow clear, sequential troubleshooting steps designed specifically for your language ecosystem."
    },
    {
      icon: <Search className="w-6 h-6 text-pink-400" />,
      title: "Searchable Analysis History",
      description: "Save past debugging sessions in MongoDB. Quickly filter by language or query past stack traces."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: "Untrusted Code Protection",
      description: "Built with production security. User input is sanitized and analyzed safely without remote code execution."
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-amber-400" />,
      title: "Prevention & Best Practices",
      description: "Learn how to avoid similar exceptions with language-specific linting rules and defensive coding tips."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Paste Your Error or Code",
      description: "Select your programming language (JS, Python, Java, C++, Go, etc.) and paste stack traces, terminal logs, or failing code."
    },
    {
      step: "02",
      title: "AI Analysis Pipeline",
      description: "Our backend OpenAI service validates context, parses syntax structures, and performs structured JSON reasoning."
    },
    {
      step: "03",
      title: "Get Structured Fix & History",
      description: "View the root cause breakdown, step-by-step fix, corrected snippet, and save the result to your personal history."
    }
  ];

  const techStack = [
    { name: "React 18", category: "Frontend UI" },
    { name: "Tailwind CSS", category: "Styling & Layout" },
    { name: "Node.js & Express", category: "REST API Backend" },
    { name: "MongoDB & Mongoose", category: "Database Persistence" },
    { name: "OpenAI GPT-4", category: "AI Reasoning Pipeline" },
    { name: "JWT & Bcrypt", category: "Security & Auth" }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI-Powered Developer Debugging Assistant
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Stop Guessing Stack Traces. <br />
            <span className="gradient-text">Understand & Fix Bugs Fast.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI Bug Explainer turns cryptic runtime exceptions, stack traces, and failing code snippets into clear root-cause explanations and verified code fixes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Explain My Bug Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-center"
              >
                Sign In to Dashboard
              </Link>
            )}
          </div>

          {/* Interactive Code Preview Card */}
          <div className="mt-14 max-w-3xl mx-auto text-left glass-panel p-4 sm:p-6 border border-slate-700/60 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-300 font-semibold">TypeError: Cannot read property 'map' of undefined</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">JavaScript</span>
            </div>
            <div className="mt-3 font-mono text-xs text-rose-300/90 bg-[#080b12] p-3 rounded-lg overflow-x-auto">
              {`Uncaught TypeError: Cannot read properties of undefined (reading 'map')
  at UserList (UserList.jsx:14:22)
  at renderWithHooks (react-dom.development.js:16305)`}
            </div>
            <div className="mt-4 p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Sparkles className="w-4 h-4" /> AI Analysis Insight
              </div>
              <p className="text-slate-300">
                <strong className="text-white">Root Cause:</strong> Component attempted to call <code className="text-emerald-400">users.map()</code> while <code className="text-emerald-400">users</code> state was still <code className="text-amber-400">undefined</code> before API fetch completed.
              </p>
              <div className="text-emerald-400 font-mono text-[11px] pt-1">
                {`// Fix: Add default array fallback
const UserList = ({ users = [] }) => users.map(user => <UserCard key={user.id} {...user} />);`}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-b border-slate-800/80 bg-[#0d131f]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Modern Software Engineers
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Everything you need to debug stack traces, understand complex errors, and store solutions for future reference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 w-fit mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How It Works
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Three simple steps to resolve complex bugs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="glass-panel p-8 relative border border-slate-800">
                <span className="text-5xl font-extrabold text-indigo-500/20 absolute top-4 right-4 font-mono">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 mt-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-[#0d131f]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Production Full-Stack Architecture
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Engineered with clean separation of concerns, secure REST APIs, and structured AI response pipelines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="font-bold text-white text-base">{tech.name}</p>
                <p className="text-xs text-indigo-400 mt-1">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-slate-800 bg-gradient-to-b from-indigo-950/30 to-[#0b0f17]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to debug faster?
          </h2>
          <p className="text-slate-400 text-base mb-8">
            Create an account in seconds and analyze your first stack trace.
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all"
          >
            Start Debugging Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
