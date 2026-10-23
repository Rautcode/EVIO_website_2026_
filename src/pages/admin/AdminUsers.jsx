import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api, ROLE_LABELS } from '../../lib/adminApi';

const ROLE_HELP = {
    admin: 'Everything, including users and the activity log',
    sales: 'Leads and enquiries',
    hr: 'Job openings and applicants',
    marketing: 'Case studies, blog, CSR and images',
};
const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white';

// 16 characters from an unambiguous alphabet, from the browser's secure random source
const tempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    return Array.from(crypto.getRandomValues(new Uint32Array(16)), n => chars[n % chars.length]).join('');
};

export const AdminUsers = () => {
    const { user: me } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [form, setForm] = useState({ username: '', role: 'sales', password: tempPassword() });

    const load = useCallback(() => api('/api/users').then(setUsers).catch(err => setError(err.message)), []);
    useEffect(() => { load(); }, [load]);

    const run = async (fn, okText) => {
        setError(''); setNotice('');
        try { await fn(); if (okText) setNotice(okText); await load(); }
        catch (err) { setError(err.message); }
    };

    const add = (e) => {
        e.preventDefault();
        run(async () => {
            await api('/api/users', { method: 'POST', body: form });
            setForm({ username: '', role: 'sales', password: tempPassword() });
        }, `User "${form.username}" created. Share the temporary password privately: ${form.password} (they should change it under My account).`);
    };

    const patch = (u, body, okText) => run(() => api(`/api/users/${u.id}`, { method: 'PATCH', body }), okText);

    const resetPassword = (u) => {
        const password = tempPassword();
        if (window.confirm(`Reset ${u.username}'s password? They will be signed out.`)) {
            patch(u, { password }, `New temporary password for ${u.username}: ${password}`);
        }
    };

    const remove = (u) => {
        if (window.confirm(`Delete user ${u.username}? This cannot be undone.`)) run(() => api(`/api/users/${u.id}`, { method: 'DELETE' }), `Deleted ${u.username}.`);
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl font-syne font-bold text-evio-navy">Users</h1>
            <p className="text-evio-black/60 font-inter mb-8">Give each person their own login. Any change signs that user out so it takes effect at once.</p>

            {error && <p role="alert" className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
            {notice && <p role="status" className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm break-words">{notice}</p>}

            <form onSubmit={add} className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <label className="block">
                    <span className="block text-sm font-bold text-evio-navy mb-2">Username</span>
                    <input required pattern="[a-z0-9._\-]{3,40}" title="3–40 lowercase letters, numbers, dot, dash or underscore" value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))} className={inputClass} placeholder="e.g. priya.sales" />
                </label>
                <label className="block">
                    <span className="block text-sm font-bold text-evio-navy mb-2">Role</span>
                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputClass}>
                        {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </label>
                <label className="block">
                    <span className="block text-sm font-bold text-evio-navy mb-2">Temporary password</span>
                    <input required minLength="12" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={`${inputClass} font-mono text-sm`} />
                </label>
                <button type="submit" className="bg-evio-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-evio-navy transition-colors">Add user</button>
                <p className="md:col-span-4 text-xs text-evio-black/50">{ROLE_LABELS[form.role]}: {ROLE_HELP[form.role]}.</p>
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-evio-black/5 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-evio-light-gray text-evio-navy">
                        <tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-evio-black/5">
                        {users.map(u => {
                            const self = u.username === me.username;
                            return (
                                <tr key={u.id} className={u.disabled ? 'opacity-50' : ''}>
                                    <td className="px-5 py-3 font-semibold text-evio-navy">{u.username}{self && <span className="ml-2 text-xs font-normal text-evio-black/50">(you)</span>}</td>
                                    <td className="px-5 py-3">
                                        <select value={u.role} disabled={self} aria-label={`Role for ${u.username}`}
                                            onChange={e => patch(u, { role: e.target.value }, `${u.username} is now ${ROLE_LABELS[e.target.value]}.`)}
                                            className="px-3 py-1.5 rounded-lg border border-evio-black/10 bg-white disabled:bg-transparent disabled:border-transparent">
                                            {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-5 py-3">{u.disabled ? 'Disabled' : 'Active'}</td>
                                    <td className="px-5 py-3 text-right whitespace-nowrap space-x-3">
                                        {!self && <>
                                            <button onClick={() => resetPassword(u)} className="text-evio-blue hover:underline">Reset password</button>
                                            <button onClick={() => patch(u, { disabled: !u.disabled }, `${u.username} ${u.disabled ? 'enabled' : 'disabled'}.`)} className="text-evio-navy hover:underline">{u.disabled ? 'Enable' : 'Disable'}</button>
                                            <button onClick={() => remove(u)} className="text-red-500 hover:underline">Delete</button>
                                        </>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
