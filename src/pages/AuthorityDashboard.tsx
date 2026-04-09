import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { CATEGORIES, MOCK_SUSTAINABILITY_METRICS } from '../mockData';
import StatCard from '../components/ui/StatCard';
import SeverityBadge from '../components/ui/SeverityBadge';
import type { IssueStatus } from '../types';

const STATUS_COLORS: Record<string, string> = {
    reported: '#6B7280',
    'under-review': '#F59E0B',
    assigned: '#3B82F6',
    'in-progress': '#8B5CF6',
    resolved: '#10B981',
    closed: '#10B981',
    rejected: '#EF4444',
};

function StatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status] ?? '#6B7280';
    return (
        <span style={{ display: 'inline-block', padding: '.2rem .55rem', borderRadius: 99, fontSize: '.72rem', fontWeight: 600, textTransform: 'capitalize', background: `${color}18`, color }}>
            {status.replace(/-/g, ' ')}
        </span>
    );
}

function StatusSelect({ currentStatus, onChange }: { currentStatus: IssueStatus; onChange: (s: IssueStatus) => void }) {
    const nextStatuses: IssueStatus[] = ['reported', 'under-review', 'assigned', 'in-progress', 'resolved', 'rejected'];
    return (
        <select className="cv-input" value={currentStatus} onChange={(e) => onChange(e.target.value as IssueStatus)} style={{ padding: '.25rem .4rem', fontSize: '.78rem', minWidth: 110 }}>
            {nextStatuses.map((s) => <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>)}
        </select>
    );
}

export default function AuthorityDashboard() {
    const { issues, currentUser, updateIssueStatus } = useAppContext();
    const t = useT();

    const total = issues.length;
    const open = issues.filter((i) => i.status === 'reported' || i.status === 'under-review').length;
    const inProgress = issues.filter((i) => i.status === 'in-progress' || i.status === 'assigned').length;
    const resolved = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const critical = issues.filter((i) => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'closed').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentIssues = issues.filter((i) => new Date(i.createdAt).getTime() > oneWeekAgo);

    const prioritized = [...issues]
        .filter((i) => i.status !== 'resolved' && i.status !== 'closed' && i.status !== 'rejected')
        .sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.severity] - { critical: 0, high: 1, medium: 2, low: 3 }[b.severity]))
        .slice(0, 8);

    const categoryCounts = issues.reduce<Record<string, number>>((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {});
    const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const overviewRows = [
        { label: 'Reported', count: issues.filter((i) => i.status === 'reported').length, color: '#6B7280' },
        { label: 'Under Review', count: issues.filter((i) => i.status === 'under-review').length, color: '#F59E0B' },
        { label: 'Assigned', count: issues.filter((i) => i.status === 'assigned').length, color: '#3B82F6' },
        { label: 'In Progress', count: issues.filter((i) => i.status === 'in-progress').length, color: '#8B5CF6' },
        { label: 'Resolved', count: issues.filter((i) => i.status === 'resolved').length, color: '#10B981' },
        { label: t.criticalOpen, count: critical, color: '#EF4444' },
    ];

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <div>
                    <h1>{t.authorityDashTitle}</h1>
                    <p>{t.welcomeBack2}, {currentUser?.name ?? 'Officer'}. {t.authorityDashSubtitle}</p>
                </div>
                <Link to="/authority/issues" className="cv-btn cv-btn-primary">{t.manageAllIssues}</Link>
            </div>

            <div className="cv-grid cv-grid-4" style={{ marginBottom: '2rem' }}>
                <StatCard icon="📋" value={total} label={t.totalIssues} color="var(--cv-primary)" />
                <StatCard icon="🔴" value={open} label={t.needsAttention} color="var(--cv-danger)" />
                <StatCard icon="⚙️" value={inProgress} label={t.inProgress} color="var(--cv-warning)" />
                <StatCard icon="✅" value={`${resolutionRate}%`} label={t.resolutionRate} color="var(--cv-accent)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
                <div>
                    <div className="cv-flex cv-items-center cv-justify-between" style={{ marginBottom: '1rem' }}>
                        <h3>{t.priorityIssues}</h3>
                        <Link to="/authority/issues" className="cv-btn cv-btn-ghost cv-btn-sm">{t.viewAll}</Link>
                    </div>

                    <div className="cv-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--cv-surface-alt)', borderBottom: '1px solid var(--cv-border)' }}>
                                    {['Issue', 'Severity', 'Status', 'Action'].map((h) => (
                                        <th key={h} style={{ padding: '.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--cv-text-secondary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {prioritized.map((issue, idx) => (
                                    <tr key={issue.id} style={{ borderBottom: idx < prioritized.length - 1 ? '1px solid var(--cv-border)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--cv-surface-alt)44' }}>
                                        <td style={{ padding: '.7rem 1rem', maxWidth: 260 }}>
                                            <Link to={`/issues/${issue.id}`} style={{ fontWeight: 500, color: 'var(--cv-text)', textDecoration: 'none' }}>
                                                {issue.title.length > 50 ? issue.title.slice(0, 50) + '…' : issue.title}
                                            </Link>
                                            <div className="cv-text-xs cv-text-muted" style={{ marginTop: 2 }}>📍 {issue.location.area}</div>
                                        </td>
                                        <td style={{ padding: '.7rem .75rem' }}><SeverityBadge severity={issue.severity} /></td>
                                        <td style={{ padding: '.7rem .75rem' }}><StatusBadge status={issue.status} /></td>
                                        <td style={{ padding: '.7rem .75rem' }}>
                                            <StatusSelect currentStatus={issue.status} onChange={(s) => void updateIssueStatus(issue.id, s)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="cv-flex-col cv-gap">
                    {/* Weekly Report Card */}
                    <div className="cv-card" style={{ background: 'var(--cv-surface-alt)', border: '1px solid var(--cv-border)' }}>
                        <div className="cv-flex cv-items-center cv-justify-between" style={{ marginBottom: '.5rem' }}>
                            <h4 style={{ margin: 0 }}>📅 {t.thisWeek || 'Last 7 Days'}</h4>
                            <span className="cv-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--cv-warning)' }}>
                                +{recentIssues.length} new
                            </span>
                        </div>
                        <p className="cv-text-xs cv-text-secondary">
                            A total of {recentIssues.length} issue(s) were reported to your authority this past week.
                        </p>
                    </div>

                    {/* Sustainability & Tree Priorities */}
                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.75rem' }}>🌳 {t.sustainability || 'Tree Priorities'}</h4>
                        <div className="cv-flex-col cv-gap-sm">
                            {MOCK_SUSTAINABILITY_METRICS.filter(m => m.plantationPriority !== 'low').map((m, idx, arr) => (
                                <div key={m.areaName} className="cv-flex cv-items-center cv-justify-between cv-text-sm" style={{ padding: '.25rem 0', borderBottom: idx < arr.length - 1 ? '1px solid var(--cv-border)' : 'none' }}>
                                    <span style={{ fontWeight: 500 }}>{m.areaName}</span>
                                    <span className="cv-badge" style={{ 
                                        background: m.plantationPriority === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                                        color: m.plantationPriority === 'critical' ? 'var(--cv-danger)' : 'var(--cv-warning)' 
                                    }}>
                                        {m.plantationPriority.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.75rem' }}>{t.overview}</h4>
                        {overviewRows.map((row) => (
                            <div key={row.label} className="cv-flex cv-justify-between cv-items-center cv-text-sm" style={{ padding: '.3rem 0', borderBottom: '1px solid var(--cv-border)' }}>
                                <span className="cv-text-secondary">{row.label}</span>
                                <span className="cv-font-semibold" style={{ color: row.color }}>{row.count}</span>
                            </div>
                        ))}
                    </div>

                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.75rem' }}>📁 {t.byCategory}</h4>
                        <div className="cv-flex-col cv-gap-sm">
                            {topCategories.map(([catId, count]) => {
                                const info = CATEGORIES.find((c) => c.id === catId);
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={catId}>
                                        <div className="cv-flex cv-justify-between cv-text-xs cv-text-muted" style={{ marginBottom: 3 }}>
                                            <span>{info?.icon} {info?.label}</span>
                                            <span>{count} ({pct}%)</span>
                                        </div>
                                        <div className="cv-progress" style={{ height: 5 }}>
                                            <div className="cv-progress-fill" style={{ width: `${pct}%`, background: info?.color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="cv-card" style={{ textAlign: 'center' }}>
                        <h4 style={{ marginBottom: '.75rem' }}>{t.quickLinks}</h4>
                        <div className="cv-flex-col cv-gap-sm">
                            <Link to="/authority/issues" className="cv-btn cv-btn-secondary" style={{ width: '100%' }}>📋 {t.allIssues}</Link>
                            <Link to="/authority/analytics" className="cv-btn cv-btn-secondary" style={{ width: '100%' }}>📈 {t.analytics}</Link>
                            <Link to="/map" className="cv-btn cv-btn-secondary" style={{ width: '100%' }}>🗺️ {t.mapView}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
