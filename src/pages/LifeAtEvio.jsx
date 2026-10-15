import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GPTWBadge } from '../components/ui/GPTWBadge';
import { Helmet } from 'react-helmet-async';
import { PageHero } from '../components/ui/PageHero';

gsap.registerPlugin(ScrollTrigger);

// Real EVIO event photos (from evio.in/life-evio). Grouped by event; only the 2022 ones are dated.
const L = '/images/life/';
const galleryEvents = [
    { title: 'Annual Function', date: '2022', images: ['af22_1.jpeg', 'af22_2-1200x900.jpeg', 'af22_3-1200x900.jpeg', 'af22_4-1200x900.jpeg'] },
    { title: 'EVIO Premier League (Cricket)', date: 'Feb 2022', images: ['IMG20220212113353.jpg', 'IMG20220212165450.jpg', 'A-5.jpg'] },
    { title: 'Christmas & Secret Santa', date: 'Dec 2022', images: ['A.jpg', 'IMG20221223161310.jpg', 'IMG20221223122517.jpg'] },
    { title: 'Diwali & Festive Celebrations', images: ['A-1.jpg', 'A-2.jpg'] },
    { title: "Women's Day", images: ['A-4.jpg'] },
];

// What EVIO offers, per evio.in/life-evio (statements, not attributed quotes)
const highlights = [
    'A dynamic, fast-paced work environment',
    'Health & wellness programs',
    'Professional development and career growth',
    'Team-building activities and company celebrations',
    'Policies that support work-life balance'
];

export const LifeAtEvio = () => {
    const [activeEvent, setActiveEvent] = useState(galleryEvents[0].title);
    const event = galleryEvents.find(e => e.title === activeEvent);
    const marqueeRef = useRef(null);

    useEffect(() => {

        // Continuous horizontal scroll for quotes
        if (marqueeRef.current) {
            gsap.to(marqueeRef.current, {
                xPercent: -50,
                ease: "none",
                duration: 20,
                repeat: -1,
            });
        }
    }, []);

    return (
        <div className="w-full flex flex-col min-h-screen bg-white">
            <Helmet>
                <title>Life at EVIO | Our Culture &amp; Workplace</title>
                <meta name="description" content="Discover the vibrant culture, benefits, dynamic work environment, and team celebrations at EVIO Private Limited, a Great Place To Work certified company." />
            </Helmet>

            {/* Hero */}
            <PageHero eyebrow="Life @ EVIO" title="More than a workplace" subtitle="The people, celebrations and everyday culture behind our projects." image="/images/life/af22_1.jpeg" />

            {/* 4 Culture Pillars */}
            <section className="culture-pillars pt-32 pb-24 px-6 bg-evio-light-gray relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy mb-4">Our Culture Pillars</h2>
                        <p className="text-lg text-evio-black/70 font-inter">The foundation of our vibrant workplace experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="pillar-card bg-white p-8 rounded-[24px] shadow-sm border border-evio-black/5 hover:-translate-y-2 transition-transform">
                            <div className="w-12 h-12 bg-evio-blue/10 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="font-syne font-bold text-xl text-evio-navy mb-3">Dynamic Work Environment</h3>
                            <p className="text-sm text-evio-black/70 font-inter leading-relaxed">Well-equipped offices with carrom boards and space to unwind between site visits.</p>
                        </div>
                        <div className="pillar-card bg-white p-8 rounded-[24px] shadow-sm border border-evio-black/5 hover:-translate-y-2 transition-transform">
                            <div className="w-12 h-12 bg-evio-blue/10 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <h3 className="font-syne font-bold text-xl text-evio-navy mb-3">Employee Benefits</h3>
                            <p className="text-sm text-evio-black/70 font-inter leading-relaxed">Comprehensive health and wellness programs alongside active, ongoing career development trajectories.</p>
                        </div>
                        <div className="pillar-card bg-white p-8 rounded-[24px] shadow-sm border border-evio-black/5 hover:-translate-y-2 transition-transform">
                            <div className="w-12 h-12 bg-evio-blue/10 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="font-syne font-bold text-xl text-evio-navy mb-3">Work-Life Balance</h3>
                            <p className="text-sm text-evio-black/70 font-inter leading-relaxed">We honor boundaries, maintain reasonable hours, and ensure you have time to recharge with your families.</p>
                        </div>
                        <div className="pillar-card bg-white p-8 rounded-[24px] shadow-sm border border-evio-black/5 hover:-translate-y-2 transition-transform">
                            <div className="w-12 h-12 bg-evio-blue/10 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="font-syne font-bold text-xl text-evio-navy mb-3">Fun & Celebrations</h3>
                            <p className="text-sm text-evio-black/70 font-inter leading-relaxed">From the massive EVIO Premier League to vibrant Diwali celebrations, we take time to party hard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workplace Details */}
            <section className="pt-32 pb-20 px-6 bg-white border-b border-evio-black/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl md:text-3xl font-syne font-bold text-evio-navy mb-6">Environment & Support</h3>
                    <p className="text-evio-black/70 font-inter text-lg leading-relaxed mb-8">
                        Our offices are set up for teams who split their week between the desk and the site. Health and safety come first here, as they do on every project. Benefits include health and wellness programmes, training, and a clear path to grow from site engineer to project lead.
                    </p>
                    <div className="inline-flex items-center justify-center space-x-2 bg-evio-navy px-6 py-3 rounded-full text-white font-syne font-bold">
                        <span>GPTW Certified Workplace</span>
                        <GPTWBadge className="w-auto h-20 md:h-24 ml-4" />
                    </div>
                </div>
            </section>

            {/* Historic Fun Gallery (Tabbed) */}
            <section className="py-24 px-6 bg-evio-light-gray" id="gallery">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy mb-4">Fun @ EVIO Gallery</h2>
                        <p className="text-evio-black/60 font-inter">Real moments from our team celebrations.</p>
                    </div>

                    {/* Timeline Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {galleryEvents.map(e => (
                            <button
                                key={e.title}
                                onClick={() => setActiveEvent(e.title)}
                                className={`px-6 py-2.5 rounded-full font-syne font-bold transition-all duration-300 ${activeEvent === e.title ? 'bg-evio-blue text-white shadow-md' : 'bg-white text-evio-black/50 hover:bg-white/80'}`}
                            >
                                {e.title}
                            </button>
                        ))}
                    </div>

                    {/* Image Grid */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px]">
                        <AnimatePresence mode='popLayout'>
                            {event.images.map((img) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4 }}
                                    key={img}
                                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl"
                                >
                                    <img
                                        src={L + img}
                                        alt={`EVIO ${event.title}`}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-evio-navy/90 via-evio-navy/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h4 className="text-xl font-syne font-bold text-white mb-1 drop-shadow-md">{event.title}</h4>
                                        {event.date && <p className="text-white/80 text-sm font-inter">{event.date}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Employee Quote Strip */}
            <section className="pt-32 pb-12 bg-evio-blue overflow-hidden relative">
                <div className="whitespace-nowrap flex overflow-hidden w-full relative z-10">
                    <div ref={marqueeRef} className="flex gap-16 px-8 items-center shrink-0 w-[200%] max-w-none">
                        {/* Rendered twice so the loop has no gap */}
                        {[...highlights, ...highlights].map((quote, idx) => (
                            <div key={idx} className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-white/50 mr-6 shrink-0" />
                                <span className="text-2xl font-syne font-bold text-white tracking-wide">
                                    {quote}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pt-32 pb-24 bg-evio-navy text-center px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-6">Ready to join our family?</h2>
                    <p className="text-lg text-white/70 font-inter mb-10">Discover open positions across Engineering, Operations, and Management.</p>
                    <Link to="/careers" className="inline-flex items-center justify-center px-8 py-4 bg-white text-evio-navy font-inter font-bold rounded-lg hover:bg-evio-blue hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl">
                        Explore Careers at EVIO
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </section>

        </div>
    );
};
