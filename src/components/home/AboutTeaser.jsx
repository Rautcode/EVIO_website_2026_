import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const AboutTeaser = () => {
    const sectionRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "bottom 90%",
                toggleActions: "play none none reverse",
            }
        });

        tl.fromTo(leftRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        ).fromTo(rightRef.current,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        );
    }, []);

    return (
        <section ref={sectionRef} className="py-32 bg-evio-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                <div ref={leftRef} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-evio-navy shadow-evio-card group">
                    <img src="/images/life/team-entire.jpg" alt="The EVIO team" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-evio-navy/80 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <span className="text-4xl font-syne font-bold text-evio-blue block mb-1">15</span>
                        <span className="text-lg font-inter text-white/80">Years of Trust</span>
                    </div>
                </div>

                <div ref={rightRef} className="space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-evio-blue/10 text-evio-blue font-inter font-medium text-sm tracking-wide uppercase">
                        Who We Are
                    </div>
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-evio-navy leading-tight">
                        A Dependable Project Execution Partner.
                    </h2>
                    <p className="text-lg text-gray-600 font-inter leading-relaxed">
                        As a Great Place To Work® Certified company, EVIO is built on 15 years of engineering excellence since 2011. We collaborate with top global brands like Siemens and Helvar to deliver integrated Electrical, Instrumentation, and Automation solutions across 22+ industry sectors.
                    </p>
                    <Link to="/about">
                        <Button variant="secondary" className="group cursor-hover hover:-translate-y-1">
                            Discover Our Story
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
};
