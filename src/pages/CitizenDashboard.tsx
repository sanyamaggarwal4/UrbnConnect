import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { CATEGORIES, MOCK_SUSTAINABILITY_METRICS } from '../mockData';
import { MOCK_CITIZEN_DRIVES } from '../mockData/community';
import ProblemCard from '../components/issue/ProblemCard';
import SustainabilityCard from '../components/ui/SustainabilityCard';
import CivicScoreCard from '../components/ui/CivicScoreCard';
import { isTopContributor } from '../lib/civicScore';
import TopContributorBadge from '../components/ui/TopContributorBadge';

// Compute a rough green score label
function greenScoreLabel(pct: number): { label: string; color: string } {
    if (pct >= 35) return { label: 'Good', color: '#10B981' };
    if (pct >= 20) return { label: 'Moderate', color: '#F59E0B' };
    return { label: 'Critical', color: '#EF4444' };
}

export default function CitizenDashboard() {
    const { issues, currentUser, upvoteIssue } = useAppContext();
    const t = useT();

    /* ── Computed stats ───────────────────────────────────── */
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const recentIssues = issues.filter((i) => new Date(i.createdAt).getTime() > oneWeekAgo);
    const resolvedCount = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const unresolvedCount = issues.filter(
        (i) => i.status !== 'resolved' && i.status !== 'closed' && i.status !== 'rejected',
    ).length;
    const criticalCount = issues.filter(
        (i) => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'closed',
    ).length;
    const resolutionRate = issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0;

    /* Green Issues count */
    const greenIssues = issues.filter(i => i.category === 'environment-damage' || i.category === 'low-greenery-deforestation').length;

    /* Top categories by issue count */
    const categoryCounts = issues.reduce<Record<string, number>>((acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
    }, {});
    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    /* latest 5 issues */
    const latestIssues = [...issues].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ).slice(0, 5);

    /* Sustainability snapshot */
    const sustainMetrics = MOCK_SUSTAINABILITY_METRICS[0];
    const { label: greenLabel, color: greenColor } = greenScoreLabel(sustainMetrics.greenCoveragePct);

    /* Civic score for current user */
    const civicScore = currentUser?.civicScore;
    const isTopC = civicScore ? isTopContributor(civicScore.total) : false;

    /* Recent citizen drives */
    const activeDrives = MOCK_CITIZEN_DRIVES.filter(d => d.status === 'active' || d.status === 'gathering').slice(0, 3);

    return (
        <div className="cv-animate-fadeIn cv-eco-page cv-eco-bg-pattern">
            {/* ── Green Hero Header ────────────────────────────── */}
            <div className="cv-eco-hero">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h1 style={{ color: '#fff', margin: 0 }}>👋 {t.welcomeBack2}{currentUser ? `, ${currentUser.name}` : ''}!</h1>
                    {isTopC && <TopContributorBadge size="md" />}
                </div>
                <p style={{ margin: '.35rem 0 0', opacity: 0.85 }}>{t.dashboardSubtitle}</p>
            </div>

            {/* ── Civic Score Card (shows only for logged-in citizens) ─ */}
            {civicScore && currentUser?.role === 'citizen' && (
                <div className="cv-eco-grow">
                    <CivicScoreCard score={civicScore} userName={currentUser.name} />
                </div>
            )}

            {/* ── Stat cards with plant theme ─────────────────────── */}
            <div className="cv-grid cv-grid-4" style={{ marginBottom: '2rem' }}>
                <div className="cv-plant-stat">
                    <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>📋</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--cv-primary)' }}>{issues.length}</div>
                    <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>{t.totalIssues}</div>
                </div>
                <div className="cv-plant-stat">
                    <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>🕐</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--cv-warning)' }}>{recentIssues.length}</div>
                    <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>{t.thisWeek}</div>
                </div>
                <div className="cv-plant-stat">
                    <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>✅</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--cv-accent)' }}>{resolutionRate}%</div>
                    <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>{t.resolutionRate}</div>
                </div>
                <div className="cv-plant-stat">
                    <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>🌿</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16A34A' }}>{greenIssues}</div>
                    <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>Green Issues</div>
                </div>
            </div>

            {/* ── Green Intelligence Banner ────────────────────── */}
            <div className="cv-leaf-card" style={{
                background: 'linear-gradient(120deg, rgba(22,163,74,.06) 0%, rgba(34,197,94,.03) 100%)',
                marginBottom: '1.5rem',
                padding: '1.1rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: `3px solid ${greenColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${greenColor}12`, flexShrink: 0,
                    }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 900, color: greenColor }}>{sustainMetrics.greenCoveragePct}%</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '.95rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                            <span className="cv-eco-pulse" />
                            Area Green Coverage: <span style={{ color: greenColor }}>{greenLabel}</span>
                        </div>
                        <div className="cv-text-xs cv-text-secondary">
                            {sustainMetrics.areaName} • {sustainMetrics.totalTrees.toLocaleString()} trees mapped • {sustainMetrics.treesNeeded.toLocaleString()} more needed
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                    <Link to="/sustainability" className="cv-btn cv-btn-sm" style={{
                        background: 'var(--cv-eco-green)', color: '#fff', border: 'none',
                    }}>
                        🗺️ View Coverage Map
                    </Link>
                </div>
            </div>

            {/* ── Two-column layout ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left: Recent issues */}
                <div>
                    <h3 className="cv-eco-section-title">
                        <span>🌿</span> {t.recentIssues}
                        <Link to="/issues" className="cv-btn cv-btn-ghost cv-btn-sm" style={{ marginLeft: 'auto' }}>
                            {t.viewAll}
                        </Link>
                    </h3>
                    <div className="cv-flex-col cv-gap">
                        {latestIssues.map((issue) => (
                            <ProblemCard
                                key={issue.id}
                                issue={issue}
                                onUpvote={upvoteIssue}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Sidebar widgets */}
                <div className="cv-flex-col cv-gap">
                    {/* Sustainability Intelligence */}
                    <SustainabilityCard metrics={sustainMetrics} />

                    {/* ── Active Citizen Drives (leaf-themed) ── */}
                    {activeDrives.length > 0 && (
                        <div className="cv-leaf-card" style={{ padding: 0 }}>
                            <div style={{
                                padding: '1rem 1.25rem',
                                borderBottom: '1px solid rgba(22,163,74,0.15)',
                                display: 'flex', alignItems: 'center', gap: '.5rem',
                                background: 'linear-gradient(135deg, rgba(22,163,74,0.08), rgba(34,197,94,0.03))',
                            }}>
                                <span style={{ animation: 'cv-leafSway 3s ease-in-out infinite', display: 'inline-block' }}>🌿</span>
                                <h4 style={{ margin: 0, color: 'var(--cv-eco-green)', fontSize: '1rem' }}>
                                    <span className="cv-eco-pulse" /> Active Drives
                                </h4>
                            </div>
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                                {activeDrives.map(drive => {
                                    const pct = Math.min(100, Math.round((drive.participantsCount / drive.target) * 100));
                                    return (
                                        <div key={drive.id} className="cv-eco-feed-item" style={{ padding: '.85rem 1rem', borderLeftWidth: 3 }}>
                                            <div style={{ fontSize: '.85rem', fontWeight: 600, marginBottom: '.3rem', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                                                🌱 {drive.title}
                                            </div>
                                            <div style={{ fontSize: '.72rem', color: 'var(--cv-text-muted)', marginBottom: '.4rem' }}>
                                                👥 {drive.participantsCount}/{drive.target} • 📍 {drive.location}
                                            </div>
                                            <div style={{ height: 5, background: 'rgba(22,163,74,0.12)', borderRadius: 99, overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%', width: `${pct}%`,
                                                    background: pct >= 100
                                                        ? 'linear-gradient(90deg, #16A34A, #22C55E)'
                                                        : 'linear-gradient(90deg, #2563EB, #3B82F6)',
                                                    borderRadius: 99,
                                                    transition: 'width .5s ease',
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                <Link to="/community" className="cv-btn cv-btn-sm" style={{
                                    background: 'var(--cv-eco-green)', color: '#fff', border: 'none', marginTop: '.25rem',
                                }}>
                                    🌿 View All Drives →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Community Hub Shortcut */}
                    <div className="cv-leaf-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid rgba(22,163,74,0.15)',
                            background: 'linear-gradient(135deg, rgba(22,163,74,0.08), rgba(34,197,94,0.04))',
                        }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '1.05rem', color: 'var(--cv-eco-green)' }}>
                                🌳 Community Hub
                            </h3>
                        </div>
                        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '.88rem', color: 'var(--cv-text-secondary)', lineHeight: 1.5 }}>
                                Join local drives, adopt trees, or check the civic leaderboard.
                            </p>
                            <Link to="/community" className="cv-btn" style={{
                                width: '100%', marginTop: 'auto',
                                background: 'var(--cv-eco-green)', color: '#fff', border: 'none',
                            }}>
                                🌿 Open Community Hub
                            </Link>
                        </div>
                    </div>

                    {/* Area Summary with eco accents */}
                    <div className="cv-leaf-card">
                        <h4 style={{ marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                            📍 {t.areaSummary}
                        </h4>
                        <div className="cv-flex cv-justify-between cv-items-center cv-text-sm" style={{ marginBottom: '.5rem' }}>
                            <span className="cv-text-secondary">{t.openIssues}</span>
                            <span className="cv-font-semibold">{unresolvedCount}</span>
                        </div>
                        <div className="cv-flex cv-justify-between cv-items-center cv-text-sm" style={{ marginBottom: '.5rem' }}>
                            <span className="cv-text-secondary">{t.resolved}</span>
                            <span className="cv-font-semibold" style={{ color: 'var(--cv-accent)' }}>{resolvedCount}</span>
                        </div>
                        <div className="cv-flex cv-justify-between cv-items-center cv-text-sm">
                            <span className="cv-text-secondary">{t.thisWeek}</span>
                            <span className="cv-font-semibold" style={{ color: 'var(--cv-warning)' }}>{recentIssues.length}</span>
                        </div>
                        {/* Mini progress */}
                        <div style={{ marginTop: '.75rem' }}>
                            <div className="cv-text-xs cv-text-muted" style={{ marginBottom: 4 }}>
                                {t.resolutionProgress}
                            </div>
                            <div className="cv-progress">
                                <div
                                    className="cv-progress-fill"
                                    style={{ width: `${resolutionRate}%`, background: 'linear-gradient(90deg, var(--cv-eco-green), var(--cv-eco-green-light))' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Weekly Report Card */}
                    <div className="cv-leaf-card" style={{ background: 'var(--cv-surface-alt)' }}>
                        <div className="cv-flex cv-items-center cv-justify-between" style={{ marginBottom: '.5rem' }}>
                            <h4 style={{ margin: 0 }}>📅 {t.thisWeek || 'Last 7 Days'}</h4>
                            <span className="cv-leaf-badge">
                                +{recentIssues.length} new
                            </span>
                        </div>
                        <p className="cv-text-xs cv-text-secondary">
                            {recentIssues.length} issue(s) were reported in your locality this past week.
                        </p>
                        {criticalCount > 0 && (
                            <div style={{ marginTop: '.5rem', padding: '.4rem .6rem', background: 'rgba(239,68,68,.08)', borderRadius: 6 }}>
                                <span className="cv-text-xs" style={{ color: 'var(--cv-danger)' }}>🚨 {criticalCount} critical issue(s) need urgent attention.</span>
                            </div>
                        )}
                    </div>

                    {/* Category Breakdown */}
                    <div className="cv-leaf-card">
                        <h4 style={{ marginBottom: '.75rem' }}>📊 {t.topCategories}</h4>
                        <div className="cv-flex-col cv-gap-sm">
                            {topCategories.map(([catId, count]) => {
                                const info = CATEGORIES.find((c) => c.id === catId);
                                return (
                                    <div
                                        key={catId}
                                        className="cv-flex cv-items-center cv-justify-between"
                                        style={{ fontSize: '.85rem' }}
                                    >
                                        <span>
                                            {info?.icon} {info?.label}
                                        </span>
                                        <span
                                            className="cv-badge"
                                            style={{ background: `${info?.color}18`, color: info?.color }}
                                        >
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="cv-leaf-card" style={{ textAlign: 'center' }}>
                        <h4 style={{ marginBottom: '.75rem' }}>{t.quickActions}</h4>
                        <div className="cv-flex-col cv-gap-sm">
                            <Link to="/report" className="cv-btn cv-btn-primary" style={{ width: '100%' }}>
                                📝 {t.reportProblem}
                            </Link>
                            <Link to="/sustainability" className="cv-btn" style={{ width: '100%', background: 'var(--cv-eco-green)', color: '#fff', border: 'none' }}>
                                🌿 Green Intelligence
                            </Link>
                            <Link to="/map" className="cv-btn cv-btn-secondary" style={{ width: '100%' }}>
                                🗺️ {t.mapView}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
