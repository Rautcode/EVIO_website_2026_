import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadAnalytics } from '../../lib/leads';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('evio_cookie_consent');
        if (!consent) {
            // Short delay so the banner doesn't compete with the first paint
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('evio_cookie_consent', 'accepted');
        loadAnalytics();
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('evio_cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-20 md:bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(11,36,21,0.15)] border border-evio-black/5 z-50 flex flex-col gap-4 font-inter text-left"
                >
                    <div>
                        <h4 className="font-syne font-bold text-lg text-evio-navy mb-1">Cookie Preferences</h4>
                        <p className="text-sm text-evio-black/70 leading-relaxed">
                            We use cookies to optimize site navigation, analyze traffic, and enhance your user experience. By clicking "Accept", you agree to our use of cookies.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center justify-end mt-2">
                        <button
                            onClick={handleDecline}
                            className="px-4 py-2 text-sm font-medium text-evio-black/60 hover:text-evio-navy transition-colors cursor-hover"
                        >
                            Decline
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-5 py-2.5 bg-evio-blue text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-95 transition-all hover:-translate-y-0.5 cursor-hover"
                        >
                            Accept Cookies
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
