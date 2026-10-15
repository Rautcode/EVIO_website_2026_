import { motion } from 'framer-motion';

export const ProjectsHero = () => {
    const stats = [
        { label: 'Engineering Legacy', value: '15 Years' },
        { label: 'Projects Delivered', value: '1000+' },
        { label: 'Satisfied Clients', value: '400+' },
        { label: 'Sectors Served', value: '30+' },
        { label: 'Awards Won', value: '100+' },
    ];

    return (
        <section className="relative w-full pt-32 pb-24 bg-evio-navy overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1.5px,transparent_0)] bg-[size:24px_24px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-evio-blue/20 border border-evio-blue/30 text-evio-blue text-xs font-bold font-syne uppercase tracking-wider mb-6">
                        Projects & Proven Execution
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-syne font-bold text-white mb-6 leading-tight">
                        Engineering Infrastructure <br/>
                        <span className="text-evio-blue">That Performs Under Demand</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 font-inter max-w-3xl mx-auto font-light leading-relaxed mb-16">
                        EVIO delivers electrical, automation and building-infrastructure projects where reliability, coordination and execution quality directly affect operational performance.
                    </p>
                </motion.div>

                {/* Engineering by Numbers */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4"
                >
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="text-3xl lg:text-4xl font-syne font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-xs text-[#4ade80] font-inter font-bold uppercase tracking-widest leading-snug">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
