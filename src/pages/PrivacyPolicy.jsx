import { Helmet } from 'react-helmet-async';

export const PrivacyPolicy = () => {
    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray pt-[120px] pb-24 px-6">
            <Helmet>
                <title>Privacy Policy | EVIO Private Limited</title>
                <meta name="description" content="EVIO's Privacy Policy explaining how we collect, use, and protect your personal information on our site." />
            </Helmet>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-evio-black/5 font-inter text-left">
                <h1 className="font-syne font-bold text-4xl text-evio-navy mb-4">Privacy Policy</h1>
                <p className="text-sm text-evio-black/50 mb-8">Last Updated: July 8, 2026</p>

                <div className="space-y-6 text-evio-black/80 leading-relaxed">
                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">1. Information We Collect</h2>
                        <p className="mb-2">We collect information that you voluntarily provide to us when you fill out forms on our website. This includes:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Inquiry forms:</strong> Name, email address, company name, telephone number, and message content.</li>
                            <li><strong>Job application forms:</strong> Resume files, contact details, work history, and covering notes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">2. How We Use Your Information</h2>
                        <p className="mb-2">We use the collected data to respond to your inquiries and evaluate job applications. Specifically:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Processing business requests and project consultations.</li>
                            <li>Assessing suitability for open job positions within our engineering and execution divisions.</li>
                            <li>Complying with legal requirements and safety policies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">3. Data Protection and Security</h2>
                        <p>We implement a variety of security measures, including parameterized queries, secure database storage, and SSL encryption, to maintain the safety of your personal information. However, no internet transmission is 100% secure, and we cannot guarantee absolute protection.</p>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">4. Cookies and Tracking</h2>
                        <p>We use essential cookies to manage sessions and basic preference settings. Any analytical or performance cookies are only loaded upon receiving user consent via the cookie banner.</p>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">5. Contact Information</h2>
                        <p>If you have any questions or concerns regarding our privacy policies, please contact us at <a href="mailto:mumbai@evio.in" className="text-evio-blue hover:underline">mumbai@evio.in</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
