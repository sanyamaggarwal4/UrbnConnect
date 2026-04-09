import { useState } from 'react';
import { useT } from '../i18n/translations';

export default function ContactUsPage() {
    const t = useT();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && message) {
            setSubmitted(true);
        }
    };

    return (
        <div className="cv-animate-fadeIn" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="cv-page-header">
                <h1>✉️ {t.contactUsTitle}</h1>
                <p>{t.contactUsSubtitle}</p>
            </div>

            <div className="cv-grid cv-grid-2" style={{ gap: '2rem' }}>
                {/* Contact Info */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>{t.getInTouch}</h3>
                    <p className="cv-text-secondary" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        {t.contactDesc}
                    </p>

                    <div className="cv-flex-col cv-gap-lg">
                        <div className="cv-flex cv-items-center cv-gap">
                            <div className="cv-card" style={{ padding: '.75rem', fontSize: '1.25rem' }}>📍</div>
                            <div>
                                <div className="cv-font-semibold">{t.officeAddress}</div>
                                <div className="cv-text-sm cv-text-secondary">GGSIPU, New Delhi</div>
                            </div>
                        </div>

                        <div className="cv-flex cv-items-center cv-gap">
                            <div className="cv-card" style={{ padding: '.75rem', fontSize: '1.25rem' }}>📞</div>
                            <div>
                                <div className="cv-font-semibold">{t.phoneNumber}</div>
                                <div className="cv-text-sm cv-text-secondary">+91 77018 55017</div>
                            </div>
                        </div>

                        <div className="cv-flex cv-items-center cv-gap">
                            <div className="cv-card" style={{ padding: '.75rem', fontSize: '1.25rem' }}>✉️</div>
                            <div>
                                <div className="cv-font-semibold">{t.emailLabel}</div>
                                <div className="cv-text-sm cv-text-secondary">[sanyamaggarwal2007@gmail.com]</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="cv-card">
                    <h3 style={{ marginBottom: '1.25rem' }}>{t.sendUsMsg}</h3>
                    {submitted ? (
                        <div className="cv-text-center cv-animate-fadeIn" style={{ padding: '2rem 1rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h4 style={{ marginBottom: '.5rem' }}>{t.msgSentTitle}</h4>
                            <p className="cv-text-sm cv-text-secondary">{t.msgSentDesc}</p>
                            <button
                                className="cv-btn cv-btn-primary"
                                style={{ marginTop: '1.25rem' }}
                                onClick={() => {
                                    setSubmitted(false);
                                    setName('');
                                    setEmail('');
                                    setMessage('');
                                }}
                            >
                                {t.sendAnother}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="cv-flex-col cv-gap">
                            <div>
                                <label className="cv-label">{t.yourName}</label>
                                <input
                                    className="cv-input"
                                    type="text"
                                    placeholder={t.namePlaceholder}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="cv-label">{t.emailLabel}</label>
                                <input
                                    className="cv-input"
                                    type="email"
                                    placeholder={t.emailPlaceholder}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="cv-label">{t.messageLabel}</label>
                                <textarea
                                    className="cv-textarea"
                                    placeholder={t.msgPlaceholder}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    required
                                    style={{ minHeight: 120 }}
                                />
                            </div>
                            <button type="submit" className="cv-btn cv-btn-primary" style={{ width: '100%', padding: '.85rem' }}>
                                {t.sendMessage}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
