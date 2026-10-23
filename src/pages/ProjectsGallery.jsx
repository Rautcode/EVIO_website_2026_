import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { DataContext } from '../context/DataContext';
import { withAdminProjects } from '../data/projectMap';
import { ProjectsHero } from '../components/projects/ProjectsHero';
import { ProjectGalleryGrid } from '../components/projects/ProjectGalleryGrid';
import { ProjectMap } from '../components/projects/ProjectMap';

export const ProjectsGallery = () => {
    const { dbProjects } = useContext(DataContext);
    const { cities, unmapped } = withAdminProjects(dbProjects || []);
    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray">
            <Helmet>
                <title>Projects & Proven Execution | EVIO</title>
                <meta name="description" content="Engineering Infrastructure That Performs Under Demand. EVIO delivers electrical, automation and building-infrastructure projects." />
            </Helmet>
            
            <ProjectsHero />
            <ProjectMap cities={cities} unmapped={unmapped} />
            <ProjectGalleryGrid />
        </div>
    );
};
