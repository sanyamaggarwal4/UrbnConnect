import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { CATEGORIES, MOCK_SUSTAINABILITY_METRICS } from '../mockData';
import StatCard from '../components/ui/StatCard';
import ProblemCard from '../components/issue/ProblemCard';
import SustainabilityCard from '../components/ui/SustainabilityCard';

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

    /* Sustainability snapshot — use the deficit zone closest to the citizen */
    const sustainMetrics = MOCK_SUSTAINABILITY_METRICS[0];
    const { label: greenLabel, color: greenColor } = greenScoreLabel(sustainMetrics.greenCoveragePct);

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <h1>👋 {t.welcomeBack2}{currentUser ? `, ${currentUser.name}` : ''}!</h1>
                <p>{t.dashboardSubtitle}</p>
            </div>

            {/* ── Stat cards ──────────────────────────────────────── */}
            <div className="cv-grid cv-grid-4" style={{ marginBottom: '2rem' }}>
                <StatCard icon="📋" value={issues.length} label={t.totalIssues} color="var(--cv-primary)" />
                <StatCard icon="🕐" value={recentIssues.length} label={t.thisWeek} color="var(--cv-warning)" />
                <StatCard icon="✅" value={`${resolutionRate}%`} label={t.resolutionRate} color="var(--cv-accent)" />
                <StatCard icon="🌿" value={greenIssues} label="Green Issues" color="#10B981" />
            </div>

            {/* ── Green Intelligence Banner ────────────────────── */}
            <div className="cv-card" style={{
                background: 'linear-gradient(120deg, rgba(16,185,129,.08) 0%, rgba(59,130,246,.06) 100%)',
                border: '1px solid rgba(16,185,129,.22)',
                marginBottom: '1.5rem',
                padding: '1.1rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        border: `3px solid ${greenColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${greenColor}12`, flexShrink: 0,
                    }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 900, color: greenColor }}>{sustainMetrics.greenCoveragePct}%</span>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '.95rem' }}>
                            Area Green Coverage: <span style={{ color: greenColor }}>{greenLabel}</span>
                        </div>
                        <div className="cv-text-xs cv-text-secondary">
                            {sustainMetrics.areaName} • {sustainMetrics.totalTrees.toLocaleString()} trees mapped • {sustainMetrics.treesNeeded.toLocaleString()} more needed
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                    <Link to="/sustainability" className="cv-btn cv-btn-secondary" style={{ fontSize: '.82rem' }}>
                        🗺️ View Coverage Map
                    </Link>
                </div>
            </div>

            {/* ── Two-column layout ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left: Recent issues */}
                <div>
                    <div className="cv-flex cv-items-center cv-justify-between" style={{ marginBottom: '1rem' }}>
                        <h3>{t.recentIssues}</h3>
                        <Link to="/issues" className="cv-btn cv-btn-ghost cv-btn-sm">
                            {t.viewAll}
                        </Link>
                    </div>
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

                    {/* Area Summary */}
                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.75rem' }}>📍 {t.areaSummary}</h4>
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
                                    style={{ width: `${resolutionRate}%`, background: 'var(--cv-accent)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Weekly Report Card */}
                    <div className="cv-card" style={{ background: 'var(--cv-surface-alt)', border: '1px solid var(--cv-border)' }}>
                        <div className="cv-flex cv-items-center cv-justify-between" style={{ marginBottom: '.5rem' }}>
                            <h4 style={{ margin: 0 }}>📅 {t.thisWeek || 'Last 7 Days'}</h4>
                            <span className="cv-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--cv-warning)' }}>
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
                    <div className="cv-card">
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
                    <div className="cv-card" style={{ textAlign: 'center' }}>
                        <h4 style={{ marginBottom: '.75rem' }}>{t.quickActions}</h4>
                        <div className="cv-flex-col cv-gap-sm">
                            <Link to="/report" className="cv-btn cv-btn-primary" style={{ width: '100%' }}>
                                📝 {t.reportProblem}
                            </Link>
                            <Link to="/sustainability" className="cv-btn cv-btn-secondary" style={{ width: '100%' }}>
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

