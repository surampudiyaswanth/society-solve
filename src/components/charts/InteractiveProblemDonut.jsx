import React, { useState } from 'react';
import { SOCIETAL_CATEGORIES } from '../../data/categoriesData';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle,
  Layers,
  AlertCircle
} from 'lucide-react';

export default function InteractiveProblemDonut({ onSelectProblem }) {
  const [selectedCategory, setSelectedCategory] = useState(SOCIETAL_CATEGORIES[0]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // SVG Donut geometry calculations
  const size = 340;
  const strokeWidth = 52;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = SOCIETAL_CATEGORIES.length;
  const sliceAngle = 360 / total;

  const currentFocus = hoveredCategory || selectedCategory;

  return (
    <div className="space-y-8">
      {/* Category Problem Selection Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: The Interactive SVG Donut Interface (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between">
          <div className="w-full text-center mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold">
              Step 1: Choose a Domain
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any section of the donut to inspect issues
            </p>
          </div>

          {/* Interactive SVG Donut */}
          <div className="relative flex items-center justify-center my-4">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 filter drop-shadow-lg"
            >
              {SOCIETAL_CATEGORIES.map((cat, idx) => {
                const isSelected = selectedCategory.id === cat.id;
                const isHovered = hoveredCategory?.id === cat.id;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(circumference / total) - 4} ${circumference}`;
                const strokeDashoffset = -(idx * (circumference / total));

                return (
                  <circle
                    key={cat.id}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={cat.color}
                    strokeWidth={isSelected || isHovered ? strokeWidth + 8 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="cursor-pointer transition-all duration-300 ease-out hover:opacity-100"
                    style={{
                      opacity: isSelected ? 1 : isHovered ? 0.9 : 0.65,
                      filter: isSelected ? `drop-shadow(0 0 10px ${cat.color}88)` : 'none',
                    }}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => setSelectedCategory(cat)}
                  />
                );
              })}
            </svg>

            {/* Center Dynamic Status Information */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-8 text-center">
              <div
                className="w-3 h-3 rounded-full mb-1 transition-colors duration-300"
                style={{ backgroundColor: currentFocus.color }}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Selected Category
              </span>
              <h4 className="text-lg font-extrabold text-white tracking-tight mt-0.5 leading-tight">
                {currentFocus.name}
              </h4>
              <span className="text-[11px] font-mono text-teal-400 mt-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                {currentFocus.exampleProblems.length} Problem Types
              </span>
            </div>
          </div>

          {/* Bottom Category Selector Chips (Accessible Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full pt-4 border-t border-slate-800">
            {SOCIETAL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-600 font-bold shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-slate-900'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Example Problems Container (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header of the Selected Category */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, ${selectedCategory.color}, #14b8a6)`,
              }}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                  <h3 className="text-xl font-bold text-white">
                    {selectedCategory.name} Challenges
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-lg">
                  {selectedCategory.description}
                </p>
              </div>

              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono text-teal-400 bg-teal-950/80 border border-teal-800 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 2: Pick Specific Problem</span>
              </span>
            </div>
          </div>

          {/* 4 Example Problem Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedCategory.exampleProblems.map((prob, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-slate-950/50"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      Problem #{idx + 1}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full opacity-75 group-hover:opacity-100 group-hover:scale-125 transition-all"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {prob.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {prob.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectProblem({
                      category: selectedCategory.name,
                      problemType: prob.title,
                      defaultDescription: prob.desc,
                    })
                  }
                  className="mt-5 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-teal-500 cursor-pointer shadow-sm"
                >
                  <span>Report This Issue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* Option to Report Custom Problem */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Have a different {selectedCategory.name} issue?
                </p>
                <p className="text-[11px] text-slate-400">
                  You can specify custom details directly in the submission form.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onSelectProblem({
                  category: selectedCategory.name,
                  problemType: `Other ${selectedCategory.name} Challenge`,
                  defaultDescription: '',
                })
              }
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold transition-all border border-slate-700 shrink-0 cursor-pointer"
            >
              Report Custom Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
