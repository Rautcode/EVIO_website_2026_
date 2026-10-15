import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';



import { DataContext } from '../context/DataContext';
import { leadSource, track } from '../lib/leads';
import { PageHero } from '../components/ui/PageHero';
import { SpamGuardFields } from '../components/ui/SpamGuardFields';

const UNLOCK_KEY = 'evio_downloads_unlocked';
const isUnlocked = () => { try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch { return false; } };

const startDownload = (item) => {
    const a = document.createElement('a');
    a.href = item.file;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
    track('file_download', { file_name: item.name });
};

export const Downloads = () => {
    const { downloadCategories } = useContext(DataContext);

    // Lead gate: first download asks for contact details, later ones go straight through.
    const [pendingItem, setPendingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleDownload = (e, item) => {
        e.preventDefault();
        if (isUnlocked()) startDownload(item);
        else setPendingItem(item);
    };

    const handleGateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = Object.fromEntries(new FormData(e.target));
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    projectType: 'Brochure Download',
                    message: `Downloaded: ${pendingItem.name}`,
                    source: leadSource(`download:${pendingItem.name}`),
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            track('generate_lead', { form: 'download_gate', file_name: pendingItem.name });
        } catch (err) {
            console.error('Download lead not saved:', err); // never block the download on this
        }
        try { localStorage.setItem(UNLOCK_KEY, '1'); } catch { /* storage blocked */ }
        startDownload(pendingItem);
        setPendingItem(null);
        setSubmitting(false);
    };

    const inputClass = 'w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all';

    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray">
            <Helmet>
                <title>Downloads &amp; Resource Center | EVIO</title>
                <meta name="description" content="Access EVIO Private Limited's resource center to download corporate brochures, quality policy documents, safety certifications, and project profiles." />
            </Helmet>
            
            {/* Hero */}
            <PageHero eyebrow="Resources" title="Brochure & resources" subtitle="Download the EVIO company brochure and project resources." image="/images/projects/real/data-centre.jpg" />

            {/* Downloads List */}
            <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto w-full downloads-container">
                <div className="space-y-16">
                    {downloadCategories.map((category, idx) => (
                        <div key={idx} className="download-group bg-white rounded-[24px] p-8 md:p-12 shadow-sm hover:shadow-lg transition-shadow duration-500 border border-evio-black/5">
                            <h2 className="text-3xl font-syne font-bold text-evio-navy mb-8 pb-6 border-b border-evio-black/5 flex items-center">
                                <span className="w-10 h-10 rounded-full bg-evio-blue/10 flex items-center justify-center mr-4 text-evio-blue">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                {category.title}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {category.items.map((item, itemIdx) => (
                                    <div 
                                        key={itemIdx} 
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl bg-evio-light-gray/50 hover:bg-evio-blue hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:shadow-md" 
                                        onClick={(e) => handleDownload(e, item)}
                                    >
                                        <div className="flex items-start mb-4 sm:mb-0">
                                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shrink-0 text-evio-blue group-hover:text-evio-navy transition-colors shadow-sm">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-syne font-bold text-lg text-evio-navy group-hover:text-white transition-colors">{item.name}</h3>
                                                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-inter text-evio-black/50 group-hover:text-white/80 mt-2 transition-colors">
                                                    <span className="bg-white/50 group-hover:bg-white/20 px-2 py-0.5 rounded font-bold tracking-wider">{item.format}</span>
                                                    <span>{item.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:opacity-0 group-hover:opacity-100 flex items-center justify-center w-10 h-10 rounded-full bg-white text-evio-blue transition-all shrink-0 shadow-sm ml-auto">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <AnimatePresence>
                {pendingItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-evio-navy/70 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => !submitting && setPendingItem(null)}
                        data-lenis-prevent
                    >
                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            onSubmit={handleGateSubmit}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="download-gate-title"
                            className="w-full max-w-md bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <SpamGuardFields />
                            <div className="flex justify-between items-start mb-2">
                                <h2 id="download-gate-title" className="font-syne font-bold text-2xl text-evio-navy">Get the document</h2>
                                <button type="button" onClick={() => setPendingItem(null)} aria-label="Close" className="text-evio-black/40 hover:text-evio-navy text-2xl leading-none">&times;</button>
                            </div>
                            <p className="text-sm font-inter text-evio-black/60 mb-6">
                                Tell us where to send updates and your download of <strong className="text-evio-navy">{pendingItem.name}</strong> starts right away.
                            </p>
                            <div className="space-y-4">
                                <input name="name" required minLength="2" autoComplete="name" placeholder="Full name *" className={inputClass} autoFocus />
                                <input name="email" type="email" required autoComplete="email" placeholder="Work email *" className={inputClass} />
                                <input name="company" autoComplete="organization" placeholder="Company" className={inputClass} />
                                <input name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={inputClass} />
                            </div>
                            <button type="submit" disabled={submitting} className="mt-6 w-full bg-evio-blue text-white font-inter font-bold py-3.5 rounded-xl hover:bg-evio-navy transition-colors disabled:opacity-50">
                                {submitting ? 'Preparing...' : 'Download'}
                            </button>
                            <p className="text-xs text-evio-black/40 font-inter mt-4 text-center">
                                We'll only use this to follow up on your enquiry. See our <a href="/privacy" className="underline">privacy policy</a>.
                            </p>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
