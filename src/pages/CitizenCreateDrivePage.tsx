import { useState } from 'react';
import { useT } from '../i18n/translations';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MOCK_CITIZEN_DRIVES } from '../mockData/community';
import { findMergeCandidate } from '../lib/civicScore';

export default function CitizenCreateDrivePage() {
    const t = useT();
    const navigate = useNavigate();
    const { id: issueId } = useParams<{ id: string }>();
    const { issues, currentUser } = useAppContext();

    const issue = issues.find(i => i.id === issueId);

    const [form, setForm] = useState({
        title: issue ? `Community Drive: ${issue.title.slice(0, 50)}` : '',
        description: '',
        type: 'cleanliness',
        target: 20,
        date: '',
        locality: issue?.location?.area?.toLowerCase() || '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [merged, setMerged] = useState(false);
    const [mergedDriveTitle, setMergedDriveTitle] = useState('');

    if (!currentUser || currentUser.id === 'guest') {
        return (
            <div className="cv-animate-fadeIn cv-text-center" style={{ padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h2>Login Required</h2>
                <p className="cv-text-secondary" style={{ marginBottom: '1rem' }}>
                    You need to be signed in to start a community drive.
                </p>
                <Link to="/login" className="cv-btn cv-btn-primary">Sign In</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.target < 2) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700)); // simulate submit

        // ── Merge logic ──
        if (issueId && form.locality) {
            const mergeCandidate = findMergeCandidate(MOCK_CITIZEN_DRIVES, issueId, form.locality);
            if (mergeCandidate) {
                setMergedDriveTitle(mergeCandidate.title);
                setMerged(true);
                setLoading(false);
                setTimeout(() => navigate('/community'), 3000);
                return;
            }
        }

        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/community'), 2000);
    };

    // Merged result
    if (merged) {
        return (
            <div className="cv-animate-fadeIn cv-text-center" style={{ padding: '4rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔀</div>
                <h2 style={{ color: 'var(--cv-eco-green)', marginBottom: '.5rem' }}>Drive Merged!</h2>
                <p className="cv-text-secondary" style={{ maxWidth: 420, margin: '0 auto' }}>
                    A drive already exists for this issue in the same locality. Your request has been merged into:
                </p>
                <div style={{
                    margin: '1rem auto', padding: '.75rem 1.25rem', maxWidth: 400,
                    background: 'var(--cv-eco-green-muted)', border: '1px solid rgba(22,163,74,0.25)',
                    borderRadius: 'var(--cv-radius)', fontWeight: 600, color: 'var(--cv-eco-green)',
                }}>
                    🤝 "{mergedDriveTitle}"
                </div>
                <p className="cv-text-xs cv-text-muted" style={{ marginTop: '.5rem' }}>Redirecting to Community Hub…</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="cv-animate-fadeIn cv-text-center" style={{ padding: '4rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ color: 'var(--cv-eco-green)', marginBottom: '.5rem' }}>Drive Created!</h2>
                <p className="cv-text-secondary">Your citizen drive has been proposed. Redirecting to Community Hub…</p>
            </div>
        );
    }

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 640, margin: '0 auto', paddingBottom: '2rem' }}>
            {/* Header */}
            <div className="cv-eco-header" style={{ marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', borderRadius: '6px', padding: '.3rem .8rem', cursor: 'pointer', marginBottom: '.75rem', fontSize: '.875rem' }}
                >
                    ← Back
                </button>
                <h1 style={{ margin: '0 0 .25rem', color: '#fff', fontSize: '1.5rem' }}>
                    🤝 {t.createCitizenDriveTitle}
                </h1>
                {issue && (
                    <p style={{ margin: 0, fontSize: '.875rem', color: 'rgba(255,255,255,.8)' }}>
                        {t.relatedToIssue}: <strong>"{issue.title}"</strong>
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="cv-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Drive Title */}
                <div className="cv-input-group">
                    <label>Drive Title <span style={{ color: 'var(--cv-danger)' }}>*</span></label>
                    <input
                        className="cv-input"
                        required
                        placeholder="e.g., Fix Potholes Together — Karol Bagh"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                {/* Type */}
                <div className="cv-input-group">
                    <label>{t.driveType}</label>
                    <select className="cv-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="cleanliness">{t.cleanliness}</option>
                        <option value="plantation">{t.plantation}</option>
                        <option value="awareness">{t.awareness}</option>
                        <option value="volunteering">{t.volunteering}</option>
                        <option value="health-safety">{t.healthSafety}</option>
                    </select>
                </div>

                {/* Description */}
                <div className="cv-input-group">
                    <label>Description <span style={{ color: 'var(--cv-danger)' }}>*</span></label>
                    <textarea
                        className="cv-input"
                        rows={4}
                        required
                        placeholder="What will volunteers do? What is the goal?"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                {/* Locality (for merge logic) */}
                <div className="cv-input-group">
                    <label>Locality <span style={{ color: 'var(--cv-danger)' }}>*</span></label>
                    <input
                        className="cv-input"
                        required
                        placeholder="e.g. Karol Bagh, Lajpat Nagar"
                        value={form.locality}
                        onChange={e => setForm({ ...form, locality: e.target.value })}
                    />
                    <span style={{ fontSize: '.72rem', color: 'var(--cv-text-muted)', marginTop: '.2rem', display: 'block' }}>
                        If a drive already exists for this issue + locality, your request will be merged automatically.
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Target Participants */}
                    <div className="cv-input-group" style={{ flex: 1 }}>
                        <label>{t.driveTarget} <span style={{ color: 'var(--cv-danger)' }}>*</span></label>
                        <input
                            className="cv-input"
                            type="number"
                            min={2}
                            required
                            placeholder="e.g. 25"
                            value={form.target}
                            onChange={e => setForm({ ...form, target: parseInt(e.target.value) || 0 })}
                        />
                        <span style={{ fontSize: '.75rem', color: 'var(--cv-text-muted)', marginTop: '.25rem', display: 'block' }}>
                            Drive activates when this target is met.
                        </span>
                    </div>

                    {/* Date (optional) */}
                    <div className="cv-input-group" style={{ flex: 1 }}>
                        <label>Date / Time (Optional)</label>
                        <input
                            className="cv-input"
                            placeholder="e.g. This Sunday, 8:00 AM"
                            value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* Info box */}
                <div style={{
                    background: 'var(--cv-eco-green-muted)',
                    border: '1px solid rgba(22,163,74,.25)',
                    borderRadius: 'var(--cv-radius)',
                    padding: '1rem',
                    fontSize: '.85rem',
                    color: 'var(--cv-eco-green)',
                    display: 'flex',
                    gap: '.75rem',
                    alignItems: 'flex-start'
                }}>
                    <span>🌿</span>
                    <span>
                        Your drive will be tagged <strong>"Citizen Initiated"</strong> and will appear in the Community Hub once proposed.
                        It goes <strong>Active</strong> when your participant target is reached.
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '.5rem' }}>
                    <button type="button" className="cv-btn cv-btn-secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="cv-btn cv-btn-primary"
                        disabled={loading}
                        style={{ background: 'var(--cv-eco-green)', borderColor: 'var(--cv-eco-green)' }}
                    >
                        {loading ? 'Proposing…' : '🤝 Propose Drive'}
                    </button>
                </div>
            </form>
        </div>
    );
}
