interface ParticipantProgressBarProps {
    current: number;
    target: number;
    showLabel?: boolean;
}

export default function ParticipantProgressBar({ current, target, showLabel = true }: ParticipantProgressBarProps) {
    const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    const isComplete = pct >= 100;

    return (
        <div>
            {showLabel && (
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '.78rem', marginBottom: '4px',
                }}>
                    <span style={{ color: 'var(--cv-text-secondary)' }}>
                        👥 {current} / {target} participants
                    </span>
                    <span style={{
                        fontWeight: 700,
                        color: isComplete ? '#16A34A' : 'var(--cv-text-muted)',
                    }}>
                        {pct}%{isComplete ? ' 🎉' : ''}
                    </span>
                </div>
            )}
            <div style={{
                height: 7, background: 'var(--cv-surface-alt)',
                borderRadius: 99, overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: isComplete
                        ? 'linear-gradient(90deg, #16A34A, #22C55E)'
                        : 'linear-gradient(90deg, #2563EB, #3B82F6)',
                    borderRadius: 99,
                    transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                }} />
            </div>
        </div>
    );
}
