import { Helmet } from 'react-helmet-async';
import { HeroSection } from '../components/home/HeroSection';
import { WhoWeAre } from '../components/home/WhoWeAre';
import { AboutTeaser } from '../components/home/AboutTeaser';
import { ServicesSection } from '../components/home/ServicesSection';
import { StatsCounter } from '../components/home/StatsCounter';
import { LogoMarquee } from '../components/home/LogoMarquee';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { TestimonialsTeaser } from '../components/home/TestimonialsTeaser';
import { CtaBanner } from '../components/home/CtaBanner';

export const Home = () => {
    return (
        <div className="flex flex-col w-full">
            <Helmet>
                <title>EVIO - Turnkey Electrical & Automation Solutions</title>
                <meta name="description" content="EVIO Private Limited delivers turnkey electrical, Industrial Automation, and IBMS solutions across India since 2011, including 295 MW of data centre capacity." />
            </Helmet>
            <HeroSection />
            <WhoWeAre />
            <AboutTeaser />
            <ServicesSection />
            <StatsCounter />
            <LogoMarquee />
            <FeaturedProjects />
            <TestimonialsTeaser />
            <CtaBanner />
        </div>
    );
};
