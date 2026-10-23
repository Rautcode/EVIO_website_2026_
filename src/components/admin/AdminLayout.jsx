import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { canAccess, ROLE_LABELS } from '../../lib/adminApi';

const adminLinks = [
    // `section` decides who sees the link (see canAccess in lib/adminApi.js)
    { name: 'Dashboard', section: 'dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Manage Inquiries', section: 'inquiries', path: '/admin/inquiries', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Manage Careers', section: 'careers', path: '/admin/careers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Manage CSR', section: 'csr', path: '/admin/csr', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { name: 'Case Studies', section: 'projects', path: '/admin/projects', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Manage Blog', section: 'blog', path: '/admin/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14' },
    { name: 'Users', section: 'users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Activity Log', section: 'activity', path: '/admin/activity', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Return to Site', path: '/', icon: 'M10 19l-7-7m0 0l7-7m-7 7h18', external: true }
];

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // { username, role }
    const [aiEnabled, setAiEnabled] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(setUser)
            .catch(() => navigate('/admin/login', { replace: true }));
        fetch('/api/ai/status').then(r => r.ok ? r.json() : { enabled: false }).then(d => setAiEnabled(!!d.enabled)).catch(() => {});
    }, [navigate]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        setUser(null);
        navigate('/admin/login', { replace: true });
    };

    if (!user) return <div className="min-h-screen bg-evio-navy flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-evio-blue border-t-transparent animate-spin"></div></div>;

    // Section of the current page: /admin -> dashboard, /admin/blog -> blog
    const section = location.pathname.split('/')[2] || 'dashboard';
    const links = adminLinks.filter(l => l.external || canAccess(user.role, l.section));

    return (
        <div className="flex bg-evio-light-gray min-h-screen font-inter w-full">
            {/* Sidebar */}
            <aside className="w-64 bg-evio-navy text-white flex flex-col shrink-0 fixed inset-y-0 z-20">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <span className="font-syne font-bold text-2xl tracking-tighter">EVIO<span className="text-evio-blue">.Admin</span></span>
                </div>
                
                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {links.map(link => {
                        const isActive = location.pathname === link.path && !link.external;
                        
                        if (link.external) {
                             return (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-white/60 hover:bg-white/5 hover:text-white"
                                >
                                    <svg className="w-5 h-5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                                    </svg>
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            );
                        }

                        return (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-evio-blue text-white shadow-md' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                            >
                                <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-evio-blue'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                                </svg>
                                <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 text-sm">
                    <div className="flex items-center p-3 rounded-lg bg-black/20">
                         <div className="w-8 h-8 rounded-full bg-evio-blue flex items-center justify-center text-white font-bold mr-3 uppercase">{user.username[0]}</div>
                         <div className="min-w-0">
                             <p className="font-bold truncate">{user.username} <span className="font-normal text-white/50 text-xs">· {ROLE_LABELS[user.role] || user.role}</span></p>
                             <div className="flex gap-3 text-xs">
                                 <Link to="/admin/account" className="text-evio-blue hover:text-white transition-colors">My account</Link>
                                 <button onClick={handleLogout} className="text-evio-blue hover:text-white transition-colors">Logout</button>
                             </div>
                         </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 relative min-h-screen flex flex-col overflow-y-auto overflow-x-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-evio-blue/5 blur-3xl rounded-full mr-[-50px] mt-[-50px] pointer-events-none"></div>
                <motion.div 
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 flex-grow flex flex-col w-full max-w-6xl mx-auto"
                >
                    {canAccess(user.role, section)
                        ? <Outlet context={{ user, aiEnabled }} />
                        : (
                            <div className="bg-white rounded-2xl p-10 text-center border border-evio-black/5">
                                <h1 className="text-2xl font-syne font-bold text-evio-navy mb-2">No access</h1>
                                <p className="font-inter text-evio-black/60">Your account ({ROLE_LABELS[user.role]}) can't open this section. Ask an admin if you need it.</p>
                            </div>
                        )}
                </motion.div>
            </main>
        </div>
    );
};
