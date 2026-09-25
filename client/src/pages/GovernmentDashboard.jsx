import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Users, 
  Search, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function GovernmentDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/problems');
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (err) {
      console.error('Error loading problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleUpdateStatus = async (problemId, status, note) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/problems/${problemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status, note })
      });
      const data = await res.json();
      if (data.success) {
        fetchProblems();
      } else {
        alert(data.message || 'Status transition failed');
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const safeProblems = Array.isArray(problems) ? problems : [];

  const filtered = safeProblems.filter((p) => {
    const matchCat = filterDept === 'All' || p.category === filterDept;
    const matchSearch =
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.problemId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-800 text-sky-400 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Civic Governance & Municipal Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Government Authority Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Department verification, public resource allocation, and field implementation monitoring.
          </p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">Logged Authority</span>
          <span className="font-mono text-sm text-sky-400 font-bold">{user?.name || 'Municipal Officer'}</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Pending Review</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {safeProblems.filter((p) => p.status === 'Submitted' || p.status === 'Under Review').length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Active Solutions</span>
          <p className="text-2xl font-black text-teal-400 mt-1">
            {safeProblems.filter((p) => ['Accepted', 'University Assigned', 'Solution Development', 'Industry Collaboration'].includes(p.status)).length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Pilot Field Tests</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">
            {safeProblems.filter((p) => p.status === 'Pilot Implementation').length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">Resolved Challenges</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {safeProblems.filter((p) => p.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Title, ID, or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Department:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Departments</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Environment">Environment & Sanitation</option>
            <option value="Transportation">Transportation</option>
            <option value="Public Safety">Public Safety</option>
          </select>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Civic Action & Verification Queue</h3>
          <span className="text-xs font-mono text-slate-400">{filtered.length} Cases Active</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading civic cases...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No issues found matching criteria.</div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filtered.map((item) => (
              <div key={item._id || item.problemId} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-800/30 transition">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-sky-400 font-bold bg-sky-950/60 px-2.5 py-0.5 rounded-lg border border-sky-800">
                      {item.problemId}
                    </span>
                    <span className="text-xs text-slate-300 font-medium bg-slate-800 px-2.5 py-0.5 rounded-lg">
                      {item.category}
                    </span>
                    <span className="text-xs text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-800">
                      {item.status} ({item.progress || 10}%)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {item.city || 'Regional'}, {item.state || ''}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> {item.peopleAffected || 10}+ Citizens</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {item.status === 'Submitted' && (
                    <button
                      onClick={() => handleUpdateStatus(item.problemId, 'Accepted', 'Verified and accepted by municipal department.')}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition cursor-pointer"
                    >
                      Verify & Accept
                    </button>
                  )}

                  {item.status === 'Pilot Implementation' && (
                    <button
                      onClick={() => handleUpdateStatus(item.problemId, 'Implemented', 'Civic department verified field deployment.')}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                    >
                      Verify #8 Implemented
                    </button>
                  )}

                  {item.status === 'Impact Measured' && (
                    <button
                      onClick={() => handleUpdateStatus(item.problemId, 'Resolved', 'Final municipal inspection completed and closed.')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer"
                    >
                      Close as #10 Resolved
                    </button>
                  )}

                  <Link
                    to={`/problems/${item.problemId}`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1 transition"
                  >
                    View Pipeline <ArrowUpRight className="w-3 h-3" />
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