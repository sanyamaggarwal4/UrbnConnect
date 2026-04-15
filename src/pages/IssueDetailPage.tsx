import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { MOCK_USERS, MOCK_CITIZEN_DRIVES } from '../mockData';
import type { CitizenDrive } from '../types';
import CategoryChip from '../components/ui/CategoryChip';
import SeverityBadge from '../components/ui/SeverityBadge';
import StatusProgressBar from '../components/ui/StatusProgressBar';

export default function IssueDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { issues, upvoteIssue, currentUser } = useAppContext();
    const navigate = useNavigate();
    const t = useT();

    const issue = issues.find((i) => i.id === id);

    if (!issue) {
        return (
            <div className="cv-animate-fadeIn cv-text-center" style={{ padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
                <h2>Issue Not Found</h2>
                <p className="cv-text-secondary" style={{ marginBottom: '1rem' }}>
                    The issue you're looking for doesn't exist or has been removed.
                </p>
                <button className="cv-btn cv-btn-primary" onClick={() => navigate('/issues')}>
                    ← Back to Issues
                </button>
            </div>
        );
    }

    // Check if current user has already voted
    const voterId = currentUser?.id ?? 'guest';
    const hasVoted = issue.upvotedBy.includes(voterId);

    const reporter = MOCK_USERS.find((u) => u.id === issue.reportedBy);
    const reporterName = issue.isAnonymous ? t.anonymousCitizen : (reporter?.name ?? 'Unknown');
    const createdDate = new Date(issue.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const updatedDate = new Date(issue.updatedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 760 }}>
            {/* Back */}
            <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                {t.back}
            </button>

            {/* Title & chips */}
            <h1 style={{ fontSize: '1.6rem', marginBottom: '.75rem' }}>{issue.title}</h1>
            <div className="cv-flex cv-gap-sm cv-items-center" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <CategoryChip category={issue.category} size="md" />
                <SeverityBadge severity={issue.severity} />
                <span className="cv-text-sm cv-text-muted">📍 {issue.location.area}</span>
                {issue.location.ward && (
                    <span className="cv-text-xs cv-text-muted">| Ward: {issue.location.ward}</span>
                )}
            </div>

            {/* Status */}
            <div className="cv-card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
                <StatusProgressBar status={issue.status} />
            </div>

            {/* Description */}
            <div className="cv-card" style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ marginBottom: '.5rem' }}>{t.description}</h4>
                <p className="cv-text-secondary" style={{ lineHeight: 1.7, fontSize: '.95rem' }}>
                    {issue.description}
                </p>
            </div>

            {/* Image if exists */}
            {issue.imageUrl && (
                <div className="cv-card" style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ marginBottom: '.5rem' }}>{t.attachedPhoto}</h4>
                    <img
                        src={issue.imageUrl}
                        alt="Issue"
                        style={{ borderRadius: 'var(--cv-radius)', maxHeight: 300 }}
                    />
                </div>
            )}

            {/* Meta grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                }}
            >
                <div className="cv-card">
                    <div className="cv-text-xs cv-text-muted" style={{ marginBottom: 4 }}>{t.reportedBy}</div>
                    <div className="cv-font-semibold">{reporterName}</div>
                </div>
                <div className="cv-card">
                    <div className="cv-text-xs cv-text-muted" style={{ marginBottom: 4 }}>{t.reportedOn}</div>
                    <div className="cv-font-semibold cv-text-sm">{createdDate}</div>
                </div>
                <div className="cv-card">
                    <div className="cv-text-xs cv-text-muted" style={{ marginBottom: 4 }}>{t.lastUpdated}</div>
                    <div className="cv-font-semibold cv-text-sm">{updatedDate}</div>
                </div>
                <div className="cv-card">
                    <div className="cv-text-xs cv-text-muted" style={{ marginBottom: 4 }}>{t.locationLabel}</div>
                    <div className="cv-font-semibold cv-text-sm">
                        {issue.location.area}
                        {issue.location.constituency ? `, ${issue.location.constituency}` : ''}
                    </div>
                </div>
            </div>

            {/* Action bar */}
            <div className="cv-flex cv-gap cv-items-center">
                <button
                    className={`cv-btn ${hasVoted ? 'cv-btn-ghost' : 'cv-btn-secondary'}`}
                    onClick={() => !hasVoted && void upvoteIssue(issue.id)}
                    disabled={hasVoted}
                    title={hasVoted ? 'You already voted for this issue' : 'Mark this issue as affecting you too'}
                    style={hasVoted ? { opacity: 0.65, cursor: 'not-allowed' } : {}}
                >
                    {hasVoted ? t.alreadyUpvoted : `👍 ${t.sameIssue} (${issue.upvotes})`}
                </button>
                <button className="cv-btn cv-btn-ghost" onClick={() => navigate('/map')}>
                    {t.viewOnMap}
                </button>
            </div>

            {/* ── Community Support Section ──────────────────────────────── */}
            <div style={{ marginTop: '2rem' }}>
                <div className="cv-eco-card">
                    <h3 style={{ margin: '0 0 .4rem', display: 'flex', alignItems: 'center', gap: '.5rem', color: 'var(--cv-eco-green)' }}>
                        {t.communitySupport}
                    </h3>
                    <p style={{ margin: '0 0 1.25rem', fontSize: '.9rem', color: 'var(--cv-text-secondary)', lineHeight: 1.55 }}>
                        {t.communitySupportDesc}
                    </p>

                    {/* Existing citizen drives for this issue */}
                    {(() => {
                        const relatedDrives: CitizenDrive[] = MOCK_CITIZEN_DRIVES.filter((d: CitizenDrive) => d.issueId === issue.id);
                        if (relatedDrives.length > 0) {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1rem' }}>
                                    {relatedDrives.map((drive: CitizenDrive) => {
                                        const pct = Math.min(100, Math.round((drive.participantsCount / drive.target) * 100));
                                        const statusColor: Record<string, string> = { proposed: 'cv-status-proposed', gathering: 'cv-status-gathering', active: 'cv-status-active', completed: 'cv-status-completed', expired: 'cv-status-expired' };
                                        return (
                                            <div key={drive.id} style={{ background: 'var(--cv-surface)', borderRadius: 'var(--cv-radius)', padding: '1rem', border: '1px solid var(--cv-border)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                                                    <strong style={{ fontSize: '.95rem' }}>{drive.title}</strong>
                                                    <span className={`cv-status-chip ${statusColor[drive.status] || ''}`}>{drive.status.replace('-', ' ')}</span>
                                                </div>
                                                <div style={{ fontSize: '.8rem', color: 'var(--cv-text-muted)', marginBottom: '.6rem' }}>
                                                    by {drive.createdBy} {drive.date && `• ${drive.date}`}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', color: 'var(--cv-text-secondary)', marginBottom: '.25rem' }}>
                                                    <span>👥 {drive.participantsCount} / {drive.target} participants</span>
                                                    <span>{pct}%</span>
                                                </div>
                                                <div className="cv-drive-progress">
                                                    <div className="cv-drive-progress-bar" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* CTA Button */}
                    <button
                        className="cv-btn cv-btn-primary"
                        onClick={() => navigate(`/issues/${issue.id}/create-drive`)}
                        disabled={!currentUser || currentUser.id === 'guest'}
                        style={{ background: 'var(--cv-eco-green)', borderColor: 'var(--cv-eco-green)', width: '100%' }}
                        title={!currentUser || currentUser.id === 'guest' ? 'Login to start a drive' : ''}
                    >
                        🌿 {t.startDriveForIssue}
                    </button>
                    {(!currentUser || currentUser.id === 'guest') && (
                        <p style={{ fontSize: '.8rem', color: 'var(--cv-text-muted)', textAlign: 'center', marginTop: '.5rem' }}>
                            Please <a href="/login" style={{ color: 'var(--cv-eco-green)' }}>login</a> to start a drive.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
