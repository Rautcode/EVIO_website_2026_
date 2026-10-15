import { Zap, Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const MissionCriticalCapabilities = () => {
    const capabilities = [
        {
            title: "Electrical Infrastructure",
            icon: Zap,
            items: [
                "HT receiving and distribution",
                "HT/LT switchgear",
                "Transformers",
                "DG systems",
                "LT distribution",
                "Power and control cabling",
                "Cable tray systems",
                "Earthing",
                "Lightning protection",
                "Electrical installation"
            ]
        },
        {
            title: "Critical Power",
            icon: Activity,
            items: [
                "UPS infrastructure",
                "Busduct systems",
                "PDU / RPP distribution",
                "Critical-load distribution",
                "Power monitoring",
                "Energy metering",
                "Distribution monitoring"
            ]
        },
        {
            title: "Automation & Controls",
            icon: Cpu,
            items: [
                "PLC systems",
                "Redundant PLC architectures",
                "SCADA / HMI",
                "EPMS",
                "BMS / IBMS",
                "Electrical monitoring",
                "Load management",
                "Facility integration"
            ]
        }
    ];

    return (
        <section className="py-24 bg-evio-light-gray px-6 border-b border-evio-black/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Mission Critical / Data Centers</h2>
                    <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy mb-6">Powering Infrastructure Where Downtime Is Not an Option</h3>
                    <p className="text-lg text-evio-black/70 font-inter leading-relaxed">
                        Data centers demand a different standard of electrical execution. We deliver electrical, automation and integrated building-system solutions for mission-critical facilities, combining engineering discipline with site execution across high-voltage power infrastructure, low-voltage distribution, data halls and facility automation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {capabilities.map((cap, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="bg-white border border-evio-black/5 rounded-[24px] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-evio-blue/10 flex items-center justify-center mb-6">
                                <cap.icon className="w-7 h-7 text-evio-blue" />
                            </div>
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-6 pb-4 border-b border-evio-black/5">{cap.title}</h4>
                            <ul className="space-y-3">
                                {cap.items.map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-evio-blue mt-2 mr-3 shrink-0"></div>
                                        <span className="font-inter text-evio-black/70">{item}</span>
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
