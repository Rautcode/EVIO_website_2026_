import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, Phone, MapPin, ArrowRight, Linkedin, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { GPTWBadge } from '../ui/GPTWBadge';


export const Footer = () => {
    const footerRef = useRef(null);
    const columnsRef = useRef([]);


    const addToRefs = (el) => {
        if (el && !columnsRef.current.includes(el)) {
            columnsRef.current.push(el);
        }
    };

    return (
        <footer ref={footerRef} className="bg-evio-navy text-white pt-20 pb-10 overflow-hidden relative">

            {/* Giant Background Logo Text (Subtle Accent Watermark) */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-[16vw] md:text-[18vw] lg:text-[22vw] font-syne font-black text-white/[0.02] select-none pointer-events-none tracking-[0.08em] leading-none z-0 uppercase">
                EVIO
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">

                {/* Column 1: Brand */}
                <div ref={addToRefs} className="space-y-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/brand/evio-logo-white.svg" alt="EVIO Private Limited" width="178" height="56" className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
                    </Link>
                    <p className="text-gray-400 font-inter text-sm leading-relaxed">
                        Complex Challenges, Intelligent Engineering.
                        A dependable project execution partner since 2011.
                    </p>
                    <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                        <GPTWBadge className="w-auto h-32 md:h-40 shrink-0" />
                        <div className="text-left">
                            <p className="text-xs font-inter text-gray-300">Certified by</p>
                            <p className="text-sm font-bold font-syne tracking-wide pt-1">Great Place To Work® 2026</p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div ref={addToRefs}>
                    <h4 className="font-syne font-bold text-lg mb-6 text-white">Quick Links</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'About Us', path: '/about' },
                            { name: 'Projects Gallery', path: '/projects' },
                            { name: 'Careers', path: '/careers' },
                            { name: 'CSR Initiatives', path: '/csr' },
                            { name: 'Blog', path: '/blog' }
                        ].map(link => (
                            <li key={link.name}>
                                <Link to={link.path} className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-hover py-1">
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-evio-blue" />
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Services */}
                <div ref={addToRefs}>
                    <h4 className="font-syne font-bold text-lg mb-6 text-white">Our Services</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'Turnkey Electrical', path: '/services/turnkey-electrical' },
                            { name: 'Industrial Automation', path: '/services/industrial-automation' },
                            { name: 'Lighting Automation', path: '/services/lighting-automation' },
                            { name: 'Building Automation', path: '/services/building-automation' },
                            { name: 'Industrial IoT', path: '/services/industrial-iot' },
                            { name: 'MEP Contracting', path: '/services/mep' },
                            { name: 'Data Centres', path: '/data-centres' }
                        ].map(link => (
                            <li key={link.name}>
                                <Link to={link.path} className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-hover py-1">
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-evio-blue" />
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div ref={addToRefs}>
                    <h4 className="font-syne font-bold text-lg mb-6 text-white">Reach Us</h4>
                    <ul className="space-y-6">
                        <li className="group flex items-start gap-4 text-gray-400">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-evio-blue/20 transition-colors duration-300 group-hover:scale-110">
                                <MapPin className="text-evio-blue" size={18} />
                            </div>
                            <span className="text-sm mt-1 group-hover:text-white transition-colors duration-300 leading-relaxed">Plot No. A10, Cross Road B, MIDC Industrial Area, Marol, Andheri (E), Mumbai – 400 093</span>
                        </li>
                        <li className="group flex items-center gap-4 text-gray-400">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-evio-blue/20 transition-colors duration-300 group-hover:scale-110">
                                <Phone className="text-evio-blue" size={18} />
                            </div>
                            <a href="tel:+912245766700" className="text-sm group-hover:text-white transition-colors duration-300">+91 22 4576 6700</a>
                        </li>
                        <li className="group flex items-center gap-4 text-gray-400">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-evio-blue/20 transition-colors duration-300 group-hover:scale-110">
                                <Mail className="text-evio-blue" size={18} />
                            </div>
                            <a href="mailto:mumbai@evio.in" className="text-sm group-hover:text-white transition-colors duration-300">mumbai@evio.in</a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Copyright Strip */}
            <div className="footer-bottom max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-inter">
                <p>© {new Date().getFullYear()} EVIO Private Limited. All rights reserved.</p>
                <div className="flex items-center space-x-6">
                    <a href="https://www.linkedin.com/company/evio-pvt-ltd/" target="_blank" rel="noopener noreferrer" aria-label="EVIO on LinkedIn" className="hover:text-evio-blue transition-colors"><Linkedin size={18} /></a>
                    <a href="https://www.facebook.com/profile.php?id=100069426716896" target="_blank" rel="noopener noreferrer" aria-label="EVIO on Facebook" className="hover:text-evio-blue transition-colors"><Facebook size={18} /></a>
                    <Link to="/privacy" className="hover:text-evio-blue transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-evio-blue transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};
