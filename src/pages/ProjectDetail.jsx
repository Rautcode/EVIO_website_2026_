import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { projectsData } from '../data/projectsData';
import { ArrowLeft, CheckCircle2, ChevronRight, HardHat, ShieldCheck, Zap } from 'lucide-react';

export const ProjectDetail = () => {
    const { projectId } = useParams();
    // Static data: derive directly instead of copying into state (no loading flash)
    const project = projectsData.find(p => p.id === projectId);

    useEffect(() => { window.scrollTo(0, 0); }, [projectId]);

    if (!project) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <div className="w-full flex flex-col min-h-screen bg-white selection:bg-evio-blue selection:text-white">
            <Helmet>
                <title>{`${project.projectName} | ${project.client} | EVIO`}</title>
                <meta name="description" content={`EVIO executed the ${project.contractType} for ${project.client}'s ${project.facilityType} in ${project.location}. Scope included: ${project.scope.join(', ')}.`} />
                <meta property="og:title" content={`${project.projectName} - EVIO Case Study`} />
                <meta property="og:description" content={`Read the technical execution case study for ${project.client}.`} />
            </Helmet>

            {/* Hero Section */}
            <section className="relative w-full pt-32 pb-24 md:py-40 bg-evio-navy overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {project.images[0] && <img
                        src={project.images[0]}
                        alt={`${project.projectName} overview`}
                        className="w-full h-full object-cover opacity-20"
                        loading="lazy"
                    />}
                    <div className="absolute inset-0 bg-gradient-to-t from-evio-navy via-evio-navy/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <Link to="/projects" className="inline-flex items-center text-evio-blue hover:text-white transition-colors font-inter text-sm mb-8 group">
                        <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-evio-blue/20 text-evio-blue text-xs font-bold uppercase tracking-wider rounded-full border border-evio-blue/30">
                                {project.sector}
                            </span>
                            <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                                {project.contractType}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-syne font-bold text-white mb-6">
                            {project.projectName}
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-white/80 font-inter max-w-3xl border-l-4 border-evio-blue pl-6">
                            Executed for <strong className="text-white">{project.client}</strong> at their {project.facilityType} in {project.location}.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Project Snapshot Bar */}
            <div className="bg-white border-b border-evio-black/5 relative z-20 shadow-sm -mt-10 mx-6 md:mx-auto max-w-7xl rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-evio-black/5 divide-y md:divide-y-0">
                    <div className="p-6">
                        <p className="text-xs font-inter uppercase tracking-wider text-evio-black/50 mb-1">Capacity</p>
                        <p className="font-syne font-bold text-evio-navy text-lg">{project.capacity}</p>
                    </div>
                    <div className="p-6">
                        <p className="text-xs font-inter uppercase tracking-wider text-evio-black/50 mb-1">EVIO Role</p>
                        <p className="font-syne font-bold text-evio-navy text-lg">{project.evioRole}</p>
                    </div>
                    <div className="p-6">
                        <p className="text-xs font-inter uppercase tracking-wider text-evio-black/50 mb-1">Duration</p>
                        <p className="font-syne font-bold text-evio-navy text-lg">{project.duration}</p>
                    </div>
                    <div className="p-6">
                        <p className="text-xs font-inter uppercase tracking-wider text-evio-black/50 mb-1">Verification</p>
                        <p className="font-syne font-bold text-green-600 flex items-center gap-2">
                            <ShieldCheck size={18} /> Verified Data
                        </p>
                    </div>
                </div>
            </div>

            {/* Technical Detail Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* Scope of Work */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-evio-light-gray rounded-xl flex items-center justify-center text-evio-blue">
                                    <Zap size={24} />
                                </div>
                                <h2 className="text-3xl font-syne font-bold text-evio-navy">Scope of Work</h2>
                            </div>
                            <ul className="space-y-4">
                                {project.scope.map((item, index) => (
                                    <li key={index} className="flex items-start gap-4 p-4 bg-evio-light-gray rounded-xl">
                                        <CheckCircle2 className="text-evio-blue flex-shrink-0 mt-1" size={20} />
                                        <span className="font-inter text-evio-black/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Engineering Challenge */}
                        {project.challenges && project.challenges.length > 0 && (
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-evio-light-gray rounded-xl flex items-center justify-center text-red-500">
                                        <HardHat size={24} />
                                    </div>
                                    <h2 className="text-3xl font-syne font-bold text-evio-navy">Engineering Challenges</h2>
                                </div>
                                <div className="border-l-4 border-red-500 pl-6 space-y-4">
                                    {project.challenges.map((challenge, index) => (
                                        <p key={index} className="font-inter text-evio-black/80 leading-relaxed">{challenge}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Execution Methodology */}
                        {project.executionMethod && project.executionMethod.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-syne font-bold text-evio-navy mb-8">Execution Methodology</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.executionMethod.map((step, index) => (
                                        <div key={index} className="p-6 border border-evio-black/10 rounded-2xl">
                                            <h3 className="font-syne font-bold text-lg text-evio-navy mb-3">{step.phase}</h3>
                                            <p className="font-inter text-sm text-evio-black/70">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Image Gallery */}
                        {project.images && project.images.length > 1 && (
                            <div>
                                <h2 className="text-3xl font-syne font-bold text-evio-navy mb-8">Site Gallery</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.images.slice(1).map((img, index) => (
                                        <img 
                                            key={index} 
                                            src={img} 
                                            alt={`Project execution ${index + 1}`} 
                                            className="w-full h-64 object-cover rounded-2xl shadow-sm"
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            
                            {/* Equipment Block */}
                            <div className="bg-evio-light-gray p-8 rounded-3xl">
                                <h3 className="font-syne font-bold text-xl text-evio-navy mb-6">Major Equipment</h3>
                                <ul className="space-y-3">
                                    {project.equipment.map((eq, index) => (
                                        <li key={index} className="flex items-center gap-3 font-inter text-sm text-evio-black/80">
                                            <ChevronRight size={16} className="text-evio-blue" />
                                            {eq}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tech/Integration Block */}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="bg-evio-light-gray p-8 rounded-3xl">
                                    <h3 className="font-syne font-bold text-xl text-evio-navy mb-6">Technologies & Systems</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, index) => (
                                            <span key={index} className="px-3 py-1.5 bg-white border border-evio-black/10 rounded-lg text-sm font-inter text-evio-navy">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Outcomes Block */}
                            <div className="bg-evio-navy text-white p-8 rounded-3xl">
                                <h3 className="font-syne font-bold text-xl mb-6 flex items-center gap-3">
                                    <ShieldCheck className="text-evio-blue" />
                                    Execution Outcome
                                </h3>
                                <ul className="space-y-4">
                                    {project.outcomes.map((outcome, index) => (
                                        <li key={index} className="font-inter text-sm text-white/80 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                            {outcome}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* RFQ CTA */}
                            <Link to={`/contact?ref=project:${project.id}${project.sector === 'Data Center' ? '&type=Data Center' : ''}`} className="block w-full bg-evio-blue text-white text-center font-inter font-bold py-4 rounded-xl hover:bg-evio-navy transition-colors shadow-lg shadow-evio-blue/20">
                                Request a Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
