import React, { useState } from 'react';
import { 
  X, 
  Lightbulb, 
  Cpu, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users, 
  Video, 
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { createSolution } from '../../services/solutionService';

export default function SolutionProposalModal({
  isOpen,
  onClose,
  problem,
  onSolutionSubmitted,
  defaultFaculty = 'Prof. Radhika Rao',
}) {
  if (!isOpen || !problem) return null;

  const [formData, setFormData] = useState({
    solutionTitle: `Low-Cost Technological Solution for ${problem.problemType || problem.title}`,
    problemId: problem.problemId,
    leadFaculty: defaultFaculty,
    studentTeam: 'Arjun Verma, Meera Swaminathan',
    department: 'Civil & Environmental Engineering',
    description: 'A modular, energy-efficient system designed for rapid deployment using locally sourced materials and automated telemetry sensors.',
    proposedTechnology: 'IoT Telemetry Sensors, Solar Micro-Inverter, Edge Computing Microcontroller, Cloud Dashboard',
    requiredResources: 'Prototyping lab access, fabrication materials, 3D printing equipment, test field site',
    estimatedCost: 8500,
    timeline: '4 to 6 months',
    expectedImpact: `Directly improves quality of life and safety for ${problem.peopleAffected || 500}+ citizens with 80% cost reduction.`,
    videoLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await createSolution(formData);
      if (onSolutionSubmitted) {
        onSolutionSubmitted(res.solution);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error submitting solution proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-950/80 text-teal-400 border border-teal-800 text-xs font-semibold">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Academic Solution Blueprint</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Propose Technological Solution</h2>
          <p className="text-xs text-slate-400">
            For Challenge: <span className="font-mono text-teal-400 font-bold">{problem.problemId}</span> &bull; {problem.title}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Solution Title *
            </label>
            <input
              type="text"
              name="solutionTitle"
              required
              value={formData.solutionTitle}
              onChange={handleChange}
              placeholder="e.g. Solar Bio-char Water Purifier System"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Lead Faculty Coordinator *
              </label>
              <input
                type="text"
                name="leadFaculty"
                required
                value={formData.leadFaculty}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Student Research Team *
              </label>
              <input
                type="text"
                name="studentTeam"
                required
                value={formData.studentTeam}
                onChange={handleChange}
                placeholder="Names separated by comma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Proposed Technology & Architecture *
            </label>
            <div className="relative">
              <Cpu className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="proposedTechnology"
                required
                value={formData.proposedTechnology}
                onChange={handleChange}
                placeholder="e.g. IoT sensors, solar inverters, AI vision, Python edge compute"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Technical Description & Methodology *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain how this technology solves the community challenge..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Budget ($ / ₹) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  name="estimatedCost"
                  required
                  min={100}
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Timeline *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="timeline"
                  required
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="e.g. 6 months"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Expected Community Impact *
            </label>
            <input
              type="text"
              name="expectedImpact"
              required
              value={formData.expectedImpact}
              onChange={handleChange}
              placeholder="e.g. Provides clean drinking water to 500+ households with 95% turbidity reduction"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Submitting Blueprint...' : 'Submit Solution Blueprint'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
