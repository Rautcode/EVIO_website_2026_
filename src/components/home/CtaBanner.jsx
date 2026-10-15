import { Button } from '../ui/Button';
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CtaBanner = () => {
    return (
        <section className="py-24 bg-evio-navy relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-evio-navy via-evio-navy to-evio-blue opacity-80" />


            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center relative pointer-events-auto">
                <h2 className="text-5xl md:text-7xl font-syne font-bold text-white mb-8">
                    Ready to power your next project?
                </h2>
                <p className="text-xl text-gray-300 font-inter mb-12 max-w-2xl mx-auto">
                    Work with a team that has delivered electrical and automation projects across India since 2011.
                    Let's build something great together.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to="/contact">
                            <Button variant="primary" className="h-14 px-8 text-lg w-full sm:w-auto group shadow-[0_4px_20px_rgba(0,174,239,0.4)] cursor-hover">
                                Contact Us <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                    </Link>
                    <Link to="/downloads">
                            <Button variant="ghost" className="h-14 px-8 text-lg w-full sm:w-auto group cursor-hover hover:border-evio-blue pt-[14px]">
                                Download Brochure <Download className="ml-2 w-5 h-5 inline-flex group-hover:-translate-y-1 transition-transform" />
                            </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
