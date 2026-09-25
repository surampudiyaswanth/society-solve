import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import AIMatchModal from './AIMatchModal';

export default function ProblemCard({ problem }) {
  const [isMatchOpen, setIsMatchOpen] = useState(false);

  return (
    <div className="problem-card">
      <h4>{problem.title}</h4>
      <p>{problem.description}</p>

      {/* Button to open AI Matching */}
      <button
        onClick={() => setIsMatchOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: '#0f172a',
          color: '#2dd4bf',
          border: '1px solid #115e59',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        <Sparkles style={{ width: '14px', height: '14px' }} />
        <span>Match Stakeholders</span>
      </button>

      {/* Matching Modal */}
      <AIMatchModal
        isOpen={isMatchOpen}
        onClose={() => setIsMatchOpen(false)}
        problemId={problem._id}
        problemTitle={problem.title}
      />
    </div>
  );
}