import { CATEGORIES, STATUS_OPTIONS, SEVERITY_OPTIONS } from '../../mockData';
import type { IssueCategory, IssueStatus, IssueSeverity } from '../../types';

interface FilterState {
    category: IssueCategory | 'all';
    status: IssueStatus | 'all';
    severity: IssueSeverity | 'all';
}

interface Props {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {/* Category row */}
            <div style={{ marginBottom: '.5rem' }}>
                <span className="cv-text-xs cv-font-semibold cv-text-muted" style={{ marginRight: '.5rem' }}>
                    Category:
                </span>
                <div className="cv-filters" style={{ display: 'inline-flex', padding: 0 }}>
                    <button
                        className={`cv-filter-chip ${filters.category === 'all' ? 'selected' : ''}`}
                        onClick={() => onChange({ ...filters, category: 'all' })}
                    >
                        All
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`cv-filter-chip ${filters.category === cat.id ? 'selected' : ''}`}
                            onClick={() => onChange({ ...filters, category: cat.id })}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status + Severity row */}
            <div className="cv-flex cv-gap" style={{ flexWrap: 'wrap' }}>
                <div>
                    <span className="cv-text-xs cv-font-semibold cv-text-muted" style={{ marginRight: '.5rem' }}>
                        Status:
                    </span>
                    <div className="cv-filters" style={{ display: 'inline-flex', padding: 0 }}>
                        <button
                            className={`cv-filter-chip ${filters.status === 'all' ? 'selected' : ''}`}
                            onClick={() => onChange({ ...filters, status: 'all' })}
                        >
                            All
                        </button>
                        {STATUS_OPTIONS.map((s) => (
                            <button
                                key={s.id}
                                className={`cv-filter-chip ${filters.status === s.id ? 'selected' : ''}`}
                                onClick={() => onChange({ ...filters, status: s.id as IssueStatus })}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <span className="cv-text-xs cv-font-semibold cv-text-muted" style={{ marginRight: '.5rem' }}>
                        Severity:
                    </span>
                    <div className="cv-filters" style={{ display: 'inline-flex', padding: 0 }}>
                        <button
                            className={`cv-filter-chip ${filters.severity === 'all' ? 'selected' : ''}`}
                            onClick={() => onChange({ ...filters, severity: 'all' })}
                        >
                            All
                        </button>
                        {SEVERITY_OPTIONS.map((s) => (
                            <button
                                key={s.id}
                                className={`cv-filter-chip ${filters.severity === s.id ? 'selected' : ''}`}
                                onClick={() => onChange({ ...filters, severity: s.id as IssueSeverity })}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export type { FilterState };
