import { SEVERITY_OPTIONS } from '../../mockData';
import type { IssueSeverity } from '../../types';

interface Props {
    severity: IssueSeverity;
}

export default function SeverityBadge({ severity }: Props) {
    const info = SEVERITY_OPTIONS.find((s) => s.id === severity);
    if (!info) return null;

    return (
        <span
            className="cv-badge"
            style={{
                background: `${info.color}18`,
                color: info.color,
            }}
        >
            {info.label}
        </span>
    );
}
