import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  User, 
  Menu, 
  X,
  GraduationCap,
  Building2,
  Building,
  Users,
  ShieldCheck
} from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const getRoleBadge = (role) => {
    switch (role) {
      case 'citizen':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700">
            <Users className="w-3 h-3" />
            <span>Citizen</span>
          </span>
        );
      case 'university':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
            <GraduationCap className="w-3 h-3" />
            <span>University</span>
          </span>
        );
      case 'industry':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700">
            <Building2 className="w-3 h-3" />
            <span>Industry</span>
          </span>
        );
      case 'government':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-700">
            <Building className="w-3 h-3 text-sky-400" />
            <span>Government</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center font-extrabold text-slate-950 text-lg shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              SS
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Society<span className="text-teal-400">Solve</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/problems" className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center space-x-1">
              <span>Explore Challenges</span>
            </Link>
            <Link to="/solutions" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1">
              <span>Solutions Hub</span>
            </Link>
            <a href="/#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="/#actors" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Ecosystem
            </a>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                <NotificationBell />
                {getRoleBadge(user.role)}
                <Link
                  to={resolveDashboard(user.role)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-semibold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                  <span>{user.name?.split(' ')[0] || 'User'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm shadow-md shadow-teal-500/20 transition-all"
                >
                  Join SocietySolve
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 py-1"
          >
            Home
          </Link>
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-teal-400 py-1"
          >
            Explore Challenges
          </Link>
          <Link
            to="/solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-purple-400 py-1"
          >
            Solutions Hub
          </Link>
          {user ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-400">{user.name}</span>
                {getRoleBadge(user.role)}
              </div>
              <Link
                to={resolveDashboard(user.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg bg-teal-600 text-slate-950 font-semibold text-xs"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs text-rose-400 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg bg-teal-500 text-slate-950 text-sm font-semibold"
              >
                Join SocietySolve
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}