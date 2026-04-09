import { useState } from 'react';
import { useT } from '../i18n/translations';
import { useNavigate } from 'react-router-dom';

export default function CreateDrivePage() {
    const t = useT();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'cleanliness',
        date: '',
        location: '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';
        if (hasSupabase) {
            // Late import so it doesn't break offline components
            const { supabase } = await import('../lib/supabase');
            const { error } = await supabase.from('cv_community_drives').insert({
                title: form.title,
                description: form.description,
                drive_type: form.type,
                drive_date: form.date,
                location: form.location,
                authority_name: 'Local Authority', // Hardcoded fallback unless read from context
            });
            if (error) {
                alert('Error creating drive: ' + error.message);
                setLoading(false);
                return;
            }
        }
        
        setLoading(false);
        navigate('/community');
    };

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 640, margin: '0 auto', paddingBottom: '2rem' }}>
            <div className="cv-page-header">
                <h1>{t.createDriveTitle}</h1>
                <p>Post a new initiative to the Community Hub.</p>
            </div>

            <form onSubmit={handleSubmit} className="cv-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="cv-input-group">
                    <label>Title</label>
                    <input 
                        className="cv-input" 
                        required 
                        placeholder="E.g., Mega Plantation Drive" 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                    />
                </div>

                <div className="cv-input-group">
                    <label>{t.driveType}</label>
                    <select 
                        className="cv-input" 
                        value={form.type}
                        onChange={e => setForm({...form, type: e.target.value})}
                    >
                        <option value="cleanliness">{t.cleanliness}</option>
                        <option value="plantation">{t.plantation}</option>
                        <option value="awareness">{t.awareness}</option>
                        <option value="volunteering">{t.volunteering}</option>
                        <option value="health-safety">{t.healthSafety}</option>
                    </select>
                </div>

                <div className="cv-input-group">
                    <label>Description</label>
                    <textarea 
                        className="cv-input" 
                        rows={4} 
                        required 
                        placeholder="Details about the drive..."
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="cv-input-group" style={{ flex: 1 }}>
                        <label>Date & Time</label>
                        <input 
                            className="cv-input" 
                            required 
                            placeholder="e.g. This Sunday, 9 AM"
                            value={form.date}
                            onChange={e => setForm({...form, date: e.target.value})}
                        />
                    </div>
                    <div className="cv-input-group" style={{ flex: 1 }}>
                        <label>Location</label>
                        <input 
                            className="cv-input" 
                            required 
                            placeholder="Meeting point"
                            value={form.location}
                            onChange={e => setForm({...form, location: e.target.value})}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button 
                        type="button" 
                        className="cv-btn cv-btn-secondary"
                        onClick={() => navigate('/authority')}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="cv-btn cv-btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : t.postToCommunity}
                    </button>
                </div>
            </form>
        </div>
    );
}
