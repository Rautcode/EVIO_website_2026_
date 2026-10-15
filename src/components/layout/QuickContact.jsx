import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { WHATSAPP_NUMBER, SALES_PHONE, track } from '../../lib/leads';

const waLink = (path) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi EVIO, I'd like to discuss a project. (via evio.in${path})`)}`;

// Always-visible contact paths: sticky bar on mobile, floating WhatsApp on desktop.
export const QuickContact = () => {
    const { pathname } = useLocation();

    return (
        <>
            {/* Mobile: bottom action bar (+ spacer so it never covers the footer) */}
            <div className="h-16 md:hidden" />
            <nav aria-label="Quick contact" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-evio-black/10 grid grid-flow-col auto-cols-fr font-inter text-xs font-semibold shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <a href={`tel:${SALES_PHONE}`} onClick={() => track('contact_click', { method: 'phone' })} className="flex flex-col items-center justify-center gap-1 h-16 text-evio-navy">
                    <Phone className="w-5 h-5" /> Call
                </a>
                {WHATSAPP_NUMBER && (
                    <a href={waLink(pathname)} target="_blank" rel="noopener noreferrer" onClick={() => track('contact_click', { method: 'whatsapp' })} className="flex flex-col items-center justify-center gap-1 h-16 text-[#128C7E]">
                        <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                )}
                <Link to={`/contact?ref=sticky:${pathname}`} className="flex flex-col items-center justify-center gap-1 h-16 bg-evio-blue text-white">
                    <FileText className="w-5 h-5" /> Get a Quote
                </Link>
            </nav>

            {/* Desktop: floating WhatsApp */}
            {WHATSAPP_NUMBER && (
                <a
                    href={waLink(pathname)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with EVIO on WhatsApp"
                    onClick={() => track('contact_click', { method: 'whatsapp' })}
                    className="hidden md:flex fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                    <MessageCircle className="w-7 h-7" />
                </a>
            )}
        </>
    );
};
