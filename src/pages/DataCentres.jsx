import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Cable, Fuel, BatteryCharging, Rows3, ShieldCheck, ClipboardCheck, Truck, ArrowRight, MapPin, HardHat, Download } from 'lucide-react';
import {
    DC_HEADLINE_STATS, DC_CITIES, DC_FOOTPRINT, DC_PROGRAMMES, DC_CAPABILITIES, DC_QA_STEPS, SAFETY_BY_YEAR,
} from '../data/dataCentresData';

const CAPABILITY_ICONS = [Zap, Cable, Fuel, BatteryCharging, Rows3, ShieldCheck, ClipboardCheck, Truck];
const QUOTE_LINK = '/contact?type=Data Center&ref=data-centres';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5 },
};

const SectionTitle = ({ eyebrow, title, children, light }) => (
    <motion.div {...fadeUp} className="max-w-3xl mb-12">
        <p className="text-sm font-inter font-bold text-evio-blue uppercase tracking-widest mb-3">{eyebrow}</p>
        <h2 className={`text-3xl md:text-5xl font-syne font-bold mb-4 ${light ? 'text-white' : 'text-evio-navy'}`}>{title}</h2>
        {children && <p className={`font-inter text-lg leading-relaxed ${light ? 'text-white/70' : 'text-evio-black/60'}`}>{children}</p>}
    </motion.div>
);

export const DataCentres = () => {
    const [filter, setFilter] = useState('All');
    const shown = filter === 'All' ? DC_PROGRAMMES : DC_PROGRAMMES.filter(p => p.status === filter);
    const mw = (status) => DC_PROGRAMMES.filter(p => !status || p.status === status).reduce((s, p) => s + p.capacityMW, 0);
    const maxHours = Math.max(...SAFETY_BY_YEAR.map(y => y.manHours));

    return (
        <div className="w-full flex flex-col bg-white">
            <Helmet>
                <title>Data Centre Electrical Contractor in India | HT/LT Turnkey Works | EVIO</title>
                <meta name="description" content="EVIO delivers turnkey HT/LT electrical works for hyperscale and colocation data centres across Mumbai, Pune, Hyderabad and 7 more cities. 295 MW worked on, zero LTI in five years." />
            </Helmet>

            {/* 1. Hero */}
            <section className="relative w-full pt-36 pb-24 md:pt-44 md:pb-32 bg-gradient-to-br from-[#051a15] via-[#0b2b23] to-[#031511] overflow-hidden">
                <img src="/images/projects/real/data-centre.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#051a15] via-[#051a15]/80 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block text-xs font-inter font-bold uppercase tracking-[0.2em] text-[#4ade80] border border-[#4ade80]/30 rounded-full px-4 py-1.5 mb-6">
                        Data Centre Vertical
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-syne font-bold text-white mb-6 max-w-4xl leading-[1.05]">
                        Electrical infrastructure for mission-critical data centres
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-white/70 font-inter max-w-2xl mb-10">
                        Turnkey high-side and low-side electrical works for hyperscale and colocation data centres across India, from HT intake to UPS output, aligned to TIA-942 and Uptime Institute guidelines.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                        <Link to={QUOTE_LINK} className="inline-flex items-center justify-center px-8 py-4 bg-evio-blue text-white font-inter font-bold rounded-xl hover:bg-white hover:text-evio-navy transition-colors">
                            Discuss your data centre project <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/downloads" className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white font-inter font-bold rounded-xl hover:bg-white/10 transition-colors">
                            Company brochure <Download className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. Numbers strip */}
            <section className="relative z-10 -mt-12 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {DC_HEADLINE_STATS.map((s, i) => (
                        <motion.div key={s.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}
                            className={`bg-white rounded-2xl p-6 shadow-evio-card border border-evio-black/5 ${i === DC_HEADLINE_STATS.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
                            <div className="text-2xl md:text-3xl font-syne font-bold text-evio-navy mb-1">{s.value}</div>
                            <div className="text-sm font-inter text-evio-black/60 leading-snug">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
                <p className="max-w-6xl mx-auto mt-6 text-center text-sm font-inter font-semibold text-evio-navy/70">
                    ISO 9001:2015 &amp; ISO 45001:2018 certified
                </p>
            </section>

            {/* 3. About */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
                    <SectionTitle eyebrow="About the vertical" title="No weak link in the power chain" />
                    <motion.div {...fadeUp} className="space-y-5 font-inter text-evio-black/70 text-lg leading-relaxed">
                        <p>Data centres cannot afford a weak link in their power chain. EVIO Private Limited has delivered electrical turnkey projects since 2011, and data centres are now a dedicated vertical of the business.</p>
                        <p>Our teams handle high-side and low-side electrical works: HT and LT panels, cabling, isolation transformers, DG sets and fuel systems, UPS, busduct, earthing and lightning protection, through to testing and commissioning support.</p>
                        <p>We work to the client's Tier design, follow TIA-942 and Uptime Institute guidelines, and back every site with a standard QA/QC process, supported by in-house BIM capability and specialist design consultants where a project needs them.</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {DC_CITIES.map(c => (
                                <span key={c} className="inline-flex items-center text-sm bg-evio-light-gray text-evio-navy px-3 py-1.5 rounded-full">
                                    <MapPin className="w-3.5 h-3.5 mr-1 text-evio-blue" />{c}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footprint */}
            <section className="pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <SectionTitle eyebrow="Pan-India footprint" title="Data centre footprint across India">
                        {`7 data centre clients across ${DC_CITIES.length} cities: 4 programmes completed, 3 in progress.`}
                    </SectionTitle>
                    <div className="rounded-2xl overflow-hidden border border-evio-black/10">
                        <table className="w-full font-inter text-left">
                            <thead className="bg-evio-navy text-white">
                                <tr><th className="px-5 py-4 font-bold">City</th><th className="px-5 py-4 font-bold">Data centre programmes</th></tr>
                            </thead>
                            <tbody>
                                {DC_FOOTPRINT.map((row, i) => (
                                    <tr key={row.city} className={i % 2 ? 'bg-evio-light-gray' : 'bg-white'}>
                                        <td className="px-5 py-4 font-bold text-evio-navy align-top">
                                            <span className={`inline-block w-2.5 h-2.5 rounded-full mr-3 ${row.inProgress ? 'bg-amber-500' : 'bg-evio-blue'}`} aria-hidden="true" />
                                            {row.city}
                                        </td>
                                        <td className="px-5 py-4 text-evio-black/70">{row.programmes.join(' · ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-sm font-inter text-evio-black/50 flex flex-wrap gap-x-6 gap-y-1">
                        <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-evio-blue mr-2" />Completed</span>
                        <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />Includes work in progress</span>
                    </p>
                </div>
            </section>

            {/* 4. Capabilities */}
            <section className="py-24 px-6 bg-evio-light-gray">
                <div className="max-w-6xl mx-auto">
                    <SectionTitle eyebrow="Capabilities" title="From HT intake to UPS output" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {DC_CAPABILITIES.map((c, i) => {
                            const Icon = CAPABILITY_ICONS[i];
                            return (
                                <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                                    className="bg-white rounded-2xl p-6 border border-evio-black/5 hover:shadow-evio-card transition-shadow">
                                    <div className="w-11 h-11 rounded-xl bg-evio-blue/10 text-evio-blue flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                                    <h3 className="font-syne font-bold text-lg text-evio-navy mb-2">{c.title}</h3>
                                    <p className="font-inter text-sm text-evio-black/60 leading-relaxed">{c.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. Portfolio */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <SectionTitle eyebrow="Project portfolio" title="Selected data centre programmes">
                        {`Seven programmes listed here: ${mw()} MW, of which ${mw('Completed')} MW completed and ${mw('Ongoing')} MW ongoing.`}
                    </SectionTitle>
                    <div className="flex gap-2 mb-8" role="tablist" aria-label="Filter by status">
                        {['All', 'Completed', 'Ongoing'].map(f => (
                            <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full font-inter font-bold text-sm transition-colors ${filter === f ? 'bg-evio-navy text-white' : 'bg-evio-light-gray text-evio-black/60 hover:text-evio-navy'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {shown.map(p => {
                            const card = (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-xs font-inter font-bold uppercase tracking-widest text-evio-blue">{p.client}</span>
                                        <span className={`text-[11px] font-inter font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${p.status === 'Completed' ? 'bg-evio-blue/10 text-evio-blue' : 'bg-amber-100 text-amber-800'}`}>{p.status}</span>
                                    </div>
                                    <div className="text-4xl font-syne font-bold text-evio-navy mb-1">{p.capacity.split(' (')[0]}</div>
                                    {p.capacity.includes('(') && <div className="text-sm font-inter text-evio-black/50 mb-3">{p.capacity.slice(p.capacity.indexOf('('))}</div>}
                                    <div className="mt-auto pt-4 border-t border-evio-black/5 font-inter text-sm text-evio-black/70 flex items-start">
                                        <MapPin className="w-4 h-4 mr-1.5 mt-0.5 shrink-0 text-evio-blue" />{p.location}
                                    </div>
                                    {p.hasDetail && <div className="mt-3 text-xs font-bold uppercase tracking-widest text-evio-blue">View case study →</div>}
                                </>
                            );
                            const cls = 'flex flex-col h-full rounded-2xl p-6 border border-evio-black/10 hover:border-evio-blue/40 hover:shadow-evio-card transition-all';
                            return p.hasDetail
                                ? <Link key={p.id} to={`/projects/${p.id}`} className={cls}>{card}</Link>
                                : <div key={p.id} className={cls}>{card}</div>;
                        })}
                    </div>
                </div>
            </section>

            {/* 6. Case study */}
            <section className="py-24 px-6 bg-evio-navy">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div {...fadeUp} className="rounded-3xl overflow-hidden aspect-[4/3] bg-white/5">
                        <img src="/images/projects/real/data-centre.jpg" alt="EVIO data centre electrical works" loading="lazy" className="w-full h-full object-cover" />
                    </motion.div>
                    <div>
                        <SectionTitle eyebrow="Featured case study" title="AdaniConneX, Pune" light>
                            A 48 MW colocation campus where EVIO delivers high-side and low-side electrical works over a 24-month programme.
                        </SectionTitle>
                        <dl className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden mb-8 font-inter">
                            {[['Capacity', '48 MW (5 × 9.6 MW)'], ['Timeline', '24 months'], ['Scope', 'HT & LT electrical'], ['Compliance', 'Full statutory approvals']].map(([k, v]) => (
                                <div key={k} className="bg-evio-navy p-4">
                                    <dt className="text-xs uppercase tracking-widest text-white/40 mb-1">{k}</dt>
                                    <dd className="text-white font-semibold">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="font-inter text-white/70 leading-relaxed mb-8">
                            HT and LT cabling, isolation transformers, a large number of light fixtures and street-light poles, point wiring, extensive earthing and a lightning protection system, delivered with full statutory compliance and the required government approvals.
                        </p>
                        <Link to="/projects/adani-connex-pune" className="inline-flex items-center font-inter font-bold text-[#4ade80] hover:text-white transition-colors">
                            Read the full case study <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. Standards & QA */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    <div>
                        <SectionTitle eyebrow="Engineering standards" title="Built to your Tier design">
                            Every installation follows the client's Tier design and is checked stage by stage through a fixed QA/QC sequence.
                        </SectionTitle>
                        <ul className="space-y-3 font-inter text-evio-black/70">
                            {['ISO 9001:2015 quality management', 'ISO 45001:2018 occupational health & safety', 'TIA-942 and Uptime Institute guidelines on every data centre installation', 'ASHRAE standards for HVAC-related work', 'In-house engineering team and BIM modelling, with specialist design consultants where needed'].map(t => (
                                <li key={t} className="flex items-start"><ShieldCheck className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-evio-blue" />{t}</li>
                            ))}
                        </ul>
                    </div>
                    <motion.ol {...fadeUp} className="space-y-4">
                        {DC_QA_STEPS.map((step, i) => (
                            <li key={step} className="flex gap-4 bg-evio-light-gray rounded-2xl p-5">
                                <span className="font-syne font-bold text-2xl text-evio-blue w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                <span className="font-inter text-evio-black/80">{step}</span>
                            </li>
                        ))}
                    </motion.ol>
                </div>
            </section>

            {/* 8. Safety */}
            <section className="py-24 px-6 bg-evio-light-gray">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-end">
                    <div>
                        <SectionTitle eyebrow="Safety record" title="Safety is measured, not assumed">
                            Across five years and more than 1.9 crore safe man-hours, EVIO has recorded zero lost-time injuries and zero fatalities. Our teams logged 3.6 lakh+ training hours and reported over 85,000 unsafe acts and conditions, because every observation raised is a risk removed.
                        </SectionTitle>
                        <div className="flex items-center gap-4 bg-evio-navy text-white rounded-2xl p-6">
                            <HardHat className="w-10 h-10 text-[#4ade80] shrink-0" />
                            <p className="font-syne font-bold text-xl">0 lost-time injuries · 0 major incidents · 0 fatalities · 0 fires</p>
                        </div>
                        <p className="mt-3 text-xs font-inter text-evio-black/50">Company-wide figures, FY2020-21 to FY2024-25.</p>
                    </div>
                    <motion.figure {...fadeUp} className="bg-white rounded-3xl p-6 md:p-8 border border-evio-black/5">
                        <figcaption className="font-inter font-bold text-evio-navy mb-6">Safe man-hours per year (lakh)</figcaption>
                        <div className="flex items-end gap-3 md:gap-5 h-64" role="img" aria-label={SAFETY_BY_YEAR.map(y => `${y.year}: ${(y.manHours / 1e5).toFixed(1)} lakh`).join(', ')}>
                            {SAFETY_BY_YEAR.map(y => (
                                <div key={y.year} className="flex-1 flex flex-col items-center justify-end h-full">
                                    <span className="text-sm font-inter font-bold text-evio-navy mb-2">{(y.manHours / 1e5).toFixed(1)}</span>
                                    <motion.div
                                        style={{ height: `${(y.manHours / maxHours) * 85}%`, transformOrigin: 'bottom' }}
                                        initial={{ scaleY: 0 }}
                                        whileInView={{ scaleY: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="w-full rounded-t-lg bg-evio-blue"
                                    />
                                    <span className="text-xs font-inter text-evio-black/50 mt-2">{y.year}</span>
                                </div>
                            ))}
                        </div>
                    </motion.figure>
                </div>
            </section>

            {/* 9. CTA */}
            <section className="py-24 px-6 bg-evio-navy text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-syne font-bold text-white mb-6">Planning a data hall, campus or expansion?</h2>
                    <p className="text-white/70 font-inter text-lg mb-10">Share your single-line diagram, BOQ or tender. Our data centre team will come back within one working day.</p>
                    <Link to={QUOTE_LINK} className="inline-flex items-center justify-center px-8 py-4 bg-evio-blue text-white font-inter font-bold rounded-xl hover:bg-white hover:text-evio-navy transition-colors">
                        Discuss your data centre project <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};
