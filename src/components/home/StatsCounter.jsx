import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { label: 'Years Experience', value: 50, prefix: '', suffix: '+' },
    { label: 'Projects Completed', value: 1000, prefix: '', suffix: '+' },
    { label: 'Satisfied Clients', value: 400, prefix: '', suffix: '+' },
    { label: 'Sectors Served', value: 30, prefix: '', suffix: '+' },
    { label: 'Awards Won', value: 100, prefix: '', suffix: '+' },
];

export const StatsCounter = () => {
    const containerRef = useRef(null);
    const countersRef = useRef([]);

    useEffect(() => {
        countersRef.current.forEach((el, index) => {
            if (!el) return;

            const targetValue = stats[index].value;

            // For a target of 0, counting down from 100 looks better for an 'accident rate' stat
            const isZeroTarget = targetValue === 0;

            gsap.fromTo(el, 
                { innerHTML: isZeroTarget ? 10 : 0 },
                {
                    innerHTML: targetValue,
                    duration: 2.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                    },
                    snap: { innerHTML: 1 },
                }
            );
        });
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-evio-blue relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/20">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center flex flex-col items-center justify-center">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-syne font-bold text-white mb-2 flex items-center justify-center min-h-[80px]">
                                <span className="text-3xl md:text-5xl self-start mt-2 mr-1">{stat.prefix}</span>
                                <span ref={(el) => countersRef.current[i] = el}>0</span>
                                <span>{stat.suffix}</span>
                            </div>
                            <div className="text-white/80 font-inter text-xs lg:text-sm uppercase tracking-widest px-2">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Graphic */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-5 justify-between mix-blend-overlay">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-full border-r border-white/20 skew-x-12 -translate-x-20" />
                ))}
            </div>
        </section>
    );
};
