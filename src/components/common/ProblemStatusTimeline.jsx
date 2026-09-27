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
          <span className="text-sm font-sans uppercase tracking-wider text-teal-800 font-black flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#009FA6]" />
            <span>10-Stage Resolution Progression</span>
          </span>
          <span className="text-xs font-sans text-slate-900 font-extrabold bg-slate-100 px-3 py-1 rounded-full border-2 border-slate-600 shadow-sm">
            {currentProgress}% Complete
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-200 border-2 border-slate-600 overflow-hidden shadow-inner">
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
              className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between relative shadow-sm ${
                isCurrent
                  ? 'bg-[#004D40] border-2 border-teal-400 ring-2 ring-teal-400/40 shadow-lg text-white'
                  : isPassed
                  ? 'bg-white border-2 border-slate-700 text-slate-900'
                  : 'bg-slate-50 border-2 border-slate-600 text-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-sans font-black ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                    #{idx + 1}
                  </span>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-teal-300 animate-ping" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
                  )}
                </div>

                <h4
                  className={`text-xs font-extrabold leading-snug font-sans ${
                    isCurrent
                      ? 'text-white'
                      : isPassed
                      ? 'text-slate-900'
                      : 'text-slate-600'
                  }`}
                >
                  {stage.label}
                </h4>

                <span
                  className={`text-[10px] uppercase tracking-wider font-extrabold block mt-1.5 font-sans ${
                    isCurrent ? 'text-teal-200' : isPassed ? 'text-teal-800' : 'text-slate-500'
                  }`}
                >
                  {stage.actor}
                </span>
              </div>

              {event?.timestamp && (
                <span
                  className={`text-[11px] font-sans font-bold mt-2.5 block border-t-2 pt-1 ${
                    isCurrent ? 'text-teal-100 border-teal-600' : 'text-slate-900 border-slate-300'
                  }`}
                >
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Milestone Card */}
      <div className="bg-white border-2 border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-900 text-teal-300 border-2 border-teal-700 shrink-0">
            <Clock className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-700 font-sans font-bold text-xs uppercase tracking-wide">Current Active Milestone:</span>
              <span className="font-extrabold text-[#009FA6] text-sm sm:text-base font-sans">{currentStatus}</span>
            </div>
            <p className="text-slate-600 text-xs mt-0.5 font-medium font-sans">
              {WORKFLOW_STAGES[activeIdx]?.desc}
            </p>
          </div>
        </div>

        {getTimelineEvent(currentStatus)?.note && (
          <div className="px-4 py-2.5 rounded-xl bg-slate-100 border-2 border-slate-700 text-slate-900 text-xs sm:text-sm font-sans font-semibold shadow-sm leading-relaxed max-w-xl">
            <span className="text-teal-800 font-bold uppercase tracking-wider text-[11px] mr-1.5 font-sans">Note:</span>
            "{getTimelineEvent(currentStatus).note}"
          </div>
        )}
      </div>
    </div>
  );
}
