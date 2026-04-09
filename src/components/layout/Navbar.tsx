import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
    const { currentUser, logout, language, setLanguage, theme, setTheme } = useAppContext();

    return (
        <nav className="cv-navbar">
            {/* Left: Brand */}
            <div className="cv-navbar-brand">
                <button
                    className="cv-btn cv-btn-ghost cv-btn-icon sidebar-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    style={{ fontSize: '1.25rem' }}
                >
                    ☰
                </button>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'inherit' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '0.2rem' }}>🏙️</span>
                    <span style={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, var(--cv-primary), var(--cv-purple))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        UrbnConnect
                    </span>
                    <span className="subtitle" style={{ 
                        fontWeight: 600, 
                        letterSpacing: '0.03em',
                        display: 'flex',
                        gap: '0.35rem',
                        alignItems: 'center'
                    }}>
                        <span style={{ color: 'var(--cv-danger)' }}>Report</span>
                        <span style={{ color: 'var(--cv-border)', fontSize: '0.8em' }}>•</span>
                        <span style={{ color: 'var(--cv-warning)' }}>Act</span>
                        <span style={{ color: 'var(--cv-border)', fontSize: '0.8em' }}>•</span>
                        <span style={{ color: 'var(--cv-accent)' }}>Sustain</span>
                    </span>
                </Link>
            </div>

            {/* Right: Actions */}
            <div className="cv-navbar-actions">
                {/* Language Switcher */}
                <div className="cv-lang-switch">
                    <button
                        className={`cv-lang-option ${language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`cv-lang-option ${language === 'hi' ? 'active' : ''}`}
                        onClick={() => setLanguage('hi')}
                    >
                        हिं
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    className="cv-btn cv-btn-ghost cv-btn-icon"
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {currentUser ? (
                    <>
                        <span className="cv-text-sm cv-font-medium" style={{ maxWidth: 120 }}>
                            {currentUser.name}
                        </span>
                        <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="cv-btn cv-btn-primary cv-btn-sm">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
