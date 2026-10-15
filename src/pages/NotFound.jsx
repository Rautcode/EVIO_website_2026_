import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFound = () => {
    return (
        <div className="w-full min-h-screen bg-evio-navy flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden relative">
            <Helmet>
                <title>Page not found | EVIO</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="text-center relative z-10 max-w-2xl">
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-[120px] md:text-[180px] font-syne font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10"
                >
                    404
                </motion.h1>
                
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-syne font-bold text-white mt-4 mb-6"
                >
                    Page Not Found
                </motion.h2>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-white/60 font-inter text-lg mb-10"
                >
                    The circuit seems to be broken. The page you are looking for has been moved, renamed, or might never have existed.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/" className="inline-flex items-center justify-center bg-evio-blue text-white font-inter font-medium text-base h-[48px] px-[32px] rounded-[8px] hover:bg-opacity-90 transition-all shadow-[0_4px_14px_rgba(0,174,239,0.3)] hover:-translate-y-1">
                        Return Home
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};
