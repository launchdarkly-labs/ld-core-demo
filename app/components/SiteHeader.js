function NavIcon({ children, label }) {
  return (
    <button type="button" className="nav-icon-btn" aria-label={label}>
      {children}
    </button>
  );
}

export default function SiteHeader() {
  return (
    <header className="site-header site-header--hero">
      <nav className="main-nav" aria-label="Primary">
        <div className="main-nav-inner">
          <a href="/" className="logo" aria-label="SiriusXM home">
            <img
              src="/siriusxm-logo-white.png"
              alt="SiriusXM"
              className="logo-img"
              width={120}
              height={24}
            />
          </a>
          <ul className="nav-links">
            <li>
              <a href="#discover">Discover</a>
            </li>
            <li>
              <a href="#channels">Channel Guide</a>
            </li>
            <li>
              <a href="#plans" className="nav-active">
                Subscriptions
              </a>
            </li>
          </ul>
          <div className="nav-actions">
            <NavIcon label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
            </NavIcon>
            <NavIcon label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </NavIcon>
            <NavIcon label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </NavIcon>
            <a href="#help" className="nav-help">
              Help &amp; Support
            </a>
            <a href="#subscribe" className="nav-cta">
              Start Listening
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
