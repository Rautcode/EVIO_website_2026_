import { useRef } from 'react';
import { ArrowRight, Zap, Target, Lightbulb, Building2, Wifi, Wrench, Server } from 'lucide-react';
import { Link } from 'react-router-dom';


const services = [
    { id: 1, name: 'Turnkey Electrical', desc: 'End-to-end HT & LT electrical contracting.', icon: Zap, link: '/services/turnkey-electrical' },
    { id: 2, name: 'Industrial Automation', desc: 'Siemens authorized PLC, SCADA, DCS solutions.', icon: Target, link: '/services/industrial-automation' },
    { id: 3, name: 'Lighting Automation', desc: 'Helvar intelligent DALI & DMX lighting systems.', icon: Lightbulb, link: '/services/lighting-automation' },
    { id: 4, name: 'Building Automation', desc: 'Smart IBMS for commercial infrastructures.', icon: Building2, link: '/services/building-automation' },
    { id: 5, name: 'Industrial IoT', desc: 'Edge-enabled real-time monitoring platforms.', icon: Wifi, link: '/services/industrial-iot' },
    { id: 6, name: 'MEP Contracting', desc: 'Coordinated Mechanical, Electrical & Plumbing.', icon: Wrench, link: '/services/mep' },
    { id: 7, name: 'Data Centres', desc: 'HT/LT electrical for hyperscale & colocation. 295 MW worked on.', icon: Server, link: '/data-centres' },
];

export const ServicesSection = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);


    return (
        <section ref={containerRef} className="py-32 bg-evio-navy w-full relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl text-white">
                        <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6">Our Services</h2>
                        <p className="text-lg text-gray-400 font-inter">
                            Delivering high-performance electrical and automation solutions tailored
                            to meet the complex demands of modern industries.
                        </p>
                    </div>
                    <Link to="/services" className="inline-flex items-center text-evio-blue hover:text-white font-inter font-medium transition-colors cursor-hover">
                        View All Services <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <Link
                                key={service.id}
                                to={service.link}
                                className="group cursor-hover outline-none"
                                ref={el => cardsRef.current[index] = el}
                            >
                                <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-evio-blue/50 group-focus-visible:ring-2 focus-visible:ring-evio-blue">
                                    <div className="w-14 h-14 rounded-xl bg-evio-blue/20 flex items-center justify-center mb-6 text-evio-blue group-hover:scale-110 transition-transform duration-300">
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="text-2xl font-syne font-bold text-white mb-4 group-hover:text-evio-blue transition-colors">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-400 font-inter leading-relaxed">
                                        {service.desc}
                                    </p>
                                    <div className="mt-8 flex items-center text-evio-blue text-sm font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
