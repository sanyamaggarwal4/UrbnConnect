import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { CATEGORIES } from '../mockData';

function computeAreaRating(issues: ReturnType<typeof useAppContext>['issues']) {
    const total = issues.length;
    const resolved = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const critical = issues.filter((i) => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'closed').length;
    return Math.max(0, Math.min(100, 70 + Math.round((resolved / Math.max(total, 1)) * 30) - critical * 5));
}

function RatingBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
    return (
        <div className="cv-progress" style={{ height: 10, borderRadius: 99 }}>
            <div className="cv-progress-fill" style={{ width: `${(value / max) * 100}%`, background: color, borderRadius: 99 }} />
        </div>
    );
}

const AREA_RATINGS = [
    { area: 'Karol Bagh Central', scoreBase: 74, pop: '41,200' },
    { area: 'Rajinder Nagar', scoreBase: 61, pop: '33,800' },
    { area: 'Pusa Road Corridor', scoreBase: 53, pop: '18,500' },
    { area: 'Arya Samaj Block', scoreBase: 82, pop: '12,700' },
    { area: 'Ghaffar Market Zone', scoreBase: 67, pop: '22,300' },
];

export default function AreaInsightsPage() {
    const { issues } = useAppContext();
    const t = useT();

    const overallScore = computeAreaRating(issues);
    const total = issues.length;
    const resolved = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    const categoryCounts = issues.reduce<Record<string, number>>((acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + 1;
        return acc;
    }, {});

    const categoryInsights = CATEGORIES.map((cat) => ({
        ...cat,
        count: categoryCounts[cat.id] ?? 0,
        resolved: issues.filter((i) => i.category === cat.id && (i.status === 'resolved' || i.status === 'closed')).length,
    })).sort((a, b) => b.count - a.count);

    const scoreColor = overallScore >= 75 ? '#10B981' : overallScore >= 50 ? '#F59E0B' : '#EF4444';
    const scoreLabel = overallScore >= 75 ? t.good : overallScore >= 50 ? t.needsImprovement : t.poor;

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <h1>📈 {t.areaInsightsTitle}</h1>
                <p>{t.areaInsightsSubtitle}</p>
            </div>

            <div className="cv-card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem', padding: '1.75rem 2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 110, height: 110, borderRadius: '50%', border: `6px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `${scoreColor}10` }}>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreColor }}>{overallScore}</div>
                        <div style={{ fontSize: '.65rem', color: scoreColor, fontWeight: 700 }}>/ 100</div>
                    </div>
                    <div className="cv-text-xs cv-font-semibold" style={{ marginTop: '.5rem', color: scoreColor }}>{scoreLabel}</div>
                </div>

                <div>
                    <h2 style={{ marginBottom: '.35rem' }}>{t.wardHealthScore}</h2>
                    <p className="cv-text-secondary cv-text-sm" style={{ marginBottom: '1rem' }}>{t.wardHealthScoreDesc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
                        {[
                            { label: t.totalIssues, val: total },
                            { label: t.resolved, val: resolved },
                            { label: t.resolutionRate, val: `${resRate}%` },
                        ].map((kpi) => (
                            <div key={kpi.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cv-primary)' }}>{kpi.val}</div>
                                <div className="cv-text-xs cv-text-muted">{kpi.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="cv-card">
                    <h4 style={{ marginBottom: '1rem' }}>📍 {t.areaRatings}</h4>
                    <div className="cv-flex-col cv-gap">
                        {AREA_RATINGS.map((ar) => {
                            const score = Math.min(100, ar.scoreBase + Math.floor(Math.random() * 5));
                            const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
                            return (
                                <div key={ar.area}>
                                    <div className="cv-flex cv-justify-between cv-text-sm" style={{ marginBottom: 4 }}>
                                        <span className="cv-font-medium">{ar.area}</span>
                                        <span className="cv-font-semibold" style={{ color }}>{score}/100</span>
                                    </div>
                                    <RatingBar value={score} color={color} />
                                    <div className="cv-text-xs cv-text-muted" style={{ marginTop: 2 }}>
                                        {t.population} ~{ar.pop}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="cv-card">
                    <h4 style={{ marginBottom: '1rem' }}>📊 {t.categoryHealth}</h4>
                    <div className="cv-flex-col cv-gap-sm">
                        {categoryInsights.filter((c) => c.count > 0).map((cat) => {
                            const catResRate = cat.count > 0 ? Math.round((cat.resolved / cat.count) * 100) : 0;
                            const color = catResRate >= 75 ? '#10B981' : catResRate >= 40 ? '#F59E0B' : '#EF4444';
                            return (
                                <div key={cat.id}>
                                    <div className="cv-flex cv-justify-between cv-text-sm" style={{ marginBottom: 3 }}>
                                        <span>{cat.icon} {t[cat.id] || cat.label}</span>
                                        <span>
                                            <span className="cv-text-muted">{cat.count} {t.issuesText} · </span>
                                            <span className="cv-font-semibold" style={{ color }}>{catResRate}% {t.resolved}</span>
                                        </span>
                                    </div>
                                    <RatingBar value={catResRate} color={color} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="cv-card">
                <h4 style={{ marginBottom: '.85rem' }}>💡 {t.civicRecommendations}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '.75rem' }}>
                    {[
                        { icon: '🚰', tip: 'Focus on Water & Drainage — high issue count with low resolution rate.' },
                        { icon: '🛣️', tip: 'Prioritize Roads & Infrastructure repairs before the monsoon season.' },
                        { icon: '🌿', tip: 'Engage community for Environment cleanup drives in affected zones.' },
                        { icon: '📣', tip: 'Publicize resolved issues to improve citizen trust and engagement.' },
                    ].map((item, i) => (
                        <div key={i} className="cv-card" style={{ padding: '.85rem', background: 'var(--cv-surface-alt)', border: 'none' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '.35rem' }}>{item.icon}</div>
                            <p className="cv-text-sm cv-text-secondary">{item.tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
