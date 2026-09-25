import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  GraduationCap,
  Building2,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const { user, getDashboardPath } = useAuth();

  const categories = [
    { name: 'Education', count: '14 Active', color: 'from-blue-500 to-indigo-600', desc: 'Digital classrooms, school infrastructure, dropout prevention' },
    { name: 'Healthcare', count: '22 Active', color: 'from-rose-500 to-red-600', desc: 'Emergency response, medicine access, local health awareness' },
    { name: 'Environment', count: '19 Active', color: 'from-emerald-500 to-teal-600', desc: 'Waste management, water pollution, clean air initiatives' },
    { name: 'Transportation', count: '11 Active', color: 'from-amber-500 to-orange-600', desc: 'Road repairs, public transit routes, smart streetlights' },
    { name: 'Public Safety', count: '16 Active', color: 'from-purple-500 to-indigo-600', desc: 'Safe public corridors, lighting, emergency panic points' },
    { name: 'Water & Sanitation', count: '25 Active', color: 'from-cyan-500 to-blue-600', desc: 'Potable water pipelines, drainage fixes, sanitation hygiene' },
    { name: 'Employment', count: '18 Active', color: 'from-yellow-500 to-amber-600', desc: 'Vocational skill incubators, local livelihood creation' },
    { name: 'Agriculture', count: '15 Active', color: 'from-lime-500 to-emerald-600', desc: 'Smart micro-irrigation, crop disease detection, market links' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Citizen Reports Problem',
      actor: 'Citizen',
      desc: 'Citizens spot real community pain points, select from an interactive societal category chart, and submit verified reports.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Government Reviews & Assigns',
      actor: 'Government',
      desc: 'Civic authorities verify reports, allocate to municipal departments, approve initial project scope, and align stakeholders.',
      icon: Building,
    },
    {
      step: '03',
      title: 'University Leads Solution',
      actor: 'University',
      desc: 'Faculty and student research teams adopt challenges, conduct scientific field studies, and engineer innovative prototypes.',
      icon: GraduationCap,
    },
    {
      step: '04',
      title: 'Industry Funds & Scales',
      actor: 'Industry',
      desc: 'Corporate sponsors provide funding grants, technical mentorship, cloud compute, and hardware to pilot the solutions.',
      icon: Building2,
    },
  ];

  const resolveDashboard = (role) => {
    if (getDashboardPath) {
      const path = getDashboardPath(role);
      if (path) return path;
    }
    switch (role) {
      case 'government':
        return '/government';
      case 'admin':
        return '/admin';
      case 'university':
        return '/university';
      case 'industry':
        return '/industry';
      default:
        return '/citizen';
    }
  };

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 pt-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-950/60 border border-teal-800 text-teal-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>A 5-Portal Digital Platform for Collaborative Problem Solving</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Turn Community Problems Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">Real Solutions</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          SocietySolve connects citizens, universities, industries, and government bodies to identify societal challenges and collaboratively build, fund, and deploy measurable solutions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to={user ? resolveDashboard(user.role) : '/login'}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/25 transition-all flex items-center space-x-2"
          >
            <span>Report a Problem</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#categories"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            Explore Solutions
          </a>

          {!user && (
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-400 font-semibold text-sm transition-all"
            >
              Join SocietySolve
            </Link>
          )}
        </div>

        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Community Problems Logged', value: '140+' },
            { label: 'Universities & Labs', value: '38+' },
            { label: 'Industry Sponsors', value: '24+' },
            { label: 'Civic Solutions Deployed', value: '52+' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How SocietySolve Works Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold">The Resolution Pipeline</span>
          <h2 className="text-3xl font-extrabold text-white">How SocietySolve Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-700 font-mono">{s.step}</span>
                    <div className="p-2.5 rounded-xl bg-teal-950 text-teal-400 border border-teal-800">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-teal-400">{s.actor}</span>
                  <h3 className="text-base font-bold text-white mt-1 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Pillars Section: Citizens, Universities, Industries, Government */}
      <section id="actors" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold">Collaborative Stakeholders</span>
          <h2 className="text-3xl font-extrabold text-white">Built for Every Pillar of Society</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Citizens */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-blue-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Citizens</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empower your neighborhood. Report broken water systems, dark streets, or educational gaps and verify on-ground completion.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Report issues with photos and GPS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Real-time status timeline tracking</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 font-semibold text-xs text-center transition-all"
            >
              Register as Citizen
            </Link>
          </div>

          {/* Universities */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Universities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transform academic research into measurable solutions. Form student/faculty teams and engineer working prototypes.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access verified real-world challenge datasets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Form multidisciplinary research squads</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-semibold text-xs text-center transition-all"
            >
              Register Institution
            </Link>
          </div>

          {/* Industry */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-purple-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Industries</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fulfill CSR commitments with tangible outcomes. Review university blueprints, sponsor prototypes, and pilot solutions.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Direct CSR capital to vetted prototypes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Fund and test pilot field implementations</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 font-semibold text-xs text-center transition-all"
            >
              Register Corporate Partner
            </Link>
          </div>

          {/* Government */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-sky-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">For Government</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive and verify reported problems, assign to municipal departments, coordinate pilot deployment, and authorize resolution.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Categorize & assign to civic departments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Validate #8 Implemented & resolve challenges</span>
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="w-full py-2.5 rounded-xl bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 font-semibold text-xs text-center transition-all"
            >
              Access Government Portal
            </Link>
          </div>
        </div>
      </section>

      {/* 8 Societal Problem Categories Section */}
      <section id="categories" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold">Societal Focus Areas</span>
          <h2 className="text-3xl font-extrabold text-white">8 Core Societal Problem Domains</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color}`} />
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700">
                  {cat.count}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{cat.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}