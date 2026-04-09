import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { MOCK_USERS } from '../mockData';
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
        </div>
    );
}
