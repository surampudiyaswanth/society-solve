import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Building,
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const rolePresets = {
    citizen: {
      title: 'Citizen Portal',
      desc: 'Report community issues and track progress in real-time.',
      emailPlaceholder: 'citizen@societysolve.org',
    },
    university: {
      title: 'University Portal',
      desc: 'Browse challenges, lead research teams, and propose solutions.',
      emailPlaceholder: 'university@societysolve.org',
    },
    industry: {
      title: 'Industry Partner Portal',
      desc: 'Offer mentorship, technology, and funding to university projects.',
      emailPlaceholder: 'industry@societysolve.org',
    },
    government: {
      title: 'Government Portal',
      desc: 'Review civic challenges, assign departments, and verify implementation.',
      emailPlaceholder: 'gov@societysolve.org',
    },
    admin: {
      title: 'Platform Admin',
      desc: 'System governance, verification, and ecosystem analytics.',
      emailPlaceholder: 'admin@societysolve.org',
    },
  };

  const handleTabSwitch = (role) => {
    setActiveTab(role);
    setError(null);
  };

  const resolveDashboard = (role) => {
    if (getDashboardPath) {
      const path = getDashboardPath(role);
      if (path) return path;
    }
    switch (role) {
      case 'government':
        return '/government';
      case 'admin':
        return '/admin';
      case 'university':
        return '/university';
      case 'industry':
        return '/industry';
      default:
        return '/citizen';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(resolveDashboard(user?.role || activeTab));
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError(null);
    setDemoLoading(true);
    try {
      const user = await demoLogin(role);
      navigate(resolveDashboard(user?.role || role));
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure SocietySolve Authentication</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Sign In to Your Account</h1>
          <p className="text-sm text-slate-400">
            {rolePresets[activeTab]?.desc}
          </p>
        </div>

        {/* 5 Role Tabs */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { id: 'citizen', label: 'Citizen', icon: Users },
            { id: 'university', label: 'University', icon: GraduationCap },
            { id: 'industry', label: 'Industry', icon: Building2 },
            { id: 'government', label: 'Government', icon: Building },
            { id: 'admin', label: 'Admin', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSwitch(tab.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-md space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={rolePresets[activeTab]?.emailPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Login Panel */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-teal-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Beginner 1-Click Demo Login</span>
              </span>
              <span className="text-[10px] text-slate-500">Auto-seeds sample account</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                disabled={demoLoading}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left text-xs text-slate-300 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span className="truncate">Citizen Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('university')}
                disabled={demoLoading}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left text-xs text-slate-300 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">University Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('industry')}
                disabled={demoLoading}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left text-xs text-slate-300 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="truncate">Industry Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('government')}
                disabled={demoLoading}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left text-xs text-slate-300 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                <span className="truncate">Government Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={demoLoading}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left text-xs text-slate-300 transition-colors flex items-center space-x-2 cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="truncate">Admin Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-4">
            Register as Citizen, University, Industry, or Government
          </Link>
        </p>
      </div>
    </div>
  );
}