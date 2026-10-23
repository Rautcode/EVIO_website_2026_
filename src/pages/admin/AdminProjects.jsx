import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api, toLines, fromLines } from '../../lib/adminApi';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { LinkedInPost } from '../../components/admin/LinkedInPost';
import { INDIA_CITIES } from '../../data/indiaCities';
import { projectsData } from '../../data/projectsData';

const SECTORS = ['Data Centers', 'Manufacturing', 'Chemical', 'Infrastructure', 'Commercial', 'Pharmaceuticals', 'Plastics', 'FMCG', 'Automobile & Ancillary', 'Engineering'];
const TEXT = [
    ['client', 'Client', true], ['projectName', 'Project name', true], ['location', 'Location (as shown on the page)'],
    ['facilityType', 'Facility type'], ['capacity', 'Capacity (e.g. 12 MW, 66 kV)'], ['evioRole', "EVIO's role"],
    ['contractType', 'Contract type'], ['duration', 'Duration'],
];
const LISTS = [['scope', 'Scope of work'], ['equipment', 'Major equipment'], ['challenges', 'Engineering challenges'], ['outcomes', 'Outcomes'], ['technologies', 'Technologies & systems']];
const EMPTY = { sector: 'Infrastructure', mapCity: '', images: [], published: true, ...Object.fromEntries(TEXT.map(([k]) => [k, ''])), ...Object.fromEntries(LISTS.map(([k]) => [k, ''])) };
const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white';

// API object <-> form state (lists edited as one item per line)
const toForm = (p) => ({ ...EMPTY, ...p, ...Object.fromEntries(LISTS.map(([k]) => [k, toLines(p[k])])) });
const toBody = (f) => ({ ...f, ...Object.fromEntries(LISTS.map(([k]) => [k, fromLines(f[k])])), images: f.images.filter(Boolean) });

export const AdminProjects = () => {
    const { aiEnabled } = useOutletContext();
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null); // null = list view; {} = new; project = edit
    const [form, setForm] = useState(EMPTY);
    const [notes, setNotes] = useState('');
    const [busy, setBusy] = useState('');
    const [error, setError] = useState('');
    const [share, setShare] = useState(null);

    const load = useCallback(() => api('/api/projects/all').then(setItems).catch(err => setError(err.message)), []);
    useEffect(() => { load(); }, [load]);

    const open = (p) => { setEditing(p || {}); setForm(p ? toForm(p) : EMPTY); setNotes(''); setError(''); setShare(null); };
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const draft = async () => {
        setBusy('draft'); setError('');
        try {
            const d = await api('/api/ai/draft', { method: 'POST', body: { kind: 'case-study', notes } });
            setForm(f => ({ ...toForm({ ...f, ...d }), images: f.images, mapCity: f.mapCity, published: f.published }));
        } catch (err) { setError(err.message); }
        setBusy('');
    };

    const save = async (e) => {
        e.preventDefault();
        setBusy('save'); setError('');
        try {
            const saved = editing.dbId
                ? await api(`/api/projects/${editing.dbId}`, { method: 'PUT', body: toBody(form) })
                : await api('/api/projects', { method: 'POST', body: toBody(form) });
            if (projectsData.some(p => p.id === saved.id)) setError(`Saved, but the web address /projects/${saved.id} is already used by a built-in case study. Change the client or project name.`);
            await load();
            setEditing(null);
            if (saved.published) setShare({ title: `${saved.client}: ${saved.projectName}`, summary: saved.outcomes?.[0] || saved.scope?.[0], path: `/projects/${saved.id}` });
        } catch (err) { setError(err.message); }
        setBusy('');
    };

    const remove = async (p) => {
        if (!window.confirm(`Delete the case study "${p.projectName}"? It disappears from the website.`)) return;
        try { await api(`/api/projects/${p.dbId}`, { method: 'DELETE' }); await load(); } catch (err) { setError(err.message); }
    };

    if (editing) {
        return (
            <form onSubmit={save} className="w-full space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-syne font-bold text-evio-navy">{editing.dbId ? 'Edit case study' : 'New case study'}</h1>
                        <p className="text-evio-black/60 font-inter">Only publish facts the project team has confirmed.</p>
                    </div>
                    <button type="button" onClick={() => setEditing(null)} className="text-evio-black/60 hover:text-evio-navy font-semibold">Cancel</button>
                </div>
                {error && <p role="alert" className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}

                {aiEnabled && (
                    <section className="bg-evio-blue/5 border border-evio-blue/20 rounded-2xl p-6">
                        <h2 className="font-syne font-bold text-lg text-evio-navy mb-1">✨ Draft with AI</h2>
                        <p className="text-sm text-evio-black/60 mb-3">Paste site notes, a completion letter or an email. The AI fills the form below using only those facts; review every field before publishing.</p>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="5" aria-label="Notes for the AI draft" className={inputClass} placeholder="e.g. Client: ABC Pharma, Baddi. 2 x 2.5 MVA transformers, 11 kV HT panel, 40 km cabling, completed March 2026 in 9 months, zero accidents..." />
                        <button type="button" onClick={draft} disabled={busy === 'draft' || notes.trim().length < 20} className="mt-3 bg-evio-navy text-white px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-50">
                            {busy === 'draft' ? 'Drafting… (up to a minute)' : 'Fill the form from my notes'}
                        </button>
                    </section>
                )}

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {TEXT.map(([k, label, required]) => (
                        <label key={k} className="block">
                            <span className="block text-sm font-bold text-evio-navy mb-2">{label}{required && ' *'}</span>
                            <input value={form[k]} onChange={set(k)} required={required} className={inputClass} />
                        </label>
                    ))}
                    <label className="block">
                        <span className="block text-sm font-bold text-evio-navy mb-2">Sector *</span>
                        <select value={form.sector} onChange={set('sector')} className={inputClass}>{SECTORS.map(s => <option key={s}>{s}</option>)}</select>
                    </label>
                    <label className="block">
                        <span className="block text-sm font-bold text-evio-navy mb-2">Pin on the India map</span>
                        <select value={form.mapCity} onChange={set('mapCity')} className={inputClass}>
                            <option value="">Don't pin (list under the map)</option>
                            {INDIA_CITIES.map(c => <option key={c.city}>{c.city}</option>)}
                        </select>
                    </label>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {LISTS.map(([k, label]) => (
                        <label key={k} className="block">
                            <span className="block text-sm font-bold text-evio-navy mb-2">{label} <span className="font-normal text-evio-black/45">(one per line)</span></span>
                            <textarea value={form[k]} onChange={set(k)} rows="5" className={inputClass} />
                        </label>
                    ))}
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 space-y-5">
                    <h2 className="font-syne font-bold text-lg text-evio-navy">Photos</h2>
                    <p className="text-sm text-evio-black/60 -mt-3">The first photo is the page banner; the rest form the site gallery.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[...form.images, ''].slice(0, 12).map((url, i) => (
                            <ImageUpload key={i} label={i === 0 ? 'Banner photo' : `Gallery photo ${i}`} value={url}
                                onChange={(u) => setForm(f => { const images = [...f.images]; images[i] = u; return { ...f, images: images.filter(Boolean) }; })} />
                        ))}
                    </div>
                </section>

                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5">
                    <label className="flex items-center gap-3 font-semibold text-evio-navy">
                        <input type="checkbox" checked={form.published} onChange={set('published')} className="w-5 h-5" /> Published on the website
                    </label>
                    <button type="submit" disabled={busy === 'save'} className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 disabled:opacity-60">
                        {busy === 'save' ? 'Saving…' : 'Save case study'}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-syne font-bold text-evio-navy">Case studies</h1>
                    <p className="text-evio-black/60 font-inter">Add new projects to the website, the projects gallery and the India map. The {projectsData.length} original case studies are built into the site.</p>
                </div>
                <button onClick={() => open(null)} className="bg-evio-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-evio-navy transition-colors shadow-md">New case study</button>
            </div>
            {error && <p role="alert" className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
            {share && <LinkedInPost item={share} onClose={() => setShare(null)} />}

            <div className="space-y-3">
                {items.map(p => (
                    <div key={p.dbId} className="bg-white rounded-2xl p-5 shadow-sm border border-evio-black/5 flex flex-wrap items-center gap-4">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-24 h-16 object-cover rounded-lg" /> : <div className="w-24 h-16 rounded-lg bg-evio-navy" />}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-evio-blue uppercase tracking-wider">{p.client}</p>
                            <h3 className="font-syne font-bold text-evio-navy truncate">{p.projectName}</h3>
                            <p className="text-xs text-evio-black/50">{p.sector}{p.mapCity ? ` · ${p.mapCity}` : ''} · {p.published ? 'Published' : 'Draft'}</p>
                        </div>
                        <div className="flex gap-4 text-sm font-semibold">
                            {p.published && <Link to={`/projects/${p.id}`} target="_blank" className="text-evio-navy hover:underline">View</Link>}
                            {p.published && <button onClick={() => setShare({ title: `${p.client}: ${p.projectName}`, summary: p.outcomes?.[0] || p.scope?.[0], path: `/projects/${p.id}` })} className="text-[#0a66c2] hover:underline">LinkedIn post</button>}
                            <button onClick={() => open(p)} className="text-evio-blue hover:underline">Edit</button>
                            <button onClick={() => remove(p)} className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div className="text-center py-12 text-evio-black/50 bg-white rounded-2xl border border-dashed border-evio-black/20">No case studies added from the admin panel yet.</div>}
            </div>
        </div>
    );
};
