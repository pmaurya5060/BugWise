import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, Cpu, Code2, Bug, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile/analytics')
      .then(res => setAnalytics(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading real-data metrics...</div>;
  if (!analytics) return <div className="p-8 text-center text-red-400">Failed to load analytics data.</div>;

  const categoryData = Object.keys(analytics.categoryCounts || {}).map(key => ({ name: key, count: analytics.categoryCounts[key] }));
  const languageData = Object.keys(analytics.languageCounts || {}).map(key => ({ name: key, value: analytics.languageCounts[key] }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Real-Data Bug Analytics</h1>
        <p className="text-slate-400">Comprehensive intelligence insights aggregated from your MongoDB analysis history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
          <Bug className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-slate-400 text-sm">Total Analyzed Bugs</p>
            <h3 className="text-2xl font-bold text-white">{analytics.totalAnalyses}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-slate-400 text-sm">Security Risks Detected</p>
            <h3 className="text-2xl font-bold text-white">{analytics.securityRisksFound}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
          <Code2 className="w-10 h-10 text-emerald-500" />
          <div>
            <p className="text-slate-400 text-sm">Languages Analyzed</p>
            <h3 className="text-2xl font-bold text-white">{languageData.length}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center space-x-4">
          <Activity className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-slate-400 text-sm">Bug Categories</p>
            <h3 className="text-2xl font-bold text-white">{categoryData.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Bugs by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Language Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languageData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {languageData.map((entry, index) => (
                    <Cell key={cell-} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}