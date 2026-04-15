interface TopContributorBadgeProps {
    size?: 'sm' | 'md' | 'lg';
}

export default function TopContributorBadge({ size = 'md' }: TopContributorBadgeProps) {
    const sizes = {
        sm: { padding: '.15rem .55rem', fontSize: '.65rem', iconSize: '.75rem' },
        md: { padding: '.25rem .7rem', fontSize: '.72rem', iconSize: '.85rem' },
        lg: { padding: '.35rem 1rem', fontSize: '.82rem', iconSize: '1rem' },
    };
    const s = sizes[size];

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
            padding: s.padding,
            background: 'linear-gradient(135deg, #14532D, #16A34A)',
            color: '#fff',
            borderRadius: 99,
            fontSize: s.fontSize,
            fontWeight: 700,
            letterSpacing: '.03em',
            boxShadow: '0 2px 8px rgba(22,163,74,0.35)',
            whiteSpace: 'nowrap',
        }}>
            <span style={{ fontSize: s.iconSize }}>🏆</span>
            Top Contributor
        </span>
    );
}
