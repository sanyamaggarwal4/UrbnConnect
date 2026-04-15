import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDriveStatusMeta, resolveDriveStatus } from '../../lib/civicScore';
import ParticipantProgressBar from './ParticipantProgressBar';
import type { CitizenDrive } from '../../types';

interface DriveCardProps {
    drive: CitizenDrive;
    onJoin?: (driveId: string) => void;
    onCancel?: (driveId: string) => void;
    isJoined?: boolean;
    isCreator?: boolean;
}

const TYPE_ICONS: Record<string, string> = {
    cleanliness: '🧹',
    plantation: '🌳',
    awareness: '📢',
    volunteering: '🤝',
    'health-safety': '🏥',
};

export default function DriveCard({ drive, onJoin, onCancel, isJoined = false, isCreator = false }: DriveCardProps) {
    const navigate = useNavigate();
    const [joined, setJoined] = useState(isJoined);
    const [localCount, setLocalCount] = useState(drive.participantsCount);

    const resolvedStatus = resolveDriveStatus({ ...drive, participantsCount: localCount });
    const statusMeta = getDriveStatusMeta(resolvedStatus);
    const typeIcon = TYPE_ICONS[drive.type] ?? '🤝';

    const handleJoin = () => {
        if (joined) return;
        setJoined(true);
        setLocalCount(prev => prev + 1);
        onJoin?.(drive.id);
    };

    const handleCancel = () => {
        onCancel?.(drive.id);
    };

    return (
        <div style={{
            background: 'var(--cv-surface)',
            border: '1px solid var(--cv-border)',
            borderRadius: 'var(--cv-radius-lg)',
            padding: '1.25rem',
            transition: 'box-shadow .25s, transform .25s',
            borderLeft: `4px solid ${statusMeta.color}`,
        }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--cv-shadow)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.transform = ''; }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.75rem', marginBottom: '.65rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.3rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{typeIcon}</span>
                        <strong style={{ fontSize: '.975rem' }}>{drive.title}</strong>
                        {/* Citizen Initiated tag */}
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '.2rem',
                            padding: '.1rem .5rem',
                            background: 'var(--cv-eco-green-muted)',
                            color: 'var(--cv-eco-green)',
                            borderRadius: 99, fontSize: '.65rem', fontWeight: 700,
                            border: '1px solid rgba(22,163,74,0.25)',
                        }}>
                            🌿 Citizen Initiated
                        </span>
                    </div>
                    <div style={{ fontSize: '.78rem', color: 'var(--cv-text-muted)' }}>
                        by {drive.createdBy} {drive.date && `• ${drive.date}`}
                    </div>
                </div>
                {/* Status badge */}
                <span style={{
                    padding: '.2rem .65rem',
                    background: statusMeta.bg,
                    color: statusMeta.color,
                    borderRadius: 99,
                    fontSize: '.7rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}>
                    {statusMeta.label}
                </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '.875rem', color: 'var(--cv-text-secondary)', lineHeight: 1.55, margin: '0 0 .85rem' }}>
                {drive.description}
            </p>

            {/* Location */}
            <div style={{ fontSize: '.8rem', color: 'var(--cv-text-muted)', marginBottom: '.85rem' }}>
                📍 {drive.location}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '1rem' }}>
                <ParticipantProgressBar current={localCount} target={drive.target} />
            </div>

            {/* Related issue link */}
            {drive.issueTitle && (
                <div style={{
                    fontSize: '.75rem', color: 'var(--cv-text-muted)',
                    marginBottom: '.85rem',
                    padding: '.3rem .6rem',
                    background: 'var(--cv-surface-alt)',
                    borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                }}>
                    🔗 Linked: <span
                        style={{ color: 'var(--cv-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate(`/issues/${drive.issueId}`)}
                    >{drive.issueTitle.length > 50 ? drive.issueTitle.slice(0, 50) + '…' : drive.issueTitle}</span>
                </div>
            )}

            {/* Action buttons */}
            {resolvedStatus !== 'completed' && resolvedStatus !== 'expired' && (
                <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end' }}>
                    {isCreator && resolvedStatus === 'gathering' && (
                        <button
                            className="cv-btn cv-btn-ghost cv-btn-sm"
                            onClick={handleCancel}
                            style={{ color: 'var(--cv-danger)', fontSize: '.8rem' }}
                        >
                            Cancel Drive
                        </button>
                    )}
                    <button
                        className={`cv-btn cv-btn-sm ${joined ? 'cv-btn-secondary' : ''}`}
                        disabled={joined || resolvedStatus === 'expired'}
                        onClick={handleJoin}
                        style={!joined ? {
                            background: 'var(--cv-eco-green)',
                            color: '#fff',
                            border: 'none',
                        } : {}}
                    >
                        {joined ? '✅ Joined' : '🤝 Join Drive'}
                    </button>
                </div>
            )}
        </div>
    );
}
