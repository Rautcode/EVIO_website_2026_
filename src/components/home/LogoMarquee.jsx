import { useEffect, useRef, useState } from 'react';

import { clientLogos } from '../../data/clientsData';

export const LogoMarquee = () => {
    const containerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            setScrollPosition((pos) => {
                // Assume approx 200px width per logo item + 32px margin = 232px
                // Half total width reset will happen naturally without framer motion overhead
                const newPos = pos + 1;

                if (containerRef.current) {
                    const totalScrollWidth = containerRef.current.scrollWidth;
                    if (newPos >= totalScrollWidth / 2) {
                        return 0;
                    }
                }
                return newPos;
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="py-20 bg-evio-light-gray overflow-hidden border-b border-evio-border">
            <div className="text-center mb-10">
                <h3 className="font-syne font-bold text-evio-navy text-xl">Trusted by Industry Leaders</h3>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden flex cursor-hover py-6">
                {/* Left Fade */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-evio-light-gray to-transparent z-10 pointer-events-none" />

                <div
                    ref={containerRef}
                    className="flex w-max whitespace-nowrap will-change-transform"
                    style={{ transform: `translateX(-${scrollPosition}px)` }}
                >
                    {[...clientLogos.filter(c => c.logo), ...clientLogos.filter(c => c.logo)].map((client, index) => (
                        <div
                            key={`${client.name}-${index}`}
                            className="inline-flex items-center justify-center w-72 h-32 md:w-80 md:h-36 mx-4 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-evio-border transition-all hover:border-evio-blue hover:shadow-xl grayscale hover:grayscale-0 opacity-80 hover:opacity-100 p-1 overflow-hidden"
                        >
                            <img src={client.logo} alt={client.name} className="w-full h-full object-contain scale-115 transition-transform duration-300 hover:scale-125" />
                        </div>
                    ))}
                </div>

                {/* Right Fade */}
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-evio-light-gray to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
};
