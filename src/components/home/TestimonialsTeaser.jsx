import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

gsap.registerPlugin(ScrollTrigger);

export const TestimonialsTeaser = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        // Continuous infinite marquee scroll
        const marqueeElements = marqueeRef.current.children;
        const totalWidth = marqueeElements[0].offsetWidth * (marqueeElements.length / 2);

        gsap.to(marqueeRef.current, {
            x: -totalWidth,
            duration: 40, // Adjust speed here
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });

        // Entrance animation
    }, []);

    const MarqueeItem = ({ testimonial }) => (
        <div className="flex-shrink-0 flex items-center pr-8 md:pr-12 whitespace-normal group">
            <div className="flex flex-col gap-6 w-[85vw] md:w-[60vw] max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-[0_8px_30px_rgba(14,145,56,0.1)] transition-all duration-300">
                <p className="text-lg md:text-xl lg:text-2xl font-inter text-evio-navy leading-relaxed break-words italic">
                    "{testimonial.excerpt}"
                </p>
                <div className="mt-4 pt-6 border-t border-evio-black/5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-evio-light-gray rounded-full flex items-center justify-center text-evio-blue font-syne font-bold text-xl">
                        {testimonial.client[0]}
                    </div>
                    <div>
                        <p className="font-syne font-bold text-lg md:text-xl text-evio-navy">{testimonial.client}</p>
                        <p className="text-gray-500 font-inter uppercase tracking-widest text-xs md:text-sm mt-1">{testimonial.project}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-24 bg-evio-white overflow-hidden relative border-t border-evio-black/5">
            <div className="teaser-content max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Client Success</h2>
                    <h3 className="text-4xl md:text-5xl font-syne font-bold text-evio-navy">Words of Trust</h3>
                </div>
                <Link to="/clients" className="group inline-flex items-center text-evio-navy hover:text-evio-blue font-inter font-medium transition-colors cursor-hover">
                    Read all client success stories
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* GSAP Marquee Container */}
            <div className="inline-flex whitespace-nowrap cursor-grab active:cursor-grabbing" ref={marqueeRef}>
                {testimonials.map((test, index) => (
                    <MarqueeItem key={`original-${index}`} testimonial={test} />
                ))}
                {/* Second copy so the marquee loops without a gap */}
                {testimonials.map((test, index) => (
                    <MarqueeItem key={`duplicate-${index}`} testimonial={test} />
                ))}
            </div>
        </section>
    );
};

