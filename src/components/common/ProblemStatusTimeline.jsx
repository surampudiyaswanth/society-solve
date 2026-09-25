import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  Sparkles,
  FileCheck,
  Building,
  GraduationCap,
  Hammer,
  Award,
  Users
} from 'lucide-react';

export const WORKFLOW_STAGES = [
  { id: 'Submitted', label: 'Submitted', progress: 10, actor: 'Citizen', desc: 'Logged with initial proof' },
  { id: 'Under Review', label: 'Under Review', progress: 20, actor: 'Admin', desc: 'Civic feasibility check' },
  { id: 'Accepted', label: 'Accepted', progress: 30, actor: 'Admin', desc: 'Approved for research' },
  { id: 'University Assigned', label: 'University Assigned', progress: 40, actor: 'University', desc: 'Academic team claims challenge' },
  { id: 'Solution Development', label: 'Solution Development', progress: 50, actor: 'University', desc: 'Prototyping & lab modeling' },
  { id: 'Industry Collaboration', label: 'Industry Collab', progress: 65, actor: 'Industry', desc: 'Corporate funding & tech committed' },
  { id: 'Pilot Implementation', label: 'Pilot Implementation', progress: 75, actor: 'Uni + Industry', desc: 'Field testing in community' },
  { id: 'Implemented', label: 'Implemented', progress: 85, actor: 'Civic Stakeholders', desc: 'Live operational deployment' },
  { id: 'Impact Measured', label: 'Impact Measured', progress: 95, actor: 'Community', desc: 'Survey verification & metric audit' },
  { id: 'Resolved', label: 'Resolved', progress: 100, actor: 'Ecosystem', desc: 'Challenge successfully closed' },
];

export default function ProblemStatusTimeline({ currentStatus = 'Submitted', timeline = [] }) {
  const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === currentStatus);
  const activeIdx = currentIndex !== -1 ? currentIndex : 0;
  const currentProgress = WORKFLOW_STAGES[activeIdx]?.progress || 10;

  // Find note or timestamp for a status from the timeline array
  const getTimelineEvent = (statusId) => {
    return timeline.find((t) => t.status === statusId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10-Stage Resolution Progression</span>
          </span>
          <span className="text-xs font-mono text-slate-300 font-bold bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            {currentProgress}% Complete
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Desktop & Tablet Timeline Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isPassed = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isPending = idx > activeIdx;
          const event = getTimelineEvent(stage.id);

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between relative ${
                isCurrent
                  ? 'bg-teal-950/80 border-teal-500 ring-2 ring-teal-500/30 shadow-lg shadow-teal-500/10'
                  : isPassed
                  ? 'bg-slate-900/90 border-slate-700 text-slate-300'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold">
                    #{idx + 1}
                  </span>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-teal-400 animate-ping" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <h4
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-teal-300'
                      : isPassed
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </h4>

                <span className="text-[9px] uppercase tracking-wider font-semibold block mt-1 text-slate-400">
                  {stage.actor}
                </span>
              </div>

              {event?.timestamp && (
                <span className="text-[9px] font-mono text-slate-400 mt-2 block border-t border-slate-800 pt-1">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Milestone Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-mono">Current Active Milestone:</span>
              <span className="font-bold text-teal-300 text-sm">{currentStatus}</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              {WORKFLOW_STAGES[activeIdx]?.desc}
            </p>
          </div>
        </div>

        {getTimelineEvent(currentStatus)?.note && (
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono">
            Note: "{getTimelineEvent(currentStatus).note}"
          </div>
        )}
      </div>
    </div>
  );
}
