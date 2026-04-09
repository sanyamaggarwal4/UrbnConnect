import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useT } from '../../i18n/translations';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { currentUser } = useAppContext();
    const t = useT();

    const isAuthority = currentUser?.role === 'authority';

    const citizenLinks = [
        { to: '/dashboard', icon: '🏠', label: t.dashboard },
        { to: '/report', icon: '📝', label: t.reportProblem },
        { to: '/issues', icon: '📋', label: t.localityProblems },
        { to: '/map', icon: '🗺️', label: t.mapView },
        { to: '/area-insights', icon: '📊', label: t.areaInsights },
        { to: '/sustainability', icon: '🌿', label: 'Green Intelligence' },
        { to: '/community', icon: '👥', label: t.communityHub || 'Community Hub' },
        { to: '/profile', icon: '👤', label: t.profile },
    ];

    const authorityLinks = [
        { to: '/authority', icon: '📊', label: t.dashboard },
        { to: '/authority/issues', icon: '📋', label: t.allIssues },
        { to: '/authority/map', icon: '🗺️', label: t.mapView },
        { to: '/authority/analytics', icon: '📈', label: t.analytics },
        { to: '/sustainability', icon: '🌿', label: 'Green Intelligence' },
        { to: '/community', icon: '👥', label: t.communityHub || 'Community Hub' },
    ];

    const navLinks = isAuthority ? authorityLinks : citizenLinks;

    const commonLinks = [
        { to: '/about', icon: 'ℹ️', label: 'About Us' },
        { to: '/contact', icon: '✉️', label: 'Contact Us' },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {open && (
                <div
                    className="cv-overlay"
                    onClick={onClose}
                    style={{ background: 'rgba(0,0,0,.25)', backdropFilter: 'none', zIndex: 799 }}
                />
            )}

            <aside className={`cv-sidebar ${open ? 'open' : 'closed'}`}>
                {/* Role label */}
                <div className="cv-sidebar-section">
                    {isAuthority ? t.authorityDashboard : t.dashboard}
                </div>

                <ul className="cv-sidebar-nav">
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `cv-sidebar-link ${isActive ? 'active' : ''}`
                                }
                                onClick={onClose}
                            >
                                <span className="cv-sidebar-link-icon">{link.icon}</span>
                                <span className="cv-sidebar-link-label">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="cv-sidebar-section" style={{ marginTop: '1.5rem' }}>
                    General
                </div>
                <ul className="cv-sidebar-nav">
                    {commonLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `cv-sidebar-link ${isActive ? 'active' : ''}`
                                }
                                onClick={onClose}
                            >
                                <span className="cv-sidebar-link-icon">{link.icon}</span>
                                <span className="cv-sidebar-link-label">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
}
