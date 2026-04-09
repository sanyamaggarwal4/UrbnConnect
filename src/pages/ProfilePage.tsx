import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    const { currentUser, issues, logout } = useAppContext();
    const t = useT();

    if (!currentUser) {
        return (
            <div className="cv-animate-fadeIn cv-text-center" style={{ padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h2>Not Logged In</h2>
                <p className="cv-text-secondary" style={{ marginBottom: '1rem' }}>Please sign in to view your profile.</p>
                <Link to="/login" className="cv-btn cv-btn-primary">Sign In</Link>
            </div>
        );
    }

    const myIssues = issues.filter((i) => i.reportedBy === currentUser.id);
    const myResolved = myIssues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const myActive = myIssues.filter((i) => i.status !== 'resolved' && i.status !== 'closed' && i.status !== 'rejected').length;
    const myUpvotes = myIssues.reduce((s, i) => s + i.upvotes, 0);

    const roleLabel = currentUser.role === 'authority' ? '🏗️ Authority Officer' : `👤 ${t.citizenLabel || 'Citizen'}`;
    const initials = currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 680, margin: '0 auto', paddingBottom: '2.5rem' }}>

            {/* ── Profile header card ─────────────────────────────── */}
            <div className="cv-card" style={{
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                marginBottom: '1.5rem', padding: '1.75rem 2rem',
                background: 'linear-gradient(135deg, var(--cv-primary-light) 0%, var(--cv-surface) 100%)',
            }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--cv-primary), var(--cv-primary-dark))',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', fontWeight: 800, flexShrink: 0,
                }}>
                    {initials}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ marginBottom: '.15rem' }}>{currentUser.name}</h2>
                    <div className="cv-text-sm cv-text-secondary">{currentUser.email}</div>
                    <div className="cv-badge" style={{ marginTop: '.5rem', background: 'var(--cv-primary-light)', color: 'var(--cv-primary)', display: 'inline-block' }}>
                        {roleLabel}
                    </div>
                </div>
                <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={logout}>Sign Out</button>
            </div>

            {/* ── Stats row (4 cards) ───────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { icon: '📋', label: t.issuesReported, val: myIssues.length, color: 'var(--cv-primary)' },
                    { icon: '🟠', label: 'Active Issues', val: myActive, color: '#F59E0B' },
                    { icon: '✅', label: t.resolved, val: myResolved, color: '#10B981' },
                    { icon: '👍', label: t.totalUpvotes, val: myUpvotes, color: '#8B5CF6' },
                ].map((s) => (
                    <div key={s.label} className="cv-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                        <div className="cv-text-xs cv-text-muted">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── My reported issues ──────────────────────────────── */}
            {myIssues.length > 0 && (
                <div className="cv-card">
                    <h4 style={{ marginBottom: '.85rem' }}>{t.myIssues}</h4>
                    <div className="cv-flex-col cv-gap-sm">
                        {myIssues.slice(0, 5).map((issue) => (
                            <Link key={issue.id} to={`/issues/${issue.id}`} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '.6rem .75rem', borderRadius: 'var(--cv-radius)',
                                background: 'var(--cv-surface-alt)', textDecoration: 'none',
                                color: 'var(--cv-text)', fontSize: '.875rem', gap: '.75rem',
                            }}>
                                <span style={{ flex: 1, fontWeight: 500 }}>
                                    {issue.title.length > 55 ? issue.title.slice(0, 55) + '…' : issue.title}
                                </span>
                                <span style={{
                                    padding: '.2rem .5rem', borderRadius: 99, fontSize: '.72rem',
                                    fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap',
                                    background: issue.status === 'resolved' || issue.status === 'closed' ? '#10B98118' : '#F59E0B18',
                                    color: issue.status === 'resolved' || issue.status === 'closed' ? '#10B981' : '#F59E0B',
                                }}>
                                    {issue.status.replace(/-/g, ' ')}
                                </span>
                            </Link>
                        ))}
                    </div>
                    {myIssues.length > 5 && (
                        <Link to="/issues" className="cv-text-sm cv-text-muted" style={{ display: 'block', marginTop: '.75rem', textAlign: 'center' }}>
                            View all {myIssues.length} issues →
                        </Link>
                    )}
                </div>
            )}

            {myIssues.length === 0 && (
                <div className="cv-card cv-text-center" style={{ padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📝</div>
                    <h3>No issues reported yet</h3>
                    <p className="cv-text-sm cv-text-secondary" style={{ marginBottom: '1rem' }}>Help your community by reporting a civic issue.</p>
                    <Link to="/report" className="cv-btn cv-btn-primary">Report a Problem</Link>
                </div>
            )}
        </div>
    );
}
