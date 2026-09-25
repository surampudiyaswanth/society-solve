import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../services/problemService';
import api from '../services/api';
import { SOCIETAL_CATEGORIES } from '../data/categoriesData';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Zap,
  SlidersHorizontal
} from 'lucide-react';

export default function ProblemDiscoveryPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [city, setCity] = useState('');

  const fetchFilteredProblems = async () => {
    try {
      setLoading(true);
      const res = await getProblems({
        search,
        category,
        severity,
        status,
        city,
      });
      setProblems(res.problems || []);
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProblems();
  }, [category, severity, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProblems();
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await api.post('/problems/seed-demo');
      await fetchFilteredProblems();
    } catch (err) {
      console.error('Error seeding problems:', err);
    } finally {
      setSeeding(false);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-400 border-rose-800';
      case 'High':
        return 'bg-orange-950/80 text-orange-400 border-orange-800';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      default:
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/80 text-teal-400 border border-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Problem Discovery Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Community Challenges
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Browse real-world societal problems crowdsourced by citizens, ready for university research and industry sponsorship.
          </p>
        </div>

        {/* Demo Seed Button (Beginner helper) */}
        <button
          onClick={handleSeedDemo}
          disabled={seeding}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs font-semibold border border-teal-500/40 transition-all self-start md:self-auto cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{seeding ? 'Generating Samples...' : 'Load Sample Challenges'}</span>
        </button>
      </div>

      {/* Search & Multi-Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, title, problem type, or ID (e.g. SS-2026-000101)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Filter by city / area..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All 8 Societal Domains</option>
              {SOCIETAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Resolution Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Accepted">Accepted</option>
              <option value="University Assigned">University Assigned</option>
              <option value="Solution Development">Solution Development</option>
              <option value="Industry Collaboration">Industry Collaboration</option>
              <option value="Pilot Implementation">Pilot Implementation</option>
              <option value="Implemented">Implemented</option>
              <option value="Impact Measured">Impact Measured</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Showing <span className="text-teal-400 font-bold">{problems.length}</span> verified challenges
          </span>
          <button
            onClick={fetchFilteredProblems}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-teal-400 flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Querying challenges...</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-300">No challenges matched your filter criteria</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try resetting your filters or click "Load Sample Challenges" above to populate realistic test data!
            </p>
            <button
              onClick={handleSeedDemo}
              className="px-4 py-2 rounded-xl bg-teal-600 text-slate-950 text-xs font-bold"
            >
              Load Sample Challenges
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((p) => (
              <div
                key={p._id || p.problemId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl hover:shadow-slate-950/60 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-xl border border-teal-800">
                      {p.problemId}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(p.severity)}`}>
                      {p.severity}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      {p.category}
                    </span>
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-teal-300 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{p.city}, {p.state}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{p.peopleAffected?.toLocaleString() || 10}+</span>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-300">{p.status}</span>
                      <span className="font-mono text-teal-400 font-bold">{p.progress || 10}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
                        style={{ width: `${p.progress || 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/problems/${p.problemId}`}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-teal-500"
                  >
                    <span>Track Challenge & Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
