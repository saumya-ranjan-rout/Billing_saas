import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">

            {/* Header */}
            <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                        3S
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">Billing Software</h1>
                        <p className="text-xs text-slate-500">Terms & Conditions</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                    <h2 className="text-3xl font-semibold">Terms & Conditions</h2>
                    <p className="text-sm text-slate-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h3>
                        <p className="text-sm text-slate-600">
                            By using our service, you agree to comply with these terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">2. User Responsibilities</h3>
                        <p className="text-sm text-slate-600">
                            You are responsible for maintaining the confidentiality of your account
                            and all activities under it.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">3. Payments & Subscriptions</h3>
                        <p className="text-sm text-slate-600">
                            Subscription fees are billed according to your selected plan and are
                            non-refundable unless stated otherwise.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">4. Termination</h3>
                        <p className="text-sm text-slate-600">
                            We reserve the right to suspend or terminate accounts for misuse
                            or violation of terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">5. Account Registration</h3>
                        <p className="text-sm text-slate-600">
                            To access certain features, you must register for an account. You agree to provide
                            accurate and complete information and to keep your account details updated.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">6. Acceptable Use</h3>
                        <p className="text-sm text-slate-600">
                            You agree not to misuse the service, attempt unauthorized access, interfere with
                            system security, or use the platform for unlawful activities.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">7. Data Ownership</h3>
                        <p className="text-sm text-slate-600">
                            You retain full ownership of your data. By using our service, you grant us permission
                            to process your data solely for providing and improving the service.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">8. Service Availability</h3>
                        <p className="text-sm text-slate-600">
                            While we strive for maximum uptime, we do not guarantee uninterrupted service.
                            Scheduled maintenance and unexpected outages may occur.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">9. Limitation of Liability</h3>
                        <p className="text-sm text-slate-600">
                            To the maximum extent permitted by law, Billing Software shall not be liable
                            for any indirect, incidental, or consequential damages arising from the use
                            or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">10. Intellectual Property</h3>
                        <p className="text-sm text-slate-600">
                            All content, trademarks, logos, and software related to the service remain
                            the exclusive property of Billing Software and may not be copied or reused
                            without permission.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">11. Changes to Terms</h3>
                        <p className="text-sm text-slate-600">
                            We reserve the right to update these Terms & Conditions at any time. Continued
                            use of the service after changes implies acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">12. Governing Law</h3>
                        <p className="text-sm text-slate-600">
                            These terms shall be governed and interpreted in accordance with the laws of
                            India, without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">13. Contact Information</h3>
                        <p className="text-sm text-slate-600">
                            If you have any questions regarding these Terms & Conditions, please contact
                            us at <span className="font-medium">support@3sd.com</span>.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 mt-10">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between text-sm text-slate-600">
                    <span>© {new Date().getFullYear()} 3SD. All rights reserved.</span>
                    <div className="flex gap-4">
                        <Link href="/terms" className="hover:underline">Terms</Link>
                        <Link href="/privacy" className="hover:underline">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
