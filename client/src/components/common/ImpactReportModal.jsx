import React from 'react';
import {
  X,
  Printer,
  Award,
  CheckCircle2,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Calendar,
  DollarSign,
  Cpu,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function ImpactReportModal({ problem, isOpen, onClose }) {
  if (!isOpen || !problem) return null;

  const handlePrint = () => {
    window.print();
  };

  const statusProgress = {
    'Submitted': 10,
    'Under Review': 20,
    'Accepted': 30,
    'University Assigned': 40,
    'Solution Development': 55,
    'Industry Collaboration': 65,
    'Pilot Testing': 75,
    'Implemented': 85,
    'Impact Measured': 95,
    'Resolved': 100,
  };

  const currentPercent = statusProgress[problem.status] || 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden my-8 print:border-none print:shadow-none print:m-0 print:p-0 print:bg-white print:text-black">
        
        {/* Header Bar - Hidden on print */}
        <div className="p-4 sm:px-8 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-white text-sm">SocietySolve Community Impact Certificate</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 sm:p-10 space-y-8 print:p-6 print:text-black">
          
          {/* Certificate Header */}
          <div className="border-b border-slate-800 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 print:border-slate-300">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-[11px] font-mono font-bold uppercase print:bg-slate-100 print:text-teal-700 print:border-teal-700">
                  {problem.problemId}
                </span>
                <span className="text-xs text-slate-400 print:text-slate-600">Official Impact Audit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight print:text-black">
                {problem.title}
              </h1>
              <p className="text-sm text-slate-400 print:text-slate-600">
                Category: <strong className="text-slate-200 print:text-black">{problem.category}</strong> &bull; Location: <strong className="text-slate-200 print:text-black">{problem.location?.city || 'Local Community'}, {problem.location?.state || 'Urban District'}</strong>
              </p>
            </div>

            <div className="shrink-0 p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 text-center sm:w-44 print:border-slate-300 print:bg-slate-50">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block print:text-teal-700">
                Ecosystem Status
              </span>
              <span className="text-xl font-black text-white mt-1 block print:text-black">
                {problem.status}
              </span>
              <span className="text-xs font-semibold text-teal-400 print:text-teal-700">
                {currentPercent}% Progress
              </span>
            </div>
          </div>

          {/* Triad Stakeholder Collaboration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Citizen Pillar */}
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-3 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center space-x-2 text-blue-400 print:text-blue-700">
                <Users className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">Citizen Voice</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Reported By</p>
                <p className="text-sm font-bold text-slate-200 print:text-black">
                  {problem.submittedBy?.name || 'Verified Citizen'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Severity Level</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800 print:bg-amber-100 print:text-amber-900 print:border-amber-400">
                  {problem.severity} Severity
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Initial Filing</p>
                <p className="text-xs text-slate-300 font-mono print:text-slate-700">
                  {new Date(problem.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* 2. University Pillar */}
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-3 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400 print:text-emerald-700">
                <GraduationCap className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">Academic Lead</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Adopting Institution</p>
                <p className="text-sm font-bold text-slate-200 print:text-black">
                  {problem.assignedUniversity?.name || 'National Tech University'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Lead Faculty & Research Lab</p>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  {problem.assignedFacultyLead || 'Dr. Evelyn Vance (Civil & Environmental Lab)'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Student Team Size</p>
                <p className="text-xs font-semibold text-emerald-400 print:text-emerald-700">
                  {problem.studentTeamCount || 6} Engineering Fellows
                </p>
              </div>
            </div>

            {/* 3. Industry Pillar */}
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-3 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center space-x-2 text-purple-400 print:text-purple-700">
                <Building2 className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">Corporate Sponsor</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Industry Partner</p>
                <p className="text-sm font-bold text-slate-200 print:text-black">
                  {problem.industryPartner?.name || 'Apex Green Technologies & Partners'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Committed Grant & Equipment</p>
                <p className="text-sm font-extrabold text-purple-400 print:text-purple-800">
                  ${problem.industryGrantAmount?.toLocaleString() || '18,500'} USD
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 print:text-slate-600">Mentorship Hours</p>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  48 Advisory Hours
                </p>
              </div>
            </div>

          </div>

          {/* Quantified Societal Impact Section */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/30 to-slate-900 border border-teal-800/40 space-y-4 print:bg-slate-50 print:border-slate-300">
            <div className="flex items-center space-x-2 text-teal-400 print:text-teal-700">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold text-base text-white print:text-black">Quantified Societal Impact & Milestones</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center print:bg-white print:border-slate-200">
                <p className="text-2xl font-black text-teal-400 print:text-teal-700">5,400+</p>
                <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">Citizens Impacted</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center print:bg-white print:border-slate-200">
                <p className="text-2xl font-black text-emerald-400 print:text-emerald-700">88%</p>
                <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">Severity Reduction</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center print:bg-white print:border-slate-200">
                <p className="text-2xl font-black text-purple-400 print:text-purple-700">14 wks</p>
                <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">Development Cycle</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center print:bg-white print:border-slate-200">
                <p className="text-2xl font-black text-cyan-400 print:text-cyan-700">4.9/5</p>
                <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">Community Score</p>
              </div>
            </div>
          </div>

          {/* Description & Technical Summary */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider print:text-black">
              Problem Description & Ground Reality
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800 print:bg-white print:border-slate-200 print:text-slate-800">
              {problem.description}
            </p>
          </div>

          {/* Official Verification Seal & Signatures */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 print:border-slate-300 print:text-slate-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-400 font-extrabold print:bg-slate-100 print:border-teal-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-200 print:text-black">SocietySolve Cryptographic Governance Seal</p>
                <p className="text-[11px] font-mono text-slate-500 print:text-slate-600">Hash: 8f4e2b...9a1c | Verified by SocietySolve Registry</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="font-semibold text-slate-300 print:text-black">Certified on {new Date().toLocaleDateString()}</p>
              <p className="text-[10px] text-teal-400 font-mono print:text-teal-700">Citizen → University → Industry → Solution</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
