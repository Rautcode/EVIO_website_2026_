import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WhoWeAre = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            textRef.current,
            { x: "10%" },
            {
                x: "-50%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                }
            }
        );
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-evio-blue text-white overflow-hidden relative">
            <div className="absolute top-12 left-6 md:left-24 z-10 max-w-2xl">
                <p className="font-syne font-bold text-2xl md:text-4xl leading-snug">
                    We are EVIO. Powering industries with
                    unmatched precision and dependability.
                </p>
            </div>

            <div className="mt-32 md:mt-48 whitespace-nowrap opacity-20">
                <h2
                    ref={textRef}
                    className="text-7xl md:text-[12rem] font-syne font-bold uppercase tracking-tighter"
                >
                    15 Years • 1000+ Projects • Turnkey Electrical & Automation • 295 MW Data Centre Capacity • 15 Years • 1000+ Projects • Turnkey Electrical & Automation • 295 MW Data Centre Capacity •
                </h2>
            </div>
        </section>
    );
};
