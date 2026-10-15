import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';


// Service id -> projectType option on the Contact form (prefills the RFQ)
const SERVICE_LEAD_TYPE = {
    'turnkey-electrical': 'Electrical EPC',
    'industrial-automation': 'Industrial Automation',
    'industrial-iot': 'Industrial Automation',
    'lighting-automation': 'Building Automation',
    'building-automation': 'Building Automation',
    'mep': 'General Engineering',
};

// Partner logos per service (files in public/brand/partners). Same set as the company brochure.
const PARTNER_LOGOS = {
    'industrial-automation': [['Siemens', 'siemens.png']],
    'lighting-automation': [['Helvar', 'helvar.png']],
    'building-automation': [['Notifier by Honeywell', 'notifier-honeywell.png'], ['Edwards', 'edwards.png'], ['Bosch', 'bosch.svg'], ['Matrix ComSec', 'matrix.png'], ['Hikvision', 'hikvision.svg'], ['D-Link', 'd-link.svg'], ['HID', 'hid.svg']],
    'industrial-iot': [['Altizon', 'altizon.png']],
};

// Service Data Registry
const serviceData = [
    {
        id: 'turnkey-electrical',
        title: 'Turnkey Electrical Solutions',
        image: '/images/projects/real/flipkart.jpg',
        subtitle: 'End-to-end HT & LT electrical contracting from concept to commissioning.',
        whatItIs: 'We offer a comprehensive range of Turnkey Electrical Solutions designed to meet the diverse needs of our clients. Our services are categorized into main areas tailored to address specific challenges, providing total electrification solutions that maximize efficiency and productivity.',
        features: [
            'Power Infrastructure Solutions (Switchyards up to 132KV, Transformers, HT/LT Panels & DGs)',
            'Project Electrification (Internal & external electrical works for industrial and commercial projects)',
            'Illumination Systems (Cabling, streetlight and high mast installations)',
            'Specialized Installations (Clean room, flame-proof installations, instrumentation contracts)',
            'Complete Testing & Handover'
        ],
        industries: ['Pharmaceuticals', 'FMCG', 'Data Centers', 'Manufacturing', 'Commercial Spaces', 'Healthcare', 'Automotive', 'Textiles'],
        process: [
            { step: '01', title: 'Power Infrastructure', desc: 'Providing reliable and efficient power distribution systems including switchyards and panels.' },
            { step: '02', title: 'Project Electrification', desc: 'Delivering total electrification for industrial, commercial, or infrastructure projects.' },
            { step: '03', title: 'Illumination', desc: 'Enhancing visibility, safety, and energy efficiency via structured illumination systems.' },
            { step: '04', title: 'Specialized Setup', desc: 'Tailored installations for unique requirements like clean rooms and flame-proof setups.' }
        ]
    },
    {
        id: 'industrial-automation',
        title: 'Industrial Automation',
        image: '/images/projects/real/escientia.jpg',
        partner: 'Siemens Technology Partner',
        subtitle: 'Factory and process automation for enhanced industrial efficiency.',
        whatItIs: 'The experience gained from a number of local and overseas projects has enabled us to set-up a highly-trained software development team capable of providing our clients with an end-to-end service from the design, engineering and software development, commissioning, through to maintenance and support of any size of industrial automation solution – from mini single user to big and complex automation solutions.',
        features: ['Design & Engineering', 'Software Development', 'PLC & SCADA Commissioning', 'End-to-End Maintenance & Support', 'Process Customization'],
        industries: ['Automobile', 'Chemicals', 'Steel', 'Oil & Gas', 'FMCG', 'Pharmaceuticals', 'Water Treatment', 'Food & Beverage'],
        process: [
            { step: '01', title: 'Process Mapping', desc: 'Understanding your exact production workflows.' },
            { step: '02', title: 'System Architecture', desc: 'Designing the optimal PLC/SCADA control logic.' },
            { step: '03', title: 'Panel Fabrication', desc: 'In-house assembly and rigorous factory acceptance testing.' },
            { step: '04', title: 'Site Integration', desc: 'Deployment planned around your shutdown windows to keep production running.' }
        ]
    },
    {
        id: 'lighting-automation',
        title: 'Lighting Automation',
        image: '/images/projects/real/leela.jpg',
        partner: 'Helvar Technology Partner',
        subtitle: 'Smart lighting systems for energy conservation and perfect ambiance.',
        whatItIs: 'From a single room to a whole building, we design and install lighting control that cuts energy use and sets the right light for each space. Systems can be monitored remotely and connected to your BMS, so lighting responds to daylight, occupancy and schedules.',
        features: ['Digital Addressable Lighting Interface (DALI)', 'Individual Luminaire Control & Scene Setting', 'Wireless Lighting Controls', 'Smartphone & Tablet Integration', 'Comprehensive Building Integration'],
        industries: ['Hospitality & Hotels', 'Commercial Spaces', 'Healthcare', 'Educational Institutions', 'Retail & Malls', 'Corporate Offices', 'Museums & Galleries', 'Public Infrastructure'],
        process: [
            { step: '01', title: 'Lighting Audit', desc: 'Assessing spaces for optimal lux levels and energy savings.' },
            { step: '02', title: 'Network Design', desc: 'Laying out DALI networks so every fitting can be addressed and grouped.' },
            { step: '03', title: 'Installation', desc: 'Integrating sensors, routers, and luminaires.' },
            { step: '04', title: 'Programming', desc: 'Setting custom scenes and automation schedules.' }
        ]
    },
    {
        id: 'building-automation',
        title: 'Building Automation',
        image: '/images/projects/real/jio-world-drive.jpg',
        partner: 'Partnered with Edwards, Honeywell, Notifier, Bosch, Matrix, Hikvision, D-Link, HID',
        subtitle: 'Intelligent systems for efficiency, sustainability, and productivity.',
        whatItIs: 'We engineer, install and commission the systems that run a building: fire detection, BMS, lighting control, CCTV and access control. Tied together on one platform, they cut energy use, make faults visible early and give facility teams one place to manage the site.',
        features: ['Fire Detection & Fire Alarm', 'Building Management System (BMS)', 'Lighting & Dimming Control', 'VESDA, Security & CCTV', 'Access Control & Biometric'],
        industries: ['Real Estate', 'Commercial & IT Parks', 'Data Centers', 'Hospitals', 'Hotels', 'Airports', 'Shopping Malls', 'Smart Campuses'],
        process: [
            { step: '01', title: 'System Architecture', desc: 'Mapping disparate building systems onto a unified topology.' },
            { step: '02', title: 'Controller Setup', desc: 'Deploying DDC controllers and field sensors.' },
            { step: '03', title: 'Software Integration', desc: 'Developing the central graphical user interface (GUI).' },
            { step: '04', title: 'Optimization', desc: 'Fine-tuning sequences for maximum energy efficiency.' }
        ]
    },
    {
        id: 'industrial-iot',
        title: 'Industrial IoT',
        image: '/images/projects/real/cummins.jpg',
        partner: 'Altizon Partner',
        subtitle: 'Real-time visibility and predictive analytics from the factory floor.',
        whatItIs: 'Since our 2018 partnership with Altizon, we have been bridging the gap between Operational Technology (OT) and Information Technology (IT). Our Industrial IoT solutions extract data securely from legacy machines and modern equipment alike via OPC-UA and MQTT, funneling it into cloud or edge dashboards for predictive maintenance and OEE tracking.',
        features: ['Sensor Networks & Edge Gateways', 'Real-time Dashboards', 'Predictive Maintenance Analytics', 'Cloud / ERP Integration', 'OPC-UA / MQTT Connectivity'],
        industries: ['E-Commerce Logistics', 'Engineering', 'Plastic Manufacturing', 'Textiles', 'Automotive', 'Smart Factories', 'Supply Chain', 'Heavy Machinery'],
        process: [
            { step: '01', title: 'Data Strategy', desc: 'Identifying critical control points and machine data tags.' },
            { step: '02', title: 'Connectivity Setup', desc: 'Deploying edge gateways and configuring secure networks.' },
            { step: '03', title: 'Platform Onboarding', desc: 'Connecting OT data to the Altizon IIoT platform.' },
            { step: '04', title: 'Dashboarding', desc: 'Visualizing OEE, downtime, and operational metrics.' }
        ]
    },
    {
        id: 'mep',
        title: 'MEP Contracting',
        image: '/images/projects/real/odisha-secretariat.jpg',
        subtitle: 'Fully coordinated Mechanical, Electrical, and Plumbing execution.',
        whatItIs: 'Avoid the chaos of misaligned contractors. We offer a unified MEP contracting service that guarantees perfect coordination across essential building utility networks. By handling the mechanical (HVAC), electrical, and plumbing engineering under one roof, we eliminate clashes, reduce project delays, and ensure a higher standard of overall quality.',
        features: ['Coordinated 3D Design', 'HVAC Solutions', 'Plumbing & Drainage', 'Electrical Integration', 'Centralized Project Management'],
        industries: ['Infrastructure', 'Convention Centers', 'Commercial IT', 'Healthcare', 'Large Scale Residential', 'Retail Hubs', 'Airport Terminals', 'Industrial Parks'],
        process: [
            { step: '01', title: 'BIM Coordination', desc: 'Resolving spatial clashes before they reach the site.' },
            { step: '02', title: 'Parallel Execution', desc: 'Simultaneous deployment of trades by our unified team.' },
            { step: '03', title: 'Quality Audits', desc: 'Rigorous cross-discipline quality checks.' },
            { step: '04', title: 'Integrated Commissioning', desc: 'Testing all systems together to ensure harmony.' }
        ]
    }
];


export const ServiceDetail = () => {
    const { serviceId } = useParams();
    const cleanId = serviceId?.replace(/\/$/, '');
    const data = serviceData.find(s => s.id === cleanId);

    useEffect(() => { ScrollTrigger.refresh(); }, [serviceId]);

    if (!data) return (
        <div className="pt-32 pb-24 text-center min-h-[60vh]">
            <h1 className="text-4xl font-syne font-bold text-evio-navy">Service Not Found</h1>
            <Link to="/services" className="text-evio-blue mt-4 inline-block hover:underline">Back to Services</Link>
        </div>
    );

    return (
        <div className="w-full flex flex-col min-h-screen">
            <Helmet>
                <title>{`${data.title} | EVIO Services`}</title>
                <meta name="description" content={`${data.subtitle} Learn about our features, process, and industry applications.`} />
            </Helmet>
            
            {/* 1. Hero */}
            <section 
                className="relative w-full py-32 bg-evio-navy overflow-hidden"
                style={data.image ? {
                    backgroundImage: `url(${data.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}
            >
                {/* Darken Overlay */}
                <div className="absolute inset-0 bg-evio-navy/70"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-evio-navy via-transparent to-evio-navy/40"></div>
                
                
                <div className="relative z-10 px-6 max-w-7xl mx-auto">
                    <div className="mb-8 block">
                        <Link to="/services" className="inline-flex items-center text-white/60 hover:text-white transition-colors font-inter text-sm group">
                            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Services
                        </Link>
                    </div>

                    {data.partner && (
                        <div className="inline-block px-4 py-1.5 rounded-full bg-evio-blue/20 border border-evio-blue/30 text-evio-blue text-xs font-bold font-syne uppercase tracking-wider mb-6">
                            {data.partner}
                        </div>
                    )}
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-syne font-bold text-white mb-6 max-w-4xl"
                    >
                        {data.title}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/80 font-inter max-w-2xl"
                    >
                        {data.subtitle}
                    </motion.p>
                </div>
            </section>

            {PARTNER_LOGOS[data.id] && (
                <section className="bg-white border-b border-evio-black/5 px-6 py-8">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
                        <p className="text-xs font-inter font-bold uppercase tracking-widest text-evio-black/40 shrink-0">Technology partners</p>
                        <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
                            {PARTNER_LOGOS[data.id].map(([name, file]) => (
                                <img key={file} src={`/brand/partners/${file}`} alt={name} title={name} loading="lazy" className="h-8 md:h-9 w-auto max-w-[140px] object-contain" />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 2. What It Is & Features */}
            <section className="pt-32 pb-24 bg-white px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Overview</h2>
                        <h3 className="text-3xl md:text-4xl font-syne font-bold text-evio-navy mb-6">Intelligent Solutions, Expertly Delivered</h3>
                        <p className="text-evio-black/70 font-inter leading-relaxed text-lg">
                            {data.whatItIs}
                        </p>
                    </div>

                    <div className="bg-evio-light-gray rounded-[24px] p-8 md:p-10 features-grid">
                        <h4 className="text-xl font-syne font-bold text-evio-navy mb-8">Scope & Capabilities</h4>
                        <ul className="space-y-4">
                            {data.features.map((feature, idx) => (
                                <li key={idx} className="feature-item flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-evio-blue/10 flex items-center justify-center mr-4 mt-0.5 shrink-0">
                                        <svg className="w-3.5 h-3.5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-evio-black/80 font-inter">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. Industry Tags Marquee */}
            <section className="pt-32 pb-12 bg-evio-blue overflow-hidden">
                <div className="relative flex overflow-x-hidden group flex-nowrap whitespace-nowrap">
                    <div className="animate-marquee inline-flex flex-nowrap">
                        {[...data.industries, ...data.industries, ...data.industries, ...data.industries].map((industry, i) => (
                            <span key={i} className="text-white font-syne font-bold text-xl md:text-2xl uppercase tracking-wider px-8 flex items-center shrink-0">
                                {industry} <span className="w-2 h-2 rounded-full bg-white/40 ml-8 inline-block" />
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Process Workflow */}
            <section className="pt-32 pb-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Workflow</h2>
                        <h3 className="text-3xl md:text-4xl font-syne font-bold text-evio-navy">How We Do It</h3>
                    </div>

                    <div className="process-timeline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.process.map((step, idx) => (
                            <div key={idx} className="process-step relative">
                                {/* Connector line for desktop */}
                                {idx !== data.process.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-evio-black/5 -z-10" />
                                )}
                                <div className="text-6xl font-syne font-bold text-evio-navy/[0.09] mb-4 text-center select-none">{step.step}</div>
                                <div className="w-16 h-16 rounded-full bg-evio-light-gray text-evio-navy flex items-center justify-center font-syne font-bold text-xl mx-auto mb-6 border-4 border-white shadow-sm">
                                    {idx + 1}
                                </div>
                                <h4 className="text-lg font-syne font-bold text-evio-navy mb-2 text-center">{step.title}</h4>
                                <p className="text-base text-evio-black/70 font-inter text-center leading-relaxed px-2 md:px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA banner */}
            <section className="pt-32 pb-20 bg-evio-light-gray px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-syne font-bold text-evio-navy mb-6">Ready to upgrade your infrastructure?</h2>
                    <p className="text-evio-black/60 font-inter mb-8">Discuss your project requirements with our engineering team today.</p>
                    <Link to={`/contact?ref=service:${data.id}&type=${SERVICE_LEAD_TYPE[data.id] || ''}`} className="inline-flex items-center justify-center bg-evio-blue text-white font-inter font-medium text-16px h-[48px] px-[32px] rounded-[8px] hover:bg-opacity-90 transition-all shadow-[0_4px_14px_rgba(0,174,239,0.3)] hover:shadow-[0_6px_20px_rgba(0,174,239,0.4)]">
                        Discuss Your Project
                    </Link>
                </div>
            </section>

        </div>
    );
};
