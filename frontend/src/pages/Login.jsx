import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="login-card glass-strong">
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

        <h1 className="display login-title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-secondary login-sub">
          {mode === 'login'
            ? 'Log in to track your downloads and saved builds.'
            : 'Sign up — it takes about ten seconds, no email confirmation needed.'}
        </p>

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
              <span>Email</span>
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
              <span>Email or username</span>
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
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
