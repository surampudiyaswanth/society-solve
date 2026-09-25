import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am Chitti, your SocietySolve Assistant. Need help reporting an issue or tracking a 10-stage resolution pipeline?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply || data.data?.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: data.message || 'Sorry, I ran into an issue answering that.' }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Network connection failed. Ensure the server is running on port 5000.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Automatically breaks numbered points (1., 2., 3.) and bullets onto separate lines
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    // Force line breaks before numbers or bullets even if the AI sent them in one continuous line
    const normalized = rawText
      .replace(/([.!?])\s+(\d+\.\s+)/g, '$1\n\n$2')
      .replace(/([.!?])\s+([•*-]\s+)/g, '$1\n\n$2');

    const lines = normalized.split('\n');

    return lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={lIdx} style={{ height: '6px' }} />;
      }

      // Remove markdown header hashes (#, ##, ###)
      const cleanLine = trimmed.replace(/^#{1,6}\s*/, '');

      // Parse bold elements (**text**) safely with escaped asterisks
      const parts = cleanLine.split(/(\*\*[\s\S]*?\*\*)/g);
      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} style={{ color: '#5eead4', fontWeight: '700' }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Detect if this line represents an ordered step or a bullet (properly escaped)
      const isListItem = /^(\d+\.|[•*\-])\s+/.test(cleanLine);

      return (
        <div
          key={lIdx}
          style={{
            display: 'block',
            paddingLeft: isListItem ? '8px' : '0px',
            marginBottom: isListItem ? '8px' : '4px',
            lineHeight: '1.6'
          }}
        >
          {parsedParts}
        </div>
      );
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2147483647,
        pointerEvents: 'auto'
      }}
    >
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 22px',
            borderRadius: '9999px',
            backgroundColor: '#14b8a6',
            color: '#020617',
            fontWeight: '800',
            fontSize: '14px',
            border: '2px solid #5eead4',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 15px rgba(20, 184, 166, 0.5)',
            cursor: 'pointer'
          }}
        >
          <Bot style={{ width: '22px', height: '22px', color: '#020617' }} />
          <span>Ask Chitti</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            width: '380px',
            height: '520px',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
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
                  borderRadius: '10px',
                  backgroundColor: '#042f2e',
                  border: '1px solid #115e59',
                  color: '#2dd4bf',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#ffffff', lineHeight: 1.2 }}>
                  Chitti AI
                </h4>
                <span style={{ fontSize: '10px', color: '#2dd4bf', fontFamily: 'monospace' }}>
                  SocietySolve Companion
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#0f172a'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '86%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    backgroundColor: m.sender === 'user' ? '#14b8a6' : '#020617',
                    color: m.sender === 'user' ? '#020617' : '#e2e8f0',
                    fontWeight: m.sender === 'user' ? '600' : '400',
                    border: m.sender === 'user' ? 'none' : '1px solid #1e293b',
                    borderBottomRightRadius: m.sender === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: m.sender === 'user' ? '16px' : '4px'
                  }}
                >
                  {renderFormattedText(m.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Loader2 style={{ width: '14px', height: '14px', color: '#2dd4bf' }} className="animate-spin" />
                  <span>Chitti is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px',
              backgroundColor: '#020617',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask Chitti about problem IDs, tracking, or steps..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                color: '#ffffff',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: '#14b8a6',
                color: '#020617',
                border: 'none',
                opacity: loading || !input.trim() ? 0.4 : 1,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
            </button>
          </form>
        </div>
      )}
    </div>,
    document.body
  );
}