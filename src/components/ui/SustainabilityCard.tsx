import { useT } from '../../i18n/translations';
import type { SustainabilityMetrics } from '../../types';

export default function SustainabilityCard({ metrics }: { metrics?: SustainabilityMetrics }) {
    const t = useT();

    if (!metrics) {
        return (
            <div className="cv-card cv-flex-col cv-gap-sm cv-items-center cv-justify-center" style={{ minHeight: 180, textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem' }}>🌱</span>
                <div className="cv-font-medium cv-text-secondary">No Sustainability Data</div>
            </div>
        );
    }

    const { areaName, totalTrees, treesNeeded, greenCoveragePct, deficitZone, plantationPriority } = metrics;
    const progressColor = greenCoveragePct >= 30 ? 'var(--cv-accent)' : greenCoveragePct >= 15 ? 'var(--cv-warning)' : 'var(--cv-danger)';

    return (
        <div className="cv-card">
            <div className="cv-flex cv-justify-between cv-items-start" style={{ marginBottom: '1.25rem' }}>
                <div>
                    <h4 style={{ marginBottom: '.25rem' }}>🌳 {t.sustainability || 'Tree Coverage & Sustainability'}</h4>
                    <div className="cv-text-xs cv-text-muted">{areaName}</div>
                </div>
                {deficitZone && (
                    <span className="cv-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--cv-danger)' }}>
                        Deficit Zone
                    </span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                    <div className="cv-text-xs cv-text-secondary" style={{ marginBottom: 4 }}>Total Trees</div>
                    <div className="cv-font-semibold" style={{ fontSize: '1.25rem', color: 'var(--cv-primary)' }}>
                        {totalTrees.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div className="cv-text-xs cv-text-secondary" style={{ marginBottom: 4 }}>Trees Needed</div>
                    <div className="cv-font-semibold" style={{ fontSize: '1.25rem', color: treesNeeded > 0 ? 'var(--cv-warning)' : 'var(--cv-accent)' }}>
                        {treesNeeded > 0 ? `+${treesNeeded.toLocaleString()}` : '0'}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '.75rem' }}>
                <div className="cv-flex cv-justify-between cv-text-xs cv-font-medium" style={{ marginBottom: 6 }}>
                    <span className="cv-text-secondary">Est. Green Coverage</span>
                    <span style={{ color: progressColor }}>{greenCoveragePct}%</span>
                </div>
                <div className="cv-progress">
                    <div className="cv-progress-fill" style={{ width: `${greenCoveragePct}%`, background: progressColor }} />
                </div>
            </div>

            {plantationPriority !== 'low' && (
                <div className="cv-text-xs cv-font-medium" style={{ color: 'var(--cv-danger)', marginTop: '.75rem' }}>
                    🚨 Plantation Priority: {plantationPriority.toUpperCase()}
                </div>
            )}
        </div>
    );
}
