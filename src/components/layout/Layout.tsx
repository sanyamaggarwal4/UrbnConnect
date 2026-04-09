import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAppContext } from '../../context/AppContext';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
    const { currentUser } = useAppContext();

    const showSidebar = !!currentUser;

    return (
        <div className="cv-flex-col" style={{ minHeight: '100vh' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

            {showSidebar && (
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            )}

            <main className={`cv-main ${!showSidebar ? 'hidden-sidebar' : (!sidebarOpen ? 'collapsed' : '')}`}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
