import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`navbar-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar glass" aria-label="Primary">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
              <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.8" />
              <circle cx="16" cy="16" r="4" fill="currentColor" />
            </svg>
          </span>
          JARVIS-AI
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/') ? 'is-active' : ''}>Home</Link>
          <Link to="/downloads" className={isActive('/downloads') ? 'is-active' : ''}>Downloads</Link>
          {user ? (
            <button className="navbar-user" onClick={logout} title="Click to log out">
              {user.username}
            </button>
          ) : (
            <Link to="/login" className={isActive('/login') ? 'is-active' : ''}>Login</Link>
          )}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-github"
            aria-label="View source on GitHub"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.39-1.25.71-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>

        <button
          className="navbar-burger"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {mobileOpen && (
        <div className="navbar-mobile glass">
          <Link to="/">Home</Link>
          <Link to="/downloads">Downloads</Link>
          {user ? (
            <button onClick={logout}>Log out ({user.username})</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      )}
    </header>
  );
}
