import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InteractiveProblemDonut from '../components/charts/InteractiveProblemDonut';
import ProblemSubmissionModal from '../components/forms/ProblemSubmissionModal';
import { getMyProblems } from '../services/problemService';
import { 
  Users, 
  MapPin, 
  PlusCircle, 
  FileText, 
  Clock, 
  ArrowUpRight,
  PieChart,
  FolderOpen,
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user, profile } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblemData, setSelectedProblemData] = useState(null);
  const [myProblems, setMyProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  const fetchProblems = async () => {
    try {
      setLoadingProblems(true);
      const res = await getMyProblems();
      setMyProblems(res.problems || []);
    } catch (err) {
      console.error('Error loading citizen problems:', err);
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleSelectProblem = (problemData) => {
    setSelectedProblemData(problemData);
    setModalOpen(true);
  };

  const handleProblemSubmitted = (newProblem) => {
    setMyProblems((prev) => [newProblem, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Citizen Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Citizen Community Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-400 text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>{profile?.location ? `${profile.location}, ` : ''}{profile?.city || 'Local Community'}, {profile?.state || 'India'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedProblemData({
                category: 'Education',
                problemType: 'General Community Need',
                defaultDescription: '',
              });
              setModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Direct Report</span>
          </button>
        </div>
      </div>

      {/* Interactive Donut Problem Selection */}
      <section className="space-y-4">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/80 text-teal-400 border border-teal-800 text-xs font-semibold">
            <PieChart className="w-3.5 h-3.5" />
            <span>Interactive Problem Selection Interface</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What type of problem do you want to report?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select a problem from the chart to report an issue in your community.
          </p>
        </div>

        <InteractiveProblemDonut onSelectProblem={handleSelectProblem} />
      </section>

      {/* Submitted Problems Tracking Section */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-teal-400" />
              <span>My Submitted Challenges & Tracking</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status progression from submission through university research and industry pilot
            </p>
          </div>
          <span className="text-xs font-mono text-teal-400 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800 self-start sm:self-auto">
            {myProblems.length} Total Reported
          </span>
        </div>

        {loadingProblems ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono">
            Loading your reported challenges...
          </div>
        ) : myProblems.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No problems submitted yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use the interactive donut chart above to click a category, select an issue, and submit your first report!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myProblems.map((prob) => {
              const problemIdentifier = prob.problemId || prob._id;
              return (
                <div
                  key={problemIdentifier}
                  className="bg-slate-950 border border-slate-800/90 hover:border-teal-500/40 rounded-2xl p-6 space-y-4 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: ID + Status Pill */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800">
                        {prob.problemId}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        {prob.status}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-bold text-white text-lg leading-snug">{prob.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{prob.description}</p>
                    </div>

                    {/* Location & Category metadata */}
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{prob.location || `${prob.city}, ${prob.state}`}</span>
                      </div>
                      <span className="font-semibold text-slate-300">{prob.category}</span>
                    </div>

                    {/* Resolution Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-teal-400" />
                          <span>Resolution Lifecycle</span>
                        </span>
                        <span className="font-mono text-teal-400 font-extrabold">{prob.progress || 10}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                          style={{ width: `${prob.progress || 10}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tracking Button & Action Link */}
                  <div className="pt-3 border-t border-slate-900/80">
                    <Link
                      to={`/problems/${prob.problemId}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/30 hover:border-teal-500 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group shadow-sm"
                    >
                      <Clock className="w-4 h-4 text-teal-400 group-hover:text-slate-950 transition-colors" />
                      <span>Track 10-Stage Progress & History</span>
                      <ArrowUpRight className="w-4 h-4 text-teal-400 group-hover:text-slate-950 transition-colors" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Problem Submission Modal */}
      <ProblemSubmissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedProblemData}
        onProblemSubmitted={handleProblemSubmitted}
      />
    </div>
  );
}