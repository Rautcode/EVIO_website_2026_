import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalStoryline = () => {
    const containerRef = useRef(null);

    const milestones = [
        {
            year: '1984',
            title: "The Founder's Journey",
            description: 'Shri Gopal Mannalal Kandoi sets up Rohini Industrial Electricals, which grows into a leading pan-India turnkey electrical & instrumentation contractor before the family stake is divested.',
            image: '/images/about/gopal-kandoi.png'
        },
        {
            year: '2011',
            title: 'EVIO Is Founded',
            description: "EVIO Private Limited is established, bringing the founder's five decades of experience to turnkey electrical, industrial automation and intelligent building systems.",
            image: '/images/life/team-entire.jpg'
        },
        {
            year: '2018',
            title: 'Tech Partnerships',
            description: "Forged key alliances with globally recognized platforms, including Altizon for IIoT solutions, bringing machine data and analytics to our clients' factory floors.",
            image: '/images/projects/real/leela.jpg'
        },
        {
            year: '2024',
            title: 'Milestone Growth',
            description: 'Surpassed ₹268 Crore in revenue with a rapidly growing team of 970+ employees, operating across 11 states, while achieving Great Place To Work certification.',
            image: '/images/life/A.jpg'
        }
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.story-card');
            
            cards.forEach((card, index) => {
                // We don't animate the last card scaling down
                if (index === cards.length - 1) return;
                
                // When the NEXT card reaches the top of this card, scale this card down into the background
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.5,
                    filter: "blur(4px)",
                    transformOrigin: "top center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: cards[index + 1],
                        start: "top bottom", // Starts when the next card enters the bottom of the screen
                        end: "top top+=15%", // Ends when the next card reaches its sticky position (15vh)
                        scrub: true,
                    }
                });
            });

            // Intro text animation
            gsap.fromTo('.intro-text', 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, ease: 'power3.out', duration: 1,
                    scrollTrigger: {
                        trigger: '.intro-text',
                        start: 'top 80%'
                    }
                }
            );

            // Animate card content when it comes into view
            cards.forEach((card) => {
                const img = card.querySelector('.card-image');
                const text = card.querySelector('.card-content');
                
                gsap.fromTo(img,
                    { scale: 1.2, opacity: 0 },
                    { 
                        scale: 1, 
                        opacity: 1, 
                        duration: 1, 
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%'
                        }
                    }
                );

                gsap.fromTo(text,
                    { x: 30, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        delay: 0.2,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%'
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="bg-evio-navy w-full py-24 md:py-32 relative z-10 px-6 lg:px-24 border-y border-evio-white/5">
            <div className="max-w-6xl mx-auto">
                
                {/* Intro Section */}
                <div className="intro-text text-center mb-24 md:mb-40 pt-12">
                     <h2 className="text-4xl md:text-6xl font-syne font-bold mb-6 text-white drop-shadow-md">
                        Our Journey
                     </h2>
                     <div className="w-24 h-1 bg-gradient-to-r from-evio-blue to-[#4ade80] rounded-full mx-auto mb-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                     <p className="text-xl md:text-4xl font-syne font-light text-white/90 leading-relaxed max-w-4xl mx-auto">
                        A legacy of <span className="text-evio-blue font-bold">growth</span>, <span className="text-[#4ade80] font-bold">innovation</span>, and unwavering <span className="border-b border-evio-blue font-bold tracking-wide">trust</span>.
                     </p>
                </div>

                {/* Stacking Cards Container */}
                <div className="relative pb-[10vh]">
                    {milestones.map((stone, index) => (
                        <div 
                            key={stone.year}
                            className="story-card sticky w-full h-auto min-h-[500px] md:h-[70vh] mb-24 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col md:flex-row bg-evio-navy z-20"
                            style={{ 
                                top: `15vh`, // Stick to the screen a little below the top
                            }}
                        >
                             {/* Image Half */}
                             <div className="card-image w-full md:w-1/2 h-64 md:h-full relative overflow-hidden bg-black/40">
                                 <img 
                                     src={stone.image} 
                                     alt={`EVIO Milestone ${stone.year}`}
                                     className="w-full h-full object-cover object-top"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-evio-navy via-evio-navy/60 to-transparent opacity-90"></div>
                             </div>

                             {/* Content Half */}
                             <div className="card-content w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:p-16 relative bg-white/[0.03] backdrop-blur-xl">
                                  {/* Giant Year Background */}
                                  <div className="text-6xl lg:text-9xl font-syne font-black text-white/5 absolute -right-4 -bottom-4 md:top-4 md:right-8 select-none pointer-events-none">
                                        {stone.year}
                                  </div>
                                  
                                  <span className="text-evio-blue font-syne font-bold text-2xl md:text-3xl mb-4 tracking-widest uppercase block drop-shadow-md">
                                        {stone.year}
                                  </span>
                                  <h3 className="text-3xl lg:text-5xl font-syne font-bold text-white mb-6 leading-tight block">
                                      {stone.title}
                                  </h3>
                                  <p className="text-lg lg:text-xl text-white/90 font-inter leading-relaxed max-w-xl block font-medium">
                                      {stone.description}
                                  </p>
                             </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
