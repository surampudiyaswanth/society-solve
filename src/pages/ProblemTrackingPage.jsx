import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProblemById, updateProblemStatus } from '../services/problemService';
import { getAssetUrl } from '../services/api';
import ProblemStatusTimeline from '../components/common/ProblemStatusTimeline';
import DiscussionThread from '../components/common/DiscussionThread';
import ImpactReportModal from '../components/common/ImpactReportModal';
import AIMatchModal from '../components/common/AIMatchModal';
import { 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  GraduationCap, 
  Building2, 
  Building,
  ArrowLeft, 
  CheckCircle2, 
  Video, 
  ExternalLink,
  ShieldAlert,
  Share2,
  Award,
  Loader2,
  CheckCircle,
  TrendingUp,
  ClipboardCheck,
  ShieldBan,
  Sparkles,
  Rocket
} from 'lucide-react';

export default function ProblemTrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);

  // Step #9 Community Survey Form State
  const [surveyMetrics, setSurveyMetrics] = useState({
    observedReduction: '70%+ Significant Improvement',
    purityRating: 'Substantially Improved',
    satisfactionScore: '9/10',
    notes: 'Ground survey confirms significant reduction in water shortages and improved community availability.'
  });

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const res = await getProblemById(id);
      setProblem(res.problem || res.data || res);
    } catch (err) {
      setError(err.message || 'Problem not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceStage = async (nextStatus, noteText, extraPayload = {}) => {
    setUpdatingStage(true);
    try {
      const targetId = problem?.problemId || problem?._id || id;
      await updateProblemStatus(targetId, {
        status: nextStatus,
        note: noteText || `Stage transitioned to ${nextStatus}`,
        ...extraPayload
      });
      await fetchProblem();
    } catch (err) {
      console.error('Error advancing stage:', err);
      alert(err.message || 'Failed to update problem milestone.');
    } finally {
      setUpdatingStage(false);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading problem tracking data for {id}...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Challenge Not Found</h2>
        <p className="text-xs text-slate-400">{error || `No challenge found with ID ${id}`}</p>
        <Link
          to="/citizen"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 text-teal-400 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to={user?.role === 'citizen' ? '/citizen' : user?.role === 'government' ? '/government' : '/problems'}
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Directory'}</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setImpactModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 text-xs font-bold border border-teal-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Impact Report</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{copied ? 'Link Copied!' : 'Share Challenge'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-black text-teal-400 bg-teal-950/90 px-3 py-1 rounded-xl border border-teal-800/80 tracking-wider">
              {problem.problemId}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              {problem.category}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-xl border ${getSeverityBadge(problem.severity)}`}>
              {problem.severity} Severity
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Logged: {new Date(problem.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {problem.title}
          </h1>
          <p className="text-xs sm:text-sm text-teal-400/90 font-mono mt-1">
            Focus Problem Type: {problem.problemType}
          </p>
        </div>

        {/* Location & Impact Chips */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>{problem.location}, {problem.city}, {problem.state} {problem.postalCode ? `(${problem.postalCode})` : ''}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{problem.peopleAffected?.toLocaleString() || 10}+ Citizens Affected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Observed: {new Date(problem.dateObserved).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 10-Stage Progression Timeline Section */}
      <section className="bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <ProblemStatusTimeline
          currentStatus={problem.status}
          timeline={problem.timeline || []}
        />

        {/* Milestone Status Action Panel */}
        <div className="bg-slate-950/90 border-2 border-slate-700 rounded-2xl p-5 mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Milestone Execution & Role Guards
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Active Status: <span className="text-teal-400 font-bold">{problem.status}</span> ({problem.progress || 10}%)
            </span>
          </div>

          {/* Admin Exclusion Notice for Steps 8, 9, 10 */}
          {user?.role === 'admin' && ['Pilot Implementation', 'Implemented', 'Impact Measured'].includes(problem.status) && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-amber-400/90">
              <ShieldBan className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Admin Override Revoked: Steps 8, 9, and 10 require ground verification by Citizens or Government authorities.</span>
            </div>
          )}

          {/* Step #7 Action: Industry Pilot Authorization */}
          {['Solution Development', 'Industry Collaboration'].includes(problem.status) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-purple-500/30">
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Step #7: Authorize Field Pilot Implementation (75%)
                </span>
                <p className="text-xs text-slate-400">
                  Authorize corporate CSR capital & equipment to transition university lab models into community field pilot.
                </p>
              </div>

              {['industry', 'admin'].includes(user?.role) ? (
                <button
                  onClick={() => handleAdvanceStage('Pilot Implementation', 'Industry partner authorized deployment tranche. On-ground field pilot initiated.')}
                  disabled={updatingStage}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {updatingStage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
                  Deploy Step #7 Pilot (75%)
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">Restricted to Industry partners & Admin</span>
              )}
            </div>
          )}

          {/* Step #8 Action: Ground Implementation Verification */}
          {problem.status === 'Pilot Implementation' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-teal-500/20">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Step #8 Ground Verification
                </span>
                <p className="text-xs text-slate-400">
                  Confirm physical deployment of prototype/infrastructure in the local neighborhood.
                </p>
              </div>

              {['citizen', 'government'].includes(user?.role) ? (
                <button
                  onClick={() => handleAdvanceStage('Implemented', 'On-ground operational deployment verified by community/civic lead.')}
                  disabled={updatingStage}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {updatingStage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  Verify #8 Implemented (85%)
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">Restricted to Citizens & Government authorities</span>
              )}
            </div>
          )}

          {/* Step #9 Action: Citizen Community Impact Survey */}
          {problem.status === 'Implemented' && (
            <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <ClipboardCheck className="w-4 h-4" /> Step #9: Community Reduction & Impact Audit
                </span>
                <p className="text-xs text-slate-300">
                  Affected citizens must record measurable improvements before municipal authorities can officially close this challenge.
                </p>
              </div>

              {user?.role === 'citizen' ? (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Observed Improvement</label>
                      <select
                        value={surveyMetrics.observedReduction}
                        onChange={(e) => setSurveyMetrics({ ...surveyMetrics, observedReduction: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="90%+ Deficit Solved">90%+ Solved</option>
                        <option value="70%+ Significant Improvement">70%+ Significant Improvement</option>
                        <option value="50% Partial Improvement">50% Partial Improvement</option>
                        <option value="< 30% Needs Rework">&lt; 30% Needs Rework</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Community Quality Rating</label>
                      <select
                        value={surveyMetrics.purityRating}
                        onChange={(e) => setSurveyMetrics({ ...surveyMetrics, purityRating: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Excellent / Fully Resolved">Excellent / Fully Resolved</option>
                        <option value="Substantially Improved">Substantially Improved</option>
                        <option value="Acceptable Baseline">Acceptable Baseline</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Satisfaction Score</label>
                      <input
                        type="text"
                        value={surveyMetrics.satisfactionScore}
                        onChange={(e) => setSurveyMetrics({ ...surveyMetrics, satisfactionScore: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. 9/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Citizen Notes & Reduction Evidence</label>
                    <textarea
                      rows={2}
                      value={surveyMetrics.notes}
                      onChange={(e) => setSurveyMetrics({ ...surveyMetrics, notes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => handleAdvanceStage(
                      'Impact Measured',
                      `Citizen verified: ${surveyMetrics.observedReduction}. ${surveyMetrics.notes}`,
                      { impactMetrics: surveyMetrics }
                    )}
                    disabled={updatingStage}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {updatingStage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                    Submit Community Survey & Advance to #9 Impact Measured (95%)
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400">
                  Waiting for community citizen audit and feedback survey submission.
                </div>
              )}
            </div>
          )}

          {/* Step #10 Action: Government Verification & Archival */}
          {problem.status === 'Impact Measured' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border-2 border-emerald-600 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Building className="w-4 h-4" /> Step #10: Final Municipal Verification & Sign-Off
                </span>
                <p className="text-xs text-slate-400">
                  Community reduction survey recorded. Municipal department officers must inspect metrics and archive as solved.
                </p>
              </div>

              {user?.role === 'government' ? (
                <button
                  onClick={() => handleAdvanceStage('Resolved', 'Final municipal inspection completed. Challenge successfully resolved and archived.')}
                  disabled={updatingStage}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {updatingStage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  Close as #10 Resolved (100%)
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">Restricted to Government Authorities</span>
              )}
            </div>
          )}

          {problem.status === 'Resolved' && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Challenge fully resolved, audited, and permanently archived across all 5 societal portals.</span>
            </div>
          )}
        </div>
      </section>

      {/* 2-Column Content: Problem Intelligence & Collaboration Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem Details & Media */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <span>Challenge Description & Scope</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>

            {problem.additionalComments && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200 block mb-1">Additional Citizen Notes:</span>
                {problem.additionalComments}
              </div>
            )}
          </div>

          {/* Media & Documentation Gallery */}
          {(problem.images?.length > 0 || problem.documents?.length > 0 || problem.videoUrl) && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-white">Supporting Evidence & Documentation</h3>

              {problem.images?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400">Photographic Evidence ({problem.images.length})</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {problem.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={getAssetUrl(img)}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video block"
                      >
                        <img
                          src={getAssetUrl(img)}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {problem.videoUrl && (
                <div className="pt-2 border-t border-slate-800">
                  <a
                    href={problem.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-400 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>View Video Demonstration</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Stakeholders */}
        <div className="lg:col-span-4 space-y-5">
          {/* Assigned University */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Academic Lead
                </span>
                <h4 className="text-sm font-bold text-white">Assigned University</h4>
              </div>
            </div>

            {problem.assignedUniversity ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-800/40 space-y-2">
                <h5 className="font-bold text-white text-sm">
                  {problem.assignedUniversity.universityName}
                </h5>
                <p className="text-xs text-slate-400">
                  Campus: {problem.assignedUniversity.location || 'India'}
                </p>
                <div className="pt-2 border-t border-slate-900 flex items-center text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Research Team Assigned</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-400">Awaiting Academic Team Adoption</p>
                <p className="text-[11px] text-slate-500">
                  Universities can claim this challenge from their dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setMatchModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-700/60 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Find Matched Universities</span>
                </button>
              </div>
            )}
          </div>

          {/* Industry Partner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                  Corporate Sponsor
                </span>
                <h4 className="text-sm font-bold text-white">Industry Partner</h4>
              </div>
            </div>

            {problem.industryPartner ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-800/40 space-y-2">
                <h5 className="font-bold text-white text-sm">
                  {problem.industryPartner.companyName}
                </h5>
                <p className="text-xs text-slate-400">
                  Sector: {problem.industryPartner.industryType}
                </p>
                <div className="pt-2 border-t border-slate-900 flex items-center text-xs text-purple-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Funding & Mentorship Pledged</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-400">Open for Corporate Sponsorship</p>
                <p className="text-[11px] text-slate-500">
                  Industry partners can sponsor prototypes and pilot field deployment.
                </p>
                <button
                  type="button"
                  onClick={() => setMatchModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 font-bold text-xs flex items-center justify-center space-x-2 border border-purple-700/60 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Find Matched Sponsors</span>
                </button>
              </div>
            )}
          </div>

          {/* Citizen Reporter Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Reported by Community Member:</span>
            </div>
            <p className="text-sm font-bold text-white">
              {problem.citizen?.name || 'Verified Citizen'}
            </p>
            <p className="text-xs font-mono text-slate-500">
              Location: {problem.city}, {problem.state}
            </p>
          </div>
        </div>
      </div>

      {/* Discussion Thread */}
      <DiscussionThread problemId={problem.problemId || problem._id} />

      {/* Impact Modal */}
      <ImpactReportModal
        problem={problem}
        isOpen={impactModalOpen}
        onClose={() => setImpactModalOpen(false)}
      />

      {/* AI Stakeholder Match Modal */}
      <AIMatchModal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        problemId={problem._id || problem.problemId || id}
        problemTitle={problem.title}
      />
    </div>
  );
}