import { Helmet } from 'react-helmet-async';

export const TermsOfService = () => {
    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray pt-[120px] pb-24 px-6">
            <Helmet>
                <title>Terms & Conditions | EVIO Private Limited</title>
                <meta name="description" content="EVIO's Terms and Conditions outlining the rules and regulations for using our corporate website." />
            </Helmet>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-evio-black/5 font-inter text-left">
                <h1 className="font-syne font-bold text-4xl text-evio-navy mb-4">Terms & Conditions</h1>
                <p className="text-sm text-evio-black/50 mb-8">Last Updated: July 8, 2026</p>

                <div className="space-y-6 text-evio-black/80 leading-relaxed">
                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">1. Agreement to Terms</h2>
                        <p>By accessing or using the EVIO website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you must refrain from using the site.</p>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">2. Intellectual Property Rights</h2>
                        <p>All content on this website, including text, graphics, logos, brand titles, and images, is the intellectual property of EVIO Private Limited or licensed partners and is protected by copyright and intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">3. Prohibited Activities</h2>
                        <p>When using this site, you agree not to:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Attempt to exploit API endpoints, submit malicious scripts, or upload code attachments (e.g. via career forms).</li>
                            <li>Attempt to compromise admin dashboard accounts or conduct brute-force/DoS attacks.</li>
                            <li>Harvest email addresses or spam contact modules.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">4. Limitation of Liability</h2>
                        <p>EVIO Private Limited executes project commissions under explicit, separate legal agreements. All content provided on this website is for general informational purposes only, and we do not guarantee its accuracy or completeness.</p>
                    </section>

                    <section>
                        <h2 className="font-syne font-bold text-xl text-evio-navy mb-3">5. Governance</h2>
                        <p>These terms shall be governed by and construed in accordance with the laws of India, under the jurisdiction of Mumbai courts.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
