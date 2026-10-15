import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const PowerToDataHall = () => {
    const steps = [
        "Utility / Grid",
        "HT Receiving & Switching",
        "Transformers",
        "HT / LT Distribution",
        "DG / Backup Power",
        "UPS / Critical Power",
        "Busduct / Distribution",
        "PDU / RPP",
        "Data Hall",
        "Critical Loads"
    ];

    return (
        <section className="py-24 bg-evio-navy text-white px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">From Power Source to Data Hall</h2>
                    <h3 className="text-3xl md:text-5xl font-syne font-bold text-white mb-6">End-to-End Electrical Scope</h3>
                    <p className="text-lg text-white/70 font-inter max-w-3xl mx-auto">
                        EVIO's data-center electrical capability extends across the complete electrical distribution chain. At each stage, the objective is the same: Maintain electrical reliability, provide controlled distribution and enable continuous monitoring of critical infrastructure.
                    </p>
                </div>

                <div className="flex flex-col items-center max-w-2xl mx-auto">
                    {steps.map((step, idx) => (
                        <div key={idx} className="w-full flex flex-col items-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-center font-syne font-bold text-lg md:text-xl relative"
                            >
                                {step}
                                {idx >= 1 && idx <= 7 && (
                                    <span className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full text-xs font-inter font-normal text-evio-blue uppercase tracking-wider hidden md:block">
                                        Typical EVIO Scope
                                    </span>
                                )}
                            </motion.div>
                            
                            {idx < steps.length - 1 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (idx * 0.1) + 0.05 }}
                                    className="my-3 text-white/30"
                                >
                                    <ArrowDown className="w-6 h-6" />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
