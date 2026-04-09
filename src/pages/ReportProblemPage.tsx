import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES, SEVERITY_OPTIONS } from '../mockData';
import { useT } from '../i18n/translations';
import type { IssueCategory, IssueSeverity } from '../types';

export default function ReportProblemPage() {
    const { currentUser, addIssue } = useAppContext();
    const t = useT();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<IssueCategory | ''>('');
    const [severity, setSeverity] = useState<IssueSeverity>('medium');
    const [locationMethod, setLocationMethod] = useState<'manual' | 'gps'>('manual');
    const [area, setArea] = useState('');
    const [ward, setWard] = useState('');
    const [constituency, setConstituency] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !title.trim() || !area.trim()) return;

        await addIssue({
            title: title.trim(),
            description: description.trim(),
            category,
            severity,
            status: 'reported',
            location: {
                area: area.trim(),
                ward: ward.trim() || undefined,
                constituency: constituency.trim() || undefined,
            },
            reportedBy: currentUser?.id ?? 'guest',
            isAnonymous,
            imageUrl: imagePreview ?? undefined,
        });

        setSubmitted(true);
    };

    /* ── Success confirmation ─────────────────────────────── */
    if (submitted) {
        return (
            <div className="cv-animate-fadeIn" style={{ maxWidth: 520, margin: '3rem auto', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ marginBottom: '.5rem' }}>{t.successTitle}</h2>
                <p className="cv-text-secondary" style={{ marginBottom: '1.5rem' }}>
                    {t.successMessage}
                </p>
                <div className="cv-flex cv-gap cv-items-center" style={{ justifyContent: 'center' }}>
                    <button className="cv-btn cv-btn-primary" onClick={() => navigate('/issues')}>
                        {t.viewAllIssues}
                    </button>
                    <button
                        className="cv-btn cv-btn-secondary"
                        onClick={() => {
                            setSubmitted(false);
                            setTitle('');
                            setDescription('');
                            setCategory('');
                            setSeverity('medium');
                            setArea('');
                            setWard('');
                            setConstituency('');
                            setIsAnonymous(false);
                            setImagePreview(null);
                        }}
                    >
                        {t.reportAnother}
                    </button>
                </div>
            </div>
        );
    }

    /* ── Report form ──────────────────────────────────────── */
    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 680, margin: '0 auto', paddingBottom: '2.5rem' }}>
            <div className="cv-page-header">
                <h1>📝 {t.reportTitle}</h1>
                <p>{t.reportSubtitle}</p>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
                {/* Title */}
                <div>
                    <label className="cv-label">{t.problemTitle} *</label>
                    <input
                        className="cv-input"
                        type="text"
                        placeholder={t.titlePlaceholder}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="cv-label">{t.description} *</label>
                    <textarea
                        className="cv-textarea"
                        placeholder={t.descPlaceholder}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="cv-label">{t.category} *</label>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '.5rem',
                        }}
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className="cv-card"
                                style={{
                                    padding: '.65rem .85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '.5rem',
                                    cursor: 'pointer',
                                    border: category === cat.id
                                        ? `2px solid ${cat.color}`
                                        : '1px solid var(--cv-border)',
                                    background: category === cat.id ? `${cat.color}08` : 'var(--cv-surface)',
                                    fontSize: '.85rem',
                                    fontWeight: category === cat.id ? 600 : 400,
                                    color: category === cat.id ? cat.color : 'var(--cv-text)',
                                    transition: 'all .15s ease',
                                }}
                            >
                                <span>{cat.icon}</span>
                                <span style={{ textAlign: 'left', lineHeight: 1.2 }}>{t[cat.id] || cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Severity */}
                <div>
                    <label className="cv-label">{t.severityLevel}</label>
                    <div className="cv-flex cv-gap-sm" style={{ flexWrap: 'wrap' }}>
                        {SEVERITY_OPTIONS.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setSeverity(s.id as IssueSeverity)}
                                className="cv-badge"
                                style={{
                                    cursor: 'pointer',
                                    padding: '.4rem .9rem',
                                    fontSize: '.82rem',
                                    background: severity === s.id ? s.color : `${s.color}15`,
                                    color: severity === s.id ? '#fff' : s.color,
                                    border: 'none',
                                    transition: 'all .15s ease',
                                }}
                            >
                                {t[s.id as 'low' | 'medium' | 'high' | 'critical'] || s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="cv-label">{t.uploadPhoto} <span className="cv-text-muted">{t.photoOptional}</span></label>
                    <div
                        style={{
                            border: '2px dashed var(--cv-border)',
                            borderRadius: 'var(--cv-radius-lg)',
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'var(--cv-surface-alt)',
                            transition: 'border-color .2s',
                            position: 'relative',
                        }}
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        {imagePreview ? (
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxHeight: 200,
                                        margin: '0 auto',
                                        borderRadius: 'var(--cv-radius)',
                                    }}
                                />
                                <button
                                    type="button"
                                    className="cv-btn cv-btn-danger cv-btn-sm"
                                    style={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setImagePreview(null);
                                    }}
                                >
                                    ✕ Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📷</div>
                                <p className="cv-text-sm cv-text-secondary">
                                    {t.clickToUpload}
                                </p>
                                <p className="cv-text-xs cv-text-muted">{t.uploadHint}</p>
                            </>
                        )}
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="cv-label">{t.location} *</label>

                    {/* Method toggle */}
                    <div className="cv-flex cv-gap-sm" style={{ marginBottom: '.75rem' }}>
                        <button
                            type="button"
                            className={`cv-filter-chip ${locationMethod === 'manual' ? 'selected' : ''}`}
                            onClick={() => setLocationMethod('manual')}
                        >
                            ✍️ {t.manualEntry}
                        </button>
                        <button
                            type="button"
                            className={`cv-filter-chip ${locationMethod === 'gps' ? 'selected' : ''}`}
                            onClick={() => {
                                setLocationMethod('gps');
                                setArea(t.gpsCaptured);
                            }}
                        >
                            📍 {t.useGps}
                        </button>
                    </div>

                    {locationMethod === 'gps' ? (
                        <div
                            className="cv-card"
                            style={{
                                padding: '.85rem 1rem',
                                background: 'rgba(16,185,129,.06)',
                                border: '1px solid rgba(16,185,129,.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '.5rem',
                            }}
                        >
                            <span>📍</span>
                            <span className="cv-text-sm cv-font-medium">
                                {t.gpsCaptured}
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <input
                                    className="cv-input"
                                    type="text"
                                    placeholder={t.areaPlaceholder}
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    className="cv-input"
                                    type="text"
                                    placeholder={t.wardPlaceholder}
                                    value={ward}
                                    onChange={(e) => setWard(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    className="cv-input"
                                    type="text"
                                    placeholder={t.constituencyPlaceholder}
                                    value={constituency}
                                    onChange={(e) => setConstituency(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Anonymous toggle */}
                <div
                    className="cv-card"
                    style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <div className="cv-font-medium" style={{ fontSize: '.9rem' }}>
                            {t.reportAnonymously}
                        </div>
                        <div className="cv-text-xs cv-text-muted">
                            {t.anonymousNote}
                        </div>
                    </div>
                    <label className="cv-toggle">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <div className="cv-toggle-track" />
                        <div className="cv-toggle-thumb" />
                    </label>
                </div>

                {/* Submit */}
                <div className="cv-flex cv-gap" style={{ paddingTop: '.5rem' }}>
                    <button className="cv-btn cv-btn-primary cv-btn-lg" type="submit">
                        {t.submitReport}
                    </button>
                    <button
                        className="cv-btn cv-btn-ghost cv-btn-lg"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        {t.cancel}
                    </button>
                </div>
            </form>
        </div>
    );
}
