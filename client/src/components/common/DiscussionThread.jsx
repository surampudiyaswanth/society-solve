import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComments, createComment } from '../../services/commentService';
import { 
  MessageSquare, 
  Send, 
  GraduationCap, 
  Building2, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Cpu, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DiscussionThread({ problemId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [commentType, setCommentType] = useState('Project Update');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getComments(problemId);
      setComments(res.comments || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      fetchComments();
    }
  }, [problemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await createComment(problemId, {
        content,
        commentType,
      });
      setComments((prev) => [...prev, res.comment]);
      setContent('');
    } catch (err) {
      setError(err.message || 'Failed to post update.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'university':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <GraduationCap className="w-3 h-3" />
            <span>University Lead</span>
          </span>
        );
      case 'industry':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-800">
            <Building2 className="w-3 h-3" />
            <span>Corporate Partner</span>
          </span>
        );
      case 'citizen':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
            <Users className="w-3 h-3" />
            <span>Citizen Reporter</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
            <ShieldCheck className="w-3 h-3" />
            <span>Administrator</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCommentTypeTag = (type) => {
    switch (type) {
      case 'Project Update':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
      case 'Funding Offer':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/80';
      case 'Mentorship Advice':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
      case 'Milestone Report':
        return 'text-teal-400 bg-teal-950/60 border-teal-800/80';
      default:
        return 'text-slate-400 bg-slate-950/60 border-slate-800';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            <span>Collaborative Solution Discussion & Milestone Feed</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent communication between Citizens, Universities, Industries, and Platform Admins.
          </p>
        </div>
        <span className="text-xs font-mono text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-xl border border-teal-800">
          {comments.length} Updates
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-slate-500">
            Loading collaborative discussion...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs text-slate-400 font-semibold">No milestone updates posted yet.</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              University researchers, corporate sponsors, and citizens can post project updates, telemetry results, and funding notes here.
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 space-y-2 transition-all hover:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{c.authorName}</span>
                  {getRoleBadge(c.authorRole)}
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getCommentTypeTag(c.commentType)}`}>
                    {c.commentType}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Comment / Update Post Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-800 space-y-3">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Post as:</span>
              <span className="text-xs font-bold text-white">{user.name}</span>
              {getRoleBadge(user.role)}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-slate-400">Update Type:</span>
              <select
                value={commentType}
                onChange={(e) => setCommentType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="Project Update">Project Update</option>
                <option value="Funding Offer">Funding Offer</option>
                <option value="Mentorship Advice">Mentorship Advice</option>
                <option value="Milestone Report">Milestone Report</option>
                <option value="General">General Discussion</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Post a milestone update, telemetry test report, or feedback as a ${user.role}...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              <span>{submitting ? 'Posting...' : 'Post Milestone Update'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="pt-4 border-t border-slate-800 text-center py-4 bg-slate-950 rounded-2xl space-y-2">
          <p className="text-xs text-slate-400">
            Sign in as a Citizen, University researcher, or Industry partner to join the discussion.
          </p>
          <Link
            to="/login"
            className="inline-block px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md"
          >
            Sign In to Post Updates
          </Link>
        </div>
      )}
    </div>
  );
}
