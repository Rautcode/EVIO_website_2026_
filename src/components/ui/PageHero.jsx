// Inner-page hero: one real EVIO photo, a dark scrim for legibility, left-aligned type.
// Replaces the per-page gradient + floating-icon heroes.
export const PageHero = ({ eyebrow, title, subtitle, image, children }) => (
    <section className="relative w-full bg-evio-navy overflow-hidden">
        {image && (
            <img src={image} alt="" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-evio-navy via-evio-navy/85 to-evio-navy/40" />
        <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-20 md:pt-44 md:pb-24">
            {eyebrow && <p className="text-xs font-inter font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-4">{eyebrow}</p>}
            <h1 className="text-4xl md:text-6xl font-syne font-bold text-white max-w-3xl leading-[1.1] mb-5">{title}</h1>
            {subtitle && <p className="text-lg text-white/75 font-inter max-w-2xl leading-relaxed">{subtitle}</p>}
            {children}
        </div>
    </section>
);
