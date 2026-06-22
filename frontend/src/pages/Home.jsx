import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87V17a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-6.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4Z" strokeLinejoin="round" />
        <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Most Advanced AI Assistant',
    body: 'Three chat modes that auto-route between knowledge, memory, and live web search depending on what you ask.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Instant Setup',
    body: 'Unzip, add your free Groq API key, and run one command. No build steps, no waiting periods.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Yours to Keep',
    body: 'No subscription, no license check-ins. Download once and the source code is permanently yours.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Clean & Documented',
    body: 'A well-organized FastAPI codebase with clear structure, comments, and a README to get you oriented fast.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Setup took less than ten minutes. The voice responses streaming in real time is genuinely impressive for a free project.',
    name: 'Early Tester',
  },
  {
    quote: 'Clean codebase, easy to read. I forked it to add my own tools within an afternoon.',
    name: 'Beta User',
  },
  {
    quote: 'The vision and memory features work better than I expected from a personal AI assistant project.',
    name: 'JARVIS-AI User',
  },
];

const FAQS = [
  {
    q: 'Is JARVIS-AI really free?',
    a: 'Yes. The full source code is free under the MIT license. You just need a free account on this site to download it.',
  },
  {
    q: 'What do I need to run it?',
    a: 'Python 3.10+, a free Groq API key, and about five minutes. Full setup steps are on the Downloads page.',
  },
  {
    q: 'Can I modify the source code?',
    a: 'Yes — it\u2019s MIT licensed, so you can modify, extend, and redistribute it as long as the original attribution is kept.',
  },
  {
    q: 'Do I need to stay logged in to keep using it?',
    a: 'No. Logging in is only required to download the zip. Once it\u2019s on your machine, it runs independently — no account checks at runtime.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item card">
      <button className="faq-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <svg
          className={`faq-chevron ${open ? 'is-open' : ''}`}
          viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <p className="faq-answer text-secondary">{a}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero container">
        <div className="hero-card card">
          <span className="pill-badge">Open source · MIT license</span>
          <h1 className="display hero-title">
            Just A Rather<br />Very Intelligent System
          </h1>
          <p className="hero-sub text-secondary">
            A personal AI assistant with a full web UI — chat, voice, vision, and memory,
            running entirely on your own machine with one command.
          </p>
          <div className="hero-actions">
            <Link to="/downloads" className="btn btn-primary">Download JARVIS-AI</Link>
          </div>
          <code className="hero-command mono">python run.py</code>
        </div>
      </section>

      {/* Features */}
      <section className="section-panel container features-section">
        <div className="section-head">
          <span className="pill-badge">Features</span>
          <h2 className="display">Why Choose JARVIS-AI?</h2>
          <p className="text-secondary">
            Everything you need to run a powerful personal AI assistant — free, open source,
            and ready in minutes.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="text-secondary">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-panel container testimonials-section">
        <div className="section-head">
          <span className="pill-badge">Testimonials</span>
          <h2 className="display">What people are saying</h2>
          <p className="text-secondary">Early feedback from people who've tried it.</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card card" key={t.name}>
              <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-panel container faq-section">
        <div className="section-head">
          <span className="pill-badge">FAQ</span>
          <h2 className="display">Download and setup — answered.</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="section-panel container contact-section">
        <div className="section-head">
          <span className="pill-badge">Contact Us</span>
          <h2 className="display">Get in Touch</h2>
          <p className="text-secondary">
            Have questions? Send a message and we'll get back to you.
          </p>
        </div>
        <form
          className="contact-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="contact-row">
            <label className="contact-field">
              <span>Full Name *</span>
              <input type="text" required placeholder="Your name" />
            </label>
            <label className="contact-field">
              <span>Email Address *</span>
              <input type="email" required placeholder="you@example.com" />
            </label>
          </div>
          <label className="contact-field">
            <span>Subject (Optional)</span>
            <input type="text" placeholder="What's this about?" />
          </label>
          <label className="contact-field">
            <span>Message *</span>
            <textarea required placeholder="Tell us what's on your mind..." rows={5} maxLength={5000} />
          </label>
          <div className="contact-footer">
            <span className="text-tertiary">0 / 5000 characters</span>
            <button type="submit" className="btn btn-primary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Send Message
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
