import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // For mobile accordion
    const [desktopDropdown, setDesktopDropdown] = useState(null);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const menuVariants = {
        closed: { 
            x: "100%", 
            transition: { type: "tween", duration: 0.5, ease: "easeInOut", staggerChildren: 0.05, staggerDirection: -1 } 
        },
        open: { 
            x: 0, 
            transition: { type: "tween", duration: 0.5, ease: "easeInOut", staggerChildren: 0.1, delayChildren: 0.2 } 
        }
    };

    const itemVariants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Removed problematic useEffect for location.pathname
    // State is reset locally on menu item clicks

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const navItems = [
        { name: 'Home', path: '/' },
        { 
            name: 'Company', 
            dropdown: [
                { name: 'About Us', path: '/about' },
                { name: 'CSR Initiatives', path: '/csr' },
                { name: 'Careers', path: '/careers' },
                { name: 'Life @ EVIO', path: '/life-at-evio' }
            ]
        },
        { name: 'Services', path: '/services' },
        { name: 'Data Centres', path: '/data-centres' },
        { name: 'Projects', path: '/projects' },
        { name: 'Clients', path: '/clients' },
        { 
            name: 'Resources', 
            dropdown: [
                { name: 'Blog', path: '/blog' },
                { name: 'Downloads', path: '/downloads' }
            ]
        }
    ];

    const toggleMobileDropdown = (name) => {
        if (openDropdown === name) setOpenDropdown(null);
        else setOpenDropdown(name);
    };

    return (
        <>
            <header
            data-lenis-prevent
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-auto",
                scrolled 
                    ? "bg-evio-navy/95 backdrop-blur-md py-4 shadow-md" 
                    : isHome ? "bg-transparent py-4" : "bg-evio-navy py-4 shadow-sm"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 relative z-50 cursor-hover group">
                    <img src="/brand/evio-logo-white.svg" alt="EVIO Private Limited" width="153" height="48" className="h-10 md:h-12 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8 whitespace-nowrap">
                    {navItems.map((item) => (
                        <div 
                            key={item.name} 
                            className="relative"
                            onMouseEnter={() => item.dropdown && setDesktopDropdown(item.name)}
                            onMouseLeave={() => item.dropdown && setDesktopDropdown(null)}
                        >
                            {item.dropdown ? (
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDesktopDropdown(desktopDropdown === item.name ? null : item.name);
                                    }}
                                    className={cn("flex items-center text-evio-white/90 hover:text-evio-blue font-inter font-medium transition-colors text-sm uppercase tracking-wide cursor-hover py-2", item.dropdown.some(sub => location.pathname.startsWith(sub.path)) ? "text-evio-blue" : "")}
                                >
                                    {item.name}
                                    <ChevronDown size={14} className={cn("ml-1 opacity-70 transition-transform duration-300", desktopDropdown === item.name ? "rotate-180 text-evio-blue" : "")} />
                                </button>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={cn(
                                        "text-evio-white/90 hover:text-evio-blue font-inter font-medium transition-colors text-sm uppercase tracking-wide cursor-hover py-2 block",
                                        location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? "text-evio-blue" : ""
                                    )}
                                >
                                    {item.name}
                                </Link>
                            )}

                            {/* Dropdown Menu (Desktop) */}
                            {item.dropdown && (
                                <div 
                                    className={cn(
                                        "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-52 transition-all duration-300 z-50",
                                        desktopDropdown === item.name 
                                            ? "opacity-100 pointer-events-auto translate-y-0" 
                                            : "opacity-0 pointer-events-none translate-y-2"
                                    )}
                                >
                                    <div className="bg-white rounded-xl shadow-xl border border-evio-black/5 overflow-hidden py-2">
                                        {item.dropdown.map(subItem => (
                                            <Link
                                                key={subItem.name}
                                                to={subItem.path}
                                                onClick={() => setDesktopDropdown(null)}
                                                className={cn(
                                                    "block px-5 py-2.5 text-sm font-inter text-evio-navy hover:bg-evio-blue/10 hover:text-evio-blue transition-colors cursor-hover whitespace-nowrap",
                                                    location.pathname === subItem.path ? "bg-evio-blue/5 text-evio-blue font-bold" : ""
                                                )}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                        <Link to="/contact" className="ml-4 px-6 py-2.5 bg-evio-blue text-white rounded-lg font-inter font-medium transition-all hover:bg-evio-amber shadow-[0_4px_14px_rgba(0,174,239,0.39)] hover:shadow-[0_4px_14px_rgba(245,158,11,0.39)] hover:-translate-y-0.5 cursor-hover block">
                            Partner With Us
                        </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white relative z-50 cursor-hover"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>
        </header>

        {/* Mobile Menu Overlay - Rendered outside header to bypass containing block issues caused by backdrop-filter */}
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    data-lenis-prevent
                    className="fixed inset-0 bg-evio-navy flex flex-col justify-start items-center gap-6 z-40 overflow-y-auto pt-28 pb-12"
                >
                    {navItems.map((item) => (
                        <motion.div key={item.name} variants={itemVariants} className="flex flex-col items-center w-full">
                            {item.dropdown ? (
                                <>
                                    <button 
                                        onClick={() => toggleMobileDropdown(item.name)}
                                        className="flex items-center text-white text-3xl font-syne font-bold hover:text-evio-blue transition-colors cursor-hover"
                                    >
                                        {item.name}
                                        <ChevronDown size={24} className={cn("ml-2 transition-transform duration-300", openDropdown === item.name ? "rotate-180 text-evio-blue" : "opacity-70")} />
                                    </button>
                                    
                                    {/* Mobile Submenu Accordion */}
                                    <AnimatePresence>
                                        {openDropdown === item.name && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="flex flex-col items-center overflow-hidden mt-4 w-full"
                                            >
                                                {item.dropdown.map(subItem => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.path}
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setOpenDropdown(null);
                                                        }}
                                                        className="text-white/80 text-xl font-inter py-2 hover:text-evio-blue transition-colors cursor-hover block text-center w-full"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setOpenDropdown(null);
                                    }}
                                    className="text-white text-3xl font-syne font-bold hover:text-evio-blue transition-colors cursor-hover"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </motion.div>
                    ))}
                    <motion.div variants={itemVariants}>
                             <Link 
                                to="/contact" 
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setOpenDropdown(null);
                                }}
                                className="mt-8 px-8 py-4 bg-evio-blue text-white rounded-lg font-inter font-bold transition-all hover:bg-evio-amber text-xl inline-block shadow-[0_4px_14px_rgba(0,174,239,0.39)]"
                            >
                                Partner With Us
                            </Link>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};
