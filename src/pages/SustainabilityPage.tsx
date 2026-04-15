import { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/translations';

// ── Tree Coverage Data per area ─────────────────────────────────────────────
const TREE_COVERAGE_ZONES = [
    {
        name: 'Karol Bagh Central',
        lat: 28.6520,
        lng: 77.1880,
        coverage: 18,
        totalTrees: 4120,
        treesNeeded: 850,
        priority: 'high' as const,
        radius: 420,
    },
    {
        name: 'Rajinder Nagar',
        lat: 28.6450,
        lng: 77.1920,
        coverage: 32,
        totalTrees: 8400,
        treesNeeded: 200,
        priority: 'low' as const,
        radius: 380,
    },
    {
        name: 'Pusa Road Corridor',
        lat: 28.6580,
        lng: 77.1850,
        coverage: 45,
        totalTrees: 12500,
        treesNeeded: 50,
        priority: 'low' as const,
        radius: 350,
    },
    {
        name: 'Arya Samaj Block',
        lat: 28.6350,
        lng: 77.1820,
        coverage: 9,
        totalTrees: 1100,
        treesNeeded: 2300,
        priority: 'critical' as const,
        radius: 300,
    },
    {
        name: 'Ghaffar Market Zone',
        lat: 28.6510,
        lng: 77.1930,
        coverage: 4,
        totalTrees: 340,
        treesNeeded: 1800,
        priority: 'critical' as const,
        radius: 260,
    },
];

// ── Area-wise forest cover recommendations ─────────────────────────────────
const AREA_RECOMMENDATIONS = [
    {
        area: 'Arya Samaj Block',
        priority: 'critical',
        icon: '🚨',
        actions: [
            'Plant 2,300 trees of native species (Peepal, Neem, Banyan) along footpaths and open plots.',
            'Launch a community tree-adoption program: 1 family = 1 tree responsibility.',
            'Request municipal grants for a micro-park installation in open land sectors.',
        ],
        target: '25% green cover in 3 years',
    },
    {
        area: 'Ghaffar Market Zone',
        priority: 'critical',
        icon: '🚨',
        actions: [
            'Install vertical green walls on commercial buildings to compensate land scarcity.',
            'Replace concrete dividers on roads with planted median strips.',
            'Report all unauthorized tree-felling incidents immediately through UrbnConnect.',
        ],
        target: '15% green cover in 2 years',
    },
    {
        area: 'Karol Bagh Central',
        priority: 'high',
        icon: '⚠️',
        actions: [
            'Add 850 trees in available sidewalk spaces and parks.',
            'Enforce no-felling zone for 5+ year-old trees.',
            'Set up biannual community plantation drives aligned with World Environment Day.',
        ],
        target: '30% green cover in 4 years',
    },
    {
        area: 'Rajinder Nagar',
        priority: 'medium',
        icon: '✅',
        actions: [
            'Maintain existing tree health with regular pruning and watering schedules.',
            'Add 200 more trees in low-density pockets.',
            'Create a neighbourhood green corridor connecting existing tree clusters.',
        ],
        target: 'Maintain 32%, reach 40% in 5 years',
    },
    {
        area: 'Pusa Road Corridor',
        priority: 'low',
        icon: '🌿',
        actions: [
            'Protect existing canopy and conduct regular pest/disease monitoring.',
            'Use this zone as a benchmark model for other areas.',
            'Establish a natural seed bank for indigenous species propagation.',
        ],
        target: 'Maintain 45%+ and preserve biodiversity',
    },
];

// ── Sustainability Suggestions ─────────────────────────────────────────────
const GREEN_SUGGESTIONS = [
    {
        icon: '🌳',
        title: 'Urban Canopy Network',
        desc: 'Map and connect fragmented tree clusters into continuous green corridors to support urban biodiversity, reduce heat islands, and improve air quality.',
        impact: 'High Impact',
        impactColor: '#10B981',
    },
    {
        icon: '🌧️',
        title: 'Rainwater Harvesting Zones',
        desc: 'Identify low-lying areas prone to waterlogging and convert them into community rainwater collection systems to recharge groundwater.',
        impact: 'Medium Impact',
        impactColor: '#3B82F6',
    },
    {
        icon: '☀️',
        title: 'Community Solar Micro-Grids',
        desc: 'Enable rooftop solar installations in residential blocks with collective net metering for neighbourhoods to share clean energy surplus.',
        impact: 'High Impact',
        impactColor: '#10B981',
    },
    {
        icon: '♻️',
        title: 'Waste-to-Compost Initiative',
        desc: 'Create locality-wise composting hubs that convert wet waste from households into nitrogen-rich compost for parks and street trees.',
        impact: 'Medium Impact',
        impactColor: '#3B82F6',
    },
    {
        icon: '🚲',
        title: 'Car-Free Green Lanes',
        desc: 'Repurpose underutilised lanes for dedicated cycling and pedestrian paths lined with shade trees to cut carbon emissions and encourage green mobility.',
        impact: 'High Impact',
        impactColor: '#10B981',
    },
    {
        icon: '🏗️',
        title: 'Green Building Mandates',
        desc: 'Require all new construction permits to include a percentage of rooftop / façade greenery using indigenous climbing plants and terrace gardens.',
        impact: 'Long-Term',
        impactColor: '#8B5CF6',
    },
    {
        icon: '📊',
        title: 'Real-Time Air Quality Alerts',
        desc: 'Integrate low-cost IoT PM2.5 sensors across wards and push alerts via UrbnConnect to empower citizens with hyperlocal air quality data.',
        impact: 'Medium Impact',
        impactColor: '#3B82F6',
    },
    {
        icon: '💧',
        title: 'Greywater Recycling for Tree Care',
        desc: 'Pilot treated greywater reuse systems in apartment complexes to irrigate street trees and community gardens, reducing freshwater pressure.',
        impact: 'Long-Term',
        impactColor: '#8B5CF6',
    },
];

function getCoverageColor(coverage: number): string {
    if (coverage >= 35) return '#10B981';
    if (coverage >= 20) return '#F59E0B';
    if (coverage >= 10) return '#EF4444';
    return '#7C3AED';
}

function getPriorityStyle(priority: string) {
    switch (priority) {
        case 'critical': return { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' };
        case 'high': return { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' };
        case 'medium': return { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' };
        default: return { bg: 'rgba(16,185,129,0.1)', color: '#10B981' };
    }
}

export default function SustainabilityPage() {
    const t = useT();
    const [selectedZone, setSelectedZone] = useState<typeof TREE_COVERAGE_ZONES[0] | null>(null);

    const totalTrees = TREE_COVERAGE_ZONES.reduce((s, z) => s + z.totalTrees, 0);
    const totalNeeded = TREE_COVERAGE_ZONES.reduce((s, z) => s + z.treesNeeded, 0);
    const avgCoverage = Math.round(TREE_COVERAGE_ZONES.reduce((s, z) => s + z.coverage, 0) / TREE_COVERAGE_ZONES.length);
    const criticalZones = TREE_COVERAGE_ZONES.filter(z => z.priority === 'critical' || z.priority === 'high').length;

    return (
        <div className="cv-animate-fadeIn cv-eco-page cv-eco-bg-pattern">
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="cv-eco-hero" style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#fff', margin: 0 }}>{t.sustainPageTitle}</h1>
                <p style={{ margin: '.35rem 0 0', opacity: 0.85 }}>{t.sustainPageSubtitle}</p>
            </div>

            {/* ── KPI Strip ──────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { icon: '🌳', val: totalTrees.toLocaleString(), label: t.totalTreesMapped, color: '#10B981' },
                    { icon: '🌱', val: `+${totalNeeded.toLocaleString()}`, label: t.treesStillNeeded, color: '#F59E0B' },
                    { icon: '📊', val: `${avgCoverage}%`, label: t.avgGreenCoverage, color: '#3B82F6' },
                    { icon: '🚨', val: criticalZones, label: t.deficitZones, color: '#EF4444' },
                ].map(kpi => (
                    <div key={kpi.label} className="cv-plant-stat">
                        <div style={{ fontSize: '1.75rem', marginBottom: '.35rem' }}>{kpi.icon}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: kpi.color, lineHeight: 1.1 }}>{kpi.val}</div>
                        <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.35rem' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Tree Coverage Map ─────────────────────────────────── */}
            <div className="cv-leaf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--cv-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>{t.treeCoverageMap}</h3>
                        <p className="cv-text-sm cv-text-secondary" style={{ margin: '.25rem 0 0' }}>
                            {t.clickZoneHint}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {[
                            { color: '#10B981', label: t.coverageLegendGood },
                            { color: '#F59E0B', label: t.coverageLegendMod },
                            { color: '#EF4444', label: t.coverageLegendLow },
                            { color: '#7C3AED', label: t.coverageLegendCrit },
                        ].map(l => (
                            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '.75rem', color: 'var(--cv-text-secondary)' }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                                {l.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px' }}>
                    <div style={{ height: 460 }}>
                        <MapContainer
                            center={[28.6480, 77.1880]}
                            zoom={14}
                            style={{ width: '100%', height: '100%', zIndex: 1 }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {TREE_COVERAGE_ZONES.map(zone => {
                                const color = getCoverageColor(zone.coverage);
                                const isSelected = selectedZone?.name === zone.name;
                                return (
                                    <Circle
                                        key={zone.name}
                                        center={[zone.lat, zone.lng]}
                                        radius={zone.radius}
                                        pathOptions={{
                                            fillColor: color,
                                            fillOpacity: isSelected ? 0.65 : 0.38,
                                            color: color,
                                            weight: isSelected ? 3 : 1.5,
                                        }}
                                        eventHandlers={{ click: () => setSelectedZone(zone) }}
                                    >
                                        <Tooltip direction="top" permanent={false} sticky>
                                            <strong>{zone.name}</strong><br />
                                            🌳 {zone.coverage}% coverage
                                        </Tooltip>
                                        <Popup>
                                            <div style={{ minWidth: 160 }}>
                                                <strong style={{ fontSize: '.9rem' }}>{zone.name}</strong>
                                                <div style={{ marginTop: '.4rem', fontSize: '.8rem', lineHeight: 1.6 }}>
                                                    <div>🌳 Trees: <b>{zone.totalTrees.toLocaleString()}</b></div>
                                                    <div>🌱 Needed: <b>+{zone.treesNeeded.toLocaleString()}</b></div>
                                                    <div>📊 Coverage: <b style={{ color }}>{zone.coverage}%</b></div>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Circle>
                                );
                            })}
                        </MapContainer>
                    </div>

                    {/* Zone detail panel */}
                    <div style={{ borderLeft: '1px solid var(--cv-border)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: 460 }}>
                        {selectedZone ? (
                            <div className="cv-animate-fadeIn">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem' }}>
                                    <h4 style={{ margin: 0 }}>{selectedZone.name}</h4>
                                    <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cv-text-muted)' }}>✕</button>
                                </div>
                                {[
                                    { label: t.totalTrees, val: selectedZone.totalTrees.toLocaleString(), icon: '🌳' },
                                    { label: t.treesNeeded, val: `+${selectedZone.treesNeeded.toLocaleString()}`, icon: '🌱' },
                                    { label: t.greenCoverage, val: `${selectedZone.coverage}%`, icon: '📊' },
                                ].map(m => (
                                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.45rem 0', borderBottom: '1px solid var(--cv-border)' }}>
                                        <span className="cv-text-sm cv-text-secondary">{m.icon} {m.label}</span>
                                        <span className="cv-font-semibold cv-text-sm">{m.val}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: '.75rem' }}>
                                    <div className="cv-text-xs cv-text-muted" style={{ marginBottom: 6 }}>{t.coverageLevel}</div>
                                    <div className="cv-progress">
                                        <div className="cv-progress-fill" style={{ width: `${selectedZone.coverage}%`, background: getCoverageColor(selectedZone.coverage) }} />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <span className="cv-badge" style={{ ...getPriorityStyle(selectedZone.priority) }}>
                                        {t.priority}: {selectedZone.priority.toUpperCase()}
                                    </span>
                                </div>
                                <Link
                                    to="/report"
                                    className="cv-btn cv-btn-primary"
                                    style={{ marginTop: '1rem', width: '100%', textAlign: 'center', fontSize: '.85rem' }}
                                >
                                    {t.reportLowGreenery}
                                </Link>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', paddingTop: '3rem', color: 'var(--cv-text-muted)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🗺️</div>
                                <p className="cv-text-sm">{t.clickZonePrompt}</p>
                            </div>
                        )}

                        {/* Zone list */}
                        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--cv-border)', paddingTop: '.75rem' }}>
                            <div className="cv-text-xs cv-font-semibold cv-text-muted" style={{ marginBottom: '.5rem' }}>{t.allZones}</div>
                            {TREE_COVERAGE_ZONES.map(z => {
                                const color = getCoverageColor(z.coverage);
                                return (
                                    <button
                                        key={z.name}
                                        onClick={() => setSelectedZone(z)}
                                        style={{
                                            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            background: selectedZone?.name === z.name ? 'var(--cv-surface-alt)' : 'transparent',
                                            border: 'none', cursor: 'pointer', padding: '.35rem .5rem', borderRadius: 6,
                                            color: 'var(--cv-text)', fontSize: '.8rem', textAlign: 'left',
                                        }}
                                    >
                                        <span>{z.name}</span>
                                        <span style={{ fontWeight: 700, color }}>{z.coverage}%</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Area-wise Recommendations ─────────────────────────── */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="cv-eco-section-title"><span>📍</span> {t.areaRecsTitle}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                    {AREA_RECOMMENDATIONS.map(rec => {
                        const style = getPriorityStyle(rec.priority);
                        return (
                            <div key={rec.area} className="cv-leaf-card" style={{ borderTop: `3px solid ${style.color}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.85rem' }}>
                                    <span style={{ fontSize: '1.4rem' }}>{rec.icon}</span>
                                    <div>
                                        <div className="cv-font-semibold cv-text-sm">{rec.area}</div>
                                        <span className="cv-badge" style={{ ...style, marginTop: '.2rem', display: 'inline-block' }}>
                                            {rec.priority.toUpperCase()} {t.priorityLabel}
                                        </span>
                                    </div>
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                                    {rec.actions.map((a, i) => (
                                        <li key={i} className="cv-text-sm cv-text-secondary">{a}</li>
                                    ))}
                                </ul>
                                <div style={{ marginTop: '1rem', padding: '.5rem .75rem', background: 'var(--cv-surface-alt)', borderRadius: 8 }}>
                                    <span className="cv-text-xs cv-font-medium" style={{ color: style.color }}>🎯 Target: {rec.target}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Green Infra Suggestions ────────────────────────────── */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="cv-eco-section-title"><span>💡</span> {t.greenSuggestTitle}</h2>
                <p className="cv-text-sm cv-text-secondary" style={{ marginBottom: '1.25rem' }}>
                    {t.greenSuggestSubtitle}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {GREEN_SUGGESTIONS.map(s => (
                        <div key={s.title} className="cv-leaf-card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                                background: `${s.impactColor}08`, borderRadius: '0 0 0 100%',
                            }} />
                            <div style={{ fontSize: '2rem', marginBottom: '.65rem' }}>{s.icon}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.5rem' }}>
                                <h4 style={{ margin: 0, flex: 1 }}>{s.title}</h4>
                                <span className="cv-badge" style={{ background: `${s.impactColor}18`, color: s.impactColor, whiteSpace: 'nowrap' }}>
                                    {s.impact}
                                </span>
                            </div>
                            <p className="cv-text-sm cv-text-secondary" style={{ margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Report CTA ────────────────────────────────────────── */}
            <div className="cv-leaf-card" style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))',
                border: '1px solid rgba(16,185,129,0.25)',
                textAlign: 'center',
                padding: '2rem',
            }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🌱</div>
                <h3 style={{ marginBottom: '.5rem' }}>{t.reportCtaTitle}</h3>
                <p className="cv-text-secondary cv-text-sm" style={{ marginBottom: '1.25rem', maxWidth: 480, margin: '0 auto 1.25rem' }}>
                    {t.reportCtaDesc}
                </p>
                <Link to="/report" className="cv-btn cv-btn-primary">
                    {t.reportGreeneryBtn}
                </Link>
            </div>
        </div>
    );
}
