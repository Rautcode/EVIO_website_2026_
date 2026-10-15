import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CookieConsent } from '../ui/CookieConsent';
import { QuickContact } from './QuickContact';
import { useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Layout = () => {
    const location = useLocation();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);



    return (
        <>

            <Helmet>
                <link rel="canonical" href={`https://evio.in${location.pathname.replace(/\/$/, '') || '/'}`} />
                <meta property="og:url" content={`https://evio.in${location.pathname}`} />
            </Helmet>
            <Navbar />

            <main className="min-h-screen bg-evio-white w-full flex flex-col">
                <Suspense fallback={
                    <div className="w-full flex-1 flex items-center justify-center min-h-[50vh]">
                        <div className="w-10 h-10 border-4 border-evio-navy/10 border-t-evio-blue rounded-full animate-spin"></div>
                    </div>
                }>
                    <Outlet />
                </Suspense>
            </main>

            <Footer />
            <QuickContact />
            <CookieConsent />
        </>
    );
};
