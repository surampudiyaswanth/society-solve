import React, { useState } from 'react';
import { Sparkles, X, Building2, GraduationCap, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function AIMatchModal({ isOpen, onClose, problemId, problemTitle }) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleFetchMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/match/${problemId}`);
      const data = res.data;

      if (data?.success) {
        setMatches(data.matches || []);
        setSearched(true);
      } else {
        setError(data?.message || 'Unable to retrieve AI matches.');
      }
    } catch (err) {
      setError('Failed to connect to matching server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#020617',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#042f2e',
                border: '1px solid #115e59',
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                AI Stakeholder Matching
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Powered by Gemini & SocietySolve
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#020617',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              marginBottom: '16px'
            }}
          >
            <span style={{ fontSize: '11px', color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Selected Challenge
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>
              {problemTitle || 'Community Challenge'}
            </p>
          </div>

          {!searched && !loading && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
                Run the AI matching algorithm to identify top-suited universities and industry sponsors based on technical focus and regional alignment.
              </p>
              <button
                onClick={handleFetchMatches}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#14b8a6',
                  color: '#020617',
                  fontWeight: '700',
                  fontSize: '13px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                <span>Find Matched Stakeholders</span>
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <Loader2 style={{ width: '32px', height: '32px', color: '#2dd4bf', margin: '0 auto 12px auto' }} className="animate-spin" />
              <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>
                Evaluating stakeholder matrix...
              </p>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Scoring technical domain relevance & location
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '13px'
              }}
            >
              {error}
            </div>
          )}

          {searched && !loading && matches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
              No matches found with fit score &ge; 60%.
            </div>
          )}

          {searched && !loading && matches.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {matches.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.role === 'university' ? (
                        <GraduationCap style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                      ) : (
                        <Building2 style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                      )}
                      <span style={{ fontSize: '12px', textTransform: 'capitalize', color: '#cbd5e1', fontWeight: '600' }}>
                        {item.role}
                      </span>
                    </div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#042f2e',
                        color: '#2dd4bf',
                        border: '1px solid #115e59'
                      }}
                    >
                      {item.matchScore}% Fit
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#020617',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}