import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
    const { login, loginAsGuest } = useAppContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isGuestEntry = searchParams.get('guest') === 'true';

    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [voterId, setVoterId] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'login' | 'role' | 'otp'>(isGuestEntry ? 'role' : 'login');
    const [selectedRole, setSelectedRole] = useState<'citizen' | 'authority'>('citizen');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authMethod === 'email' && !email.trim()) return;
        if (authMethod === 'phone' && !phone.trim()) return;

        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';

        if (hasSupabase) {
            setIsLoading(true);
            try {
                let error;
                if (authMethod === 'email') {
                    const res = await supabase.auth.signInWithOtp({
                        email,
                        options: { data: { role: selectedRole } }
                    });
                    error = res.error;
                } else {
                    const res = await supabase.auth.signInWithOtp({
                        phone: `+91${phone}`,
                        options: { data: { role: selectedRole } }
                    });
                    error = res.error;
                }

                if (error) {
                    alert('Error sending OTP: ' + error.message);
                } else {
                    setStep('otp');
                }
            } catch (err: any) {
                alert('Fatal Error sending OTP: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            login(authMethod === 'email' ? email : `+91${phone}`, selectedRole);
            navigate(selectedRole === 'authority' ? '/authority' : '/dashboard');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim()) return;

        setIsLoading(true);
        try {
            let error;
            if (authMethod === 'email') {
                const res = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
                error = res.error;
            } else {
                const res = await supabase.auth.verifyOtp({ phone: `+91${phone}`, token: otp, type: 'sms' });
                error = res.error;
            }

            if (error) {
                alert('Invalid OTP: ' + error.message);
            } else {
                navigate(selectedRole === 'authority' ? '/authority' : '/dashboard');
            }
        } catch (err: any) {
            alert('Fatal Error verifying OTP: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = () => {
        loginAsGuest(selectedRole);
        navigate(selectedRole === 'authority' ? '/authority' : '/dashboard');
    };

    const handleGoogleLogin = async () => {
        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co';

        if (hasSupabase) {
            try {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent',
                        },
                        redirectTo: window.location.origin + (selectedRole === 'authority' ? '/authority' : '/dashboard')
                    }
                });
                if (error) {
                    alert('Google Auth Setup Error:\n' + error.message);
                }
            } catch (err: any) {
                alert('Fatal Error initiating Google Auth:\n' + err.message);
            }
        } else {
            // Mock Google login fallback
            login('sanyam.aggarwal@gmail.com', selectedRole);
            navigate(selectedRole === 'authority' ? '/authority' : '/dashboard');
        }
    };

    return (
        <div
            className="cv-animate-fadeIn"
            style={{
                maxWidth: 440,
                margin: '2rem auto',
                padding: '0 1rem',
            }}
        >
            <div className="cv-card" style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🏙️</div>
                    <h2 style={{ marginBottom: '.25rem' }}>
                        {step === 'login' ? 'Welcome Back' : 'Choose Your Role'}
                    </h2>
                    <p className="cv-text-sm cv-text-muted">
                        {step === 'login'
                            ? 'Sign in to report and track civic issues'
                            : 'How would you like to use CityVaani?'}
                    </p>
                </div>

                {step === 'role' ? (
                    /* ── Role Selection ────────────────────────── */
                    <div>
                        <div className="cv-flex-col cv-gap" style={{ marginBottom: '1.5rem' }}>
                            <RoleCard
                                icon="👤"
                                title="Citizen"
                                desc="Report issues, view local problems, and track progress."
                                selected={selectedRole === 'citizen'}
                                onClick={() => setSelectedRole('citizen')}
                            />
                            <RoleCard
                                icon="🏛️"
                                title="Authority"
                                desc="Manage reported issues, update status, and view analytics."
                                selected={selectedRole === 'authority'}
                                onClick={() => setSelectedRole('authority')}
                            />
                        </div>

                        {isGuestEntry ? (
                            <button
                                className="cv-btn cv-btn-primary"
                                style={{ width: '100%' }}
                                onClick={handleGuestLogin}
                            >
                                Continue as Guest {selectedRole === 'authority' ? 'Authority' : 'Citizen'} →
                            </button>
                        ) : (
                            <div className="cv-flex-col cv-gap-sm">
                                <button
                                    className="cv-btn cv-btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => setStep('login')}
                                >
                                    Continue to Login →
                                </button>
                                <button
                                    className="cv-btn cv-btn-ghost cv-text-sm"
                                    style={{ width: '100%' }}
                                    onClick={handleGuestLogin}
                                >
                                    or continue as Guest
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── Login Form ────────────────────────────── */
                    <div>
                        {/* Role pills */}
                        <div
                            className="cv-flex cv-gap-sm"
                            style={{ marginBottom: '1.25rem', justifyContent: 'center' }}
                        >
                            <button
                                className={`cv-filter-chip ${selectedRole === 'citizen' ? 'selected' : ''}`}
                                onClick={() => setSelectedRole('citizen')}
                            >
                                👤 Citizen
                            </button>
                            <button
                                className={`cv-filter-chip ${selectedRole === 'authority' ? 'selected' : ''}`}
                                onClick={() => setSelectedRole('authority')}
                            >
                                🏛️ Authority
                            </button>
                        </div>

                        {/* Google Sign-In button (mocked) */}
                        <button
                            className="cv-btn cv-btn-secondary"
                            style={{
                                width: '100%',
                                marginBottom: '1rem',
                                gap: '.6rem',
                                padding: '.7rem',
                            }}
                            onClick={handleGoogleLogin}
                        >
                            <GoogleIcon /> Sign in with Google
                        </button>

                        <div
                            className="cv-text-xs cv-text-muted cv-text-center"
                            style={{ margin: '.75rem 0', position: 'relative' }}
                        >
                            <span
                                style={{
                                    background: 'var(--cv-surface)',
                                    padding: '0 .75rem',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                or sign in with email / phone
                            </span>
                            <hr
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    right: 0,
                                    border: 'none',
                                    borderTop: '1px solid var(--cv-border)',
                                }}
                            />
                        </div>

                        {/* Auth form */}
                        {step === 'otp' ? (
                            <form onSubmit={handleVerifyOtp} className="cv-animate-fadeIn">
                                <div style={{ marginBottom: '.85rem' }}>
                                    <label className="cv-label">Enter OTP</label>
                                    <input
                                        className="cv-input"
                                        type="text"
                                        placeholder={authMethod === 'phone' ? '6-digit pin' : '8-digit pin'}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                    <p className="cv-text-xs cv-text-muted" style={{ marginTop: '.3rem' }}>
                                        We sent an OTP code to <strong>{authMethod === 'email' ? email : `+91 ${phone}`}</strong>
                                    </p>
                                </div>
                                <button className="cv-btn cv-btn-primary" style={{ width: '100%' }} type="submit" disabled={isLoading}>
                                    {isLoading ? 'Verifying...' : 'Verify OTP →'}
                                </button>
                                <div className="cv-text-center" style={{ marginTop: '.75rem' }}>
                                    <button
                                        type="button"
                                        className="cv-btn cv-btn-ghost cv-text-sm"
                                        onClick={() => setStep('login')}
                                    >
                                        Use a different {authMethod === 'phone' ? 'number' : 'email'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleAuthSubmit}>
                                {/* Auth Method Selector */}
                                <div className="cv-flex cv-gap-sm" style={{ marginBottom: '1rem' }}>
                                    <button
                                        type="button"
                                        className={`cv-btn cv-btn-sm ${authMethod === 'email' ? 'cv-btn-secondary' : 'cv-btn-ghost'}`}
                                        style={{ flex: 1 }}
                                        onClick={() => setAuthMethod('email')}
                                    >
                                        ✉️ Email
                                    </button>
                                    <button
                                        type="button"
                                        className={`cv-btn cv-btn-sm ${authMethod === 'phone' ? 'cv-btn-secondary' : 'cv-btn-ghost'}`}
                                        style={{ flex: 1 }}
                                        onClick={() => setAuthMethod('phone')}
                                    >
                                        📱 Phone
                                    </button>
                                </div>

                                {authMethod === 'email' ? (
                                    <div style={{ marginBottom: '.85rem' }}>
                                        <label className="cv-label">Email</label>
                                        <input
                                            className="cv-input"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '.85rem' }}>
                                        <label className="cv-label">Mobile Number</label>
                                        <div className="cv-flex cv-items-center cv-gap-sm">
                                            <span style={{
                                                padding: '.65rem .9rem',
                                                background: 'var(--cv-surface-alt)',
                                                border: '1px solid var(--cv-border)',
                                                borderRadius: 'var(--cv-radius)',
                                                color: 'var(--cv-text-secondary)',
                                                fontWeight: 600
                                            }}>+91</span>
                                            <input
                                                className="cv-input"
                                                type="tel"
                                                placeholder="9876543210"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label className="cv-label">
                                        Voter ID / EPIC <span className="cv-text-muted">(optional)</span>
                                    </label>
                                    <input
                                        className="cv-input"
                                        type="text"
                                        placeholder="e.g. DL/09/042/123456"
                                        value={voterId}
                                        onChange={(e) => setVoterId(e.target.value)}
                                    />
                                    <p className="cv-text-xs cv-text-muted" style={{ marginTop: '.3rem' }}>
                                        Used for locality identification in the demo.
                                    </p>
                                </div>

                                <button className="cv-btn cv-btn-primary" style={{ width: '100%' }} type="submit" disabled={isLoading}>
                                    {isLoading ? 'Sending OTP...' : `Sign In →`}
                                </button>
                            </form>
                        )}

                        <div className="cv-text-center" style={{ marginTop: '1rem' }}>
                            <button
                                className="cv-btn cv-btn-ghost cv-text-sm"
                                onClick={() => setStep('role')}
                            >
                                ← Back to Role Selection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Sub-components ───────────────────────────────────────── */

function RoleCard({
    icon,
    title,
    desc,
    selected,
    onClick,
}: {
    icon: string;
    title: string;
    desc: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <div
            className="cv-card cv-card-clickable"
            onClick={onClick}
            style={{
                border: selected ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                background: selected ? 'rgba(37,99,235,.04)' : 'var(--cv-surface)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            <div style={{ fontSize: '2rem' }}>{icon}</div>
            <div>
                <div className="cv-font-semibold">{title}</div>
                <div className="cv-text-sm cv-text-secondary">{desc}</div>
            </div>
            <div
                style={{
                    marginLeft: 'auto',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${selected ? 'var(--cv-primary)' : 'var(--cv-border)'}`,
                    background: selected ? 'var(--cv-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {selected && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                )}
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}
