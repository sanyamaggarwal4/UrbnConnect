import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAppContext } from '../context/AppContext';
import { useT } from '../i18n/translations';
import SeverityBadge from '../components/ui/SeverityBadge';
import type { Issue } from '../types';

const SEV_COLORS: Record<string, string> = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#F59E0B',
    low: '#10B981',
};

// Custom marker generated dynamically based on severity color
const createCustomIcon = (color: string, isSelected: boolean) => {
    return L.divIcon({
        className: 'custom-leaflet-icon',
        html: `<div style="width: ${isSelected ? 24 : 16}px; height: ${isSelected ? 24 : 16}px; border-radius: 50%; background: ${color}; border: 2px solid ${isSelected ? '#1e3a5f' : '#fff'}; box-shadow: 0 2px 6px ${color}cc; transition: all .2s ease;"></div>`,
        iconSize: [isSelected ? 24 : 16, isSelected ? 24 : 16],
        iconAnchor: [isSelected ? 12 : 8, isSelected ? 12 : 8]
    });
};

// Hardcoded location offsets mapping for MVP fake coordinates around Karol Bagh
const GEO_LOCATIONS: Record<string, [number, number]> = {
    'Ajmal Khan Road': [28.6520, 77.1880],
    'Pusa Road': [28.6450, 77.1920],
    'Arya Samaj Road': [28.6580, 77.1850],
    'Shankar Road': [28.6350, 77.1820],
    'Market No. 2': [28.6400, 77.1750],
    'Community Center': [28.6480, 77.1980],
    "Children's Park": [28.6550, 77.1950],
    'DB Gupta Road': [28.6490, 77.2020],
    'Nai Sarak': [28.6590, 77.2050],
    'Ghaffar Market': [28.6510, 77.1930],
    'Karol Bagh Metro': [28.6430, 77.1900],
    'Rohtak Road': [28.6620, 77.1800],
};

const getLatLng = (issue: Issue): L.LatLngExpression => {
    if (issue.location.lat && issue.location.lng) return [issue.location.lat, issue.location.lng];
    if (GEO_LOCATIONS[issue.location.area]) return GEO_LOCATIONS[issue.location.area];
    // Fallback deterministic random scatter around Karol Bagh for unknown user-reported areas
    const offset1 = (issue.id.length % 15) * 0.0015;
    const offset2 = (issue.title.length % 15) * 0.0015;
    return [28.6500 + offset1, 77.1900 + offset2];
};

export default function MapViewPage() {
    const { issues } = useAppContext();
    const t = useT();
    const [selected, setSelected] = useState<Issue | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const visibleIssues = issues.filter((issue) => {
        if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false;
        if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
        return true;
    });

    return (
        <div className="cv-animate-fadeIn">
            <div className="cv-page-header">
                <h1>{t.mapTitle}</h1>
                <p>{t.mapSubtitle}</p>
            </div>

            <div className="cv-flex cv-gap-sm" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="cv-text-xs cv-text-muted cv-font-semibold" style={{ alignSelf: 'center' }}>SEVERITY:</span>
                {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
                    <button key={s} className={`cv-filter-chip ${filterSeverity === s ? 'selected' : ''}`} onClick={() => setFilterSeverity(s)}>
                        {s === 'all' ? t.all : (t[s as keyof typeof t] || s.charAt(0).toUpperCase() + s.slice(1))}
                    </button>
                ))}
                <span className="cv-text-xs cv-text-muted cv-font-semibold" style={{ alignSelf: 'center', marginLeft: '1rem' }}>STATUS:</span>
                {['all', 'reported', 'in-progress', 'resolved'].map((s) => (
                    <button key={s} className={`cv-filter-chip ${filterStatus === s ? 'selected' : ''}`} onClick={() => setFilterStatus(s)}>
                        {s === 'all' ? t.all : s.replace(/-/g, ' ')}
                    </button>
                ))}
            </div>

            <div className="cv-flex cv-gap" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(SEV_COLORS).map(([sev, color]) => (
                    <div key={sev} className="cv-flex cv-items-center cv-gap-sm">
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
                        <span className="cv-text-xs cv-text-muted" style={{ textTransform: 'capitalize' }}>{t[sev as keyof typeof t] || sev}</span>
                    </div>
                ))}
                <span className="cv-text-xs cv-text-muted" style={{ marginLeft: 'auto' }}>
                    {visibleIssues.length} {visibleIssues.length !== 1 ? t.pinsShown : t.pinShown}
                </span>
            </div>

            <div className="cv-map-grid">
                <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--cv-radius-lg)', overflow: 'hidden', border: '1px solid var(--cv-border)' }}>
                    <MapContainer center={[28.6500, 77.1900]} zoom={14} style={{ width: '100%', height: '100%', zIndex: 1 }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {visibleIssues.map((issue) => {
                            const isSelected = selected?.id === issue.id;
                            const color = SEV_COLORS[issue.severity];

                            return (
                                <Marker
                                    key={issue.id}
                                    position={getLatLng(issue)}
                                    icon={createCustomIcon(color, isSelected)}
                                    eventHandlers={{ click: () => setSelected(issue) }}
                                >
                                    <Popup>
                                        <div style={{ padding: '0.25rem 0' }}>
                                            <h4 style={{ margin: '0 0 .25rem 0', fontSize: '.85rem' }}>{issue.title}</h4>
                                            <div style={{ fontSize: '.75rem', color: '#666', marginBottom: '.5rem' }}>📍 {issue.location.area}</div>
                                            <div style={{ display: 'flex', gap: '.5rem' }}>
                                                <span style={{ fontSize: '.7rem', background: `${SEV_COLORS[issue.severity]}22`, color: SEV_COLORS[issue.severity], padding: '2px 6px', borderRadius: 4, fontWeight: 'bold' }}>
                                                    {issue.severity.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                <div className="cv-flex-col cv-gap">
                    {selected ? (
                        <div className="cv-card cv-animate-fadeIn">
                            <div className="cv-flex cv-justify-between cv-items-start" style={{ marginBottom: '.75rem' }}>
                                <h4 style={{ margin: 0, flex: 1 }}>{selected.title}</h4>
                                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--cv-text-muted)' }}>✕</button>
                            </div>
                            <SeverityBadge severity={selected.severity} />
                            <p className="cv-text-sm cv-text-secondary" style={{ margin: '.65rem 0' }}>{selected.description.slice(0, 120)}…</p>
                            <div className="cv-text-xs cv-text-muted">📍 {selected.location.area}</div>
                            <div className="cv-text-xs cv-text-muted">Status: <strong style={{ textTransform: 'capitalize' }}>{selected.status.replace(/-/g, ' ')}</strong></div>
                            <div className="cv-text-xs cv-text-muted">👍 {selected.upvotes} upvotes</div>
                        </div>
                    ) : (
                        <div className="cv-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📍</div>
                            <p className="cv-text-sm cv-text-secondary">{t.clickPinMsg}</p>
                        </div>
                    )}
                    <div className="cv-card">
                        <h4 style={{ marginBottom: '.65rem', fontSize: '.9rem' }}>{t.issuesBySeverity}</h4>
                        {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
                            const cnt = issues.filter((i) => i.severity === sev).length;
                            return (
                                <div key={sev} className="cv-flex cv-justify-between cv-text-sm" style={{ padding: '.25rem 0' }}>
                                    <span className="cv-flex cv-items-center cv-gap-sm">
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_COLORS[sev] }} />
                                        <span style={{ textTransform: 'capitalize' }}>{t[sev] || sev}</span>
                                    </span>
                                    <span className="cv-font-semibold">{cnt}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
