import { useContext, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { LEAD_STATUSES, STATUS_STYLES } from '../../lib/leads';
import { canAccess } from '../../lib/adminApi';

export const Dashboard = () => {
    const { jobs, csrInitiatives, blogPosts, inquiries, refreshInquiries } = useContext(DataContext);

    const { user } = useOutletContext();
    const seesLeads = canAccess(user.role, 'inquiries');
    useEffect(() => { if (seesLeads) refreshInquiries(); }, [refreshInquiries, seesLeads]);

    const leadsIn = (status) => inquiries.filter(i => (i.status || 'New') === status).length;
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const leadsThisMonth = inquiries.filter(i => new Date(i.date) >= monthStart).length;

    const stats = [
        { section: 'blog', title: 'Total Blog Posts', count: blogPosts.length, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14' },
        { section: 'careers', title: 'Open Job Positions', count: jobs.length, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { section: 'csr', title: 'CSR Initiatives', count: csrInitiatives.length, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { section: 'inquiries', title: 'New Leads to Follow Up', count: leadsIn('New'), icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ].filter(s => canAccess(user.role, s.section));

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-syne font-bold text-evio-navy">System Overview</h1>
                <p className="text-evio-black/60 font-inter">Welcome to the EVIO master control panel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-evio-blue/10 flex items-center justify-center text-evio-blue">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-syne font-bold text-evio-navy mb-1">{stat.count}</h3>
                        <p className="text-sm font-inter text-evio-black/60">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {seesLeads && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5">
                    <div className="flex justify-between items-baseline mb-6">
                        <h3 className="font-syne font-bold text-xl text-evio-navy">Lead Pipeline</h3>
                        <span className="text-sm font-inter text-evio-black/50">{leadsThisMonth} new this month</span>
                    </div>
                    <div className="space-y-3">
                        {LEAD_STATUSES.map(status => {
                            const count = leadsIn(status);
                            return (
                                <div key={status} className="flex items-center gap-3">
                                    <span className={`w-24 shrink-0 text-center px-2 py-1 rounded border text-xs font-inter font-bold ${STATUS_STYLES[status]}`}>{status}</span>
                                    <div className="flex-1 bg-evio-light-gray rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-evio-blue h-full rounded-full" style={{ width: `${inquiries.length ? (count / inquiries.length) * 100 : 0}%` }} />
                                    </div>
                                    <span className="w-8 text-right font-syne font-bold text-evio-navy">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5">
                    <div className="flex justify-between items-baseline mb-4">
                        <h3 className="font-syne font-bold text-xl text-evio-navy">Latest Leads</h3>
                        <Link to="/admin/inquiries" className="text-sm font-inter font-semibold text-evio-blue hover:underline">Open pipeline →</Link>
                    </div>
                    {inquiries.length === 0 ? (
                        <p className="font-inter text-sm text-evio-black/50">No leads yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {inquiries.slice(0, 5).map(i => (
                                <li key={i.id} className="py-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-inter text-sm font-semibold text-evio-navy truncate">{i.name}{i.company ? ` · ${i.company}` : ''}</p>
                                        <p className="font-inter text-xs text-evio-black/50 truncate">{i.projectType || 'General'} · {new Date(i.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`shrink-0 px-2 py-0.5 rounded border text-xs font-inter font-bold ${STATUS_STYLES[i.status || 'New']}`}>{i.status || 'New'}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>}
        </div>
    );
};
