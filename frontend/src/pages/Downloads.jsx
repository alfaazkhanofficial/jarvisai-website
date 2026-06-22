import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Downloads.css';

const INCLUDED = [
  { title: 'Complete Source Code', body: 'All files and components included' },
  { title: 'Setup Documentation', body: 'Step-by-step quick start guide' },
  { title: 'MIT License', body: 'Modify and redistribute freely' },
  { title: 'Unlimited Downloads', body: 'Re-download anytime, no limits' },
];

export default function Downloads() {
  const { token, user, apiBase } = useAuth();
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/api/downloads/info`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch(() => {
        if (!cancelled) setInfo({ available: false });
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const handleDownload = async () => {
    if (!token) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${apiBase}/api/downloads/jarvis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = info?.filename || 'jarvis-source.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="page downloads-page">
      <div className="container downloads-topbar">
        <Link to="/" className="downloads-back">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
        {user && <Link to="/profile" className="downloads-back">Go to Profile</Link>}
      </div>

      <div className="container downloads-container">
        <span className="pill-badge">Download Source Code</span>
        <h1 className="display">JARVIS-AI Source Access</h1>
        <p className="text-secondary downloads-sub">Download the complete source code package</p>

        <div className="download-gate-card card">
          {!user ? (
            <>
              <div className="lock-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                </svg>
              </div>
              <h2>Login Required</h2>
              <p className="text-secondary">You need an account to download the source code</p>
              <Link to="/login" className="btn btn-primary gate-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Log in or sign up
              </Link>
              <p className="gate-footnote text-tertiary">It's free — just an account, no payment</p>
            </>
          ) : (
            <>
              <div className="lock-icon lock-icon-open">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 7.45-2" />
                </svg>
              </div>
              <h2>{info?.filename || 'jarvis-source.zip'}</h2>
              <p className="mono text-tertiary">
                {info === null && 'checking release…'}
                {info && info.available && `${info.size_mb} MB · ready`}
                {info && !info.available && 'not uploaded yet'}
              </p>
              <button
                className="btn btn-primary gate-btn"
                onClick={handleDownload}
                disabled={!info?.available || status === 'loading'}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {status === 'loading' ? 'Preparing…' : 'Download .zip'}
              </button>
              {status === 'error' && <p className="download-error mono">⚠ {errorMsg}</p>}
              {info && !info.available && (
                <p className="gate-footnote text-tertiary">Not uploaded yet — check back shortly.</p>
              )}
            </>
          )}
        </div>

        <div className="included-card card">
          <h3>What's Included</h3>
          <div className="included-grid">
            {INCLUDED.map((item) => (
              <div className="included-item" key={item.title}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="included-check">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="included-title">{item.title}</p>
                  <p className="text-secondary included-body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quickstart-card card">
          <span className="pill-badge">Quick Start</span>
          <ol className="quickstart-list">
            <li><span className="mono">1.</span> Unzip the download anywhere on your machine.</li>
            <li><span className="mono">2.</span> Run <code className="mono">pip install -r requirements.txt</code> inside the folder.</li>
            <li><span className="mono">3.</span> Add your free <code className="mono">GROQ_API_KEY</code> to the <code className="mono">.env</code> file.</li>
            <li><span className="mono">4.</span> Run <code className="mono">python run.py</code> and open <code className="mono">localhost:8000</code>.</li>
          </ol>
        </div>

        <p className="download-credit text-tertiary">
          Originally built by{' '}
          <a href="https://www.youtube.com/@TezGamerzofficial" target="_blank" rel="noopener noreferrer">
            Alfaaz Khan
          </a>{' '}
          — released under the MIT license.
        </p>
      </div>
    </div>
  );
}
