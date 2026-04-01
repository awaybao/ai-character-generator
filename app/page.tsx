'use client';

import { useState } from 'react';
import { STYLES } from '@/lib/replicate';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cartoon');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a character description');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setError(err.message || 'Generation failed, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `character-${Date.now()}.png`;
    link.click();
  };

  const styleLabels: Record<string, string> = {
    cartoon: '🎨 Cartoon',
    anime: '⛩️ Anime',
    realistic: '📷 Realistic',
    pixel: '🕹️ Pixel Art',
    '3d': '🧊 3D',
    flat: '🎯 Flat Design',
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 16px',
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '999px',
              color: '#60a5fa',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Powered by AI
          </div>
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #60a5fa)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            AI Character Generator
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', letterSpacing: '0.5px', textAlign: 'center' }}>
            Describe in words, instantly generate unique virtual mascots and brand characters
          </p>
        </header>

        <div
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '16px',
            padding: '36px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 40px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#60a5fa',
                  marginBottom: '8px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                ◈ Character Description
              </label>
              <textarea
                rows={4}
                placeholder="e.g., An orange fox wearing a spacesuit, futuristic and tech-savvy, friendly and cute..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(30,41,59,0.8)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '10px',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#60a5fa',
                  marginBottom: '10px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                ◈ Style Selection
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {Object.keys(STYLES).map((key) => (
                  <button
                    key={key}
                    onClick={() => setStyle(key)}
                    disabled={loading}
                    style={{
                      padding: '10px 8px',
                      background: style === key ? 'rgba(59,130,246,0.2)' : 'rgba(30,41,59,0.5)',
                      border: style === key ? '1px solid rgba(59,130,246,0.7)' : '1px solid rgba(59,130,246,0.15)',
                      borderRadius: '8px',
                      color: style === key ? '#93c5fd' : '#94a3b8',
                      fontSize: '13px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: style === key ? '0 0 12px rgba(59,130,246,0.2)' : 'none',
                    }}
                  >
                    {styleLabels[key] || key}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '14px',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                width: '100%',
                padding: '14px',
                background: loading || !prompt.trim()
                  ? 'rgba(59,130,246,0.15)'
                  : 'linear-gradient(90deg, #2563eb, #7c3aed)',
                border: '1px solid rgba(59,130,246,0.4)',
                borderRadius: '10px',
                color: loading || !prompt.trim() ? '#64748b' : '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '1px',
                boxShadow: loading || !prompt.trim() ? 'none' : '0 0 20px rgba(59,130,246,0.35)',
              }}
            >
              {loading ? '⏳ Generating...' : '⚡ Generate Character'}
            </button>
          </div>

          {loading && (
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '3px solid rgba(59,130,246,0.2)',
                  borderTop: '3px solid #60a5fa',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ marginTop: '16px', color: '#60a5fa', fontSize: '14px', letterSpacing: '1px' }}>
                Awakening AI creation engine...
              </p>
            </div>
          )}

          {imageUrl && !loading && (
            <div style={{ marginTop: '32px' }}>
              <div
                style={{
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 0 30px rgba(59,130,246,0.15)',
                }}
              >
                <img
                  src={imageUrl}
                  alt="Generated character"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <button
                onClick={handleDownload}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '13px',
                  background: 'linear-gradient(90deg, #059669, #0891b2)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '1px',
                  boxShadow: '0 0 20px rgba(16,185,129,0.25)',
                }}
              >
                ↓ Download Image
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#334155', fontSize: '12px' }}>
          Powered by Replicate AI · Generation takes approximately 10–30 seconds
        </p>
      </div>
    </div>
  );
}
