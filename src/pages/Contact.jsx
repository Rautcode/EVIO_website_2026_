import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { leadSource, track } from '../lib/leads';
import { PageHero } from '../components/ui/PageHero';
import { SpamGuardFields } from '../components/ui/SpamGuardFields';


// Source: evio.in/reach-us (verified 14 Oct 2026). `tel` is the dialable number for click-to-call.
const offices = [
    {
        id: 'hq',
        city: 'Mumbai (HQ)',
        address: 'Plot No. A10, Cross Road B, MIDC Industrial Area, Marol, Andheri (E), Mumbai – 400 093',
        phone: '+91 22 4576 6700',
        tel: '+912245766700',
        email: 'mumbai@evio.in',
        type: 'Headquarters',
        mapLink: 'https://maps.google.com/?q=Plot+A10+Cross+Road+B+MIDC+Marol+Andheri+East+Mumbai+400093'
    },
    {
        id: 'pune',
        city: 'Pune',
        address: '403, 4th Floor, Gheewala Complex, Station Road, Near Tata Motors, Chinchwad, Pune – 411 033',
        phone: '+91 20 2735 0104 / 105',
        tel: '+912027350104',
        email: 'mumbai@evio.in',
        type: 'Regional Office',
        mapLink: 'https://maps.google.com/?q=Gheewala+Complex+Station+Road+Chinchwad+Pune+411033'
    },
    {
        id: 'bengaluru',
        city: 'Bengaluru',
        address: "No. 246/5, 14th 'A' Main Road, 3rd Cross, HMT Layout, Mathikere, Bengaluru – 560 054",
        phone: '+91 80 2337 7878 / +91 93437 36878',
        tel: '+918023377878',
        email: 'mumbai@evio.in',
        type: 'Regional Office',
        mapLink: 'https://maps.google.com/?q=246%2F5+14th+A+Main+Road+HMT+Layout+Mathikere+Bengaluru+560054'
    }
];

export const Contact = () => {

    // Project/service pages link here as /contact?type=<projectType>&ref=<page>
    const [searchParams] = useSearchParams();
    const ref = searchParams.get('ref') || '';
    const emptyForm = { name: '', company: '', email: '', phone: '', projectType: searchParams.get('type') || '', message: '' };
    const [formData, setFormData] = useState(emptyForm);
    const fileInput = useRef(null);

    // Arriving from a "Request a Quote" button: jump straight to the form
    useEffect(() => {
        if (ref) document.getElementById('application-form')?.scrollIntoView();
    }, [ref]);
    const [status, setStatus] = useState({ loading: false, success: false, error: false, errorMsg: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: false, errorMsg: '' });

        const submitData = new FormData();
        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        submitData.append('source', leadSource(ref));
        submitData.append('formToken', e.target.formToken.value);
        submitData.append('website', e.target.website.value);
        if (fileInput.current?.files[0]) submitData.append('file', fileInput.current.files[0]);

        try {
            const res = await fetch('/api/rfq', {
                method: 'POST',
                body: submitData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'API request failed');
            }

            track('generate_lead', { form: 'rfq', project_type: formData.projectType });
            setStatus({ loading: false, success: true, error: false, errorMsg: '' });
            setFormData({ ...emptyForm, projectType: '' });
            if (fileInput.current) fileInput.current.value = '';
            
            setTimeout(() => setStatus({ loading: false, success: false, error: false, errorMsg: '' }), 6000);
        } catch (err) {
            console.error(err);
            setStatus({ loading: false, success: false, error: true, errorMsg: err.message });
        }
    };

    return (
        <div className="w-full flex flex-col min-h-screen bg-white selection:bg-evio-blue selection:text-white">
            <Helmet>
                <title>Contact Us & Office Locations | EVIO</title>
                <meta name="description" content="Get in touch with EVIO's corporate headquarters in Mumbai or our regional engineering offices in Pune and Bengaluru." />
            </Helmet>

            {/* Standardized Hero matching About & Careers */}
            <PageHero eyebrow="Contact" title="Talk to our engineering team" subtitle="Turnkey electrical, automation or data centre work: tell us about your project and we will respond within one working day." image="/images/life/A.jpg" />

            {/* Unified Light Card Design Location Grid */}
            <section className="py-24 px-6 relative z-10 bg-evio-light-gray border-b border-evio-black/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Our Operations</h2>
                        <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy">Regional Expertise</h3>
                    </div>

                    <div className="offices-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offices.map((office) => (
                            <div
                                key={office.id}
                                className="office-card group flex flex-col h-full bg-white border border-evio-black/5 hover:border-evio-blue/30 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:text-evio-blue group-hover:opacity-10 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:-translate-y-0">
                                    <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-evio-navy/5 flex items-center justify-center text-evio-blue group-hover:scale-110 group-hover:bg-evio-blue/10 transition-all duration-500">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-syne font-bold text-xl text-evio-navy group-hover:text-evio-blue transition-colors duration-300">{office.city}</h3>
                                            <span className="text-xs font-inter font-medium uppercase tracking-[0.15em] text-evio-black/40">
                                                {office.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 relative z-10">
                                    <p className="text-evio-black/70 font-inter text-sm leading-relaxed mb-8">
                                        {office.address}
                                    </p>
                                </div>

                                <div className="space-y-4 font-inter text-sm pt-6 border-t border-evio-black/10 relative z-10">
                                    <a href={`tel:${office.tel}`} className="flex items-center text-evio-black/70 hover:text-evio-navy transition-colors group/link">
                                        <div className="w-8 h-8 rounded-full bg-evio-navy/5 flex items-center justify-center mr-3 group-hover/link:bg-evio-blue/10 group-hover/link:text-evio-blue transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <span className="font-medium tracking-wide">{office.phone}</span>
                                    </a>

                                    <a href={`mailto:${office.email}`} className="flex items-center text-evio-black/70 hover:text-evio-navy transition-colors group/link">
                                        <div className="w-8 h-8 rounded-full bg-evio-navy/5 flex items-center justify-center mr-3 group-hover/link:bg-evio-blue/10 group-hover/link:text-evio-blue transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span className="font-medium tracking-wide">{office.email}</span>
                                    </a>

                                    <div className="pt-2">
                                        <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-evio-blue hover:text-evio-navy transition-colors group/btn">
                                            <span>Get Directions</span>
                                            <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clean Corporate Application-Style Form */}
            <section id="application-form" className="form-section pt-24 pb-32 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-syne font-bold text-evio-navy mb-4">Get in Touch</h2>
                        <p className="text-evio-black/60 font-inter max-w-2xl mx-auto">Submit your project inquiry or requirement details below. Our engineering team will review and respond within 24 hours to discuss the next steps.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-evio-light-gray rounded-[24px] p-8 md:p-12 shadow-sm border border-evio-black/5">
                        <SpamGuardFields />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required minLength="2" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Company / Organization</label>
                                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="EVIO Global" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Corporate Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="^\+?[0-9\-\s\(\)]+$" minLength="10" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Service of Interest *</label>
                            <select name="projectType" value={formData.projectType} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all bg-white text-evio-navy">
                                <option value="" disabled>Select category...</option>
                                <option value="Data Center">Data Center / Mission Critical</option>
                                <option value="Industrial Automation">Industrial Automation</option>
                                <option value="Electrical EPC">Electrical EPC</option>
                                <option value="Building Automation">Building Automation / IBMS</option>
                                <option value="General Engineering">General Engineering</option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Message Details *</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all resize-none" placeholder="Please describe your requirements..."></textarea>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Attach BOQ / Drawings / Tender (optional)</label>
                            <input ref={fileInput} type="file" name="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 bg-white text-sm font-inter text-evio-black/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-evio-blue/10 file:text-evio-blue file:font-semibold" />
                            <p className="text-xs text-evio-black/50 font-inter mt-2">PDF, Word or Excel, up to 10 MB.</p>
                        </div>

                        <button type="submit" disabled={status.loading} className="w-full bg-evio-blue text-white font-inter font-bold text-lg py-4 rounded-xl hover:bg-evio-navy transition-colors shadow-lg shadow-evio-blue/20 disabled:opacity-50 flex items-center justify-center gap-3">
                            {status.loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Transmitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Inquiry</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {status.success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="text-green-700 font-inter text-sm text-center font-medium bg-green-50 py-4 px-6 rounded-lg border border-green-200">
                                        <p className="font-bold text-base mb-1">Inquiry successfully transmitted.</p>
                                        <p>Our team will be in touch shortly.</p>
                                    </div>
                                </motion.div>
                            )}
                            {status.error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-red-500 font-inter text-sm text-center bg-red-50 py-4 px-6 rounded-lg border border-red-200">Transmission failed: {status.errorMsg || 'Please verify your connection or try again later.'}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </section>
        </div>
    );
};
