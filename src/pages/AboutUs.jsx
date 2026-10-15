import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GPTWBadge } from '../components/ui/GPTWBadge';
import { PageHero } from '../components/ui/PageHero';
import { HorizontalStoryline } from '../components/about/HorizontalStoryline';

gsap.registerPlugin(ScrollTrigger);

export const AboutUs = () => {

    useEffect(() => {
        // Timeline scroll animations
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        });

        // Why Choose EVIO grid stagger
        
        // Stats
    }, []);

    return (
        <div className="w-full flex flex-col min-h-screen">
            <Helmet>
                <title>About EVIO | 15 Years of Engineering Excellence</title>
                <meta name="description" content="EVIO Private Limited is a Great Place To Work certified company executing complex turnkey electrical and automation projects across India since 2011." />
            </Helmet>
            
            {/* 1. Hero */}
            <PageHero eyebrow="About EVIO" title="Complex challenges, intelligent engineering." subtitle="Turnkey electrical, automation and data centre infrastructure, delivered across India since 2011." image="/images/life/team-entire.jpg" />

            {/* 2. Intro / Mission & Vision */}
            <section className="pt-32 pb-24 bg-white px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Who We Are</h2>
                        <h3 className="text-3xl md:text-4xl font-syne font-bold text-evio-navy mb-6">
                            15 Years of Engineering Excellence
                        </h3>
                        <p className="text-evio-black/70 font-inter leading-relaxed mb-6">
                            Founded in 2011 by Gopal M. Kandoi, who brings five decades of industry leadership, EVIO executes turnkey electrical and automation projects for industry, infrastructure and data centres. In FY2024 we reported ₹268 Crore in revenue with a team of 970+ people.
                        </p>
                        <GPTWBadge className="w-auto h-40 md:h-56 cert-badge" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-evio-light-gray rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-10 h-10 rounded-full bg-evio-navy/5 flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="font-syne font-bold text-lg text-evio-navy mb-2">Our Mission</h4>
                            <p className="text-xs text-evio-black/80 font-inter leading-relaxed">
                                "Customer is at the core of EVIO's existence and we will serve our customers with tireless efforts, extraordinary commitments and fair priced solutions."
                            </p>
                        </div>
                        <div className="bg-evio-navy rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 text-white">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h4 className="font-syne font-bold text-lg text-white mb-2">Our Strategy</h4>
                            <p className="text-xs text-white/80 font-inter leading-relaxed">
                                "EVIO is the preferred partner for integrated Electrical, Instrumentation, and Automation solutions across Industry and building customer segments, collaborating with top global brands."
                            </p>
                        </div>

                        {/* Quality Policy */}
                        <div className="bg-white border border-evio-black/10 shadow-sm rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-10 h-10 rounded-full bg-evio-navy/5 flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h4 className="font-syne font-bold text-lg text-evio-navy mb-2">Quality Policy</h4>
                            <p className="text-[11px] text-evio-black/80 font-inter leading-relaxed">
                                "We remain dedicated to achieving excellence in delivering solutions within defined parameters. Our goal is to enhance our customers' performance by understanding and fulfilling their needs efficiently. We are results-oriented, prioritizing a safe working environment, continual process improvement, and full compliance with legal requirements."
                            </p>
                        </div>

                        {/* HSE Policy */}
                        <div className="bg-evio-light-gray border border-evio-blue/10 rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-10 h-10 rounded-full bg-evio-blue/10 flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                            <h4 className="font-syne font-bold text-lg text-evio-navy mb-2">HSE Policy</h4>
                            <p className="text-[11px] text-evio-black/80 font-inter leading-relaxed">
                                "The Health and Safety of our people takes precedence. We are dedicated to safeguarding our people, customer's property, and subcontractors from accidents, injuries, or damages. Environmental protection is integral to our operations. Zero accident policy is maintained across all projects."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Our Story Timeline (Pinned Horizontal Scroll) */}
            <HorizontalStoryline />

             {/* 4. Leadership Team */}
            <section className="pt-32 pb-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Leadership</h2>
                        <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy">Executive Team</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Gopal Kandoi */}
                        <div className="group relative bg-evio-light-gray overflow-hidden rounded-[24px]">
                             <div className="aspect-[4/5] bg-evio-navy/5 flex items-end justify-center">
                                 <img src="/images/about/gopal-kandoi.png" alt="Gopal M. Kandoi, Founder & Chairman" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
                                 <div className="w-full h-full bg-gradient-to-t from-evio-navy/80 to-transparent absolute" />
                             </div>
                             <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                 <h4 className="text-2xl font-syne font-bold text-white mb-1">Gopal M. Kandoi</h4>
                                 <p className="text-evio-blue mb-4">Founder & Chairman</p>
                                 <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                     Senior Technocrat with 5+ decades of experience. A serial entrepreneur whose core values and ethics define EVIO's culture.
                                 </p>
                             </div>
                        </div>

                         {/* Prashant Kandoi */}
                         <div className="group relative bg-evio-light-gray overflow-hidden rounded-[24px]">
                             <div className="aspect-[4/5] bg-evio-navy/5 flex items-end justify-center">
                                  {/* ponytail: initials until a portrait is supplied */}
                                  <span className="absolute inset-0 flex items-center justify-center font-syne font-bold text-8xl text-evio-navy/15 select-none" aria-hidden="true">PK</span>
                                  <div className="w-full h-full bg-gradient-to-t from-evio-navy/80 to-transparent absolute" />
                             </div>
                             <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                 <h4 className="text-2xl font-syne font-bold text-white mb-1">Prashant G. Kandoi</h4>
                                 <p className="text-evio-blue mb-4">Managing Director</p>
                                 <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                     Leads operations, client relationships, and technological direction. Brings years of deep expertise in engineering and automation.
                                 </p>
                             </div>
                        </div>

                        {/* Anant Kandoi */}
                        <div className="group relative bg-evio-light-gray overflow-hidden rounded-[24px]">
                             <div className="aspect-[4/5] bg-evio-navy/5 flex items-end justify-center">
                                  {/* ponytail: initials until a portrait is supplied */}
                                  <span className="absolute inset-0 flex items-center justify-center font-syne font-bold text-8xl text-evio-navy/15 select-none" aria-hidden="true">AK</span>
                                  <div className="w-full h-full bg-gradient-to-t from-evio-navy/80 to-transparent absolute" />
                             </div>
                             <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                 <h4 className="text-2xl font-syne font-bold text-white mb-1">Anant P. Kandoi</h4>
                                 <p className="text-evio-blue mb-4">Director</p>
                                 <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                     Represents the newest generation of leadership, driving modern business practices, growth, and team development.
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* 5. Values / Why Choose EVIO */}
             <section className="pt-32 pb-24 bg-evio-light-gray px-6">
                 <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-syne font-bold mb-4 text-evio-navy">Core Values</h2>
                        <p className="text-evio-black/70 font-inter max-w-2xl mx-auto text-lg">The principles that guide our decisions, our technical excellence, and our long-term client relationships.</p>
                     </div>

                     <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         {/* Value 1 */}
                         <div className="value-item bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-evio-black/5 rounded-2xl p-8 transition-all duration-300">
                             <div className="w-14 h-14 rounded-full bg-evio-navy/5 flex items-center justify-center mb-6">
                                 <span className="text-evio-blue font-syne font-bold text-xl">1</span>
                             </div>
                             <h4 className="text-xl font-syne font-bold mb-3 text-evio-navy">Customer Centricity</h4>
                             <p className="text-evio-black/80 text-sm leading-relaxed">Tireless efforts, extraordinary commitment, fair pricing.</p>
                         </div>
                         {/* Value 2 */}
                         <div className="value-item bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-evio-black/5 rounded-2xl p-8 transition-all duration-300">
                             <div className="w-14 h-14 rounded-full bg-evio-navy/5 flex items-center justify-center mb-6">
                                  <span className="text-evio-blue font-syne font-bold text-xl">2</span>
                             </div>
                             <h4 className="text-xl font-syne font-bold mb-3 text-evio-navy">Team Trust</h4>
                             <p className="text-evio-black/80 text-sm leading-relaxed">Respect, transparency, praise for sincere effort.</p>
                         </div>
                         {/* Value 3 */}
                         <div className="value-item bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-evio-black/5 rounded-2xl p-8 transition-all duration-300">
                             <div className="w-14 h-14 rounded-full bg-evio-navy/5 flex items-center justify-center mb-6">
                                 <span className="text-evio-blue font-syne font-bold text-xl">3</span>
                             </div>
                             <h4 className="text-xl font-syne font-bold mb-3 text-evio-navy">Associate Partnerships</h4>
                             <p className="text-evio-black/80 text-sm leading-relaxed">Fair opportunities, long-term relationships.</p>
                         </div>
                         {/* Value 4 */}
                         <div className="value-item bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-evio-black/5 rounded-2xl p-8 transition-all duration-300">
                             <div className="w-14 h-14 rounded-full bg-evio-navy/5 flex items-center justify-center mb-6">
                                 <span className="text-evio-blue font-syne font-bold text-xl">4</span>
                             </div>
                             <h4 className="text-xl font-syne font-bold mb-3 text-evio-navy">Founder Returns</h4>
                             <p className="text-evio-black/80 text-sm leading-relaxed">Fair returns by rewarding faith and interest-free capital.</p>
                         </div>
                     </div>
                 </div>
             </section>

             {/* 6. Certifications */}
             <section className="cert-section pt-24 pb-32 bg-evio-navy relative overflow-hidden px-6">
                 {/* Decorative background elements */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-evio-blue/30 to-transparent"></div>

                 <div className="max-w-6xl mx-auto text-center relative z-10">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12">
                          <svg className="w-5 h-5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-inter font-medium text-white/80 uppercase tracking-widest">Certifications & Accreditations</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                           {/* Badge 1 */}
                           <div className="cert-badge group relative bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-evio-blue/30 backdrop-blur-xl rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,174,239,0.15)] flex flex-col items-center justify-center">
                               <div className="absolute inset-0 bg-gradient-to-br from-evio-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                               <svg className="w-12 h-12 text-[#4ade80] mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                               </svg>
                               <span className="text-2xl font-syne font-bold text-white relative z-10 group-hover:text-evio-blue transition-colors duration-300">ISO 9001:2015</span>
                               <p className="text-white/50 text-xs font-inter mt-2 uppercase tracking-widest relative z-10">Quality Management</p>
                           </div>

                           {/* Badge 2 */}
                           <div className="cert-badge group relative bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-evio-blue/30 backdrop-blur-xl rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,174,239,0.15)] flex flex-col items-center justify-center">
                               <div className="absolute inset-0 bg-gradient-to-br from-evio-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                               <svg className="w-12 h-12 text-[#4ade80] mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                               </svg>
                               <span className="text-2xl font-syne font-bold text-white relative z-10 group-hover:text-evio-blue transition-colors duration-300">ISO 45001:2018</span>
                               <p className="text-white/50 text-xs font-inter mt-2 uppercase tracking-widest relative z-10">Occupational Health & Safety</p>
                           </div>

                           {/* Badge 3 */}
                           <div className="cert-badge group relative bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-evio-blue/30 backdrop-blur-xl rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,174,239,0.15)] flex flex-col items-center justify-center">
                               <div className="absolute inset-0 bg-gradient-to-br from-evio-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                               <svg className="w-12 h-12 text-[#4ade80] mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                               </svg>
                               <span className="text-2xl font-syne font-bold text-white relative z-10 group-hover:text-evio-blue transition-colors duration-300">MSME</span>
                               <p className="text-white/50 text-xs font-inter mt-2 uppercase tracking-widest relative z-10">Govt. of India Certified</p>
                           </div>
                      </div>
                 </div>
             </section>

        </div>
    );
};
