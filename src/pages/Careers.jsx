import { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GPTWBadge } from '../components/ui/GPTWBadge';




const departments = ['All', 'Engineering', 'Automation', 'IT', 'Management', 'Operations'];
const locations = ['All', 'Mumbai', 'Pune', 'Bengaluru'];

import { SpamGuardFields } from '../components/ui/SpamGuardFields';
import { PageHero } from '../components/ui/PageHero';
import { DataContext } from '../context/DataContext';

export const Careers = () => {
    const { jobs } = useContext(DataContext);
    const [activeDept, setActiveDept] = useState('All');
    const [activeLocation, setActiveLocation] = useState('All');
    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    const filteredJobs = jobs.filter(job => {
        const matchesDept = activeDept === 'All' || job.dept.toLowerCase().includes(activeDept.toLowerCase()) || (activeDept === 'Automation' && job.dept === 'Engineering');
        const matchesLoc = activeLocation === 'All' || job.location.includes(activeLocation);
        return matchesDept && matchesLoc;
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: false });
        
        const form = e.target;
        const formData = new FormData(form);

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'API request failed');

            setStatus({ loading: false, success: true, error: false });
            form.reset();
            setTimeout(() => setStatus({ loading: false, success: false, error: false }), 6000);
        } catch (error) {
            console.error(error);
            setStatus({ loading: false, success: false, error: true, message: error.message });
        }
    };

    return (
        <div className="w-full flex flex-col min-h-screen bg-white">
            <Helmet>
                <title>Careers | Join the EVIO Team</title>
                <meta name="description" content="EVIO offers dynamic careers in electrical engineering, industrial automation, and project management. Discover open positions and our GPTW certified culture." />
            </Helmet>
            
            {/* Hero */}
            <PageHero eyebrow="Careers" title="Build your career with EVIO" subtitle="Join a Great Place To Work® certified team of 970+ people delivering India's industrial and data centre infrastructure." image="/images/life/IMG20220212113353.jpg" />

            {/* Why EVIO (6 Cards) */}
            <section className="benefits-section pt-32 pb-24 bg-evio-light-gray px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Why Join Us</h2>
                        <h3 className="text-3xl md:text-4xl font-syne font-bold text-evio-navy">A Culture of Excellence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="benefit-card bg-white rounded-2xl p-8 border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-lg transition-all">
                            <h4 className="font-syne font-bold text-xl text-evio-navy mb-3">Professional Growth</h4>
                            <p className="text-evio-black/70 font-inter text-sm leading-relaxed">Work alongside industry veterans on massive turnkey projects that accelerate your technical expertise and career trajectory.</p>
                        </div>
                        <div className="benefit-card bg-white rounded-2xl p-8 border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-lg transition-all">
                            <h4 className="font-syne font-bold text-xl text-evio-navy mb-3">Innovation Focus</h4>
                            <p className="text-evio-black/70 font-inter text-sm leading-relaxed">Work hands-on with Industrial IoT, PLC/SCADA and building automation systems on live sites.</p>
                        </div>
                        <div className="benefit-card bg-white rounded-2xl p-8 border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-lg transition-all">
                            <h4 className="font-syne font-bold text-xl text-evio-navy mb-3">Vibrant Culture</h4>
                            <p className="text-evio-black/70 font-inter text-sm leading-relaxed">From the thrilling EVIO Premier League to Women's Day, we believe in celebrating our diversities together.</p>
                        </div>
                        <div className="benefit-card bg-white rounded-2xl p-8 border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-lg transition-all">
                            <h4 className="font-syne font-bold text-xl text-evio-navy mb-3">Comprehensive Health Benefits</h4>
                            <p className="text-evio-black/70 font-inter text-sm leading-relaxed">Complete medical coverage, regular health camps, and a strict ISO 45001:2018 Zero Accident safety policy.</p>
                        </div>
                        <div className="benefit-card bg-white rounded-2xl p-8 border border-evio-black/5 hover:border-evio-blue/30 hover:shadow-lg transition-all">
                            <h4 className="font-syne font-bold text-xl text-evio-navy mb-3">Work-Life Balance</h4>
                            <p className="text-evio-black/70 font-inter text-sm leading-relaxed">While we execute with military precision, we respect personal time, promoting healthy boundaries and well-being.</p>
                        </div>
                        <div className="benefit-card bg-evio-navy text-white rounded-2xl p-8 border border-evio-black/5 hover:-translate-y-2 transition-transform">
                           <GPTWBadge className="w-auto h-32 md:h-40 mb-6" />
                            <h4 className="font-syne font-bold text-lg mb-2">GPTW Certified</h4>
                            <p className="text-white/80 font-inter text-sm leading-relaxed">Officially recognized as a Great Place To Work® India based on anonymous, overwhelmingly positive employee feedback.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Life at EVIO Teaser */}
            <section className="life-teaser pt-32 pb-20 bg-white px-6 border-b border-evio-black/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/3">
                        <h3 className="text-3xl font-syne font-bold text-evio-navy mb-4">Life @ EVIO</h3>
                        <p className="text-evio-black/70 font-inter mb-6">Discover what happens beyond the blueprints. We work hard, play hard, and celebrate as one continuous family.</p>
                        <Link to="/life-at-evio" className="text-evio-blue font-inter font-bold hover:underline flex items-center">
                            View Full Culture Gallery
                            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    <div className="lg:w-2/3 grid grid-cols-3 gap-4">
                        <img src="/images/life/IMG20220212113353.jpg" loading="lazy" className="teaser-img rounded-2xl h-48 md:h-64 object-cover w-full shadow-md" alt="EVIO Premier League cricket team" />
                        <img src="/images/life/A-1.jpg" loading="lazy" className="teaser-img rounded-2xl h-48 md:h-64 object-cover w-full shadow-md translate-y-6" alt="EVIO Diwali celebration" />
                        <img src="/images/life/af22_1.jpeg" loading="lazy" className="teaser-img rounded-2xl h-48 md:h-64 object-cover w-full shadow-md" alt="EVIO Annual Function 2022" />
                    </div>
                </div>
            </section>

            {/* Open Positions & Filter */}
            <section className="jobs-section py-24 px-6 bg-evio-light-gray" id="open-positions">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy mb-4">Open Positions</h2>
                        <p className="text-evio-black/60 font-inter">Find your perfect role across our national operations.</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-evio-black/5 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <select 
                                value={activeDept} 
                                onChange={(e) => setActiveDept(e.target.value)}
                                className="px-4 py-2.5 bg-evio-light-gray border border-evio-black/10 rounded-lg text-sm font-inter text-evio-navy focus:outline-none focus:border-evio-blue"
                            >
                                {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>)}
                            </select>
                            <select 
                                value={activeLocation} 
                                onChange={(e) => setActiveLocation(e.target.value)}
                                className="px-4 py-2.5 bg-evio-light-gray border border-evio-black/10 rounded-lg text-sm font-inter text-evio-navy focus:outline-none focus:border-evio-blue"
                            >
                                {locations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>)}
                            </select>
                        </div>
                        <div className="text-sm font-inter text-evio-black/50 font-medium">
                            {filteredJobs.length} {filteredJobs.length === 1 ? 'Role' : 'Roles'} Found
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={job.id} 
                                    className="job-card bg-white rounded-xl p-6 md:p-8 border border-evio-black/5 hover:border-evio-blue/40 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer"
                                >
                                    <div>
                                        <h3 className="font-syne font-bold text-xl text-evio-navy mb-3 group-hover:text-evio-blue transition-colors">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm font-inter text-evio-black/60">
                                            <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{job.dept}</span>
                                            <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{job.location}</span>
                                            <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{job.type}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })} className="mt-6 sm:mt-0 px-8 py-3 rounded-lg bg-evio-blue text-white font-inter font-bold hover:bg-evio-navy hover:-translate-y-1 transition-all shadow-md shrink-0">
                                        Apply Now
                                    </button>
                                </motion.div>
                            )) : (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="text-center py-12 text-evio-black/50 font-inter"
                                >
                                    No open roles found matching your criteria.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section id="application-form" className="pt-32 pb-24 px-6 bg-white border-t border-evio-black/5">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-syne font-bold text-evio-navy mb-4">Submit Your Application</h2>
                        <p className="text-evio-black/60 font-inter">Don't see a perfect fit above? Submit your details directly to our HR team.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="bg-evio-light-gray rounded-[24px] p-8 md:p-12 shadow-sm border border-evio-black/5">
                        <SpamGuardFields />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Full Name</label>
                                <input type="text" name="name" required minLength="2" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Email Address</label>
                                <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Phone Number</label>
                                <input type="tel" name="phone" required pattern="^\+?[0-9\-\s\(\)]+$" minLength="10" title="Please enter a valid phone number (digits, spaces, or plus sign)" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="+91 98765 43210" />
                            </div>
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">LinkedIn Profile URL</label>
                                <input type="url" name="linkedin" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="https://linkedin.com/in/..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Role Applying For</label>
                                <select name="role" required className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all bg-white">
                                    <option value="">Select a role or department...</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                    <option value="Automation Engineering">Automation Engineering</option>
                                    <option value="Site Supervisor">Site Supervisor</option>
                                    <option value="Project Management">Project Management</option>
                                    <option value="Business Development">Business Development</option>
                                    <option value="Admin & HR">Admin & HR</option>
                                    <option value="Other">Other / General Application</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Years of Experience</label>
                                <input type="number" name="experience" min="0" required className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all" placeholder="e.g., 5" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Upload Resume (PDF)</label>
                            <input type="file" name="resume" accept=".pdf" required className="w-full text-sm text-evio-black/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-evio-blue/10 file:text-evio-blue hover:file:bg-evio-blue/20 cursor-pointer" />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Cover Note (Optional)</label>
                            <textarea name="note" rows="4" className="w-full px-4 py-3 rounded-lg border border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue outline-none transition-all resize-none" placeholder="Tell us why you are a great fit for EVIO..."></textarea>
                        </div>

                        <button type="submit" disabled={status.loading} className="w-full bg-evio-blue text-white font-inter font-bold text-lg py-4 rounded-xl hover:bg-evio-navy transition-colors shadow-lg shadow-evio-blue/20 disabled:opacity-50">
                            {status.loading ? 'Uploading Application...' : 'Submit Application'}
                        </button>
                        
                        {status.success && (
                            <div className="mt-4 text-green-700 font-inter text-sm text-center font-medium bg-green-50 py-4 px-6 rounded-lg border border-green-200">
                                <p className="font-bold text-base mb-1">Application Received!</p>
                                <p>Thank you for your interest in joining EVIO. Our talent acquisition team will review your profile and reach out if there's a match.</p>
                            </div>
                        )}
                        {status.error && (
                            <p className="mt-4 text-red-500 font-inter text-sm text-center">{status.message && status.message !== 'API request failed' ? status.message : 'There was an error submitting your application. Please try again later.'}</p>
                        )}
                    </form>
                </div>
            </section>
            
        </div>
    );
};
