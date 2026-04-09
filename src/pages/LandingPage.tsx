import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';

export default function LandingPage() {
    const { currentUser } = useAppContext();
    const t = useT();

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 960, margin: '0 auto' }}>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '.5rem' }}>🏙️</div>
                <h1 style={{
                    fontSize: '3.5rem',
                    marginBottom: '.25rem',
                    letterSpacing: '-.04em',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, var(--cv-primary), var(--cv-purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    UrbnConnect
                </h1>
                <p style={{
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    maxWidth: 600,
                    margin: '0 auto 1rem',
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <span style={{ color: 'var(--cv-danger)' }}>Report</span>
                    <span style={{ color: 'var(--cv-border)', fontSize: '0.8em' }}>•</span>
                    <span style={{ color: 'var(--cv-warning)' }}>Act</span>
                    <span style={{ color: 'var(--cv-border)', fontSize: '0.8em' }}>•</span>
                    <span style={{ color: 'var(--cv-accent)' }}>Sustain</span>
                </p>
                <p style={{
                    fontSize: '.95rem',
                    color: 'var(--cv-text-muted)',
                    maxWidth: 580,
                    margin: '0 auto .85rem',
                    fontStyle: 'italic',
                    borderLeft: '3px solid var(--cv-primary)',
                    paddingLeft: '1rem',
                    textAlign: 'left',
                    lineHeight: 1.7,
                }}>
                    {t.platformTagline}
                </p>
                <p style={{
                    fontSize: '.88rem',
                    color: 'var(--cv-text-muted)',
                    maxWidth: 560,
                    margin: '0 auto 2rem',
                }}>
                    {t.platformTagline2}
                </p>

                {currentUser ? (
                    <Link
                        to={currentUser.role === 'authority' ? '/authority' : '/dashboard'}
                        className="cv-btn cv-btn-primary cv-btn-lg"
                    >
                        {t.goToDashboard}
                    </Link>
                ) : (
                    <div className="cv-flex cv-items-center cv-gap" style={{ justifyContent: 'center' }}>
                        <Link to="/login" className="cv-btn cv-btn-primary cv-btn-lg">
                            {t.getStartedBtn}
                        </Link>
                        <Link to="/login?guest=true" className="cv-btn cv-btn-secondary cv-btn-lg">
                            {t.tryAsGuest}
                        </Link>
                    </div>
                )}

                {/* Green badges below CTA */}
                <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                        { icon: '🌿', labelKey: 'greenIntelligence' as const, color: '#10B981' },
                        { icon: '📍', labelKey: 'coverageMaps' as const, color: '#3B82F6' },
                        { icon: '♻️', labelKey: 'sustainabilityScore' as const, color: '#8B5CF6' },
                    ].map(b => (
                        <span key={b.labelKey} style={{
                            fontSize: '.78rem', fontWeight: 600,
                            padding: '.3rem .8rem', borderRadius: 99,
                            background: `${b.color}14`, color: b.color,
                            border: `1px solid ${b.color}30`,
                        }}>
                            {b.icon} {t[b.labelKey]}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Stats strip ──────────────────────────────────────── */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem',
                textAlign: 'center',
                padding: '1rem 0 2.5rem',
            }}>
                {STATS.map((s, i) => (
                    <div key={i} className="cv-animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cv-primary)' }}>{s.value}</div>
                        <div className="cv-text-sm cv-text-muted">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Core Features ────────────────────────────────────── */}
            <section style={{ padding: '1rem 0 2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '.4rem', fontSize: '1.35rem' }}>
                    {t.howUrbnWorks}
                </h2>
                <p className="cv-text-secondary cv-text-sm" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {t.howUrbnWorksSub}
                </p>
                <div className="cv-grid cv-grid-3">
                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="cv-card cv-animate-fadeIn"
                            style={{ textAlign: 'center', animationDelay: `${i * 80}ms` }}
                        >
                            <div style={{ fontSize: '2.25rem', marginBottom: '.75rem' }}>{f.icon}</div>
                            <h4 style={{ marginBottom: '.35rem' }}>{f.title}</h4>
                            <p className="cv-text-sm cv-text-secondary">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Green Intelligence Highlight ──────────────────────── */}
            <section style={{ padding: '1rem 0 2rem' }}>
                <div className="cv-card" style={{
                    background: 'linear-gradient(120deg, rgba(16,185,129,.07) 0%, rgba(59,130,246,.05) 100%)',
                    border: '1px solid rgba(16,185,129,.25)',
                    padding: '2rem',
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🌿</div>
                            <h2 style={{ marginBottom: '.6rem', fontSize: '1.4rem' }}>
                                Green Urban Intelligence
                            </h2>
                            <p className="cv-text-secondary cv-text-sm" style={{ lineHeight: 1.7, marginBottom: '1.25rem' }}>
                                UrbnConnect goes beyond issue reporting. Track tree coverage across your ward in real time,
                                identify green deficit zones, and receive area-specific plantation recommendations powered by urban data.
                            </p>
                            <Link to="/sustainability" className="cv-btn cv-btn-secondary" style={{ fontSize: '.85rem', borderColor: '#10B981', color: '#10B981' }}>
                                🗺️ Explore Coverage Map →
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                            {GREEN_STATS.map(g => (
                                <div key={g.label} style={{
                                    padding: '1rem', borderRadius: 12, textAlign: 'center',
                                    background: `${g.color}0D`, border: `1px solid ${g.color}25`,
                                }}>
                                    <div style={{ fontSize: '1.6rem', marginBottom: '.25rem' }}>{g.icon}</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: g.color }}>{g.val}</div>
                                    <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>{g.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Sustainability Suggestions ────────────────────────── */}
            <section style={{ padding: '1rem 0 2rem' }}>
                <div className="cv-card" style={{ borderTop: '3px solid #8B5CF6', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', top: -20, right: -20, fontSize: '6rem', opacity: .06,
                    }}>♻️</div>
                    <div style={{ fontSize: '2rem', marginBottom: '.6rem' }}>♻️</div>
                    <h3 style={{ marginBottom: '.5rem', fontSize: '1.1rem' }}>Green City Suggestions</h3>
                    <p className="cv-text-sm cv-text-secondary" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                        Explore data-backed recommendations to make your ward greener — from rainwater harvesting
                        and solar micro-grids to car-free green lanes and rooftop gardens.
                    </p>
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {['☀️ Solar', '🌧️ Rainwater', '🚲 Green Lanes', '🏗️ Green Builds'].map(t => (
                            <span key={t} style={{ fontSize: '.72rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(139,92,246,.1)', color: '#8B5CF6' }}>{t}</span>
                        ))}
                    </div>
                    <Link to="/sustainability" className="cv-btn cv-btn-secondary" style={{ fontSize: '.85rem', borderColor: '#8B5CF6', color: '#8B5CF6' }}>
                        💡 View Recommendations
                    </Link>
                </div>
            </section>

            {/* ── Issue Categories ─────────────────────────────────── */}
            <section style={{ padding: '1rem 0 2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.35rem' }}>
                    {t.issueCategoriesTitle}
                </h2>
                <div className="cv-flex cv-gap-sm" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                    {CATEGORY_PREVIEW.map((c) => (
                        <span
                            key={c.id}
                            className="cv-chip"
                            style={{ background: `${c.color}14`, color: c.color, fontSize: '.82rem' }}
                        >
                            {c.icon} {t[c.id as keyof typeof t] || c.label}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Final CTA ────────────────────────────────────────── */}
            <section style={{
                textAlign: 'center',
                padding: '2rem',
                marginBottom: '2rem',
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(59,130,246,.07), rgba(139,92,246,.07))',
                border: '1px solid var(--cv-border)',
            }}>
                <h2 style={{ marginBottom: '.5rem' }}>{t.finalCtaTitle}</h2>
                <p className="cv-text-secondary cv-text-sm" style={{ marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
                    {t.finalCtaDesc}
                </p>
                {currentUser ? (
                    <Link to={currentUser.role === 'authority' ? '/authority' : '/dashboard'} className="cv-btn cv-btn-primary cv-btn-lg">
                        Go to Dashboard →
                    </Link>
                ) : (
                    <Link to="/login" className="cv-btn cv-btn-primary cv-btn-lg">
                        Join UrbnConnect →
                    </Link>
                )}
            </section>
        </div>
    );
}

// ── Data constants ────────────────────────────────────────────────────────

const FEATURES = [
    {
        icon: '📝',
        title: 'Report Problems',
        desc: 'Easily report civic issues with photos, location, and category tags in under 2 minutes.',
    },
    {
        icon: '🗺️',
        title: 'Map-Based Tracking',
        desc: 'See all reported issues on an interactive map to understand issue density in your ward.',
    },
    {
        icon: '📊',
        title: 'Track Progress',
        desc: 'Follow the status of issues from Reported to Resolved with transparent authority updates.',
    },
    {
        icon: '🌿',
        title: 'Green Intelligence',
        desc: 'Monitor tree coverage, identify green deficit zones, and get area-wise plantation plans.',
    },
    {
        icon: '🏗️',
        title: 'Authority Dashboard',
        desc: 'Ward officers can manage, prioritize, resolve issues, and track sustainability metrics.',
    },
    {
        icon: '🌐',
        title: 'Multilingual Support',
        desc: 'Available in English and Hindi to ensure every citizen can engage with local governance.',
    },
];

const GREEN_STATS = [
    { icon: '🌳', val: '26,460', label: 'Trees Mapped', color: '#10B981' },
    { icon: '🌱', val: '5,200+', label: 'Trees Needed', color: '#F59E0B' },
    { icon: '📊', val: '21.6%', label: 'Avg Green Cover', color: '#3B82F6' },
    { icon: '🚨', val: '3 Zones', label: 'Deficit Areas', color: '#EF4444' },
];

const CATEGORY_PREVIEW = [
    { id: 'sanitation-waste', icon: '🗑️', label: 'Sanitation & Waste', color: '#D97706' },
    { id: 'water-drainage', icon: '💧', label: 'Water & Drainage', color: '#2563EB' },
    { id: 'roads-infrastructure', icon: '🛣️', label: 'Roads & Infrastructure', color: '#6B7280' },
    { id: 'streetlights-electricity', icon: '💡', label: 'Streetlights', color: '#F59E0B' },
    { id: 'environment-parks', icon: '🌳', label: 'Environment', color: '#059669' },
    { id: 'low-greenery-deforestation', icon: '🌿', label: 'Low Greenery', color: '#16A34A' },
    { id: 'animal-human-conflict', icon: '🐕', label: 'Animal–Human Conflict', color: '#DC2626' },
    { id: 'citizen-safety', icon: '🛡️', label: 'Citizen Safety', color: '#7C3AED' },
    { id: 'public-health', icon: '🏥', label: 'Public Health', color: '#EC4899' },
    { id: 'illegal-encroachment', icon: '🚧', label: 'Encroachment', color: '#92400E' },
    { id: 'noise-nuisance', icon: '📢', label: 'Noise / Nuisance', color: '#EF4444' },
    { id: 'public-property-damage', icon: '🏚️', label: 'Property Damage', color: '#4B5563' },
];

const STATS = [
    { value: '120+', label: 'Issues Reported' },
    { value: '85%', label: 'Resolution Rate' },
    { value: '13', label: 'Categories' },
    { value: '5', label: 'Wards Covered' },
];
