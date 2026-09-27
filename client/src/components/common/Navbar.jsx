import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  User, 
  Menu, 
  X,
  GraduationCap,
  Building2,
  Building,
  Users,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Users className="w-3.5 h-3.5 text-[#009FA6]" />
            <span className="capitalize">{role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </span>
        );
      case 'university':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>University</span>
            <ChevronDown className="w-3 h-3 text-emerald-400" />
          </span>
        );
      case 'industry':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Industry</span>
            <ChevronDown className="w-3 h-3 text-purple-400" />
          </span>
        );
      case 'government':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            <span>Government</span>
            <ChevronDown className="w-3 h-3 text-sky-400" />
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin</span>
            <ChevronDown className="w-3 h-3 text-amber-400" />
          </span>
        );
      default:
        return null;
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-[#009FA6] flex items-center justify-center font-black text-white text-base shadow-sm group-hover:scale-105 transition-transform">
              SS
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Society<span className="text-[#009FA6]">Solve</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#009FA6] font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/problems" 
              className={`text-sm font-medium pb-0.5 transition-all relative ${
                isActive('/problems') || isActive('/citizen') 
                  ? 'text-[#009FA6] font-semibold after:content-[""] after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#009FA6] after:rounded-full' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explore Challenges
            </Link>

            <Link 
              to="/solutions" 
              className={`text-sm font-medium transition-colors ${
                isActive('/solutions') ? 'text-[#009FA6] font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solutions Hub
            </Link>

            <a 
              href="/#how-it-works" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </a>

            <a 
              href="/#actors" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Ecosystem
            </a>
          </div>

          {/* Right Actions / User Profile */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />

                {/* Role Badge */}
                {getRoleBadge(user.role)}

                {/* Dashboard Button */}
                <Link
                  to={resolveDashboard(user.role)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#009FA6] hover:bg-[#008389] text-white font-medium text-xs shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                {/* User Pill */}
                <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.name?.split(' ')[0] || 'User'}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center">
                    {(user.name || 'S').charAt(0).toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-[#009FA6] hover:bg-[#008389] text-white font-medium text-sm shadow-sm transition-all"
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
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-5 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Home
          </Link>
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#009FA6] py-1.5"
          >
            Explore Challenges
          </Link>
          <Link
            to="/solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Solutions Hub
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            How It Works
          </a>
          <a
            href="/#actors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Ecosystem
          </a>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                {getRoleBadge(user.role)}
              </div>
              <Link
                to={resolveDashboard(user.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-[#009FA6] text-white font-medium text-xs shadow-sm"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-xs font-medium text-rose-500 py-1.5 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-xl bg-[#009FA6] text-white text-sm font-medium shadow-sm"
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