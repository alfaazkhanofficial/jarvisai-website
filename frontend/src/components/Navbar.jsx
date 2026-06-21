import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar-wrap">
      <nav className="navbar glass" aria-label="Primary">
        <Link to="/" className="navbar-brand">JARVIS-AI</Link>

        <div className="navbar-actions">
          <Link to="/downloads" className="navbar-pill-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download
          </Link>

          {user ? (
            <Link to="/profile" className="navbar-pill-btn navbar-pill-btn-solid navbar-pill-btn-icon" aria-label="Profile">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          ) : (
            <Link to="/login" className="navbar-pill-btn navbar-pill-btn-solid">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login
            </Link>
          )}
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
          <Link to="/downloads">Download</Link>
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <button className="navbar-mobile-user" onClick={logout}>Log out</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
