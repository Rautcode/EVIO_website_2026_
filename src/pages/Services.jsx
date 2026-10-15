import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHero } from '../components/ui/PageHero';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: 'turnkey-electrical',
        title: 'Turnkey Electrical Solutions',
        shortDesc: 'End-to-end HT & LT contracting.',
        description: 'Comprehensive electrical contracting from concept to commissioning for industrial and commercial projects. We handle High Tension (HT) and Low Tension (LT) installations with zero-compromise safety standards.',
        image: '/images/projects/real/flipkart.jpg',
        size: 'large',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    },
    {
        id: 'industrial-automation',
        title: 'Industrial Automation',
        shortDesc: 'PLC, SCADA, DCS integration.',
        description: 'Advanced control systems integration for manufacturing and process industries. We design, program and commission PLC and SCADA systems for production lines.',
        image: '/images/projects/real/escientia.jpg',
        size: 'large',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        id: 'building-automation',
        title: 'Building Automation (BMS)',
        shortDesc: 'HVAC, access, fire & energy.',
        description: 'Smart building integration to monitor and control HVAC, lighting, security, and energy vectors from a unified dashboard.',
        image: '/images/projects/real/jio-world-drive.jpg',
        size: 'medium',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )
    },
    {
        id: 'lighting-automation',
        title: 'Lighting Automation',
        shortDesc: 'DALI/DMX systems & scene control.',
        description: 'Energy-efficient smart lighting solutions tailored for aesthetics and sustainability.',
        image: '/images/projects/real/leela.jpg',
        size: 'medium',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )
    },
    {
        id: 'industrial-iot',
        title: 'Industrial Web IoT',
        shortDesc: 'Real-time dashboards & predictive logic.',
        description: 'Connecting factory floors to the cloud. We build custom dashboards for real-time analytics and predictive maintenance.',
        image: '/images/projects/real/cummins.jpg',
        size: 'medium',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
        )
    },
    {
        id: 'mep',
        title: 'MEP Contracting',
        shortDesc: 'Coordinated Mechanical, Electrical, Plumbing.',
        description: 'Unified execution of all building services to guarantee clash-free installation and optimal performance.',
        image: '/images/projects/real/odisha-secretariat.jpg',
        size: 'medium',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )
    },
    {
        id: 'data-center',
        title: 'Data Centres',
        shortDesc: 'HT/LT electrical for hyperscale & colocation.',
        description: "EVIO builds the electrical backbone of India's data centres: HT/LT systems, DG and UPS installations, busduct and earthing for hyperscale and colocation operators, with zero lost-time injuries in the last five years.",
        image: '/images/projects/real/data-centre.jpg',
        size: 'medium',
        icon: (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
        )
    }
];

export const Services = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    useEffect(() => {
        // Bento Grid Stagger Animation

        // EPC Process Animation
        gsap.utils.toArray('.epc-step').forEach((step, i) => {
        });

    }, []);

    return (
        <div className="w-full flex flex-col min-h-screen bg-white">
            <Helmet>
                <title>Services & Solutions | EVIO Private Limited</title>
                <meta name="description" content="Discover EVIO's premium turnkey electrical solutions, industrial automation, IBMS, lighting control, and MEP contracting services." />
            </Helmet>

            {/* Rich Green Gradient Hero */}
            <PageHero eyebrow="Services" title="What we build" subtitle="HT/LT electrical, automation, building systems and data centre infrastructure, delivered turnkey by one accountable team." image="/images/projects/real/ineos.jpg" />

            {/* Premium Bento Grid - Light Theme Re-write */}
            <section className="pt-24 pb-32 px-6 relative z-20 bg-evio-light-gray">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-16 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold mb-4 text-evio-navy">Core Competencies</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-evio-blue to-[#4ade80] rounded-full mx-auto md:mx-0"></div>
                    </div>

                    <div className="bento-grid grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
                        {services.map((service, index) => {
                            // Calculate column spans based on preset size
                            const colSpan = service.size === 'large' ? 'md:col-span-4 lg:col-span-3' : 'md:col-span-2 lg:col-span-2';

                            return (
                                <Link
                                    to={`/services/${service.id}`}
                                    key={service.id}
                                    className={`bento-item group relative rounded-3xl overflow-hidden border border-evio-black/5 bg-white hover:border-evio-blue/30 transition-all duration-700 hover:shadow-xl hover:-translate-y-2 flex flex-col justify-end p-8 ${colSpan}`}
                                >
                                    {/* Hover Reveal Image Background */}
                                    <div className="absolute inset-0 bg-white z-0"></div>
                                    <div
                                        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700 bg-cover bg-center scale-105 group-hover:scale-100 ease-out"
                                        style={{ backgroundImage: `url(${service.image})` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10 transition-opacity duration-500"></div>

                                    {/* Content (z-20 keeps it above image) */}
                                    <div className="relative z-20 flex flex-col h-full transform transition-transform duration-500">

                                        {/* Icon - Sticks to top right on large, top left on small */}
                                        <div className="absolute top-0 right-0 w-16 h-16 rounded-2xl bg-evio-light-gray flex items-center justify-center border border-evio-black/5 group-hover:bg-evio-blue/10 group-hover:border-evio-blue/30 group-hover:shadow-[0_0_20px_rgba(0,174,239,0.15)] group-hover:scale-110 transition-all duration-500">
                                            <div className="transform transition-transform duration-700 ease-out group-hover:scale-115 group-hover:rotate-[180deg]">
                                                {service.icon}
                                            </div>
                                        </div>

                                        <div className="mt-auto pointer-events-none">
                                            <p className="text-evio-blue font-inter text-sm font-bold tracking-widest uppercase mb-3 opacity-90 transition-opacity">
                                                {service.shortDesc}
                                            </p>
                                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-syne font-bold text-evio-navy mb-4 leading-tight group-hover:text-evio-blue transition-colors duration-300">
                                                {service.title}
                                            </h3>

                                            {/* Description reveals on hover for large cards, always shows on mobile/small */}
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                                                <div className="overflow-hidden">
                                                    <p className="text-evio-black/70 font-inter text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pb-2">
                                                        {service.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Fake Button */}
                                            <div className="mt-6 flex items-center gap-3 text-evio-black/40 group-hover:text-evio-blue transition-colors duration-300">
                                                <span className="font-syne font-bold text-sm tracking-widest uppercase">Explore Solution</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* EPC Process Section - Light Theme */}
            <section className="py-32 px-6 relative bg-white border-t border-evio-black/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Our Methodology</h2>
                        <h3 className="text-4xl md:text-6xl font-syne font-bold text-evio-navy mb-6">The EVIO <span className="text-evio-blue">EPC Edge</span></h3>
                        <p className="text-xl text-evio-black/60 font-inter max-w-3xl mx-auto">We don't just supply equipment. We engineer end-to-end architectures tailored for operational longevity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[60px] left-0 w-full h-[2px] bg-evio-black/5"></div>

                        {/* Step 1 */}
                        <div className="epc-step relative flex flex-col items-center text-center group">
                            <div className="w-32 h-32 rounded-full bg-white border border-evio-blue/30 flex items-center justify-center mb-8 relative z-10 group-hover:shadow-[0_0_40px_rgba(0,174,239,0.15)] transition-shadow duration-500 bg-clip-padding">
                                <span className="text-4xl font-syne font-bold text-evio-navy group-hover:text-evio-blue transition-colors">E</span>
                            </div>
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-4 group-hover:text-evio-blue transition-colors">Engineering</h4>
                            <p className="text-evio-black/60 font-inter leading-relaxed px-4">Detailed design, load calculations, panel drafting, and automation architecture planning.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="epc-step relative flex flex-col items-center text-center group">
                            <div className="w-32 h-32 rounded-full bg-white border border-[#4ade80]/30 flex items-center justify-center mb-8 relative z-10 group-hover:shadow-[0_0_40px_rgba(74,222,128,0.15)] transition-shadow duration-500 bg-clip-padding">
                                <span className="text-4xl font-syne font-bold text-evio-navy group-hover:text-[#4ade80] transition-colors">P</span>
                            </div>
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-4 group-hover:text-[#4ade80] transition-colors">Procurement</h4>
                            <p className="text-evio-black/60 font-inter leading-relaxed px-4">Strategic sourcing of Tier-1 OEMs ensures highest quality components and cost-efficiency.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="epc-step relative flex flex-col items-center text-center group">
                            <div className="w-32 h-32 rounded-full bg-white border border-amber-500/30 flex items-center justify-center mb-8 relative z-10 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-shadow duration-500 bg-clip-padding">
                                <span className="text-4xl font-syne font-bold text-evio-navy group-hover:text-amber-500 transition-colors">C</span>
                            </div>
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-4 group-hover:text-amber-500 transition-colors">Construction</h4>
                            <p className="text-evio-black/60 font-inter leading-relaxed px-4">On-site execution, staged testing and commissioning planned around your operations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Glowing CTA */}
            <section className="py-24 px-6 relative overflow-hidden bg-evio-navy">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl font-syne font-bold text-white mb-8">Ready to upgrade your infrastructure?</h2>
                    <p className="text-xl text-white/70 font-inter mb-10 max-w-2xl text-center">
                        Connect with our engineering experts to discuss your custom automation or electrical requirements.
                    </p>
                    <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-evio-blue text-white hover:bg-white hover:text-evio-navy font-syne font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                        Consult an Expert
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                </div>
            </section>

        </div>
    );
};
