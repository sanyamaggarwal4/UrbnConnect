import { getCivicRankLabel } from '../../lib/civicScore';
import type { CivicScoreBreakdown } from '../../types';

interface CivicScoreCardProps {
    score: CivicScoreBreakdown;
    userName?: string;
    compact?: boolean;
}

export default function CivicScoreCard({ score, userName, compact = false }: CivicScoreCardProps) {
    const rank = getCivicRankLabel(score.total);
    const maxScore = 600; // reference max for display ring
    const pct = Math.min(100, Math.round((score.total / maxScore) * 100));

    // Breakdown bars
    const bars = [
        { label: '🌳 Trees Adopted', val: score.treesAdopted, pts: score.treesAdopted * 5, color: '#16A34A', max: 20 },
        { label: '🤝 Drives Joined', val: score.drivesJoined, pts: score.drivesJoined * 3, color: '#2563EB', max: 20 },
        { label: '📋 Issues Reported', val: score.issuesReported, pts: score.issuesReported * 2, color: '#7C3AED', max: 30 },
    ];

    if (compact) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'var(--cv-eco-gradient-soft)',
                border: '1px solid rgba(22,163,74,0.25)',
                borderRadius: 'var(--cv-radius)',
            }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--cv-eco-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span style={{ fontSize: '1.1rem' }}>{rank.emoji}</span>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.75rem', color: 'var(--cv-text-muted)', marginBottom: 2 }}>Civic Score</div>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: rank.color, lineHeight: 1 }}>{score.total}</div>
                    <div style={{ fontSize: '.7rem', color: rank.color, marginTop: 2 }}>{rank.label}</div>
                </div>
                <div className="cv-progress" style={{ width: 60, height: 6 }}>
                    <div className="cv-progress-fill" style={{ width: `${pct}%`, background: rank.color }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--cv-eco-gradient)',
            borderRadius: 'var(--cv-radius-lg)',
            padding: '1.5rem',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.5rem',
        }}>
            {/* Decorative leaf */}
            <div style={{
                position: 'absolute', top: -20, right: -20,
                fontSize: '7rem', opacity: 0.08, userSelect: 'none',
                transform: 'rotate(-25deg)',
            }}>🌿</div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                {/* Score ring */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                    <div style={{
                        width: 90, height: 90, borderRadius: '50%',
                        border: '5px solid rgba(255,255,255,0.35)',
                        background: 'rgba(255,255,255,0.12)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>{score.total}</span>
                        <span style={{ fontSize: '.65rem', opacity: 0.8, marginTop: 2 }}>pts</span>
                    </div>
                    <span style={{ fontSize: '.75rem', opacity: 0.9, fontWeight: 600 }}>{rank.emoji} {rank.label}</span>
                </div>

                {/* Breakdown */}
                <div style={{ flex: 1, minWidth: 180 }}>
                    {userName && <div style={{ fontSize: '.8rem', opacity: 0.75, marginBottom: '.65rem' }}>Civic Score for {userName}</div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                        {bars.map(b => (
                            <div key={b.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', marginBottom: '3px' }}>
                                    <span style={{ opacity: 0.9 }}>{b.label} ({b.val})</span>
                                    <span style={{ fontWeight: 700 }}>+{b.pts} pts</span>
                                </div>
                                <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', width: `${Math.min(100, (b.val / b.max) * 100)}%`,
                                        background: 'rgba(255,255,255,0.8)', borderRadius: 99,
                                        transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                marginTop: '1.25rem', paddingTop: '.85rem',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem',
            }}>
                <div style={{ fontSize: '.75rem', opacity: 0.8 }}>
                    ⭐ Each tree = 5pts • Each drive = 3pts • Each report = 2pts
                </div>
                <div style={{
                    background: 'rgba(255,255,255,0.15)', borderRadius: 99,
                    padding: '.2rem .75rem', fontSize: '.72rem', fontWeight: 700,
                }}>
                    {pct}% to max rank
                </div>
            </div>
        </div>
    );
}
