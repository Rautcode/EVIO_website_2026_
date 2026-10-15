import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';




import { DataContext } from '../context/DataContext';
import { PageHero } from '../components/ui/PageHero';
import { Helmet } from 'react-helmet-async';

export const CSRInitiatives = () => {
    const { csrInitiatives: allInitiatives } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState('All');

    const filteredInitiatives = activeTab === 'All' 
        ? allInitiatives 
        : allInitiatives.filter(item => item.category === activeTab);


    const tabs = ['All', 'Education', 'Health', 'Environment', 'Community'];

    return (
        <div className="w-full flex flex-col min-h-screen">
            <Helmet>
                <title>CSR Initiatives | EVIO Private Limited</title>
                <meta name="description" content="EVIO's corporate social responsibility work: rural electrification, solar, environment and community initiatives across India." />
            </Helmet>
            
            {/* Hero */}
            <PageHero eyebrow="CSR" title="Corporate social responsibility" subtitle="Supporting rural communities, expanding green cover, and improving access to health and education. Our focus is the Model Village Initiative at Toranpada." />

            {/* Impact Numbers */}
            <section className="impact-section pt-32 pb-16 bg-white border-b border-evio-black/5 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="impact-card bg-evio-light-gray rounded-2xl p-8 text-center border border-evio-black/5 hover:border-evio-blue/30 transition-colors">
                        <p className="text-4xl md:text-5xl font-syne font-bold text-evio-blue mb-2">1,000+</p>
                        <p className="text-sm font-inter text-evio-black/60 uppercase tracking-wider">Trees Planted</p>
                    </div>
                    <div className="impact-card bg-evio-light-gray rounded-2xl p-8 text-center border border-evio-black/5 hover:border-evio-blue/30 transition-colors">
                        <p className="text-4xl md:text-5xl font-syne font-bold text-evio-blue mb-2">2</p>
                        <p className="text-sm font-inter text-evio-black/60 uppercase tracking-wider">Villages Impacted</p>
                    </div>
                    <div className="impact-card bg-evio-light-gray rounded-2xl p-8 text-center border border-evio-black/5 hover:border-evio-blue/30 transition-colors">
                        <p className="text-4xl md:text-5xl font-syne font-bold text-evio-blue mb-2">1</p>
                        <p className="text-sm font-inter text-evio-black/60 uppercase tracking-wider">Model Village</p>
                    </div>
                    <div className="impact-card bg-evio-light-gray rounded-2xl p-8 text-center border border-evio-black/5 hover:border-evio-blue/30 transition-colors">
                        <p className="text-4xl md:text-5xl font-syne font-bold text-evio-blue mb-2">4</p>
                        <p className="text-sm font-inter text-evio-black/60 uppercase tracking-wider">Core CSR Pillars</p>
                    </div>
                </div>
            </section>

            {/* Filtered Grid */}
            <section className="pt-32 pb-24 bg-evio-light-gray px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-full font-inter font-medium transition-all duration-300 ${activeTab === tab ? 'bg-evio-blue text-white shadow-md' : 'bg-white text-evio-black/60 hover:bg-white/80'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredInitiatives.map((item) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={item.id} 
                                    className="bg-white rounded-[24px] overflow-hidden shadow-sm flex flex-col group border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-lg hover:-translate-y-2 transition-all cursor-pointer"
                                >
                                    <div className="relative overflow-hidden h-56">
                                        <div className="absolute top-4 left-4 z-10">
                                             <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-evio-blue text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                                        <p className="text-xs font-inter text-evio-black/40 mb-2">{item.date}</p>
                                        <h3 className="text-xl font-bold font-syne text-evio-navy mb-3 line-clamp-2">{item.title}</h3>
                                        <p className="text-evio-black/70 font-inter text-sm leading-relaxed max-w-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
             <section className="pt-32 pb-24 bg-evio-navy text-center px-4 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-6">Drive Impact with EVIO</h2>
                    <p className="text-lg text-white/70 font-inter mb-10">Our work goes beyond engineering. We are deeply committed to uplifting our communities and protecting our environment. Join us or partner with us in our sustainability journey.</p>
                    <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-evio-blue text-white font-inter font-bold rounded-lg hover:bg-white hover:text-evio-blue transition-all duration-300">
                        Join Our Mission
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </section>

        </div>
    );
};
