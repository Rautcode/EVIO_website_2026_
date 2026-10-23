import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api, ROLE_LABELS } from '../../lib/adminApi';

const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none';

export const AdminAccount = () => {
    const { user } = useOutletContext();
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });
    const [msg, setMsg] = useState(null); // { ok, text }
    const [busy, setBusy] = useState(false);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (form.next !== form.confirm) return setMsg({ ok: false, text: 'The new passwords do not match.' });
        setBusy(true);
        try {
            await api('/api/auth/password', { method: 'POST', body: { current: form.current, next: form.next } });
            setForm({ current: '', next: '', confirm: '' });
            setMsg({ ok: true, text: 'Password changed. You have been signed out on your other devices.' });
        } catch (err) { setMsg({ ok: false, text: err.message }); }
        setBusy(false);
    };

    return (
        <div className="w-full max-w-xl">
            <h1 className="text-3xl font-syne font-bold text-evio-navy">My account</h1>
            <p className="text-evio-black/60 font-inter mb-8">Signed in as <strong>{user.username}</strong> ({ROLE_LABELS[user.role]}).</p>

            <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 space-y-5">
                <h2 className="text-xl font-syne font-bold text-evio-navy">Change password</h2>
                <label className="block">
                    <span className="block text-sm font-bold text-evio-navy mb-2">Current password</span>
                    <input type="password" autoComplete="current-password" required value={form.current} onChange={set('current')} className={inputClass} />
                </label>
                <label className="block">
                    <span className="block text-sm font-bold text-evio-navy mb-2">New password (at least 12 characters)</span>
                    <input type="password" autoComplete="new-password" required minLength="12" value={form.next} onChange={set('next')} className={inputClass} />
                </label>
                <label className="block">
                    <span className="block text-sm font-bold text-evio-navy mb-2">Repeat new password</span>
                    <input type="password" autoComplete="new-password" required minLength="12" value={form.confirm} onChange={set('confirm')} className={inputClass} />
                </label>
                {msg && <p role="status" className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}
                <button type="submit" disabled={busy} className="bg-evio-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-evio-navy transition-colors disabled:opacity-60">
                    {busy ? 'Saving…' : 'Change password'}
                </button>
            </form>
        </div>
    );
};
