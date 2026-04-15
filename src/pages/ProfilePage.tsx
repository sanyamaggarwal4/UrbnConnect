import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { Link } from 'react-router-dom';
import CivicScoreCard from '../components/ui/CivicScoreCard';
import TopContributorBadge from '../components/ui/TopContributorBadge';
import { isTopContributor } from '../lib/civicScore';

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

    const civicScore = currentUser.civicScore;
    const isTopC = civicScore ? isTopContributor(civicScore.total) : false;

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
                        <h2 style={{ marginBottom: '.15rem' }}>{currentUser.name}</h2>
                        {isTopC && <TopContributorBadge size="sm" />}
                    </div>
                    <div className="cv-text-sm cv-text-secondary">{currentUser.email}</div>
                    <div className="cv-badge" style={{ marginTop: '.5rem', background: 'var(--cv-primary-light)', color: 'var(--cv-primary)', display: 'inline-block' }}>
                        {roleLabel}
                    </div>
                </div>
                <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={logout}>Sign Out</button>
            </div>

            {/* ── Civic Score Section ─────────────────────────────── */}
            {civicScore && currentUser.role === 'citizen' && (
                <CivicScoreCard score={civicScore} userName={currentUser.name} />
            )}

            {/* ── Contribution History ────────────────────────────── */}
            {civicScore && currentUser.role === 'citizen' && (
                <div className="cv-card" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        🏅 Contribution History
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
                        {[
                            { icon: '🌳', label: 'Trees Adopted', val: civicScore.treesAdopted, color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
                            { icon: '🤝', label: 'Drives Joined', val: civicScore.drivesJoined, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
                            { icon: '📋', label: 'Issues Reported', val: civicScore.issuesReported, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
                        ].map(item => (
                            <div key={item.label} style={{
                                textAlign: 'center', padding: '1rem',
                                background: item.bg, borderRadius: 'var(--cv-radius)',
                                border: `1px solid ${item.color}15`,
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{item.icon}</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color }}>{item.val}</div>
                                <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Download certificate button */}
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            className="cv-btn cv-btn-sm"
                            style={{
                                background: 'var(--cv-eco-green-muted)', color: 'var(--cv-eco-green)',
                                border: '1px solid rgba(22,163,74,0.3)',
                            }}
                            onClick={() => {
                                const w = window.open('', '_blank');
                                if (w) {
                                    w.document.write(`
                                        <html><head><title>Civic Contribution Certificate</title>
                                        <style>body{font-family:Inter,sans-serif;text-align:center;padding:3rem;color:#0F172A}
                                        h1{color:#16A34A;font-size:2rem;margin:.5rem 0 .25rem}
                                        .score{font-size:3.5rem;font-weight:900;color:#14532D;margin:1rem 0}
                                        .line{width:200px;height:2px;background:linear-gradient(90deg,#16A34A,#22C55E);margin:1rem auto}
                                        .detail{color:#64748B;font-size:.95rem;margin:.3rem 0}
                                        .footer{margin-top:2rem;font-size:.8rem;color:#94A3B8}</style></head>
                                        <body>
                                        <div style="border:3px solid #16A34A;padding:3rem;border-radius:16px;max-width:600px;margin:0 auto">
                                        <div style="font-size:3rem">🏅</div>
                                        <h1>Certificate of Civic Contribution</h1>
                                        <div class="line"></div>
                                        <p style="font-size:1.1rem;margin-top:1rem">This certifies that</p>
                                        <h2 style="color:#14532D">${currentUser.name}</h2>
                                        <p>has earned a Civic Score of</p>
                                        <div class="score">${civicScore.total} pts</div>
                                        <div class="detail">🌳 ${civicScore.treesAdopted} trees adopted</div>
                                        <div class="detail">🤝 ${civicScore.drivesJoined} drives joined</div>
                                        <div class="detail">📋 ${civicScore.issuesReported} issues reported</div>
                                        <div class="line"></div>
                                        <div class="footer">Issued by UrbnConnect — ${new Date().toLocaleDateString()}</div>
                                        </div>
                                        </body></html>
                                    `);
                                    w.document.close();
                                    setTimeout(() => w.print(), 500);
                                }
                            }}
                        >
                            📜 Download Contribution Certificate
                        </button>
                    </div>
                </div>
            )}

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
