import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DataContext } from '../../context/DataContext';
import { LEAD_STATUSES, STATUS_STYLES } from '../../lib/leads';

const LeadCard = ({ inq, onUpdate, onDelete, onDownload }) => {
    const [notes, setNotes] = useState(inq.notes || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const status = inq.status || 'New';

    const save = async (patch) => {
        setSaving(true);
        setError('');
        try { await onUpdate(inq.id, patch); }
        catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 ${status === 'New' ? 'border-blue-200' : 'border-gray-100'}`}
        >
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-syne font-bold text-lg text-evio-navy">{inq.name}</h3>
                    <span className="text-xs text-evio-black/40 font-inter shrink-0">{new Date(inq.date).toLocaleString()}</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm font-inter text-evio-black/60">
                    {inq.company && <span className="font-semibold text-evio-navy">{inq.company}</span>}
                    <a href={`mailto:${inq.email}`} className="text-evio-blue hover:underline">{inq.email}</a>
                    {inq.phone && <a href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`} className="text-evio-blue hover:underline">{inq.phone}</a>}
                    {inq.projectType && <span className="px-2 py-0.5 rounded bg-evio-blue/10 text-evio-blue text-xs font-semibold self-center">{inq.projectType}</span>}
                </div>

                {inq.source && <p className="mb-3 text-xs font-inter text-evio-black/40 break-all">Source: {inq.source}</p>}

                <div className="bg-evio-light-gray/50 p-4 rounded-lg font-inter text-sm text-evio-black/80 whitespace-pre-wrap border border-black/5 mb-4">
                    {inq.message}
                </div>

                {inq.attachment && (
                    <button
                        onClick={() => onDownload(inq.id, inq.attachment.slice(17)).catch(err => setError(err.message))}
                        className="mb-4 inline-flex items-center text-sm font-inter font-semibold text-evio-blue hover:underline"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        {inq.attachment.slice(17)}
                    </button>
                )}

                <label className="block text-xs font-inter font-bold uppercase tracking-wider text-evio-black/40 mb-1" htmlFor={`notes-${inq.id}`}>Internal notes</label>
                <textarea
                    id={`notes-${inq.id}`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => notes !== (inq.notes || '') && save({ notes })}
                    rows={2}
                    placeholder="Call log, quote value, next step..."
                    className="w-full px-3 py-2 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none text-sm font-inter resize-y"
                />
                <p className="text-xs font-inter mt-1 h-4">
                    {error ? <span className="text-red-500">{error}</span>
                        : saving ? <span className="text-evio-black/40">Saving...</span>
                        : inq.updatedAt && <span className="text-evio-black/30">Updated {new Date(inq.updatedAt).toLocaleString()}</span>}
                </p>
            </div>

            <div className="flex md:flex-col items-stretch gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-40">
                <label className="sr-only" htmlFor={`status-${inq.id}`}>Status</label>
                <select
                    id={`status-${inq.id}`}
                    value={status}
                    disabled={saving}
                    onChange={(e) => save({ status: e.target.value })}
                    className={`px-3 py-2 rounded-lg border font-inter text-sm font-bold ${STATUS_STYLES[status]}`}
                >
                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <a href={`mailto:${inq.email}`} className="px-4 py-2 text-center bg-evio-blue text-white rounded-lg font-inter text-sm font-medium hover:bg-evio-navy transition-colors">
                    Reply
                </a>
                <button
                    onClick={() => window.confirm(`Delete the lead from ${inq.name}? This cannot be undone.`) && onDelete(inq.id)}
                    className="px-4 py-2 text-center bg-white text-red-500 border border-red-100 rounded-lg font-inter text-sm font-medium hover:bg-red-50 transition-colors"
                >
                    Delete
                </button>
            </div>
        </motion.div>
    );
};

export const AdminInquiries = () => {
    const { inquiries, deleteInquiry, refreshInquiries, updateInquiry, downloadInquiryAttachment } = useContext(DataContext);
    const [filter, setFilter] = useState('Open');

    useEffect(() => { refreshInquiries(); }, [refreshInquiries]);

    const statusOf = (i) => i.status || 'New';
    const isOpen = (i) => !['Won', 'Lost'].includes(statusOf(i));
    const tabs = [
        ['Open', inquiries.filter(isOpen).length],
        ...LEAD_STATUSES.map(s => [s, inquiries.filter(i => statusOf(i) === s).length]),
        ['All', inquiries.length],
    ];
    const shown = filter === 'All' ? inquiries
        : filter === 'Open' ? inquiries.filter(isOpen)
        : inquiries.filter(i => statusOf(i) === filter);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-syne font-bold text-evio-navy">Leads Pipeline</h1>
                <p className="text-evio-black/60 font-inter mt-1">Enquiries, RFQs and brochure downloads from the website. Move each lead through the pipeline as you follow up.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter leads by status">
                {tabs.map(([name, count]) => (
                    <button
                        key={name}
                        role="tab"
                        aria-selected={filter === name}
                        onClick={() => setFilter(name)}
                        className={`px-4 py-2 rounded-lg font-inter text-sm font-semibold border transition-colors ${filter === name ? 'bg-evio-navy text-white border-evio-navy' : 'bg-white text-evio-black/60 border-gray-200 hover:text-evio-navy'}`}
                    >
                        {name} <span className="ml-1 opacity-60">{count}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {shown.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p className="font-inter text-evio-black/50">No leads in this stage.</p>
                    </div>
                ) : (
                    shown.map(inq => (
                        <LeadCard key={inq.id} inq={inq} onUpdate={updateInquiry} onDelete={deleteInquiry} onDownload={downloadInquiryAttachment} />
                    ))
                )}
            </div>
        </div>
    );
};
