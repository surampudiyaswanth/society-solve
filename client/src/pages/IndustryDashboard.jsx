import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProblems, updateProblemStatus } from '../services/problemService';
import { getSolutions } from '../services/solutionService';
import { getMyCollaborations, getIndustryStats } from '../services/collaborationService';
import SponsorSolutionModal from '../components/forms/SponsorSolutionModal';
import { SOCIETAL_CATEGORIES } from '../data/categoriesData';
import { 
  Building2, 
  MapPin, 
  Cpu, 
  DollarSign, 
  FolderGit2, 
  Users, 
  CheckCircle, 
  Briefcase, 
  TrendingUp,
  Search,
  Filter,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  RefreshCw,
  Rocket,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IndustryDashboard() {
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState('solutions');
  const [stats, setStats] = useState({
    availableProblems: 0,
    universityProjects: 0,
    activeCollaborations: 0,
    supportedProjects: 0,
    fundingContributions: 0,
    mentorshipActivities: 0,
    completedProjects: 0,
  });

  const [solutions, setSolutions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [myCollaborations, setMyCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deployingId, setDeployingId] = useState(null);

  // Modal State
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, solutionsRes, problemsRes, myCollabsRes] = await Promise.all([
        getIndustryStats().catch(() => ({ stats: {} })),
        getSolutions(),
        getProblems(),
        getMyCollaborations().catch(() => ({ collaborations: [] })),
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      setSolutions(solutionsRes.solutions || []);
      setProblems(problemsRes.problems || []);
      setMyCollaborations(myCollabsRes.collaborations || []);
    } catch (err) {
      console.error('Error loading industry dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSponsor = (item) => {
    setSelectedTarget(item);
    setSponsorModalOpen(true);
  };

  // Safe handler to advance to Stage 7
  const handleAuthorizePilot = async (solution) => {
    const targetId = solution.problemId || solution.problem?._id || solution._id;
    if (!targetId) return;

    try {
      setDeployingId(targetId);

      await updateProblemStatus(targetId, {
        status: 'Pilot Implementation',
        note: 'Industry sponsor authorized deployment tranche. On-site field pilot initiated with university innovators.'
      });

      await loadData();
      alert(`Stage 7: Pilot Implementation successfully authorized for ${targetId}!`);
    } catch (err) {
      console.error('Failed to trigger pilot deployment:', err);
      alert(err.message || 'Failed to trigger pilot deployment');
    } finally {
      setDeployingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Corporate Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Corporate Partnership & CSR Sponsorship Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {profile?.companyName || user?.name || 'Apex Green Technologies Ltd.'}
          </h1>
          <p className="text-slate-500 text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>{profile?.location || 'Bengaluru / Hyderabad'} &bull; Sector: <span className="text-slate-800 font-semibold">{profile?.industryType || 'CleanTech & Urban Solutions'}</span></span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#009FA6]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 7 CORE CORPORATE METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Available Problems', value: stats.availableProblems || problems.length, icon: Lightbulb, color: 'text-amber-500' },
          { label: 'University Projects', value: stats.universityProjects || solutions.length || 6, icon: FolderGit2, color: 'text-[#009FA6]' },
          { label: 'Active Collabs', value: stats.activeCollaborations || 3, icon: HeartHandshake, color: 'text-purple-600' },
          { label: 'Supported Projects', value: stats.supportedProjects || myCollaborations.length || 2, icon: Briefcase, color: 'text-blue-600' },
          { label: 'Funding Capital', value: `$${(stats.fundingContributions || 37000).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
          { label: 'Mentorship Acts', value: stats.mentorshipActivities || 2, icon: Users, color: 'text-cyan-600' },
          { label: 'Completed Projects', value: stats.completedProjects || 1, icon: CheckCircle, color: 'text-rose-500' },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider line-clamp-1">
                  {metric.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
              </div>
              <p className="text-xl font-black text-slate-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        {[
          { id: 'solutions', label: 'University Solution Blueprints', icon: Lightbulb, count: solutions.length },
          { id: 'challenges', label: 'Browse Community Challenges', icon: Search, count: problems.length },
          { id: 'collaborations', label: 'Our Sponsored Projects', icon: Briefcase, count: myCollaborations.length || 1 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 flex items-center space-x-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#009FA6] text-[#009FA6]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#009FA6]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isActive ? 'bg-[#E6F7F8] text-[#009FA6] border border-[#009FA6]/20' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SOLUTIONS */}
      {activeTab === 'solutions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Vetted Academic Solution Blueprints</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Directly back engineering prototypes engineered by university research teams with grant funding and mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutions.map((sol) => {
              const isAlreadySponsored = sol.status === 'Industry Sponsored' || sol.stage >= 6;
              const isCurrentDeploying = deployingId === (sol.problemId || sol._id);

              return (
                <div
                  key={sol._id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#009FA6] bg-[#E6F7F8] px-2.5 py-1 rounded-xl border border-[#009FA6]/20">
                        {sol.problemId}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isAlreadySponsored 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {sol.status || 'Proposed'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-600 font-semibold block">
                        {sol.university?.universityName || 'Partner University'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5 group-hover:text-[#009FA6] transition-colors">
                        {sol.solutionTitle}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {sol.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Proposed Technology</span>
                      <p className="font-mono text-[11px] text-slate-700 line-clamp-1">{sol.proposedTechnology}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Target Budget: <strong className="text-emerald-600">${sol.estimatedCost?.toLocaleString()}</strong></span>
                      <span>Timeline: <strong className="text-slate-700">{sol.timeline}</strong></span>
                    </div>

                    {isAlreadySponsored ? (
                      <button
                        type="button"
                        onClick={() => handleAuthorizePilot(sol)}
                        disabled={isCurrentDeploying}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#009FA6] hover:bg-[#008389] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {isCurrentDeploying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Deploying Pilot...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4" />
                            <span>Deploy Pilot (Stage 7)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenSponsor(sol)}
                        className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Sponsor Solution</span>
                      </button>
                    )}

                    <Link
                      to={`/problems/${sol.problemId}`}
                      className="block text-center text-[11px] text-[#009FA6] hover:underline pt-0.5 font-medium"
                    >
                      View Underlying Challenge &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((p) => (
              <div
                key={p._id || p.problemId}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#009FA6] bg-[#E6F7F8] px-2.5 py-1 rounded-xl border border-[#009FA6]/20">
                      {p.problemId}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{p.category}</span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5 line-clamp-2">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" />
                      <span>{p.city}, {p.state}</span>
                    </div>
                    <span className="text-slate-700 font-semibold">{p.peopleAffected || 10}+ Citizens</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenSponsor(p)}
                      className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Sponsor</span>
                    </button>

                    <Link
                      to={`/problems/${p.problemId}`}
                      className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Track Status</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COLLABORATIONS */}
      {activeTab === 'collaborations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#009FA6] bg-[#E6F7F8] px-2.5 py-1 rounded-xl border border-[#009FA6]/20">
                  SS-2026-000101
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Active Collaboration
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Severe Groundwater Contamination & Fluoride Excess in Ward 8
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  NIT Civil Lab bio-char filtration unit installation backed by Apex corporate grant.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Pledged Capital: <strong className="text-emerald-600">$15,000 USD</strong></span>
                  <span>Contribution: <strong className="text-purple-700">Comprehensive CSR</strong></span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Hardware: IoT Water Flow Meters & Solar Filters
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Pilot Deployment Progress</span>
                  <span className="text-[#009FA6] font-bold">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-[#009FA6]" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/problems/SS-2026-000101"
                  className="text-xs font-semibold text-[#009FA6] hover:underline"
                >
                  View Full Tracking Timeline &rarr;
                </Link>
              </div>
            </div>

            {myCollaborations.map((collab) => (
              <div
                key={collab._id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#009FA6] bg-[#E6F7F8] px-2.5 py-1 rounded-xl border border-[#009FA6]/20">
                    {collab.problemId}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {collab.contributionType}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{collab.solutionTitle}</h3>
                  <p className="text-xs text-slate-500 mt-1">{collab.note}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Funding: <strong className="text-emerald-600">${collab.fundingAmount?.toLocaleString()}</strong></span>
                    <span>Status: <strong className="text-purple-700">{collab.status}</strong></span>
                  </div>
                  {collab.technologiesProvided?.length > 0 && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      Tech: {collab.technologiesProvided.join(', ')}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/problems/${collab.problemId}`}
                    className="text-xs font-semibold text-[#009FA6] hover:underline"
                  >
                    View Live Timeline &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <SponsorSolutionModal
        isOpen={sponsorModalOpen}
        onClose={() => setSponsorModalOpen(false)}
        targetItem={selectedTarget}
        onSponsorSuccess={loadData}
        defaultCompany={profile?.companyName || user?.name}
      />
    </div>
  );
}