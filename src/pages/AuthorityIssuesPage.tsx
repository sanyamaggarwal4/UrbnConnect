import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import type { IssueStatus } from '../types';
import SeverityBadge from '../components/ui/SeverityBadge';
import CategoryChip from '../components/ui/CategoryChip';

const STATUS_OPTIONS: IssueStatus[] = ['reported', 'under-review', 'assigned', 'in-progress', 'resolved', 'rejected'];

const STATUS_COLORS: Record<string, string> = {
    reported: '#6B7280',
    'under-review': '#F59E0B',
    assigned: '#3B82F6',
    'in-progress': '#8B5CF6',
    resolved: '#10B981',
    closed: '#10B981',
    rejected: '#EF4444',
};

export default function AuthorityIssuesPage() {
    const { issues, updateIssueStatus } = useAppContext();
    const t = useT();

    const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const filterCategory = 'all'; // category filter UI coming in a future iteration
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'severity' | 'upvotes'>('severity');

    let filtered = [...issues];
    if (filterStatus !== 'all') filtered = filtered.filter((i) => i.status === filterStatus);
    if (filterSeverity !== 'all') filtered = filtered.filter((i) => i.severity === filterSeverity);
    if (filterCategory !== 'all') filtered = filtered.filter((i) => i.category === filterCategory);
    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.location.area.toLowerCase().includes(q));
    }

    if (sortBy === 'recent') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'severity') {
        const sev = { critical: 0, high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => sev[a.severity] - sev[b.severity]);
    } else {
        filtered.sort((a, b) => b.upvotes - a.upvotes);
    }

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <h1>📋 Area Issues Management</h1>
                <p>Review, assign, and resolve issues reported in your jurisdiction.</p>
            </div>

            <div className="cv-flex cv-items-center cv-gap" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input className="cv-input" type="text" placeholder="🔍 Search issues..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
                <div className="cv-flex cv-gap-sm">
                    {(['severity', 'recent', 'upvotes'] as const).map((s) => (
                        <button key={s} className={`cv-filter-chip ${sortBy === s ? 'selected' : ''}`} onClick={() => setSortBy(s)}>
                            {s === 'severity' ? '🚨 Severity' : s === 'recent' ? '🕐 Recent' : '👍 Upvotes'}
                        </button>
                    ))}
                </div>
                <span className="cv-text-sm cv-text-muted" style={{ marginLeft: 'auto' }}>
                    {filtered.length} issue{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="cv-flex cv-gap-sm" style={{ marginBottom: '.5rem', flexWrap: 'wrap' }}>
                <span className="cv-text-xs cv-text-muted cv-font-semibold" style={{ alignSelf: 'center' }}>STATUS:</span>
                <button className={`cv-filter-chip ${filterStatus === 'all' ? 'selected' : ''}`} onClick={() => setFilterStatus('all')}>{t.all}</button>
                {STATUS_OPTIONS.map((s) => (
                    <button key={s} className={`cv-filter-chip ${filterStatus === s ? 'selected' : ''}`} onClick={() => setFilterStatus(s)}>{s.replace(/-/g, ' ')}</button>
                ))}
            </div>

            <div className="cv-flex cv-gap-sm" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span className="cv-text-xs cv-text-muted cv-font-semibold" style={{ alignSelf: 'center' }}>SEVERITY:</span>
                {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
                    <button key={s} className={`cv-filter-chip ${filterSeverity === s ? 'selected' : ''}`} onClick={() => setFilterSeverity(s)}>
                        {s === 'all' ? t.all : (t[s as keyof typeof t] || s.charAt(0).toUpperCase() + s.slice(1))}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="cv-card cv-text-center" style={{ padding: '3rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🔍</div>
                    <h3>No issues match your filters.</h3>
                </div>
            ) : (
                <div className="cv-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--cv-surface-alt)', borderBottom: '1px solid var(--cv-border)' }}>
                                {['Issue & Location', 'Category', 'Severity', 'Status', 'Upvotes', 'Update Status'].map((h) => (
                                    <th key={h} style={{ padding: '.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--cv-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((issue, idx) => (
                                <tr key={issue.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--cv-border)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--cv-surface-alt)44' }}>
                                    <td style={{ padding: '.75rem 1rem', maxWidth: 260 }}>
                                        <Link to={`/issues/${issue.id}`} style={{ fontWeight: 500, color: 'var(--cv-primary)', textDecoration: 'none' }}>{issue.title.length > 55 ? issue.title.slice(0, 55) + '…' : issue.title}</Link>
                                        <div className="cv-text-xs cv-text-muted" style={{ marginTop: 2 }}>📍 {issue.location.area}{issue.location.ward ? ` · ${issue.location.ward}` : ''}</div>
                                        <div className="cv-text-xs cv-text-muted">{new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    </td>
                                    <td style={{ padding: '.75rem .75rem' }}><CategoryChip category={issue.category} size="sm" /></td>
                                    <td style={{ padding: '.75rem .75rem' }}><SeverityBadge severity={issue.severity} /></td>
                                    <td style={{ padding: '.75rem .75rem' }}>
                                        <span style={{ display: 'inline-block', padding: '.2rem .55rem', borderRadius: 99, fontSize: '.72rem', fontWeight: 600, textTransform: 'capitalize', background: `${STATUS_COLORS[issue.status] ?? '#6B7280'}18`, color: STATUS_COLORS[issue.status] ?? '#6B7280' }}>
                                            {issue.status.replace(/-/g, ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '.75rem .75rem', textAlign: 'center' }}><span style={{ fontWeight: 600 }}>👍 {issue.upvotes}</span></td>
                                    <td style={{ padding: '.75rem .75rem' }}>
                                        <select className="cv-input" value={issue.status} onChange={(e) => void updateIssueStatus(issue.id, e.target.value as IssueStatus)} style={{ padding: '.3rem .5rem', fontSize: '.78rem', minWidth: 120 }}>
                                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
