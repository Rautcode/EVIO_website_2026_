import { useState } from 'react';
import { api } from '../../lib/adminApi';

// Uploads one image to /api/media and reports its URL. `value` = current URL (shown as a preview).
export const ImageUpload = ({ value, onChange, label = 'Image' }) => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const upload = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setBusy(true);
        setError('');
        try {
            const body = new FormData();
            body.append('image', file);
            onChange((await api('/api/media', { method: 'POST', body })).url);
        } catch (err) {
            setError(err.message);
        }
        setBusy(false);
    };

    return (
        <div>
            <span className="block text-sm font-inter text-evio-navy font-bold mb-2">{label}</span>
            <div className="flex items-center gap-4">
                {value
                    ? <img src={value} alt="" className="w-24 h-16 object-cover rounded-lg border border-evio-black/10" />
                    : <div className="w-24 h-16 rounded-lg border border-dashed border-evio-black/20 flex items-center justify-center text-[10px] text-evio-black/40">No image</div>}
                <label className="cursor-pointer px-4 py-2 rounded-lg border border-evio-black/10 text-sm font-inter font-semibold text-evio-navy hover:border-evio-blue">
                    {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} className="sr-only" />
                </label>
                {value && <button type="button" onClick={() => onChange('')} className="text-sm text-red-500 hover:underline">Remove</button>}
            </div>
            <p className="text-xs text-evio-black/45 mt-1">JPG, PNG or WebP, up to 5 MB.</p>
            {error && <p role="alert" className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};
