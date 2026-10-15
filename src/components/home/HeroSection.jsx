import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

// The 5.8 MB background video only loads on wider screens without data-saver / reduced-motion.
// Phones get the poster photo. ponytail: re-encode hero-video.mp4 (~1.5 MB H.264) to drop this gate.
const wantsVideo = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 768px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !navigator.connection?.saveData;

export const HeroSection = () => {
    const containerRef = useRef(null);
    const showVideo = wantsVideo();

    useEffect(() => {
        gsap.to(containerRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });
    }, []);

    const textVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }),
    };

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-evio-navy flex items-center justify-center">
            <div ref={containerRef} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 origin-center">
                {showVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover"
                        poster="/images/projects/real/flipkart.jpg"
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                    </video>
                ) : (
                    <img src="/images/projects/real/flipkart.jpg" alt="" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-evio-navy/85 to-evio-navy/60 z-10" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-28 pb-24 md:pt-20 md:pb-0">
                <motion.h1
                    className="text-5xl md:text-8xl font-syne font-bold text-white max-w-5xl leading-tight"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {["Complex", "Challenges,"].map((word, i) => (
                        <motion.span key={word} custom={i} variants={textVariants} className="inline-block mr-4">{word}</motion.span>
                    ))}
                    <br />
                    {["Intelligent", "Engineering."].map((word, i) => (
                        <motion.span key={word} custom={i + 2} variants={textVariants} className="inline-block mr-4 text-evio-blue">{word}</motion.span>
                    ))}
                </motion.h1>

                <motion.p
                    className="mt-8 text-xl md:text-2xl text-gray-300 max-w-2xl font-inter"
                    custom={4}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={textVariants}
                >
                    Engineering Excellence. Delivering integrated electrical and automation solutions with an uncompromising <strong className="text-white">Safety First</strong> culture and a strict <strong className="text-evio-blue">Zero Accident</strong> policy.
                </motion.p>

                <motion.div
                    className="mt-12 flex flex-col sm:flex-row gap-4"
                    custom={5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={textVariants}
                >
                    <Link to="/services">
                            <Button variant="primary" className="cursor-hover h-14 px-8 text-lg hover:-translate-y-1 w-full">Explore Services</Button>
                    </Link>
                    <Link to="/contact">
                            <Button variant="ghost" className="cursor-hover h-14 px-8 text-lg hover:-translate-y-1 hover:border-evio-blue w-full">Get in Touch</Button>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <span className="text-white/60 text-sm font-inter tracking-widest uppercase">Scroll</span>
                <motion.div
                    className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"
                    animate={{ scaleY: [0, 1, 0], transformOrigin: ["top", "top", "bottom"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
};
