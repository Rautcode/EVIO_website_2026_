import { Helmet } from 'react-helmet-async';
import { ProjectsHero } from '../components/projects/ProjectsHero';
import { ProjectGalleryGrid } from '../components/projects/ProjectGalleryGrid';

export const ProjectsGallery = () => {
    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray">
            <Helmet>
                <title>Projects & Proven Execution | EVIO</title>
                <meta name="description" content="Engineering Infrastructure That Performs Under Demand. EVIO delivers electrical, automation and building-infrastructure projects." />
            </Helmet>
            
            <ProjectsHero />
            <ProjectGalleryGrid />
        </div>
    );
};
