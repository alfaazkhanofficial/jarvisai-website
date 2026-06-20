import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Downloads.css';

export default function Downloads() {
  const { token, apiBase } = useAuth();
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
    setStatus('loading');
    setErrorMsg('');
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiBase}/api/downloads/jarvis`, { headers });
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
      <div className="container downloads-container">
        <p className="eyebrow">Releases</p>
        <h1 className="display">Download JARVIS-AI</h1>
        <p className="text-secondary downloads-sub">
          The full source code, free under the MIT license. Unzip it, drop in your own
          Groq API key, and run it from your terminal.
        </p>

        <div className="download-card glass-strong">
          <div className="download-card-info">
            <div className="download-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3>{info?.filename || 'jarvis-source.zip'}</h3>
              <p className="mono text-tertiary download-meta">
                {info === null && 'checking release…'}
                {info && info.available && `${info.size_mb} MB · ready`}
                {info && !info.available && 'not uploaded yet'}
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={!info?.available || status === 'loading'}
          >
            {status === 'loading' ? 'Preparing…' : 'Download .zip'}
          </button>
        </div>

        {status === 'error' && (
          <p className="download-error mono">⚠ {errorMsg}</p>
        )}

        {info && !info.available && (
          <p className="download-note text-tertiary">
            The release hasn't been uploaded to the server yet — check back shortly.
          </p>
        )}

        <div className="download-steps">
          <p className="eyebrow">Quick start</p>
          <ol>
            <li><span className="mono">1.</span> Unzip the download anywhere on your machine.</li>
            <li><span className="mono">2.</span> Run <code className="mono">pip install -r requirements.txt</code> inside the folder.</li>
            <li><span className="mono">3.</span> Add your free <code className="mono">GROQ_API_KEY</code> to the <code className="mono">.env</code> file.</li>
            <li><span className="mono">4.</span> Run <code className="mono">python run.py</code> and open <code className="mono">localhost:8000</code>.</li>
          </ol>
        </div>

        <p className="download-credit text-tertiary">
          Originally built by{' '}
          <a href="https://www.theshreshthkaushik.com/" target="_blank" rel="noopener noreferrer">
            Shreshth Kaushik
          </a>{' '}
          — released under the MIT license.
        </p>
      </div>
    </div>
  );
}
