import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  DollarSign, 
  Cpu, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { createCollaboration } from '../../services/collaborationService';

export default function SponsorSolutionModal({
  isOpen,
  onClose,
  targetItem, // Can be a solution or problem
  onSponsorSuccess,
  defaultCompany = 'Apex Green Technologies',
}) {
  if (!isOpen || !targetItem) return null;

  const problemId = targetItem.problemId || targetItem.problem?.problemId || targetItem._id;
  const title = targetItem.solutionTitle || targetItem.title || 'Societal Challenge';

  const [formData, setFormData] = useState({
    problemId,
    solutionId: targetItem.solutionTitle ? targetItem._id : null,
    contributionType: 'Comprehensive CSR Support',
    fundingAmount: targetItem.estimatedCost ? targetItem.estimatedCost : 12000,
    technologiesProvided: 'IoT Sensors, Solar Microinverters, AI Telemetry API, Cloud Credits',
    mentorshipDetails: 'Senior Principal Engineer assigned for weekly bi-directional architecture reviews.',
    note: 'Corporate CSR sponsorship committed for community pilot deployment and testing.',
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
      const res = await createCollaboration(formData);
      if (onSponsorSuccess) {
        onSponsorSuccess(res.collaboration);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error creating corporate sponsorship.');
    } finally {
      setLoading(false);
    }
  };

  const contributionOptions = [
    { id: 'Funding', label: 'Grant Funding', desc: 'Direct financial capital for prototypes and hardware' },
    { id: 'Technology', label: 'Enterprise Tech', desc: 'Hardware sensors, cloud infra, and licensed software' },
    { id: 'Mentorship', label: 'Technical Mentorship', desc: 'Industry engineering guidance for university teams' },
    { id: 'Comprehensive CSR Support', label: 'Comprehensive CSR', desc: 'Combined funding, hardware, and engineering advisory' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Corporate Sponsorship & CSR Partnership</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sponsor Project Solution</h2>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-teal-400 font-bold mt-2">
            [{problemId}] {title}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contribution Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Sponsorship Model *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {contributionOptions.map((opt) => {
                const isSelected = formData.contributionType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, contributionType: opt.id })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 text-purple-300 ring-1 ring-purple-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Funding Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Committed Funding Capital ($ / ₹) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="number"
                name="fundingAmount"
                required
                min={0}
                value={formData.fundingAmount}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Technologies Provided */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Enterprise Technologies & Hardware Provided
            </label>
            <div className="relative">
              <Cpu className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="technologiesProvided"
                value={formData.technologiesProvided}
                onChange={handleChange}
                placeholder="Comma separated: IoT Sensors, Solar Inverters, Cloud API, etc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Mentorship Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Engineering Mentorship & Advisory Commitment
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="mentorshipDetails"
                value={formData.mentorshipDetails}
                onChange={handleChange}
                placeholder="Advisor name, frequency of technical reviews, lab access"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Corporate Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Corporate CSR Alignment Note
            </label>
            <textarea
              name="note"
              rows={2}
              value={formData.note}
              onChange={handleChange}
              placeholder="State how this project fulfills your corporate societal goals..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
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
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Committing Sponsorship...' : 'Confirm Sponsorship Pledge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
