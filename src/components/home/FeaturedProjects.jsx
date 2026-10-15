import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: 1,
        title: 'Embassy Industrial Park',
        sector: 'E-Commerce / Logistics',
        location: 'NCR, Delhi',
        image: '/images/projects/real/myntra.jpg',
        desc: 'Turnkey electrical works for Myntra at Embassy Industrial Park, Bilaspur, completed with zero accidents.'
    },
    {
        id: 2,
        title: 'Flipkart Big Box Logistics Hub',
        sector: 'E-Commerce / Logistics',
        location: 'Haringhata, West Bengal',
        image: '/images/projects/real/flipkart.jpg',
        desc: 'Fast-track electrical EPC for one of the largest logistics hubs of e-commerce giant Flipkart.'
    },
    {
        id: 3,
        title: 'IIT Hyderabad Campus (Package 3B)',
        sector: 'Education / Infrastructure',
        location: 'Kandi, Telangana',
        image: '/images/projects/real/iit-hyderabad.jpg',
        desc: 'Campus development electrical works for Shapoorji Pallonji, completed with zero accidents.'
    }
];

export const FeaturedProjects = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const cards = gsap.utils.toArray('.project-card');

        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { y: 50 },
                {
                    y: -20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                }
            );
        });
    }, []);

    return (
        <section ref={containerRef} className="py-32 bg-evio-white w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                    <div className="max-w-2xl text-evio-navy">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-evio-blue/10 text-evio-blue font-inter font-medium text-sm tracking-wide uppercase mb-6">
                            Featured Work
                        </div>
                        <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6">Proven Execution.</h2>
                        <p className="text-lg text-gray-600 font-inter">
                            A glimpse into 1000+ successful projects delivered across India, marked by safety, precision, and zero-accident records.
                        </p>
                    </div>
                    <Link to="/projects" className="inline-flex items-center px-6 py-3 bg-evio-navy text-white rounded-lg hover:bg-evio-blue font-inter font-medium transition-colors cursor-hover shadow-lg">
                        View Project Gallery <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <Link key={project.id} to="/projects" className={`project-card group cursor-hover outline-none block ${index === 1 ? 'md:mt-16' : ''} ${index === 2 ? 'md:mt-32' : ''}`}>
                            <div className="rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-evio-border transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,174,239,0.15)] group-focus-visible:ring-2 focus-visible:ring-evio-blue h-full flex flex-col">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute inset-0 bg-evio-navy/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-evio-navy text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                                            {project.sector}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow bg-white relative z-20 -mt-4 rounded-t-2xl">
                                    <div className="flex items-center text-gray-500 text-sm font-inter mb-3 gap-1">
                                        <MapPin size={16} className="text-evio-blue" /> {project.location}
                                    </div>
                                    <h3 className="text-2xl font-syne font-bold text-evio-navy mb-4 group-hover:text-evio-blue transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 font-inter leading-relaxed flex-grow">
                                        {project.desc}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
