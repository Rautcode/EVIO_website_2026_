import { HeroSection } from './components/home/HeroSection';
import { WhoWeAre } from './components/home/WhoWeAre';
import { AboutTeaser } from './components/home/AboutTeaser';
import { ServicesSection } from './components/home/ServicesSection';
import { StatsCounter } from './components/home/StatsCounter';
import { LogoMarquee } from './components/home/LogoMarquee';
import { FeaturedProjects } from './components/home/FeaturedProjects';
import { TestimonialsTeaser } from './components/home/TestimonialsTeaser';
import { CtaBanner } from './components/home/CtaBanner';

function App() {
  return (
    <div className="flex flex-col w-full">
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
}

export default App;
