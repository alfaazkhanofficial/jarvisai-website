import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ identifier: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(form.identifier, form.password);
      } else {
        await signup(form.username, form.email, form.password);
      }
      navigate('/downloads');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="container login-topbar">
        <Link to="/" className="downloads-back">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="login-card card">
        <span className="pill-badge login-pill">
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </span>

        <h1 className="display login-title">
          {mode === 'login' ? 'Login to JARVIS-AI' : 'Create your account'}
        </h1>
        <p className="text-secondary login-sub">
          {mode === 'login'
            ? 'Access your account and download the source code'
            : 'Sign up — it takes about ten seconds, no email confirmation needed'}
        </p>

        <div className="login-tabs">
          <button
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => { setMode('login'); setError(''); }}
            type="button"
          >
            Log in
          </button>
          <button
            className={mode === 'signup' ? 'is-active' : ''}
            onClick={() => { setMode('signup'); setError(''); }}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'signup' && (
            <label className="login-field">
              <span>Username</span>
              <input
                type="text"
                value={form.username}
                onChange={update('username')}
                placeholder="alfaaz"
                minLength={3}
                maxLength={32}
                required
              />
            </label>
          )}

          {mode === 'signup' ? (
            <label className="login-field">
              <span>Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                required
              />
            </label>
          ) : (
            <label className="login-field">
              <span>Email or Username</span>
              <input
                type="text"
                value={form.identifier}
                onChange={update('identifier')}
                placeholder="you@example.com"
                required
              />
            </label>
          )}

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              minLength={mode === 'signup' ? 8 : undefined}
              required
            />
          </label>

          {error && <p className="login-error mono">⚠ {error}</p>}

          <button type="submit" className="btn btn-primary login-submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <p className="login-switch text-secondary">
            {mode === 'login' ? (
              <>New to JARVIS-AI? <button type="button" onClick={() => setMode('signup')}>Create an account</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => setMode('login')}>Log in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
