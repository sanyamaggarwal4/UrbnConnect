import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { CATEGORIES } from '../mockData';

export default function AuthorityAnalyticsPage() {
    const { issues } = useAppContext();
    const t = useT();

    const total = issues.length;
    const resolved = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const avgUpvotes = total > 0 ? (issues.reduce((s, i) => s + i.upvotes, 0) / total).toFixed(1) : 0;

    /* ── Category breakdown ──────────────────────────────── */
    const categoryCounts = issues.reduce<Record<string, number>>((acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + 1;
        return acc;
    }, {});
    const byCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const maxCat = byCategory[0]?.[1] ?? 1;

    /* ── Status breakdown ────────────────────────────────── */
    const statusCounts = issues.reduce<Record<string, number>>((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {});
    const STATUS_COLORS: Record<string, string> = {
        reported: '#6B7280',
        'under-review': '#F59E0B',
        assigned: '#3B82F6',
        'in-progress': '#8B5CF6',
        resolved: '#10B981',
        closed: '#10B981',
        rejected: '#EF4444',
    };

    /* ── Severity breakdown ──────────────────────────────── */
    const SEVERITY_COLORS: Record<string, string> = {
        critical: '#EF4444',
        high: '#F97316',
        medium: '#F59E0B',
        low: '#10B981',
    };
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    issues.forEach((i) => { (severityCounts as Record<string, number>)[i.severity]++; });

    /* ── Top upvoted issues ──────────────────────────────── */
    const topUpvoted = [...issues].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <h1>📈 {t.analytics} & Insights</h1>
                <p>Data-driven overview of civic issues in your area.</p>
            </div>

            {/* ── KPI Row ──────────────────────────────────────── */}
            <div className="cv-grid cv-grid-4" style={{ marginBottom: '2rem' }}>
                {[
                    { icon: '📋', label: 'Total Issues', value: total, color: 'var(--cv-primary)' },
                    { icon: '✅', label: 'Resolved', value: resolved, color: 'var(--cv-accent)' },
                    { icon: '📊', label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#8B5CF6' },
                    { icon: '👍', label: 'Avg Upvotes', value: avgUpvotes, color: 'var(--cv-warning)' },
                ].map((kpi) => (
                    <div key={kpi.label} className="cv-card cv-animate-fadeIn" style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '.35rem' }}>{kpi.icon}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                        <div className="cv-text-sm cv-text-muted">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Two-column charts ────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="cv-card">
                    <h4 style={{ marginBottom: '1rem' }}>Issues by Category</h4>
                    <div className="cv-flex-col cv-gap-sm">
                        {byCategory.map(([catId, count]) => {
                            const info = CATEGORIES.find((c) => c.id === catId);
                            const pct = Math.round((count / maxCat) * 100);
                            return (
                                <div key={catId}>
                                    <div className="cv-flex cv-justify-between cv-text-sm" style={{ marginBottom: 4 }}>
                                        <span>{info?.icon} {info?.label}</span>
                                        <span className="cv-text-muted">{count}</span>
                                    </div>
                                    <div className="cv-progress" style={{ height: 8, borderRadius: 99 }}>
                                        <div className="cv-progress-fill" style={{ width: `${pct}%`, background: info?.color, borderRadius: 99 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="cv-flex-col cv-gap">
                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.75rem' }}>Status Breakdown</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.4rem .75rem' }}>
                            {Object.entries(statusCounts).map(([status, count]) => {
                                const color = STATUS_COLORS[status] ?? '#6B7280';
                                return (
                                    <div key={status} className="cv-flex cv-items-center cv-gap-sm" style={{ fontSize: '.82rem' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                        <span className="cv-text-secondary" style={{ textTransform: 'capitalize' }}>{status.replace(/-/g, ' ')}</span>
                                        <span className="cv-font-semibold" style={{ marginLeft: 'auto' }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.75rem' }}>Severity Distribution</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.5rem', textAlign: 'center' }}>
                            {(['critical', 'high', 'medium', 'low'] as const).map((sev) => (
                                <div key={sev} className="cv-card" style={{ padding: '.65rem .5rem', background: `${SEVERITY_COLORS[sev]}10` }}>
                                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: SEVERITY_COLORS[sev] }}>{severityCounts[sev]}</div>
                                    <div className="cv-text-xs" style={{ color: SEVERITY_COLORS[sev], textTransform: 'capitalize', fontWeight: 600 }}>{t[sev] || sev}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="cv-card">
                <h4 style={{ marginBottom: '.85rem' }}>🔥 Most Upvoted Issues</h4>
                <div className="cv-flex-col" style={{ gap: '.5rem' }}>
                    {topUpvoted.map((issue, idx) => (
                        <div key={issue.id} className="cv-flex cv-items-center cv-gap" style={{ padding: '.65rem .85rem', borderRadius: 'var(--cv-radius)', background: 'var(--cv-surface-alt)', fontSize: '.875rem' }}>
                            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cv-primary-light)', color: 'var(--cv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.78rem', flexShrink: 0 }}>{idx + 1}</span>
                            <span style={{ flex: 1, fontWeight: 500 }}>{issue.title.length > 70 ? issue.title.slice(0, 70) + '…' : issue.title}</span>
                            <span className="cv-text-sm cv-text-muted">📍 {issue.location.area}</span>
                            <span style={{ fontWeight: 700, color: 'var(--cv-primary)', background: 'var(--cv-primary-light)', padding: '.2rem .6rem', borderRadius: 99, fontSize: '.8rem' }}>👍 {issue.upvotes}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
