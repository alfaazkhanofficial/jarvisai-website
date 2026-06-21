import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="page profile-page">
      <div className="container profile-topbar">
        <Link to="/" className="downloads-back">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
        <button className="downloads-back" onClick={logout}>
          Logout
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="container profile-container">
        <div className="profile-avatar">{initials}</div>
        <span className="pill-badge">Your Profile</span>
        <h1 className="display profile-name">{user.username}</h1>
        <p className="text-secondary">{user.email}</p>

        <div className="profile-info-card card">
          <h3>Account Information</h3>
          <div className="profile-info-row">
            <span className="text-tertiary">Username</span>
            <span>{user.username}</span>
          </div>
          <div className="profile-info-row">
            <span className="text-tertiary">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="text-tertiary">User ID</span>
            <span className="mono">#{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
