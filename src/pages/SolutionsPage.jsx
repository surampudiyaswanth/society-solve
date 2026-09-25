import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSolutions } from '../services/solutionService';
import SponsorSolutionModal from '../components/forms/SponsorSolutionModal';
import { 
  Lightbulb, 
  Cpu, 
  DollarSign, 
  Clock, 
  GraduationCap, 
  Building2, 
  Search, 
  ArrowRight, 
  HeartHandshake,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);

  const fetchAllSolutions = async () => {
    try {
      setLoading(true);
      const res = await getSolutions();
      setSolutions(res.solutions || []);
    } catch (err) {
      console.error('Error fetching solutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSolutions();
  }, []);

  const handleOpenSponsor = (sol) => {
    setSelectedSolution(sol);
    setSponsorModalOpen(true);
  };

  const filteredSolutions = solutions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.solutionTitle?.toLowerCase().includes(q) ||
      s.proposedTechnology?.toLowerCase().includes(q) ||
      s.problemId?.toLowerCase().includes(q) ||
      s.leadFaculty?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/80 text-teal-400 border border-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Innovation Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Solutions Hub
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Explore multidisciplinary technological blueprints proposed by university research teams to solve real-world societal problems.
          </p>
        </div>

        <button
          onClick={fetchAllSolutions}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors self-start md:self-auto cursor-pointer"
          title="Refresh Solutions"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center">
        <Search className="w-4 h-4 text-slate-500 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search solutions by technology (e.g. IoT, Solar, AI), faculty lead, or Problem ID..."
          className="w-full bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
        />
      </div>

      {/* Solutions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Showing <span className="text-teal-400 font-bold">{filteredSolutions.length}</span> verified solution blueprints
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading university solutions...</p>
          </div>
        ) : filteredSolutions.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Lightbulb className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No solutions matched your search</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Universities are continuously proposing new technology blueprints for open community challenges.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((sol) => (
              <div
                key={sol._id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl hover:shadow-slate-950/60 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-xl border border-teal-800">
                      {sol.problemId}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {sol.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      {sol.university?.universityName || 'Partner University'}
                    </span>
                    <h3 className="font-bold text-white text-base leading-snug mt-0.5 group-hover:text-teal-300 transition-colors line-clamp-2">
                      {sol.solutionTitle}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {sol.description}
                  </p>

                  {/* Technology Spec Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center space-x-1.5 text-purple-400">
                      <Cpu className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono uppercase font-bold">Proposed Technology</span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-300 line-clamp-2">{sol.proposedTechnology}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Budget: <strong className="text-emerald-400">${sol.estimatedCost?.toLocaleString()}</strong></span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Timeline: <strong className="text-slate-200">{sol.timeline}</strong></span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenSponsor(sol)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Sponsor</span>
                    </button>

                    <Link
                      to={`/problems/${sol.problemId}`}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Underlying Issue &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sponsor Solution Modal */}
      <SponsorSolutionModal
        isOpen={sponsorModalOpen}
        onClose={() => setSponsorModalOpen(false)}
        targetItem={selectedSolution}
        onSponsorSuccess={fetchAllSolutions}
      />
    </div>
  );
}
