import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">

      {/* Header */}
<header className="border-b border-slate-200 bg-blue-500/10 backdrop-blur">
  <div className="max-w-4xl mx-auto px-6 py-4">
    <div className="flex items-center gap-4">
      <Image
        src="/logo.png"
        alt="Billing Software Logo"
        width={60}
        height={60}
        className="rounded-lg"
        priority
      />
      <div>
        <h1 className="text-lg font-semibold">Billing Software</h1>
        <p className="text-xs text-slate-500">Privacy Policy</p>
      </div>
    </div>
  </div>
</header>



      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h2 className="text-3xl font-semibold">Privacy Policy</h2>
          <p className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h3 className="font-semibold text-lg mb-2">1. Information We Collect</h3>
            <p className="text-sm text-slate-600">
              We collect information such as your name, email address, billing details,
              and usage data to provide and improve our services.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">2. How We Use Your Data</h3>
            <p className="text-sm text-slate-600">
              Your data is used for authentication, invoicing, analytics, support,
              and security purposes only.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">3. Data Security</h3>
            <p className="text-sm text-slate-600">
              We use industry-standard encryption, access control, and monitoring
              to protect your data.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">4. Contact</h3>
            <p className="text-sm text-slate-600">
              If you have questions about this policy, contact us at support@3sd.com
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">5. Types of Information Collected</h3>
            <p className="text-sm text-slate-600">
              We may collect personal information such as name, email address, phone number,
              business details, payment information, and account credentials. We also collect
              technical data including IP address, browser type, and device information.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">6. Cookies & Tracking Technologies</h3>
            <p className="text-sm text-slate-600">
              We use cookies and similar technologies to enhance user experience, analyze
              usage patterns, and improve platform performance. You can control cookies
              through your browser settings.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">7. How We Share Information</h3>
            <p className="text-sm text-slate-600">
              We do not sell or rent your personal data. Information may be shared only with
              trusted third-party service providers under strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">8. Data Retention</h3>
            <p className="text-sm text-slate-600">
              We retain your data only for as long as necessary to fulfill legal, operational,
              and business requirements.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">9. User Rights</h3>
            <p className="text-sm text-slate-600">
              You have the right to access, update, correct, or delete your personal data.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">10. Third-Party Services</h3>
            <p className="text-sm text-slate-600">
              Our platform may contain links to third-party websites or services. We are not
              responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">11. Children’s Privacy</h3>
            <p className="text-sm text-slate-600">
              Our services are not intended for individuals under the age of 18.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">12. International Data Transfers</h3>
            <p className="text-sm text-slate-600">
              Your information may be processed and stored on servers outside your country,
              in compliance with applicable laws.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">13. Changes to This Policy</h3>
            <p className="text-sm text-slate-600">
              We may update this Privacy Policy from time to time.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">14. Contact Us</h3>
            <p className="text-sm text-slate-600">
              For any concerns, contact us at{" "}
              <span className="font-medium">support@3sd.com</span>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-10 bg-blue-500/10">
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
