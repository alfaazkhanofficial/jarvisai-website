import { Link } from 'react-router-dom';
import './Home.css';

const FEATURES = [
  {
    label: 'Chat',
    title: 'Three modes, one assistant',
    body: 'Jarvis Mode auto-routes between knowledge and web search. General Mode answers fast from memory. Realtime Mode pulls fresh results from the web before replying.',
  },
  {
    label: 'Voice',
    title: 'Talks back as it types',
    body: 'Responses stream out loud using free Microsoft Edge TTS — the first sentence starts playing before the full reply has even finished generating.',
  },
  {
    label: 'Vision',
    title: 'Sees what you show it',
    body: 'Send a photo or use your webcam and Jarvis can describe it, read it, or answer questions about what\u2019s in frame.',
  },
  {
    label: 'Memory',
    title: 'Remembers what you tell it',
    body: 'Drop personal notes into a learning folder and Jarvis recalls them in later conversations — and keeps full chat history across restarts.',
  },
];

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero container">
        <p className="eyebrow">Open source · MIT license</p>
        <h1 className="display hero-title">
          Just A Rather<br />Very Intelligent System
        </h1>
        <p className="hero-sub text-secondary">
          A personal AI assistant with a full web UI — chat, voice, vision, and image
          generation, running entirely on your own machine with one command.
        </p>
        <div className="hero-actions">
          <Link to="/downloads" className="btn btn-primary">Download JARVIS-AI</Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View source
          </a>
        </div>
        <code className="hero-command mono">python run.py</code>
      </section>

      <section className="features container">
        <p className="eyebrow features-eyebrow">What it does</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card glass" key={f.label}>
              <span className="feature-label mono">{f.label}</span>
              <h3>{f.title}</h3>
              <p className="text-secondary">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner container">
        <div className="cta-banner-inner glass-strong">
          <div>
            <h2>Get the source. Run it tonight.</h2>
            <p className="text-secondary">No payment, no waitlist — just a zip file and a terminal.</p>
          </div>
          <Link to="/downloads" className="btn btn-primary">Go to downloads</Link>
        </div>
      </section>
    </div>
  );
}
