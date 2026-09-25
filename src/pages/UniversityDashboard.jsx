import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProblems } from '../services/problemService';
import { getSolutions, getUniversityStats } from '../services/solutionService';
import { SOCIETAL_CATEGORIES } from '../data/categoriesData';
import ClaimProblemModal from '../components/forms/ClaimProblemModal';
import SolutionProposalModal from '../components/forms/SolutionProposalModal';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Building2, 
  FolderGit2, 
  Users, 
  CheckCircle, 
  Lightbulb, 
  ArrowRight,
  Search,
  Filter,
  PlusCircle,
  Clock,
  DollarSign,
  Cpu,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UniversityDashboard() {
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'projects' | 'solutions'
  const [stats, setStats] = useState({
    totalProblems: 0,
    newProblems: 0,
    problemsUnderReview: 0,
    activeProjects: 0,
    completedSolutions: 0,
    industryCollaborations: 0,
    impactGenerated: 0,
  });

  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states for Browse tab
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');

  // Modals state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [solutionModalOpen, setSolutionModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, problemsRes, solutionsRes] = await Promise.all([
        getUniversityStats().catch(() => ({ stats: {} })),
        getProblems({ search, category, severity }),
        getSolutions(),
      ]);

      if (statsRes?.stats) {
        setStats(statsRes.stats);
      }
      setProblems(problemsRes.problems || []);
      setSolutions(solutionsRes.solutions || []);
    } catch (err) {
      console.error('Error loading university data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category, severity]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenClaim = (problem) => {
    setSelectedProblem(problem);
    setClaimModalOpen(true);
  };

  const handleOpenSolution = (problem) => {
    setSelectedProblem(problem);
    setSolutionModalOpen(true);
  };

  // Filter our active projects (claimed or in progress)
  const activeProjectsList = problems.filter(
    (p) =>
      p.status === 'University Assigned' ||
      p.status === 'Solution Development' ||
      p.status === 'Industry Collaboration' ||
      p.status === 'Pilot Implementation'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Research & Innovation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {profile?.universityName || user?.name || 'National Institute of Technology'}
          </h1>
          <p className="text-slate-400 text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{profile?.location || 'Bengaluru, Karnataka'} &bull; Coordinator: <span className="text-slate-200 font-semibold">{user?.name}</span></span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 7 CORE UNIVERSITY METRICS (Required by Section 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total Problems', value: stats.totalProblems || problems.length, icon: Lightbulb, color: 'text-blue-400' },
          { label: 'New Problems', value: stats.newProblems || 0, icon: Sparkles, color: 'text-cyan-400' },
          { label: 'Under Review', value: stats.problemsUnderReview || 0, icon: Clock, color: 'text-amber-400' },
          { label: 'Active Projects', value: stats.activeProjects || activeProjectsList.length, icon: FolderGit2, color: 'text-teal-400' },
          { label: 'Completed Solutions', value: stats.completedSolutions || 0, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Industry Collabs', value: stats.industryCollaborations || 0, icon: Building2, color: 'text-purple-400' },
          { label: 'Impact Generated', value: `${(stats.impactGenerated || 3800).toLocaleString()}+`, icon: Users, color: 'text-rose-400' },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider line-clamp-1">
                  {metric.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
              </div>
              <p className="text-xl font-black text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'browse', label: 'Browse Societal Challenges', icon: Search, count: problems.length },
          { id: 'projects', label: 'Our Active Projects', icon: FolderGit2, count: activeProjectsList.length },
          { id: 'solutions', label: 'Proposed Solutions', icon: Lightbulb, count: solutions.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 flex items-center space-x-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BROWSE PROBLEMS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search challenges by keyword, location, or Problem ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </form>

            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="All">All Categories</option>
                {SOCIETAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((p) => (
              <div
                key={p._id || p.problemId}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-xl border border-teal-800">
                      {p.problemId}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{p.category}</span>
                    <h3 className="font-bold text-white text-base leading-snug mt-0.5 line-clamp-2">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p.city}, {p.state}</span>
                    </div>
                    <span className="text-slate-300">{p.peopleAffected || 10}+ Affected</span>
                  </div>

                  {/* University Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenClaim(p)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Claim Challenge</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenSolution(p)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Propose Solution</span>
                    </button>
                  </div>

                  <Link
                    to={`/problems/${p.problemId}`}
                    className="block text-center text-[11px] text-teal-400 hover:text-teal-300 pt-1"
                  >
                    View Timeline & Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {activeProjectsList.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">No active projects claimed yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Switch to "Browse Societal Challenges" and click "Claim Challenge" to assign faculty and student teams.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeProjectsList.map((proj) => (
                <div
                  key={proj._id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-xl border border-teal-800">
                      {proj.problemId}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{proj.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                  </div>

                  {/* Faculty & Students Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Academic Lead: <span className="text-white font-semibold">Prof. Radhika Rao</span></span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>Research Team: <span className="text-slate-400 font-mono">Arjun V., Meera S.</span></span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Development Progress</span>
                      <span className="text-teal-400 font-bold">{proj.progress || 40}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${proj.progress || 40}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenSolution(proj)}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Propose Solution Blueprint
                    </button>
                    <Link
                      to={`/problems/${proj.problemId}`}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Track Challenge &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROPOSED SOLUTIONS */}
      {activeTab === 'solutions' && (
        <div className="space-y-4">
          {solutions.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <Lightbulb className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">No solutions proposed yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Propose a technology solution for any societal challenge to seek industry sponsorship.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {solutions.map((sol) => (
                <div
                  key={sol._id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-xl border border-teal-800">
                      {sol.problemId}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {sol.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{sol.solutionTitle}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sol.description}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-start space-x-2">
                      <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 font-mono text-[11px]">{sol.proposedTechnology}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-slate-400">
                      <span>Est. Cost: <strong className="text-emerald-400">${sol.estimatedCost?.toLocaleString()}</strong></span>
                      <span>Timeline: <strong className="text-white">{sol.timeline}</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
                    <span>Faculty: <strong className="text-white">{sol.leadFaculty}</strong></span>
                    <Link
                      to={`/problems/${sol.problemId}`}
                      className="text-teal-400 hover:text-teal-300 font-semibold"
                    >
                      View Linked Challenge &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claim Problem Modal */}
      <ClaimProblemModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        problem={selectedProblem}
        onClaimSuccess={loadData}
        defaultFaculty={user?.name}
      />

      {/* Solution Proposal Modal */}
      <SolutionProposalModal
        isOpen={solutionModalOpen}
        onClose={() => setSolutionModalOpen(false)}
        problem={selectedProblem}
        onSolutionSubmitted={loadData}
        defaultFaculty={user?.name}
      />
    </div>
  );
}
