import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrap container">
      <div className="footer-card card">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>JARVIS-AI</h3>
            <p className="text-secondary">
              A free, open-source personal AI assistant. Download the source,
              run it on your own machine, make it yours.
            </p>
          </div>
          <div className="footer-links">
            <span className="footer-links-title">Pages</span>
            <Link to="/downloads">Download</Link>
            <Link to="/login">Login</Link>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="text-tertiary">© 2026 JARVIS-AI. All rights reserved.</span>
          <span className="text-tertiary">MIT licensed · originally by Alfaaz Khan</span>
        </div>
      </div>
    </footer>
  );
}
