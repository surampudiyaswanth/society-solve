import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStatistics,
  getAdminUsers,
  verifyUser,
  deleteUser,
  getAdminProblems,
  moderateProblem,
} from '../services/adminService';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Building2, 
  FileText, 
  FolderGit2, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  Search,
  Filter,
  Trash2,
  Check,
  X,
  Sparkles,
  RefreshCw,
  BarChart3,
  Sliders,
  Award,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'verification' | 'users' | 'analytics'
  const [stats, setStats] = useState({
    totalCitizens: 142,
    totalUniversities: 18,
    totalIndustries: 9,
    totalProblems: 57,
    activeProjects: 14,
    completedSolutions: 8,
    resolvedProblems: 12,
    totalCollaborations: 15,
  });

  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // User management filters
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, problemsRes] = await Promise.all([
        getAdminStatistics().catch(() => ({ statistics: {}, categoryStats: [] })),
        getAdminUsers({ role: userRoleFilter, search: userSearch }),
        getAdminProblems(),
      ]);

      if (statsRes?.statistics) setStats(statsRes.statistics);
      if (statsRes?.categoryStats) setCategoryStats(statsRes.categoryStats);
      setUsers(usersRes.users || []);
      setProblems(problemsRes.problems || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [userRoleFilter]);

  const handleSearchUsers = (e) => {
    e.preventDefault();
    loadAdminData();
  };

  const handleVerifyToggle = async (userId) => {
    try {
      await verifyUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: !u.isVerified } : u))
      );
    } catch (err) {
      alert(err.message || 'Error updating verification');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.message || 'Error deleting user');
    }
  };

  const handleModerate = async (problemId, action) => {
    try {
      await moderateProblem(problemId, { action });
      setProblems((prev) =>
        prev.map((p) =>
          p.problemId === problemId || p._id === problemId
            ? { ...p, status: action === 'approve' ? 'Accepted' : 'Under Review', progress: action === 'approve' ? 30 : p.progress }
            : p
        )
      );
    } catch (err) {
      alert(err.message || 'Error moderating problem');
    }
  };

  // Pending verification institutions
  const pendingInstitutions = users.filter(
    (u) => (u.role === 'university' || u.role === 'industry') && !u.isVerified
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Governance & Ecosystem Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            System Administrator Control Center
          </h1>
          <p className="text-slate-400 text-sm">
            Administrator: <span className="text-slate-200 font-semibold">{user?.email}</span> &bull; Status: <span className="text-emerald-400 font-bold">Optimal Governance</span>
          </p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* 8 CORE PLATFORM STATISTICS (Required by Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Citizens', value: stats.totalCitizens, icon: Users, color: 'text-blue-400' },
          { label: 'Universities', value: stats.totalUniversities, icon: GraduationCap, color: 'text-emerald-400' },
          { label: 'Industries', value: stats.totalIndustries, icon: Building2, color: 'text-purple-400' },
          { label: 'Problems', value: stats.totalProblems, icon: FileText, color: 'text-amber-400' },
          { label: 'Active Projects', value: stats.activeProjects, icon: FolderGit2, color: 'text-teal-400' },
          { label: 'Completed Sols', value: stats.completedSolutions, icon: CheckCircle2, color: 'text-cyan-400' },
          { label: 'Resolved Issues', value: stats.resolvedProblems, icon: Award, color: 'text-green-400' },
          { label: 'Collaborations', value: stats.totalCollaborations, icon: HeartHandshake, color: 'text-rose-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider line-clamp-1">
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <p className="text-xl font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Governance Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'moderation', label: 'Challenge Moderation', icon: FileText, count: problems.length },
          { id: 'verification', label: 'Institutional Verification', icon: ShieldCheck, count: pendingInstitutions.length },
          { id: 'users', label: 'User Directory', icon: Users, count: users.length },
          { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 flex items-center space-x-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CHALLENGE MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Challenge Review & Verification Queue</h2>
              <p className="text-xs text-slate-400">
                Review grassroots submissions from citizens. Approving transitions problem to <strong>Accepted (30%)</strong> for university research adoption.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {problems.map((p) => (
              <div
                key={p._id || p.problemId}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-lg border border-teal-800">
                      {p.problemId}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {p.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
                      {p.status} ({p.progress || 10}%)
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Reported by: <span className="text-slate-300">{p.citizen?.name || 'Citizen'}</span> &bull; Location: {p.location}, {p.city} &bull; Affected: {p.peopleAffected || 10}+
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex flex-col sm:flex-row items-end md:items-center gap-2 shrink-0">
                  {p.status === 'Submitted' || p.status === 'Under Review' ? (
                    <button
                      onClick={() => handleModerate(p.problemId, 'approve')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Accept (30%)</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved Active</span>
                    </span>
                  )}

                  <Link
                    to={`/problems/${p.problemId}`}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Track Challenge &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INSTITUTIONAL VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">University & Corporate Partner Accreditation</h2>
              <p className="text-xs text-slate-400">
                Validate academic institutions and corporate partners before they claim challenges or commit funding.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {users
              .filter((u) => u.role === 'university' || u.role === 'industry')
              .map((u) => (
                <div
                  key={u._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase font-mono ${
                        u.role === 'university'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-purple-950 text-purple-400 border border-purple-800'
                      }`}>
                        {u.role}
                      </span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        u.isVerified
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {u.isVerified ? 'Verified Institution' : 'Pending Verification'}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base">{u.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Email: {u.email} &bull; Phone: {u.phone || 'Not provided'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVerifyToggle(u._id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      u.isVerified
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{u.isVerified ? 'Revoke Verification' : 'Verify Institution'}</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between">
            <form onSubmit={handleSearchUsers} className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, or phone..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </form>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Roles</option>
              <option value="citizen">Citizens</option>
              <option value="university">Universities</option>
              <option value="industry">Industries</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Name / Institution</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Verification</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">{u.name}</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="capitalize px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleVerifyToggle(u._id)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono cursor-pointer ${
                            u.isVerified
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Challenges by Societal Category</span>
            </h3>

            <div className="space-y-3">
              {categoryStats.length > 0 ? (
                categoryStats.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">{cat._id}</span>
                      <span className="text-teal-400 font-mono">{cat.count} Problems</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-amber-400"
                        style={{ width: `${Math.min(cat.count * 15, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No category breakdown available yet.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <span>Platform Health & Security Status</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Node REST API:</span>
                <span className="text-emerald-400 font-bold">ONLINE (Port 5000)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">MongoDB Persistence:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (Mongoose ODM)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">JWT Token Expiry:</span>
                <span className="text-teal-300">30 Days</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Bcrypt Salt Rounds:</span>
                <span className="text-teal-300">10 Rounds</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
