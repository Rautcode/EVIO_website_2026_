import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Manage Inquiries', path: '/admin/inquiries', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Manage Careers', path: '/admin/careers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Manage CSR', path: '/admin/csr', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { name: 'Manage Blog', path: '/admin/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14' },
    { name: 'Return to Site', path: '/', icon: 'M10 19l-7-7m0 0l7-7m-7 7h18', external: true }
];

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) setIsAuthenticated(true);
                else navigate('/admin/login', { replace: true });
            })
            .catch(() => navigate('/admin/login', { replace: true }));
    }, [navigate]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        setIsAuthenticated(false);
        navigate('/admin/login', { replace: true });
    };

    if (isAuthenticated === null) return <div className="min-h-screen bg-evio-navy flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-evio-blue border-t-transparent animate-spin"></div></div>;
    if (!isAuthenticated) return null;

    return (
        <div className="flex bg-evio-light-gray min-h-screen font-inter w-full">
            {/* Sidebar */}
            <aside className="w-64 bg-evio-navy text-white flex flex-col shrink-0 fixed inset-y-0 z-20">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <span className="font-syne font-bold text-2xl tracking-tighter">EVIO<span className="text-evio-blue">.Admin</span></span>
                </div>
                
                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {adminLinks.map(link => {
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
                         <div className="w-8 h-8 rounded-full bg-evio-blue flex items-center justify-center text-white font-bold mr-3">A</div>
                         <div>
                             <p className="font-bold">System Admin</p>
                             <button onClick={handleLogout} className="text-evio-blue hover:text-white text-xs transition-colors">Logout</button>
                         </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 relative min-h-screen flex flex-col overflow-y-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-evio-blue/5 blur-3xl rounded-full mr-[-50px] mt-[-50px] pointer-events-none"></div>
                <motion.div 
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 flex-grow flex flex-col w-full max-w-6xl mx-auto"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};
