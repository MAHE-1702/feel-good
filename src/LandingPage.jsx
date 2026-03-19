import { useState, useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: .6; }
      100% { transform: scale(1.5); opacity: 0;  }
    }
    @keyframes spin-slow { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(360deg); } 
    }
    @keyframes spin-rev { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(-360deg); } 
    }
    .fade-up   { animation: fadeUp 0.7s ease both; }
    .fade-in   { animation: fadeIn 0.5s ease both; }
    .delay-1   { animation-delay: 0.10s; }
    .delay-2   { animation-delay: 0.22s; }
    .delay-3   { animation-delay: 0.34s; }
    .delay-4   { animation-delay: 0.46s; }
    .delay-5   { animation-delay: 0.58s; }

    .section-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.2em;
      color: var(--color-accent);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--color-accent);
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 0.8rem 1.8rem;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 300ms ease;
      text-decoration: none;
      white-space: nowrap;
    }
    .btn-primary:hover {
      background: #c0392b;
      transform: scale(1.04);
      box-shadow: 0 8px 24px rgba(196,149,106,0.35);
    }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: transparent;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.8rem 1.8rem;
      border-radius: 50px;
      border: 1.5px solid rgba(255,255,255,0.45);
      cursor: pointer;
      transition: all 300ms ease;
      text-decoration: none;
    }
    .btn-ghost:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.8);
    }

    .service-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 2rem 1.6rem;
      transition: all 300ms ease;
      cursor: default;
    }
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 40px rgba(44,95,110,0.12);
      border-left: 3px solid var(--color-accent);
    }

    .contact-row {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--color-border);
      transition: all 300ms ease;
    }
    .contact-row:last-child { border-bottom: none; }
    .contact-row:hover { transform: translateX(4px); }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid var(--color-border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem;
      color: var(--color-text);
      background: #fff;
      outline: none;
      transition: border-color 300ms ease;
    }
    .form-input:focus { border-color: var(--color-primary); }
    .form-input::placeholder { color: var(--color-muted); }

    .consult-card {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 2.4rem 2rem;
      transition: all 300ms ease;
    }
    .consult-card:hover {
      background: rgba(255,255,255,0.11);
      transform: translateY(-4px);
    }

    .nav-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      padding: 0.3rem 0;
      position: relative;
      transition: color 300ms ease;
    }
    .nav-link::after {
      content: '';
      position: absolute; bottom: 0; left: 0;
      width: 0; height: 2px;
      background: var(--color-accent);
      transition: width 300ms ease;
    }
    .nav-link:hover { color: var(--color-primary); }
    .nav-link:hover::after { width: 100%; }

    /* ── Popup ── */
    @keyframes popupIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    .popup-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(15, 30, 45, 0.72);
      backdrop-filter: blur(6px);
      animation: fadeIn 0.3s ease both;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .popup-box {
      position: relative;
      z-index: 10000;
      background: linear-gradient(145deg, #ffffff 0%, #f7f4ef 100%);
      border-radius: 24px;
      padding: 3rem 2.8rem 2.4rem;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 32px 80px rgba(15,30,45,0.35), 0 0 0 1px rgba(196,149,106,0.2);
      animation: popupIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      text-align: center;
      max-height: 90vh;
      overflow-y: auto;
    }
    .popup-close {
      position: absolute; top: 1rem; right: 1.1rem;
      background: none; border: none; cursor: pointer;
      color: #9aa5b1; font-size: 1.5rem; line-height: 1;
      transition: color 200ms ease, transform 200ms ease;
      padding: 0.2rem 0.4rem;
      border-radius: 50%;
    }
    .popup-close:hover { color: #1a3240; transform: rotate(90deg); }
    .popup-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(44,95,110,0.1);
      color: var(--color-primary);
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem; letter-spacing: 0.18em;
      text-transform: uppercase;
      border-radius: 50px;
      padding: 0.4rem 1rem;
      margin-bottom: 1.2rem;
    }
    .popup-register-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
      background: #c0392b;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      padding: 1rem 2.2rem;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      width: 100%;
      margin-top: 1.2rem;
      transition: all 300ms ease;
      box-shadow: 0 8px 28px rgba(192,57,43,0.35);
      text-decoration: none;
      letter-spacing: 0.04em;
    }
    .popup-register-btn:hover:not(:disabled) {
      background: #a93226;
      box-shadow: 0 12px 36px rgba(192,57,43,0.5);
      transform: translateY(-2px);
    }
    .popup-register-btn:disabled {
      opacity: 0.7; cursor: not-allowed;
    }
    .popup-later {
      margin-top: 1rem;
      font-size: 0.82rem;
      color: #6b7a8d;
      cursor: pointer;
      background: none; border: none;
      font-family: 'DM Sans', sans-serif;
      transition: color 200ms ease;
      text-decoration: underline;
    }
    .popup-later:hover { color: #1a2744; }

    /* Popup Form Styles */
    .popup-form {
      text-align: left;
      margin-top: 1.5rem;
    }
    .popup-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #e1e8ed;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      margin-bottom: 0.8rem;
      color: #1a2744;
      background: #fafbfc;
      transition: all 200ms ease;
    }
    .popup-input:focus {
      outline: none;
      border-color: #c0392b;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(192,57,43,0.1);
    }
    .popup-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: #1a2744;
      margin-bottom: 0.3rem;
      font-family: 'DM Sans', sans-serif;
    }
    .popup-radio-group {
      display: flex; gap: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .popup-radio-label {
      display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.9rem; color: #4a5568; cursor: pointer;
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    // { label: 'Home', href: '#home' },
    // { label: 'About', href: '#about' },
    // { label: 'Services', href: '#services' },
    // { label: 'Consultation', href: '#consultation' },
    // { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 300ms ease',
        background: scrolled ? 'rgba(247,244,239,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        padding: scrolled ? '0.6rem 0' : '1.2rem 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }} aria-label="Feel Good Cafe">
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', color: scrolled ? 'var(--color-text)' : '#fff', transition: 'color 300ms ease' }}>Feel Good Cafe</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="nav-link" style={{ color: scrolled ? 'var(--color-text)' : 'rgba(255,255,255,0.85)' }}>{l.label}</a>
          ))}
          <a href="tel:+91 8825982278" className="btn-primary" style={{ color: '#fff', padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}>
            📞 Call Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: scrolled ? 'var(--color-text)' : '#fff' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ background: 'rgba(247,244,239,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--color-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="nav-link" style={{ fontSize: '1.05rem', color: 'var(--color-text)' }} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="tel:+919876543210" className="btn-primary" style={{ color: '#fff', textAlign: 'center', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
            📞 Call Now: +91 98765 43210
          </a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero"
      style={{
        minHeight: '100vh',
        background: 'var(--color-hero-bg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background decorative shapes */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-10%', right: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(44,95,110,0.6) 0%, transparent 70%)', zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-8%', left: '-6%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,149,106,0.15) 0%, transparent 70%)', zIndex: 0 }} />
      {/* Subtle grain overlay */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, zIndex: 0 }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '7rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }} className="grid-hero">
        {/* Left: Text */}
        <div>
          <p className="section-label fade-up" style={{ color: 'var(--color-accent)', letterSpacing: '0.22em' }}> Wellness for Women</p>

          <h1 className="fade-up delay-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', color: '#fff', lineHeight: 1.15, margin: '0.4rem 0 1rem' }}>
            Break Free... Heal...<br />Become Stronger...
          </h1>

          <p className="fade-up delay-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: 480, marginBottom: '0.5rem', fontStyle: 'italic' }}>
            If you feel stuck in the same emotional patterns…<br />
            If you're trying to stay positive... but something keeps pulling you back…
          </p>

          <p className="fade-up delay-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '1.4rem' }}>
            You're not alone.
          </p>

          <p className="fade-up delay-3" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.97rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 480, marginBottom: '2rem' }}>
            Many women silently carry this weight — feeling drained, disconnected,
            or trapped in repeated struggles. Your life won't change by waiting.
            It changes the moment you decide.
          </p>

          {/* <div className="fade-up delay-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => document.getElementById('register-popup-trigger')?.click()}
              className="btn-primary"
              style={{ background: '#c0392b', boxShadow: '0 8px 24px rgba(192,57,43,0.4)', color: '#fff', fontSize: '1rem', padding: '0.9rem 2rem' }}
            >
              📝 Register Now
            </button>
            <a href="#services" className="btn-ghost">↓ Our Services</a>
          </div> */}

          {/* Transformation points */}
          <div className="fade-up delay-5" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              'Release old emotional patterns',
              'Reconnect with yourself',
              'Step into a stronger, more confident you',
            ].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1rem' }}>✦</span>
                <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', fontFamily: "'DM Sans', sans-serif" }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Second CTA */}
          <div className="fade-up delay-5" style={{ marginTop: '1.8rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
              You deserve better. This is your moment.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open-register-popup'))}
              style={{
                background: '#c0392b',   // initial red
                border: '2px solid #c0392b',
                color: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 300ms ease',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'transparent';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#c0392b';
              }}
            >
              REGISTER NOW →
            </button>
          </div>
        </div>

        {/* Right: Clinic visual — Circle container */}
        {/* Right: Clinic visual — Circle container */}
        <div className="fade-in delay-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 320, height: 320 }}>

            {/* Outer dashed rotating ring */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: -28, borderRadius: '50%',
              border: '1px dashed rgba(196,149,106,0.2)',
              animation: 'spin-slow 18s linear infinite'
            }} />

            {/* Dots on rotating ring */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: -28, borderRadius: '50%', animation: 'spin-slow 18s linear infinite' }}>
              {[['top', '6px', 'left', '50%'], ['bottom', '6px', 'left', '50%'], ['left', '6px', 'top', '50%'], ['right', '6px', 'top', '50%']].map(([side, val, side2, val2], i) => (
                <div key={i} style={{ position: 'absolute', [side]: val, [side2]: val2, transform: side === 'left' || side === 'right' ? 'translateY(-50%)' : 'translateX(-50%)', width: 5, height: 5, borderRadius: '50%', background: 'rgba(196,149,106,0.6)' }} />
              ))}
            </div>

            {/* Pulse rings */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(196,149,106,0.3)', animation: 'pulse-ring 3s ease-out infinite' }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(196,149,106,0.15)', animation: 'pulse-ring 3s ease-out 1s infinite' }} />

            {/* Counter-rotating inner ring */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '1px solid rgba(196,149,106,0.12)', animation: 'spin-rev 24s linear infinite' }} />

            {/* Main circle */}
            <div style={{
              width: 320, height: 320, borderRadius: '50%',
              background: 'linear-gradient(145deg, #2C5F6E 0%, #1A3240 55%, #0f1f29 100%)',
              border: '2px solid rgba(196,149,106,0.35)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '1rem', position: 'relative', overflow: 'hidden',
            }}>
              {/* Icon */}
              <div style={{ animation: 'float 4s ease-in-out infinite', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="150" height="155" viewBox="0 0 150 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Brain - left lobe */}
                  <path d="M75 58 C75 58 42 52 38 36 C34 22 45 10 57 9 C63 8 69 12 75 18" stroke="rgba(196,149,106,0.9)" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* Brain - right lobe */}
                  <path d="M75 58 C75 58 108 52 112 36 C116 22 105 10 93 9 C87 8 81 12 75 18" stroke="rgba(196,149,106,0.9)" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <line x1="75" y1="18" x2="75" y2="58" stroke="rgba(196,149,106,0.4)" strokeWidth="1.2" strokeDasharray="3 3" />
                  <path d="M46 24 C49 21 54 23 52 29" stroke="rgba(196,149,106,0.55)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <path d="M39 38 C43 35 49 37 47 43" stroke="rgba(196,149,106,0.55)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <path d="M104 24 C101 21 96 23 98 29" stroke="rgba(196,149,106,0.55)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <path d="M111 38 C107 35 101 37 103 43" stroke="rgba(196,149,106,0.55)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <circle cx="55" cy="28" r="3" fill="rgba(196,149,106,0.3)" stroke="rgba(196,149,106,0.8)" strokeWidth="1" />
                  <circle cx="45" cy="42" r="2.5" fill="rgba(196,149,106,0.3)" stroke="rgba(196,149,106,0.8)" strokeWidth="1" />
                  <circle cx="95" cy="28" r="3" fill="rgba(196,149,106,0.3)" stroke="rgba(196,149,106,0.8)" strokeWidth="1" />
                  <circle cx="105" cy="42" r="2.5" fill="rgba(196,149,106,0.3)" stroke="rgba(196,149,106,0.8)" strokeWidth="1" />
                  <circle cx="75" cy="36" r="4" fill="rgba(196,149,106,0.2)" stroke="rgba(196,149,106,0.85)" strokeWidth="1.3" />
                  <line x1="55" y1="28" x2="75" y2="36" stroke="rgba(196,149,106,0.25)" strokeWidth="1" />
                  <line x1="45" y1="42" x2="75" y2="36" stroke="rgba(196,149,106,0.25)" strokeWidth="1" />
                  <line x1="95" y1="28" x2="75" y2="36" stroke="rgba(196,149,106,0.25)" strokeWidth="1" />
                  <line x1="105" y1="42" x2="75" y2="36" stroke="rgba(196,149,106,0.25)" strokeWidth="1" />
                  {/* Connector stem */}
                  <line x1="75" y1="58" x2="75" y2="72" stroke="rgba(196,149,106,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="75" cy="72" r="2.5" fill="rgba(196,149,106,0.5)" stroke="rgba(196,149,106,0.7)" strokeWidth="1" />
                  {/* Scale pole */}
                  <line x1="75" y1="74" x2="75" y2="110" stroke="rgba(196,149,106,0.7)" strokeWidth="2" strokeLinecap="round" />
                  <rect x="58" y="110" width="34" height="5" rx="2.5" fill="rgba(196,149,106,0.35)" stroke="rgba(196,149,106,0.6)" strokeWidth="1" />
                  <rect x="52" y="115" width="46" height="4" rx="2" fill="rgba(196,149,106,0.25)" stroke="rgba(196,149,106,0.5)" strokeWidth="1" />
                  {/* Balance beam */}
                  <line x1="32" y1="91" x2="118" y2="87" stroke="rgba(196,149,106,0.8)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="75" cy="89" r="3.5" fill="rgba(196,149,106,0.4)" stroke="rgba(196,149,106,0.9)" strokeWidth="1.5" />
                  {/* Left pan */}
                  <line x1="36" y1="91" x2="26" y2="105" stroke="rgba(196,149,106,0.55)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="36" y1="91" x2="46" y2="105" stroke="rgba(196,149,106,0.55)" strokeWidth="1" strokeLinecap="round" />
                  <path d="M22 105 Q36 112 50 105" stroke="rgba(196,149,106,0.8)" strokeWidth="1.8" strokeLinecap="round" fill="rgba(196,149,106,0.12)" />
                  <circle cx="30" cy="103" r="3.5" fill="none" stroke="rgba(196,149,106,0.7)" strokeWidth="1.2" />
                  <path d="M28 103 Q30 100 32 103" stroke="rgba(196,149,106,0.7)" strokeWidth="1" strokeLinecap="round" fill="none" />
                  <circle cx="40" cy="103" r="2.5" fill="none" stroke="rgba(196,149,106,0.6)" strokeWidth="1" />
                  {/* Right pan */}
                  <line x1="114" y1="87" x2="104" y2="105" stroke="rgba(196,149,106,0.55)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="114" y1="87" x2="124" y2="105" stroke="rgba(196,149,106,0.55)" strokeWidth="1" strokeLinecap="round" />
                  <path d="M100 105 Q114 114 128 105" stroke="rgba(196,149,106,0.8)" strokeWidth="1.8" strokeLinecap="round" fill="rgba(196,149,106,0.12)" />
                  <circle cx="108" cy="101" r="3" fill="rgba(196,149,106,0.45)" stroke="rgba(196,149,106,0.8)" strokeWidth="1" />
                  <path d="M105 108 Q108 111 111 108" stroke="rgba(196,149,106,0.7)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <line x1="108" y1="104" x2="108" y2="109" stroke="rgba(196,149,106,0.6)" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="116" y1="100" x2="122" y2="100" stroke="rgba(196,149,106,0.5)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="117" y1="103" x2="121" y2="103" stroke="rgba(196,149,106,0.5)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="118" y1="106" x2="120" y2="106" stroke="rgba(196,149,106,0.4)" strokeWidth="1" strokeLinecap="round" />
                  {/* EEG pulse */}
                  <polyline points="30,138 44,138 50,131 56,145 62,138 76,138 82,133 88,143 94,138 120,138"
                    stroke="rgba(196,149,106,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>

              {/* Chip */}
              <div style={{
                borderRadius: 10, background: 'rgba(196,149,106,0.15)',
                border: '1px solid rgba(196,149,106,0.4)',
                padding: '0.55rem 1rem', textAlign: 'center',
                backdropFilter: 'blur(8px)', width: '76%',
              }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', color: '#C4956A', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                  Psychological &amp; Career Counselling
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.92rem', color: '#fff', margin: 0, lineHeight: 1.3 }}>
                  Feel Good Cafe
                </p>
              </div>
            </div>

            {/* Bottom pill */}
            <div style={{
              position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
              background: '#2C5F6E', borderRadius: 100, padding: '0.4rem 1.2rem',
              border: '1px solid rgba(196,149,106,0.4)', whiteSpace: 'nowrap',
            }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', margin: 0, letterSpacing: '0.06em' }}>
                Mind · Body · Balance
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-hero { grid-template-columns: 1fr !important; }
          .grid-hero > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
const services = [
  { icon: '🧠', title: 'Anxiety & Panic Disorders', desc: 'Evidence-based CBT and medication management for generalized anxiety, panic attacks, social anxiety, and specific phobias — tailored to your severity and lifestyle.' },
  { icon: '💙', title: 'Depression Treatment', desc: 'Comprehensive psychiatric evaluation and personalized treatment plans combining psychotherapy, pharmacotherapy, and lifestyle interventions for sustained recovery.' },
  { icon: '🔄', title: 'OCD Management', desc: 'Specialized Exposure and Response Prevention (ERP) therapy alongside optimal medication protocols to reduce intrusive thoughts and compulsive behaviours.' },
  { icon: '🛡️', title: 'Addiction Psychiatry', desc: 'Holistic de-addiction support for substance use disorders including alcohol, cannabis, and prescription drugs, with structured rehabilitation and relapse prevention.' },
  { icon: '😴', title: 'Sleep Disorders', desc: 'Accurate diagnosis and treatment of insomnia, hypersomnia, circadian rhythm disruptions, and sleep-related mood disorders through behavioral and medical approaches.' },
  { icon: '🧒', title: 'Child & Adolescent', desc: 'Compassionate care for ADHD, autism spectrum disorders, childhood anxiety, school-related mental health concerns, and behavioural challenges in young patients.' },
];

function Services() {
  return (
    <section id="services" style={{ background: 'var(--color-bg)', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-label">WHAT WE TREAT</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-text)', fontWeight: 700 }}>
            Specialised Psychiatric Services
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', maxWidth: 560, margin: '0.9rem auto 0', lineHeight: 1.7 }}>
            Comprehensive care rooted in evidence-based medicine and delivered with empathy. Every condition, every patient, treated as unique.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {services.map(s => (
            <article key={s.title} className="service-card">
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(44,95,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.2rem' }} aria-hidden="true">
                {s.icon}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.6rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.7 }}>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const credentials = [
    'MBBS — Bangalore Medical College, 2005',
    'MD (Psychiatry) — NIMHANS, Bangalore, 2009',
    'Fellowship in Child & Adolescent Psychiatry',
    'Member, Indian Psychiatric Society',
    'Certified CBT Practitioner (Beck Institute)',
  ];
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '2,000+', label: 'Patients Treated' },
    { value: '3', label: 'National Awards' },
  ];

  return (
    <section id="about" style={{ background: 'var(--color-surface)', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="grid-about">
        {/* Image area */}
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', maxWidth: 420, height: 500, borderRadius: '24px', background: 'linear-gradient(145deg, #2C5F6E 0%, #1A3240 100%)', position: 'relative', overflow: 'hidden' }}>
            {/* Head silhouette */}
            <div aria-hidden="true" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 130, height: 130, borderRadius: '50%', background: 'rgba(107,138,153,0.3)' }} />
            <div aria-hidden="true" style={{ position: 'absolute', top: '36%', left: '50%', transform: 'translateX(-50%)', width: 220, height: 250, borderRadius: '110px 110px 0 0', background: 'rgba(107,138,153,0.2)' }} />
            {/* Bottom text */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(26,50,64,0.95), transparent)', padding: '2rem 1.5rem 1.5rem' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>Dr. Meera Sharma</p>
              <p style={{ fontFamily: "'DM Mono', monospace", color: 'var(--color-accent)', fontSize: '0.72rem', letterSpacing: '0.12em', marginTop: '0.2rem' }}>MBBS · MD (PSYCHIATRY) · NIMHANS</p>
            </div>
          </div>
          {/* Gold accent square */}
          <div aria-hidden="true" style={{ position: 'absolute', top: -18, right: -18, width: 100, height: 100, borderRadius: '16px', background: 'var(--color-accent)', opacity: 0.18, zIndex: 0 }} />
          {/* Years badge */}
          <div style={{ position: 'absolute', bottom: 40, right: -24, background: 'var(--color-surface)', borderRadius: '16px', boxShadow: '0 12px 32px rgba(44,95,110,0.15)', padding: '1rem 1.4rem', border: '1px solid var(--color-border)' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.6rem', color: 'var(--color-primary)', fontWeight: 700 }}>15+</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '0.1rem' }}>Years of Practice</p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="section-label">ABOUT THE DOCTOR</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '1.4rem' }}>
            Healing Minds with<br />Science & Compassion
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Dr. Meera Sharma is a highly regarded psychiatrist practicing in Bangalore with over 15 years of clinical experience. Trained at NIMHANS — India's premier institute for mental health — she brings both academic rigor and genuine warmth to every patient interaction.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '1.8rem' }}>
            Her philosophy is simple: mental health care should be accessible, non-judgmental, and effective. She integrates the latest evidence-based treatments with a deep respect for the individual's unique circumstances, cultural background, and personal goals.
          </p>

          {/* Credentials */}
          <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {credentials.map(c => (
              <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700, marginTop: '0.05rem', flexShrink: 0 }}>✓</span>
                {c}
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            {stats.map(s => (
              <div key={s.label}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.7rem', color: 'var(--color-primary)', fontWeight: 700 }}>{s.value}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.1rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-about { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONSULTATION
───────────────────────────────────────────── */
function Consultation() {
  return (
    <section id="consultation" style={{ background: 'var(--color-hero-bg)', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-label">VISIT & CONSULT</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#fff', fontWeight: 700 }}>
            Transparent, Accessible Care
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: 520, margin: '0.8rem auto 0', lineHeight: 1.7 }}>
            No hidden fees, no unnecessary wait times. We make quality psychiatric care straightforward and respectful of your time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Fees */}
          <div className="consult-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">💳</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#fff', marginBottom: '1.4rem' }}>Consultation Fees</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>First Visit</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.3rem', color: 'var(--color-accent)', fontWeight: 700 }}>₹ 1,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>Follow-up Visit</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.3rem', color: 'var(--color-accent)', fontWeight: 700 }}>₹ 500</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Includes prescription, care plan & post-visit notes</p>
          </div>

          {/* Timings */}
          <div className="consult-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">🕐</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#fff', marginBottom: '1.4rem' }}>Clinic Hours</h3>
            {[
              { day: 'Monday – Friday', time: '10:00 AM – 7:00 PM' },
              { day: 'Saturday', time: '10:00 AM – 2:00 PM' },
              { day: 'Sunday', time: 'Closed', closed: true },
            ].map(r => (
              <div key={r.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>{r.day}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.82rem', color: r.closed ? 'rgba(255,100,100,0.7)' : 'var(--color-accent)' }}>{r.time}</span>
              </div>
            ))}
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginTop: '0.4rem' }}>Appointments recommended</p>
          </div>

          {/* Modes */}
          <div className="consult-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">🏥</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#fff', marginBottom: '1.4rem' }}>Consultation Modes</h3>
            {[
              { mode: 'In-Person (Clinic)', note: 'Main Indiranagar Clinic' },
              { mode: 'Video Consultation', note: 'Zoom / Google Meet' },
              { mode: 'Home Visits', note: 'Selected cases only' },
            ].map(m => (
              <div key={m.mode} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700, marginTop: '0.05rem', flexShrink: 0 }}>✓</span>
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{m.mode}</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem' }}>{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', concern: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone number.';
    if (!form.concern.trim()) e.concern = 'Please describe your concern.';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const contactItems = [
    { icon: '📞', label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: '📧', label: 'Email', value: 'dr.sharma@clinic.in', href: 'mailto:dr.sharma@clinic.in' },
    { icon: '📍', label: 'Address', value: '12, 3rd Cross, Indiranagar, Bangalore — 560 038' },
    { icon: '🕐', label: 'Hours', value: 'Mon – Sat, 10:00 AM – 7:00 PM' },
  ];

  return (
    <section id="contact" style={{ background: 'var(--color-bg)', padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-label">GET IN TOUCH</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-text)', fontWeight: 700 }}>
            Start Your Healing Journey
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', maxWidth: 500, margin: '0.8rem auto 0', lineHeight: 1.7 }}>
            Reaching out is the first step. We respond to all queries within 24 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="grid-contact">
          {/* Details */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: 'var(--color-text)', marginBottom: '1.5rem' }}>Contact Information</h3>
            {contactItems.map(c => (
              <div key={c.label} className="contact-row">
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(44,95,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }} aria-hidden="true">{c.icon}</div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>{c.label}</p>
                  {c.href
                    ? <a href={c.href} style={{ fontSize: '0.95rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>{c.value}</a>
                    : <p style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>{c.value}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 32px rgba(44,95,110,0.08)', border: '1px solid var(--color-border)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.8rem' }}>Message Received!</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: 1.7 }}>Thank you for reaching out. We'll call you back within 24 hours to schedule your consultation.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', concern: '' }); }} className="btn-primary" style={{ marginTop: '1.5rem', color: '#fff' }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: 'var(--color-text)', marginBottom: '1.5rem' }}>Send a Message</h3>
                {[
                  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', key: 'name' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit mobile number', key: 'phone' },
                ].map(f => (
                  <div key={f.id} style={{ marginBottom: '1.2rem' }}>
                    <label htmlFor={f.id} style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.4rem' }}>{f.label}</label>
                    <input id={f.id} type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                      className="form-input" />
                    {errors[f.key] && <p style={{ color: '#e05252', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors[f.key]}</p>}
                  </div>
                ))}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="concern" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.4rem' }}>Concern / Query</label>
                  <textarea id="concern" rows={4} placeholder="Briefly describe what you'd like help with…" value={form.concern}
                    onChange={e => setForm(v => ({ ...v, concern: e.target.value }))}
                    className="form-input" style={{ resize: 'vertical', minHeight: 100 }} />
                  {errors.concern && <p style={{ color: '#e05252', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.concern}</p>}
                </div>
                <button type="submit" className="btn-primary" style={{ color: '#fff', width: '100%', justifyContent: 'center', borderRadius: 12, padding: '0.9rem' }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .grid-contact { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAP SECTION
───────────────────────────────────────────── */
function MapSection() {
  return (
    <section id="map" style={{ background: 'var(--color-surface)', padding: '4rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="section-label">FIND US</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--color-text)', fontWeight: 700 }}>
            Visit Our Clinic
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '0.6rem' }}>12, 3rd Cross, Indiranagar, Bangalore — 560 038</p>
        </div>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 40px rgba(44,95,110,0.12)', border: '1px solid var(--color-border)' }}>
          {/* REPLACE: paste your Google Maps embed URL below */}
          <iframe
            title="Clinic Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9850382539165!2d77.6408!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17c1b04a6b5d%3A0xb4c1a78e5a55b0e6!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  const quickLinks = ['Home',
    //  'About', 
    //  'Services',
    //   'Consultation', 
    'Contact'];

  return (
    <footer style={{ background: 'var(--color--bg)', padding: '5rem 1.5rem 2rem' }} aria-label="Site footer">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }} className="grid-footer">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)' }}>Feel Good Cafe</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.75, maxWidth: 280, marginBottom: '1.5rem' }}>
              Compassionate care for every mind.
            </p>
            {/* Social icons */}
            {/* <div style={{ display: 'flex', gap: '0.8rem' }}>
              {[
                { label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 300ms ease', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,149,106,0.25)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.path} /></svg>
                </a>
              ))}
            </div> */}
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Quick Links</h4>
            <nav aria-label="Footer navigation">
              {quickLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text)', textDecoration: 'none', marginBottom: '0.7rem', transition: 'color 300ms ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}>{l}</a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Contact</h4>
            {[
              { icon: '📞', val: '+91 8825982278', href: 'tel:+8825982278' },
              // { icon: '📧', val: 'dr.sharma@clinic.in', href: 'mailto:dr.sharma@clinic.in' },
              // { icon: '📍', val: '12, 3rd Cross, Indiranagar,\nBangalore — 560 038' },
            ].map(c => (
              <div key={c.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', marginBottom: '1rem' }}>
                <span style={{ flexShrink: 0, marginTop: '0.05rem' }}>{c.icon}</span>
                {c.href
                  ? <a href={c.href} style={{ fontSize: '0.88rem', color: 'var(--color-text)', textDecoration: 'none', lineHeight: 1.5, transition: 'color 200ms' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}>{c.val}</a>
                  : <p style={{ fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{c.val}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', gap: '1rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>© Feel Good Cafe. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* {['Privacy Policy', 'Terms of Use'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.82rem', color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 200ms' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}>{l}</a>
            ))} */}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .grid-footer { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   REGISTER POPUP
───────────────────────────────────────────── */
function RegisterPopup() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const [form, setForm] = useState({
    name: '', age: '', email: '', phone: '', issue: '', payment: 'Yes'
  });

  useEffect(() => {
    // Show after 2.5 seconds
    const timer = setTimeout(() => setVisible(true), 2500);

    // Listen for custom event from hero buttons
    const handleOpen = () => setVisible(true);
    window.addEventListener('open-register-popup', handleOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-register-popup', handleOpen);
    };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    // Reset state after popup closes so it's fresh for next time
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', age: '', email: '', phone: '', issue: '', payment: 'Yes' });
    }, 300);
  }, []);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && status !== 'submitting') close();
  }, [close, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();

    formData.append("entry.2005620554", form.name);
    formData.append("entry.1045781291", form.email);
    formData.append("entry.1166974658", form.phone);
    formData.append("entry.1065046570", form.age);
    formData.append("entry.839337160", form.issue);
    formData.append("entry.1615171599", form.payment);

    // Required radio helper
    // formData.append("entry.1094963558_sentinel", "");

    // // Required Google params
    // formData.append("fvv", "1");
    // formData.append("pageHistory", "0");
    // formData.append("fbzx", Date.now().toString());

    await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSdCWQCT94PpsQGtWwfsvfbwF29FKlI67ueKCamKkrBBORp2-w/formResponse",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      }
    );

    setStatus("success");
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  if (!visible) return null;

  return (
    <div
      className="popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-heading"
      onClick={handleOverlayClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Box */}
      <div
        className="popup-box"
        role="document"
        style={{ background: '#ffffff', position: 'relative' }}
      >
        <button className="popup-close" onClick={close} aria-label="Close popup" style={{ color: '#5a6a7a' }} disabled={status === 'submitting'}>✕</button>

        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 5,
          background: 'linear-gradient(90deg, #c0392b, #e74c3c)',
          borderRadius: '24px 24px 0 0',
        }} />

        {status === 'success' ? (
          <div style={{ padding: '2rem 0 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} aria-hidden="true">🕊️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#1a2744', marginBottom: '0.8rem', fontWeight: 700 }}>
              You've Taken the First Step
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '2rem', maxWidth: 300, margin: '0 auto 2rem' }}>
              Your details have been received securely. We will reach out to you shortly to guide you forward.
            </p>
            <button className="popup-register-btn" onClick={close} style={{ background: '#1a2744', boxShadow: 'none' }}>
              Back to site
            </button>
          </div>
        ) : (
          <>
            {/* Header Content */}
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0.2rem auto 1rem',
              boxShadow: '0 8px 24px rgba(192,57,43,0.3)',
            }} aria-hidden="true">
              <span style={{ fontSize: '1.5rem' }}>💫</span>
            </div>

            <h2
              id="popup-heading"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 4vw, 1.8rem)',
                fontWeight: 700,
                color: '#1a2744',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
              }}
            >
              Break Free. Heal.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#4a5568', lineHeight: 1.5, margin: '0 auto', maxWidth: 320 }}>
              Your life changes the moment you decide. Fill out the form below to register.
            </p>

            {/* In-built Google Form */}
            <form onSubmit={handleSubmit} className="popup-form">
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <label className="popup-label">Full Name</label>
                  <input required name="name" value={form.name} onChange={handleChange} className="popup-input" placeholder="Your name" disabled={status === 'submitting'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="popup-label">Age</label>
                  <input required name="age" type="number" value={form.age} onChange={handleChange} className="popup-input" placeholder="Age" disabled={status === 'submitting'} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="popup-label">Email</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} className="popup-input" placeholder="Your email" disabled={status === 'submitting'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="popup-label">Phone Number</label>
                  <input required type="tel" name="phone" value={form.phone} onChange={handleChange} className="popup-input" placeholder="Your phone number" disabled={status === 'submitting'} />
                </div>
              </div>

              <div>
                <label className="popup-label">Share one most painful memory</label>
                <textarea required name="issue" value={form.issue} onChange={handleChange} className="popup-input" rows="2" placeholder="Briefly describe what you're feeling..." style={{ resize: 'none' }} disabled={status === 'submitting'}></textarea>
              </div>

              <div>
                <label className="popup-label">Have you done your payment?</label>
                <div className="popup-radio-group">
                  <label className="popup-radio-label">
                    <input type="radio" name="payment" value="Yes" checked={form.payment === 'Yes'} onChange={handleChange} disabled={status === 'submitting'} />
                    Yes
                  </label>
                  <label className="popup-radio-label">
                    <input type="radio" name="payment" value="No" checked={form.payment === 'No'} onChange={handleChange} disabled={status === 'submitting'} />
                    No
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="popup-register-btn"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting secure form...' : 'REGISTER NOW →'}
              </button>

              {status === 'error' && (
                <p style={{ color: '#c0392b', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>Something went wrong. Please try again.</p>
              )}
            </form>

            <button className="popup-later" onClick={close} disabled={status === 'submitting'}>Maybe later</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <GlobalStyles />
      <RegisterPopup />
      <Navbar />
      <main>
        <Hero />
        {/* <Services /> */}
        {/* <About /> */}
        {/* <Consultation /> */}
        {/* <Contact /> */}
        {/* <MapSection /> */}
      </main>
      <Footer />
    </>
  );
}
