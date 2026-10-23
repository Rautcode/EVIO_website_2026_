import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../lib/adminApi';

// Ready-to-post LinkedIn caption for a published case study or article.
// item = { title, summary, path }  (path like /projects/slug)
export const LinkedInPost = ({ item, onClose }) => {
    const { aiEnabled } = useOutletContext();
    const url = `${window.location.origin}${item.path}`;
    const [text, setText] = useState(`${item.title}\n\n${item.summary || ''}\n\nRead more: ${url}\n\n#EVIO #ElectricalEngineering #EPC #India`.replace(/\n{3,}/g, '\n\n'));
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState('');

    const improve = async () => {
        setBusy(true);
        setNote('');
        try {
            const { post } = await api('/api/ai/draft', { method: 'POST', body: { kind: 'linkedin', notes: `Title: ${item.title}\nSummary: ${item.summary || ''}\nLink: ${url}` } });
            setText(post);
        } catch (err) { setNote(err.message); }
        setBusy(false);
    };

    const copy = async () => {
        try { await navigator.clipboard.writeText(text); setNote('Copied. Paste it into a new LinkedIn post.'); }
        catch { setNote('Copy failed: select the text and copy it manually.'); }
    };

    return (
        <div className="bg-[#0a66c2]/5 border border-[#0a66c2]/20 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-syne font-bold text-lg text-evio-navy">Share on LinkedIn</h3>
                <button onClick={onClose} className="text-sm text-evio-black/50 hover:text-evio-navy">Close</button>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows="8" aria-label="LinkedIn post text"
                className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none font-inter text-sm bg-white" />
            <div className="flex flex-wrap gap-3 mt-3">
                <button onClick={copy} className="bg-[#0a66c2] text-white px-5 py-2 rounded-lg font-inter font-bold text-sm hover:opacity-90">Copy text</button>
                <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-lg border border-[#0a66c2]/40 text-[#0a66c2] font-inter font-bold text-sm hover:bg-white">Open LinkedIn</a>
                {aiEnabled && <button onClick={improve} disabled={busy} className="px-5 py-2 rounded-lg border border-evio-black/10 font-inter font-bold text-sm text-evio-navy hover:border-evio-blue disabled:opacity-50">{busy ? 'Writing…' : '✨ Rewrite with AI'}</button>}
            </div>
            {note && <p className="text-sm font-inter text-evio-black/60 mt-2">{note}</p>}
        </div>
    );
};
