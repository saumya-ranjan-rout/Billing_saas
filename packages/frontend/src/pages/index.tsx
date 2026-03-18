'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Zap,
  ShieldCheck,
  BarChart3,
  Phone,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
// new
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  const handleGetStarted = () => {
    if (isLoading) return;
    if (isAuthenticated) router.push('/app/dashboard');
    else router.push('/auth/login');
  };

  const businesses = [
    "Agencies",
    "Freelancers",
    "Consultants",
    "Gyms",
    "Retail Shops",
  ];

  const toSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, "-");

  // if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 antialiased">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>
          Best Cloud-Based Billing Software for Small Businesses & Freelancers
          in India | Free 15-Day Trial
        </title>

        <meta name="description"
          content="Best cloud-based billing software for small businesses and freelancers in India. Create GST-compliant invoices, automate payment reminders, manage taxes, and reduce late payments. Start a free 15-day trial today – no credit card required." />

        <meta name="keywords"
          content="billing software, GST invoicing software, cloud billing, invoice generator, payment reminders, small business billing, freelancer invoicing" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://billingsoftwareonline.com/" />

        {/* SoftwareApplication Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context"
              : "https://schema.org", "@type": "SoftwareApplication", name: "Billing Software Online",
            applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: {
              "@type": "Offer",
              price: "0", priceCurrency: "INR",
            }, aggregateRating: {
              "@type": "AggregateRating", ratingValue: "4.8",
              reviewCount: "250",
            },
          }),
        }} />

        {/* FAQ Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context"
              : "https://schema.org", "@type": "FAQPage", mainEntity: [{
                "@type": "Question",
                name: "Is this billing software GST compliant?", acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, fully compliant with Indian GST invoicing standards.",
                },
              }, {
                "@type": "Question",
                name: "Do I need a credit card for the trial?", acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Free 15-day trial without any payment details.",
                },
              }, {
                "@type": "Question",
                name: "Who is this billing software best for?", acceptedAnswer: {
                  "@type": "Answer",
                  text: "Freelancers, agencies, SMEs, consultants, and service businesses in India.",
                },
              },],
          }),
        }} />
      </Head>

      {/* Decorative floating blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 opacity-40 blur-3xl mix-blend-plus-lighter" width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <ellipse cx="400" cy="200" rx="380" ry="180" fill="url(#g1)" />
          <ellipse cx="820" cy="380" rx="360" ry="200" fill="#06b6d4" opacity="0.12" />
        </svg>
      </div>

      {/* Header */}
      {/* <header className="sticky top-0 z-50 backdrop-blur-md bg-blue/60 border-b border-slate-200"> */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-blue-500/10 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">3S</div> */}
            <Image
              src="/logo.png"
              alt="Billing Software Logo"
              width={60}
              height={60}
              className="rounded-lg"
              priority
            />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Billing Software</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Simple. Secure. Scalable.</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* <a href="/indexMerge" className="hover:text-slate-900">Index</a> */}
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
            <button
              onClick={handleGetStarted}
              className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:scale-[1.02] transition-transform"
            >
              Get Started
            </button>
          </nav>

          <div className="md:hidden">
            <button onClick={handleGetStarted} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
       
{/* <section
  id="pricing"
  className="relative overflow-hidden py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100"
> */}
<section
  id="pricing"
  className="relative overflow-hidden py-20 
             bg-gradient-to-b 
             from-[#95ADFF] 
             via-white 
             to-[#AEC7FF]"
>
  {/* Background glow */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
  </div>

  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT – VALUE */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      
      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">
        Built for Indian Businesses 🇮🇳
      </span>

      <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight">
        Billing that helps you  
        <span className="text-indigo-600"> get paid faster</span>
      </h2>

     <p className="mt-5 max-w-4xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
              Create professional GST invoices, automate payment reminders,
              manage taxes effortlessly, and get paid faster — all from a
              secure, user-friendly dashboard.
            </p>

      {/* Trust chips */}
   <div className="mt-10 flex flex-wrap justify-center gap-3">
              {["🔒 SSL Secured", "📊 GST Ready", "☁️ Encrypted Cloud", "⚡ Fast Setup"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm text-slate-600"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

      {/* Business selector */}
       <div className="mt-10 flex flex-wrap justify-center gap-4">
             {/* <a
                href="/signup"
                className="rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
              >
                Start Free 15-Day Trial
              </a>*/}

              <a
                href="#"
                className="rounded-xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Try Free Invoice Generator →
              </a>
                </div>
                <p className="mt-2 text-slate-600 text-sm">
                  Choose your business to explore tools, workflows, and features designed specifically for your industry.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {[
                    ["Agencies", "agencies"],
                    ["Consultants", "consultants"],
                    ["Freelancers", "freelancers"],
                    ["Gyms", "gyms"],
                    ["Retail Shops", "retail-shops"],
                  ].map(([name, slug]) => (
                    <button
                      key={slug}
                      onClick={() => router.push(`/tools/${slug}`)}
className="rounded-full border border-slate-200 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-8 py-2.5 text-sm font-medium
           hover:border-blue-500 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-200 hover:to-indigo-400
           shadow-sm transition-all duration-300"



                    >
                      {name}
                    </button>
                  ))}
                </div>

      {/* Testimonial */}
 

                {/* TESTIMONIAL */}
                <div className="mt-8 mx-auto max-w-4xl rounded-xl bg-slate-50 border border-slate-200 p-5">
                  <p className="text-slate-700 font-semibold">
                    “Reduced late payments by 40% in just 2 months – game-changer for my freelance business!”
                  </p>
                  <span className="mt-2 block text-sm text-slate-500">
                    – Priya S., Freelancer
                  </span>
                </div>
    </motion.div>

    {/* RIGHT – PRICING */}
    {/* <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      viewport={{ once: true }}
      className="grid gap-6 md:grid-cols-3 lg:grid-cols-1"
    > */}
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.1 }}
  viewport={{ once: true }}
  className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
>
      {/* Free */}
      <div className="relative rounded-2xl bg-white/80 backdrop-blur border p-6 shadow-md">
        <h4 className="font-semibold text-blue-700">Free Trial</h4>
        <p className="mt-3 text-3xl font-bold">₹0</p>
        <p className="text-sm text-slate-500">15 days • No credit card</p>

        <ul className="mt-4 text-sm space-y-2">
          <li>✔ Unlimited invoices</li>
          <li>✔ All features unlocked</li>
          <li>✔ Priority support</li>
        </ul>

        <button onClick={handleGetStarted} className="mt-6 w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700">
          Start Free Trial
        </button>
      </div>

      {/* Starter – Highlight */}
      <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-6 shadow-xl scale-[1.03]">
        <span className="absolute -top-3 left-4 rounded-full bg-black/20 px-3 py-1 text-xs">
          Most Popular
        </span>

        <h4 className="font-semibold">Starter</h4>
        <p className="mt-3 text-3xl font-bold">₹299/mo</p>

        <ul className="mt-4 text-sm space-y-2">
          <li>✔ Unlimited invoices</li>
          <li>✔ 500 customers</li>
          <li>✔ Email support</li>
        </ul>

        <button onClick={handleGetStarted} className="mt-6 w-full rounded-lg bg-white text-indigo-600 py-2 font-semibold">
          Choose Starter
        </button>
      </div>

      {/* Business */}
      <div className="rounded-2xl bg-white/80 backdrop-blur border p-6 shadow-md">
        <h4 className="font-semibold">Business</h4>
        <p className="mt-3 text-3xl font-bold">₹1499/yr</p>

        <ul className="mt-4 text-sm space-y-2">
          <li>✔ Unlimited customers</li>
          <li>✔ Advanced analytics</li>
          <li>✔ API access</li>
        </ul>

        <button  onClick={handleGetStarted} className="mt-6 w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold">
          Get Business
        </button>
      </div>
    </motion.div>
  </div>
</section>



        <section className="max-w-7xl mx-auto px-6 pt-0 pb-0">
                         <span className="inline-block mb-3 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold text-center">
                  Trusted by 10,000+ Businesses Across India
                </span>
          <div className="grid gap-8 lg:grid-cols-12 items-center">

            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight">Simplify billing. Accelerate growth.</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl">Automate invoices, manage subscriptions, and get paid faster with bank-grade security and a developer-friendly API.</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={handleGetStarted} className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:opacity-95">
                    Start Monthly — ₹299
                  </button>

                  <button onClick={handleGetStarted} className="inline-flex items-center gap-2 border border-slate-200 px-5 py-3 rounded-lg bg-white hover:shadow-md">
                    Save with Annual — ₹1499
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-6 flex-wrap text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                    <span>PCI & GDPR compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    <span>Rated 4.8 by businesses</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature chips */}
              <motion.div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                {[
                  { icon: <CreditCard className="h-5 w-5" />, title: 'Invoices' },
                  { icon: <Zap className="h-5 w-5" />, title: 'Automation' },
                  { icon: <BarChart3 className="h-5 w-5" />, title: 'Analytics' },
                  { icon: <Phone className="h-5 w-5" />, title: 'Mobile-ready' },
                  { icon: <ShieldCheck className="h-5 w-5" />, title: 'Security' },
                  { icon: <Star className="h-5 w-5" />, title: 'Priority Support' }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
                    <div className="p-2 rounded-md bg-slate-50 border border-slate-100">{f.icon}</div>
                    <div className="text-sm font-medium">{f.title}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right card - pricing / preview */}
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
                <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Live dashboard preview</h3>
                      <p className="text-sm text-slate-500">A quick glance at your revenue and invoices.</p>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">₹299/mo</div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-b from-slate-50 to-white border border-slate-100">
                      <p className="text-xs text-slate-500">Invoices</p>
                      <p className="mt-1 text-lg font-semibold">1,240</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-b from-slate-50 to-white border border-slate-100">
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="mt-1 text-lg font-semibold">₹1.2M</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-28 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-slate-100">
                      <p className="text-sm text-slate-600">(Mini sparkline / chart preview)</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={handleGetStarted} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Get Started</button>
                    <button className="px-4 py-2 rounded-md border border-slate-200">Demo</button>
                  </div>
                </div>

                {/* Accent ribbon */}
                <div className="absolute -top-4 left-6 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">Most popular</div>
              </motion.div>
            </div>
          </div>
        </section>



        {/* PAIN → SOLUTION */}
        <section className="py-24 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">

            {/* Section heading */}
            <div className="text-center mb-14">
              <span className="inline-block mb-3 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">
                Problems → Solutions
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Turn Business Pain Points Into Growth
              </h2>

              <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                Designed to remove billing friction and help Indian businesses
                scale faster with confidence.
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-8 md:grid-cols-3">

              {/* Card 1 */}
              <article className="group relative rounded-2xl border border-slate-200 bg-blue-500/10 p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-blue-600 text-xl">
                  ⏳
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Struggling with Late Payments?
                </h3>

                <p className="text-slate-600 mb-4">
                  Automated reminders and smart late-fee calculations help you recover
                  payments faster — without awkward follow-ups.
                </p>

                <span className="text-sm font-medium text-blue-600">
                  ✔ Get paid on time
                </span>
              </article>

              {/* Card 2 */}
              <article className="group relative rounded-2xl border border-slate-200 bg-blue-500/10 p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-blue-600 text-xl">
                  📄
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  GST Compliance Headaches?
                </h3>

                <p className="text-slate-600 mb-4">
                  Generate GST-ready invoices, summaries, and reports instantly —
                  fully compliant with Indian tax regulations.
                </p>

                <span className="text-sm font-medium text-blue-600">
                  ✔ Stay audit-ready
                </span>
              </article>

              {/* Card 3 */}
              <article className="group relative rounded-2xl border border-slate-200 bg-blue-500/10 p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-blue-600 text-xl">
                  ⚙️
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Too Much Manual Work?
                </h3>

                <p className="text-slate-600 mb-4">
                  Bulk uploads, reusable templates, and integrations eliminate repetitive
                  data entry and save hours every week.
                </p>

                <span className="text-sm font-medium text-blue-600">
                  ✔ Save hours weekly
                </span>
              </article>

            </div>
          </div>
        </section>

        {/* FREE TOOLS */}
        <section className="py-24 border-b border-slate-200  bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}
            <div>
              <span className="inline-block mb-4 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">
                100% Free Tools
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-white-900 mb-6">
                Free Business Tools – No Signup Required
              </h2>

              <p className="text-white-600 mb-8 max-w-xl">
                Save time, stay compliant, and get paid faster using our free tools —
                designed especially for Indian businesses.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <span className="text-lg">🧾</span>
                  <span>
                    <strong>Free Online Invoice Generator</strong> – Create and download
                    professional PDF invoices instantly.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">🧮</span>
                  <span>
                    <strong>GST Calculator</strong> – Quickly calculate taxes for any
                    transaction.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">📉</span>
                  <span>
                    <strong>Late Fee Calculator</strong> – Estimate costs from unpaid
                    invoices and plan better.
                  </span>
                </li>
              </ul>

              <a
                href="/tools/free-invoice-generator"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 px-8 py-4 text-blue-700 font-semibold shadow-lg hover:scale-105 transition"
              >
                Use Free Invoice Generator Now →
              </a>
            </div>

            {/* RIGHT VISUAL / BILLING INFO */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-lg">

                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Smart Billing at a Glance
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center rounded-lg bg-white p-4 border">
                    <span className="text-slate-600">Invoices Generated</span>
                    <span className="font-bold text-slate-900">1,245</span>
                  </div>

                  <div className="flex justify-between items-center rounded-lg bg-white p-4 border">
                    <span className="text-slate-600">GST Calculated</span>
                    <span className="font-bold text-slate-900">₹8.6L</span>
                  </div>

                  <div className="flex justify-between items-center rounded-lg bg-white p-4 border">
                    <span className="text-slate-600">Late Fees Saved</span>
                    <span className="font-bold text-green-600">₹1.2L</span>
                  </div>
                </div>

                <p className="mt-6 text-sm text-slate-500">
                  Real-time insights that help Indian businesses invoice smarter and get
                  paid faster.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-semibold text-center mb-8">Why teams choose Billing Software</h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Automated Invoicing', desc: 'Create and send professional invoices automatically with templates and reminders.', icon: <CreditCard className="h-6 w-6" /> },
              { title: 'Payment Tracking', desc: 'Real-time payment status, receipts and reconciliation tools.', icon: <Zap className="h-6 w-6" /> },
              { title: 'Bank-grade Security', desc: 'End-to-end encryption and role-based access control.', icon: <ShieldCheck className="h-6 w-6" /> },
              { title: 'Mobile-friendly', desc: 'Manage billing on the go with our responsive UI and mobile app.', icon: <Phone className="h-6 w-6" /> },
              { title: 'Powerful Analytics', desc: 'Detailed reports to understand revenue, churn and growth.', icon: <BarChart3 className="h-6 w-6" /> },
              { title: 'Priority Support', desc: 'Fast, human support — available to help with migrations and integrations.', icon: <Star className="h-6 w-6" /> }
            ].map((f, i) => (
              <motion.div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition" whileHover={{ y: -6 }}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">{f.icon}</div>
                  <div>
                    <h4 className="font-semibold">{f.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

       
        {/* FAQ */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">

            {/* LEFT CONTENT */}
            <div>
              <span className="inline-block mb-4 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">
                FAQs
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Questions about our billing software?
              </h2>

              <p className="mt-4 text-slate-600 max-w-md">
                Everything you need to know about GST compliance, free trials,
                integrations, and who this software is best suited for.
              </p>

              {/* Trust points */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600">✔</span>
                  <p className="text-slate-700">
                    Built specifically for Indian GST regulations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600">✔</span>
                  <p className="text-slate-700">
                    No credit card required for free trial
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600">✔</span>
                  <p className="text-slate-700">
                    Trusted by freelancers, SMEs & agencies
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT FAQ LIST */}
            <div className="space-y-4">
              {[
                {
                  q: "Is this billing software GST compliant for Indian businesses?",
                  a: "Yes, it is fully compliant with Indian GST regulations, including e-invoicing and tax reporting.",
                },
                {
                  q: "Do I need a credit card to start the free trial?",
                  a: "No. Our 15-day free trial does not require any payment details upfront.",
                },
                {
                  q: "Who is this cloud billing software best suited for?",
                  a: "Freelancers, agencies, consultants, retail shops, gyms, and service-based SMEs across India.",
                },
                {
                  q: "Can I integrate it with other tools?",
                  a: "Yes, it integrates seamlessly with accounting software, payment gateways, and more.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:border-blue-300 transition"
                >
                  <h3 className="font-semibold text-slate-900">{item.q}</h3>
                  <p className="mt-2 text-slate-600 text-sm">{item.a}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="pt-8 py-24">
          <div className="max-w-6xl mx-auto px-6">

            <div className="rounded-3xl border border-slate-200 px-10 py-16 bg-white">

              <div className="grid md:grid-cols-2 gap-10 items-center">

                {/* Left */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Stop late payments.<br />Start billing smarter.
                  </h2>

                  <p className="text-slate-600 max-w-md mb-8">
                    Create GST invoices, automate reminders, and get paid faster
                    with a secure cloud billing platform built for India.
                  </p>

                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={handleGetStarted}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-8 py-4 font-semibold shadow hover:bg-blue-700 transition"
                    >
                      Start Free Trial
                    </button>

                    <a
                      href="#pricing"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 text-slate-700 px-8 py-4 font-semibold hover:bg-slate-50 transition"
                    >
                      See Plans
                    </a>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    No credit card required • Cancel anytime
                  </p>
                </div>

                {/* Right visual */}
                <div className="hidden md:block">
                  <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li>✔ GST-ready invoices</li>
                      <li>✔ Automated reminders</li>
                      <li>✔ Secure cloud storage</li>
                      <li>✔ Fast setup</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-blue-100 to-white rounded-3xl">
          <h3 className="text-3xl font-semibold text-center mb-6">Loved by teams around the world</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[{
              quote: 'BillingSoftware transformed our cash-flow in under 30 days — reliable, fast and easy to use.',
              name: 'Sarah Johnson', role: 'CEO, TechStart'
            }, {
              quote: 'Subscription management works like a charm. Integrations were painless.',
              name: 'Mike Chen', role: 'Founder, InnovateHub'
            }, {
              quote: 'Secure, scalable, and the support team is outstanding.',
              name: 'Emily Rodriguez', role: 'Operations Lead, GrowthForge'
            }].map((t, i) => (
              <motion.blockquote key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                <p className="italic text-slate-700">“{t.quote}”</p>
                <div className="mt-4 text-sm font-medium text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </motion.blockquote>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold">Ready to transform your billing?</h4>
              <p className="text-sm opacity-90 mt-1">Start your free 15-day trial — no credit card required.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleGetStarted} className="px-6 py-3 rounded-md bg-white text-blue-600 font-semibold">Start Free Trial</button>
              <a href="#pricing" className="px-4 py-3 rounded-md border border-white/30">See Plans</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="mt-12 backdrop-blur-md bg-blue-500/10 border-t border-indigo-100" >
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">© {new Date().getFullYear()} 3SD. All rights reserved.</div>
            <div className="flex gap-4 text-sm">
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/terms" className="hover:underline">Terms</a>
              {/* <a href="#" className="hover:underline">Status</a> */}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}



          {/* <motion.div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h4 className="text-lg font-semibold">Starter</h4>
              <div className="mt-4 text-3xl font-bold">₹299<span className="text-sm font-medium">/mo</span></div>
              <p className="text-sm text-slate-500 mt-2">For new businesses — unlimited invoices, up to 500 customers.</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                <li>Unlimited invoices</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <button onClick={handleGetStarted} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md">Choose</button>
            </motion.div>

            <motion.div className="p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl border-2 border-indigo-600 shadow-lg text-center transform scale-105" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h4 className="text-lg font-semibold">Business</h4>
              <div className="mt-4 text-3xl font-bold">₹1499<span className="text-sm font-medium">/yr</span></div>
              <p className="text-sm text-slate-500 mt-2">Best value — advanced analytics, API access and priority support.</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                <li>Unlimited customers</li>
                <li>Advanced analytics</li>
                <li>API & integrations</li>
              </ul>
              <button onClick={handleGetStarted} className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md">Get Business</button>
            </motion.div> */}

            {/* <motion.div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h4 className="text-lg font-semibold">Enterprise</h4>
              <div className="mt-4 text-3xl font-bold">Custom</div>
              <p className="text-sm text-slate-500 mt-2">Custom plans with SLAs, dedicated support and onboarding assistance.</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                <li>Dedicated success manager</li>
                <li>Custom SLAs</li>
                <li>Priority integrations</li>
              </ul>
              <button onClick={() => router.push('/contact')} className="mt-6 w-full border border-slate-200 py-2 rounded-md">Contact Sales</button>
            </motion.div> */}



//                     <section className="max-w-10xl mx-auto px-6 pt-12 pb-10">
//           <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
                

//           <div className="relative max-w-10xl mx-auto px-6 pt-0 pb-24 text-center">

//             {/* <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">
//               🇮🇳 Made for Indian Businesses
//             </span> */}

//             <h1 className="mt-6 max-w-7xl mx-auto text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-slate-900">
//               Best Cloud-Based Billing Software for Small Businesses & Freelancers
//             </h1>

//             <p className="mt-5 max-w-4xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
//               Create professional GST invoices, automate payment reminders,
//               manage taxes effortlessly, and get paid faster — all from a
//               secure, user-friendly dashboard.
//             </p>
//    <div className="mt-10 flex flex-wrap justify-center gap-3">
//               {["🔒 SSL Secured", "📊 GST Ready", "☁️ Encrypted Cloud", "⚡ Fast Setup"].map(
//                 (item) => (
//                   <span
//                     key={item}
//                     className="rounded-full bg-blue-100 px-4 py-2 text-sm text-slate-600"
//                   >
//                     {item}
//                   </span>
//                 )
//               )}
//             </div>
//             <div className="mt-10 flex flex-wrap justify-center gap-4">
//              {/* <a
//                 href="/signup"
//                 className="rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
//               >
//                 Start Free 15-Day Trial
//               </a>*/}

//               <a
//                 href="#"
//                 className="rounded-xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 hover:bg-slate-50"
//               >
//                 Try Free Invoice Generator →
//               </a>
//                 </div>
//                 <p className="mt-2 text-slate-600 text-sm">
//                   Choose your business to explore tools, workflows, and features designed specifically for your industry.
//                 </p>

//                 {/* BUTTONS */}
//                 <div className="mt-8 flex flex-wrap justify-center gap-4">
//                   {[
//                     ["Agencies", "agencies"],
//                     ["Consultants", "consultants"],
//                     ["Freelancers", "freelancers"],
//                     ["Gyms", "gyms"],
//                     ["Retail Shops", "retail-shops"],
//                   ].map(([name, slug]) => (
//                     <button
//                       key={slug}
//                       onClick={() => router.push(`/tools/${slug}`)}
// className="rounded-full border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 text-sm font-medium
//            hover:border-blue-500 hover:text-blue-700 hover:bg-gradient-to-r hover:from-white hover:to-indigo-600
//            shadow-sm transition-all duration-300"



//                     >
//                       {name}
//                     </button>
//                   ))}
//                 </div>

//                 <p className="mt-5 text-sm text-slate-600">
//                   Freelancers • Digital Agencies • Consultants • Retail Shops • Gyms • Service Providers
//                 </p>

//                 {/* TESTIMONIAL */}
//                 <div className="mt-8 mx-auto max-w-4xl rounded-xl bg-slate-50 border border-slate-200 p-5">
//                   <p className="text-slate-700 font-semibold">
//                     “Reduced late payments by 40% in just 2 months – game-changer for my freelance business!”
//                   </p>
//                   <span className="mt-2 block text-sm text-slate-500">
//                     – Priya S., Freelancer
//                   </span>
//                 </div>
          

         
//           </div>
//         </section>


 {/* Pricing Section */}
  //       <section id="pricing" className="max-w-6xl mx-auto px-6 py-12">
  //         <h3 className="text-3xl font-semibold text-center mb-6">Transparent pricing</h3>
  //         <p className="text-center text-slate-500 mb-8">No surprises. Cancel anytime. 15-day free trial on all plans.</p>

  //         <div className="grid gap-6 md:grid-cols-3">
  //             {/* Free Trial */}
  // <motion.div
  //   className="p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl border-2 border-indigo-600 shadow-lg text-center transform scale-105"
  //   initial={{ opacity: 0 }}
  //   animate={{ opacity: 1 }}
  //   transition={{ delay: 0.1 }}
  // >
  //   <h4 className="text-lg font-semibold text-blue-700">Free Trial</h4>
  //   <div className="mt-4 text-3xl font-bold">₹0<span className="text-sm font-medium"> / 15 Days</span></div>
  //   <p className="text-sm text-slate-500 mt-2">Try all premium features free for 15 days. No credit card required.</p>
  //   <ul className="mt-4 text-sm text-slate-700 space-y-2">
  //     <li>Unlimited invoices</li>
  //     <li>All features unlocked</li>
  //     <li>Priority support</li>
  //   </ul>
  //   <button
  //     onClick={handleGetStarted}
  //     className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
  //   >
  //     Start Free Trial
  //   </button>
  // </motion.div>
  // {/* Starter */}
  // <motion.div
  //   className="p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg text-center"
  //   initial={{ opacity: 0 }}
  //   animate={{ opacity: 1 }}
  //   transition={{ delay: 0.2 }}
  // >
  //   <h4 className="text-lg font-semibold">Starter</h4>
  //   <div className="mt-4 text-3xl font-bold">₹299<span className="text-sm font-medium">/mo</span></div>
  //   <p className="text-sm text-slate-500 mt-2">For new businesses — unlimited invoices, up to 500 customers.</p>
  //   <ul className="mt-4 text-sm text-slate-700 space-y-2">
  //     <li>Unlimited invoices</li>
  //     <li>Basic analytics</li>
  //     <li>Email support</li>
  //   </ul>
  //   <button
  //     onClick={handleGetStarted}
  //     className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md"
  //   >
  //     Choose Starter
  //   </button>
  // </motion.div>

  // {/* Business */}
  // <motion.div
  //   className="p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg text-center"
  //   initial={{ opacity: 0 }}
  //   animate={{ opacity: 1 }}
  //   transition={{ delay: 0.3 }}
  // >
  //   <h4 className="text-lg font-semibold">Business</h4>
  //   <div className="mt-4 text-3xl font-bold">₹1499<span className="text-sm font-medium">/yr</span></div>
  //   <p className="text-sm text-slate-500 mt-2">Best value — advanced analytics, API access and priority support.</p>
  //   <ul className="mt-4 text-sm text-slate-700 space-y-2">
  //     <li>Unlimited customers</li>
  //     <li>Advanced analytics</li>
  //     <li>API & integrations</li>
  //   </ul>
  //   <button
  //     onClick={handleGetStarted}
  //     className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md"
  //   >
  //     Get Business
  //   </button>
  // </motion.div>
  
  //         </div>
  //       </section>
