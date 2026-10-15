import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GPTWBadge } from '../components/ui/GPTWBadge';
import { Helmet } from 'react-helmet-async';


import { clientsData } from '../data/clientsData';
import { PageHero } from '../components/ui/PageHero';
import { testimonials } from '../data/testimonials';

export const ClientsAndTestimonials = () => {
    const categoriesList = Object.keys(clientsData);
    const [activeCategory, setActiveCategory] = useState(categoriesList[0]);


    // Animate logos grid on category changes

    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray">
            <Helmet>
                <title>Clients &amp; Testimonials | EVIO Private Limited</title>
                <meta name="description" content="Read reviews, case testimonials, and trusted endorsements from leading brands across India who choose EVIO for turnkey electrical and automation engineering." />
            </Helmet>

            {/* 1. Hero / Trust Header - Standardized to Dark Theme Navy */}
            {/* Rich Green Gradient Hero */}
            <PageHero eyebrow="Clients" title="Our clients & partners" subtitle="Since 2011, India's leading enterprises have relied on EVIO to deliver on schedule, safely, and to specification." image="/images/projects/real/iit-hyderabad.jpg">
                <div className="mt-8"><GPTWBadge className="h-28 w-auto" /></div>
            </PageHero>

            {/* 2. Dynamic Split Client Logos Directory - Light Theme */}
            <section className="pt-24 pb-24 px-6 bg-evio-light-gray">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Client Portfolio</h2>
                        <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy">Industry Leaders We Serve</h3>
                    </div>

                    {/* Responsive Category Selector */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-12">
                        
                        {/* Sidebar Category list for Desktop */}
                        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-evio-black/5 shadow-sm sticky top-28 max-h-[70vh] overflow-y-auto hidden lg:block">
                            <h4 className="font-syne font-bold text-lg text-evio-navy mb-4 pb-2 border-b border-evio-black/5">Sectors</h4>
                            <div className="space-y-1.5">
                                {categoriesList.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl font-inter font-medium text-sm transition-all duration-200 flex justify-between items-center ${activeCategory === cat ? 'bg-evio-blue text-white shadow-sm font-bold scale-[1.02]' : 'text-evio-black/60 hover:bg-evio-light-gray/60 hover:text-evio-navy'}`}
                                    >
                                        <span className="truncate pr-2">{cat}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-evio-light-gray text-evio-black/40'}`}>
                                            {clientsData[cat].length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dropdown Category Selector for Mobile */}
                        <div className="lg:hidden w-full mb-6">
                            <label htmlFor="category-select" className="block text-xs font-bold font-inter text-evio-black/40 uppercase tracking-widest mb-2">Select Sector</label>
                            <select
                                id="category-select"
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="w-full bg-white border border-evio-black/10 rounded-xl px-4 py-3 font-inter font-bold text-evio-navy text-sm shadow-sm focus:outline-none focus:border-evio-blue"
                            >
                                {categoriesList.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat} ({clientsData[cat].length})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Logos Grid Section */}
                        <div className="lg:col-span-3 min-h-[400px]">
                            <div className="bg-white rounded-3xl p-8 border border-evio-black/5 shadow-sm min-h-[400px]">
                                <h4 className="font-syne font-bold text-xl text-evio-navy mb-8 pb-3 border-b border-evio-black/5 flex items-center justify-between">
                                    <span>{activeCategory}</span>
                                    <span className="text-xs font-inter font-normal text-evio-black/45">
                                        Showing {clientsData[activeCategory].length} {clientsData[activeCategory].length === 1 ? 'partner' : 'partners'}
                                    </span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {clientsData[activeCategory].map((logo, idx) => (
                                            <motion.div
                                                key={`${activeCategory}-${idx}`}
                                                className="logo-item-wrapper bg-white rounded-3xl p-6 flex items-center justify-center h-36 md:h-44 border border-evio-black/5 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(14,145,56,0.1)] hover:border-evio-blue/30 transition-all duration-300 group cursor-default"
                                            >
                                                {logo.startsWith('http') || logo.startsWith('/') ? (
                                                    <img
                                                        src={logo}
                                                        alt={`${activeCategory} Partner logo`}
                                                        loading="lazy"
                                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
                                                    />
                                                ) : (
                                                    <span className="font-syne font-bold text-lg md:text-xl text-evio-navy text-center">{logo}</span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. Testimonials / Words of Trust - Light Theme */}
            <section className="pt-32 pb-32 bg-white px-6 overflow-hidden border-t border-evio-black/5">
                <div className="max-w-7xl mx-auto relative">
                    <div className="absolute -top-10 -left-10 text-[200px] text-evio-light-gray font-syne leading-none select-none">"</div>

                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Testimonials</h2>
                        <h3 className="text-4xl md:text-5xl font-syne font-bold text-evio-navy">Words of Trust</h3>
                    </div>

                    <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {testimonials.map((test, idx) => (
                            <div key={idx} className="testimonial-card bg-evio-light-gray border border-evio-black/5 rounded-[24px] p-8 flex flex-col h-full hover:border-evio-blue/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                                <div className="text-evio-blue mb-6">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                                        <path d="M10.003 6.002c-4.385 0-7.94 3.555-7.94 7.94 0 2.508 1.173 4.743 3 6.186v5.87h5.87c1.442 1.826 3.677 3 6.185 3 4.386 0 7.941-3.555 7.941-7.94 0-4.386-3.555-7.94-7.94-7.94z" opacity=".2" />
                                        <path d="M13.444 14.333c0 2.454-1.99 4.444-4.444 4.444s-4.444-1.99-4.444-4.444 1.99-4.444 4.444-4.444 4.444 1.99 4.444 4.444zm14 0c0 2.454-1.99 4.444-4.444 4.444s-4.444-1.99-4.444-4.444 1.99-4.444 4.444-4.444 4.444 1.99 4.444 4.444z" />
                                    </svg>
                                </div>
                                <p className="text-evio-black/70 font-inter leading-relaxed mb-8 flex-grow text-[15px]">
                                    "{test.quote}"
                                </p>
                                <div className="pt-6 border-t border-evio-black/10 mt-auto">
                                    <h4 className="font-syne font-bold text-evio-navy text-lg">{test.client}</h4>
                                    <p className="text-evio-black/50 text-xs font-inter font-bold tracking-wider uppercase mt-1">{test.project}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

