import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../i18n/translations';

export default function AboutUsPage() {
    const t = useT();

    const [selectedMember, setSelectedMember] = useState<any>(null);

    const team = [
        {
            id: 'sanyam',
            name: 'Sanyam Aggarwal',
            title: 'Team Lead',
            role: 'Full Stack',
            imageUrl: '/team/sanyam.jpg',
            email: 'sanyamaggarwal@outlook.in',
            linkedin: 'https://linkedin.com/in/sanyamaggarwal4',
        },
        {
            id: 'ojaswini',
            name: 'Ojaswini',
            title: 'Team Member',
            role: 'Frontend',
            imageUrl: '/team/ojaswini.jpg',
            email: 'ojaswiniii07@gmail.com',
            linkedin: 'https://linkedin.com/in/ojaswini-arora-85ab3b346',
        },
        {
            id: 'anany',
            name: 'Anany Pratyush',
            title: 'Team Member',
            role: 'PPT',
            imageUrl: '/team/anany.jpg',
            email: 'pratyushanany@gmail.com',
            linkedin: 'https://linkedin.com/in/anany-pratyush-61746737a',
        },
        {
            id: 'krisha',
            name: 'Krisha Malhotra',
            title: 'Team Member',
            role: 'UI/UX',
            imageUrl: '/team/krisha.jpg',
            email: 'krisha2247@gmail.com',
            linkedin: 'https://linkedin.com/in/krisha-malhotra-11680737b',
        },
    ];

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header */}
            <div className="cv-page-header cv-text-center">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '.5rem', color: 'var(--cv-primary)' }}>
                    ✨ {t.aboutUsTitle}
                </h1>
                <p style={{ fontSize: '1.1rem' }}>{t.aboutUsSubtitle}</p>
            </div>

            {/* Who We Are */}
            <div className="cv-card" style={{ padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>{t.whoWeAre}</h2>
                <h3 style={{ color: 'var(--cv-primary)', marginBottom: '1rem' }}>Team Infinite Loop</h3>
                <p className="cv-text-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 700, margin: '0 auto 1.25rem' }}>
                    {t.teamDesc}
                </p>
                <div style={{
                    display: 'inline-block',
                    borderLeft: '3px solid var(--cv-primary)',
                    paddingLeft: '1.1rem',
                    textAlign: 'left',
                    maxWidth: 680,
                }}>
                    <p style={{ fontStyle: 'italic', color: 'var(--cv-text-secondary)', fontSize: '.97rem', lineHeight: 1.75, margin: 0 }}>
                        “UrbnConnect is a civic-tech platform that enables citizens to report local urban issues while helping
                        authorities track, manage, and improve community sustainability transparently.”
                    </p>
                </div>
            </div>

            {/* Meet the Team */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2>{t.meetTheTeam}</h2>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem'
                }}
            >
                {team.map((member) => (
                    <div
                        key={member.id}
                        className="cv-card cv-card-clickable cv-text-center"
                        style={{ padding: '2rem 1rem' }}
                        onClick={() => setSelectedMember(member)}
                    >
                        {/* Avatar Wrapper */}
                        <div
                            style={{
                                width: 120,
                                height: 120,
                                margin: '0 auto 1.25rem',
                                borderRadius: '50%',
                                background: 'var(--cv-surface-alt)',
                                border: '3px solid var(--cv-border)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}
                        >
                            {member.imageUrl ? (
                                <img
                                    src={member.imageUrl}
                                    alt={member.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '3rem', color: 'var(--cv-text-muted)' }}>👤</span>
                            )}

                            {/* "Add Photo" overlay hint (only shows if no image is present) */}
                            {!member.imageUrl && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        left: 0,
                                        right: 0,
                                        fontSize: '0.65rem',
                                        color: 'var(--cv-text-muted)',
                                        fontWeight: 600
                                    }}
                                >
                                    Add Photo
                                </div>
                            )}
                        </div>
                        <h4 style={{ marginBottom: '.5rem', fontSize: '1.1rem' }}>{member.name}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem' }}>
                            <span style={{
                                padding: '.2rem .65rem',
                                borderRadius: '1rem',
                                fontSize: '.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                background: member.title === 'Team Lead' ? 'rgba(37,99,235,0.1)' : 'var(--cv-surface-alt)',
                                color: member.title === 'Team Lead' ? 'var(--cv-primary)' : 'var(--cv-text-secondary)',
                            }}>
                                {member.title}
                            </span>
                            <span className="cv-text-sm" style={{ fontWeight: 600, color: 'var(--cv-text)' }}>
                                {member.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Sustainability Mission ──────────────────────────── */}
            <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '.4rem' }}>🌿 Our Green Mission</h2>
                <p className="cv-text-secondary" style={{ textAlign: 'center', fontSize: '.9rem', marginBottom: '1.75rem', maxWidth: 600, margin: '0 auto 1.75rem' }}>
                    Beyond issue reporting, UrbnConnect is committed to building sustainable, greener urban spaces for every community.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        {
                            icon: '🌳',
                            title: 'Tree Coverage Intelligence',
                            desc: 'We map and monitor tree density across wards, identify green deficit zones, and surface area-wise plantation priorities using real urban data.'
                        },
                        {
                            icon: '♻️',
                            title: 'Green Urban Suggestions',
                            desc: 'From solar micro-grids and rainwater harvesting to car-free green lanes and rooftop gardens — we surface data-backed ideas for a greener city.'
                        },
                    ].map(item => (
                        <div key={item.title} className="cv-card" style={{ textAlign: 'center', borderTop: '3px solid #10B981' }}>
                            <div style={{ fontSize: '2.25rem', marginBottom: '.6rem' }}>{item.icon}</div>
                            <h4 style={{ marginBottom: '.5rem', fontSize: '.95rem' }}>{item.title}</h4>
                            <p className="cv-text-sm cv-text-secondary" style={{ lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Green impact numbers */}
                <div className="cv-card" style={{
                    background: 'linear-gradient(120deg, rgba(16,185,129,.07) 0%, rgba(59,130,246,.05) 100%)',
                    border: '1px solid rgba(16,185,129,.25)',
                    padding: '1.75rem 2rem',
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                        {[
                            { icon: '🌳', val: '26,460', label: 'Trees Mapped' },
                            { icon: '🌿', val: '5,200+', label: 'More Trees Needed' },
                            { icon: '♻️', val: '21.6%', label: 'Avg Green Coverage' },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>{s.icon}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>{s.val}</div>
                                <div className="cv-text-xs cv-text-muted" style={{ marginTop: '.2rem' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {selectedMember && createPortal(
                <div className="cv-overlay" onClick={() => setSelectedMember(null)}>
                    <div className="cv-modal cv-text-center" style={{ maxWidth: 400, padding: '2.5rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                        <div
                            style={{
                                width: 150,
                                height: 150,
                                margin: '0 auto 1.5rem',
                                borderRadius: '50%',
                                background: 'var(--cv-surface-alt)',
                                border: '4px solid var(--cv-primary)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {selectedMember.imageUrl ? (
                                <img
                                    src={selectedMember.imageUrl}
                                    alt={selectedMember.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '4rem', color: 'var(--cv-text-muted)' }}>👤</span>
                            )}
                        </div>

                        <h2 style={{ marginBottom: '.5rem' }}>{selectedMember.name}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.5rem', marginBottom: '1.5rem' }}>
                            <span style={{
                                padding: '.2rem .65rem',
                                borderRadius: '1rem',
                                fontSize: '.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                background: selectedMember.title === 'Team Lead' ? 'rgba(37,99,235,0.1)' : 'var(--cv-surface-alt)',
                                color: selectedMember.title === 'Team Lead' ? 'var(--cv-primary)' : 'var(--cv-text-secondary)',
                            }}>
                                {selectedMember.title}
                            </span>
                            <span className="cv-text-sm cv-font-semibold" style={{ color: 'var(--cv-text)' }}>
                                {selectedMember.role}
                            </span>
                        </div>

                        <div className="cv-flex-col cv-gap-sm cv-items-center" style={{ marginBottom: '2rem' }}>
                            <a
                                href={`mailto:${selectedMember.email}`}
                                className="cv-flex cv-items-center cv-gap-sm cv-text-secondary"
                                style={{ fontSize: '.95rem', fontWeight: 500 }}
                            >
                                <span>📧</span> {selectedMember.email}
                            </a>
                            <a
                                href={selectedMember.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="cv-flex cv-items-center cv-gap-sm cv-text-secondary"
                                style={{ fontSize: '.95rem', fontWeight: 500 }}
                            >
                                <span style={{ color: '#0A66C2' }}>💼</span> LinkedIn Profile
                            </a>
                        </div>

                        <button className="cv-btn cv-btn-secondary" style={{ width: '100%' }} onClick={() => setSelectedMember(null)}>
                            {t.close}
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
