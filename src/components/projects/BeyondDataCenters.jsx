import { FlaskConical, Zap, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

export const BeyondDataCenters = () => {
    const cards = [
        {
            title: "Pharmaceutical / Chemical",
            icon: FlaskConical,
            metric: "Up to 8,000 I/O",
            items: ["PLC / DCS", "Redundant control", "SCADA / HMI", "Historian", "Process automation"]
        },
        {
            title: "Power & Substation",
            icon: Zap,
            metric: "Up to 3,000 I/O",
            items: ["Generator automation", "Breaker automation", "Numerical relays", "IEC 61850", "Energy monitoring", "SCADA"]
        },
        {
            title: "Water & Wastewater",
            icon: Droplet,
            metric: "Up to 6,000 I/O",
            items: ["WTP", "ETP", "STP", "Desalination", "PLC / SCADA", "Instrumentation"]
        }
    ];

    return (
        <section className="py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Beyond Data Centers</h2>
                    <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy mb-6">Electrical & Automation Projects Across Industries</h3>
                    <p className="text-lg text-evio-black/70 font-inter leading-relaxed">
                        EVIO's broader project portfolio covers industrial automation, building automation, turnkey electrical infrastructure, power and substations, water treatment, chemicals, pharmaceuticals and other process industries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-evio-light-gray rounded-[24px] p-8 border border-evio-black/5"
                        >
                            <div className="w-14 h-14 rounded-full bg-evio-blue/10 flex items-center justify-center mb-6">
                                <card.icon className="w-7 h-7 text-evio-blue" />
                            </div>
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-2">{card.title}</h4>
                            <div className="text-[#4ade80] font-syne font-bold text-lg mb-6 pb-4 border-b border-evio-black/5">{card.metric}</div>
                            
                            <ul className="space-y-3">
                                {card.items.map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-evio-navy mt-2 mr-3 shrink-0"></div>
                                        <span className="font-inter text-evio-black/70 text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
