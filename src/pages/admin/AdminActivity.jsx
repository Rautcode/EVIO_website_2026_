import { useEffect, useState } from 'react';
import { api } from '../../lib/adminApi';

export const AdminActivity = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [q, setQ] = useState('');

    useEffect(() => { api('/api/audit').then(setRows).catch(err => setError(err.message)); }, []);

    const needle = q.trim().toLowerCase();
    const shown = needle ? rows.filter(r => [r.username, r.action, r.target].join(' ').toLowerCase().includes(needle)) : rows;

    return (
        <div className="w-full">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-syne font-bold text-evio-navy">Activity log</h1>
                    <p className="text-evio-black/60 font-inter">The latest 500 admin actions: who changed what, and when.</p>
                </div>
                <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Filter by user, action or item" aria-label="Filter activity"
                    className="px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white w-72" />
            </div>
            {error && <p role="alert" className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
            <div className="bg-white rounded-2xl shadow-sm border border-evio-black/5 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-evio-light-gray text-evio-navy">
                        <tr><th className="px-5 py-3">When</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Item</th></tr>
                    </thead>
                    <tbody className="divide-y divide-evio-black/5">
                        {shown.map(r => (
                            <tr key={r.id}>
                                <td className="px-5 py-2.5 whitespace-nowrap text-evio-black/60">{new Date(r.at).toLocaleString('en-IN')}</td>
                                <td className="px-5 py-2.5 font-semibold text-evio-navy">{r.username || '-'}</td>
                                <td className="px-5 py-2.5"><code className="text-xs bg-evio-light-gray px-2 py-0.5 rounded">{r.action}</code></td>
                                <td className="px-5 py-2.5 text-evio-black/70">{r.target}</td>
                            </tr>
                        ))}
                        {shown.length === 0 && <tr><td colSpan="4" className="px-5 py-10 text-center text-evio-black/50">No activity yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
