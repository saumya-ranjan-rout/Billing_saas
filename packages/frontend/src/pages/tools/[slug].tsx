import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image"; // <-- fixed import
import { useAuth } from '../../hooks/useAuth';
import { useState } from "react";
import { useFreegstMutation } from "../../services/endpoints/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const freeGSTSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

type FreeGSTFormData = z.infer<typeof freeGSTSchema>;

const INDUSTRIES: Record<string, any> = {
  agencies: {
    INDUSTRY: "Agencies",
    SLUG: "agencies",
    DESCRIPTION: "All-in-one billing and invoicing software for agencies",
    BENEFITS: [
      "Manage multiple clients and projects easily",
      "Automate retainer billing",
    ],
    PROBLEMS: [
      "Manual invoicing for multiple clients",
      "Time wasted in payment follow-ups",
    ],
  },
  consultants: {
    INDUSTRY: "Consultants",
    SLUG: "consultants",
    DESCRIPTION: "Smart billing software for consultants and advisory firms",
    BENEFITS: ["Bill by hours or projects", "Professional GST invoices"],
    PROBLEMS: ["Untracked billable hours", "Delayed client payments"],
  },
  freelancers: {
    INDUSTRY: "Freelancers",
    SLUG: "freelancers",
    DESCRIPTION: "Simple and fast billing software for freelancers",
    BENEFITS: ["Create invoices in 30 seconds", "Recurring billing for clients"],
    PROBLEMS: ["Chasing payments", "Manual invoice creation"],
  },
  gyms: {
    INDUSTRY: "Gyms",
    SLUG: "gyms",
    DESCRIPTION: "Billing and membership management software for gyms",
    BENEFITS: ["Membership billing automation", "Monthly subscription management"],
    PROBLEMS: ["Manual fee collection", "Missed renewals"],
  },
  "retail-shops": {
    INDUSTRY: "Retail Shops",
    SLUG: "retail-shops",
    DESCRIPTION: "GST billing software for retail shops and stores",
    BENEFITS: ["Fast POS billing", "Stock and billing integration"],
    PROBLEMS: ["Manual billing", "Stock mismatch issues"],
  },
};

export default function IndustryPage() {
  const router = useRouter();
  const { slug } = router.query;
   const { isAuthenticated, isLoading } = useAuth();
   const [showPopup, setShowPopup] = useState(false);
const [freeGSTuser, { isLoading: isSubmitting }] = useFreegstMutation();


const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<FreeGSTFormData>({
  resolver: zodResolver(freeGSTSchema),
});


    const handleGetStarted = () => {
    if (isLoading) return;
    if (isAuthenticated) router.push('/app/dashboard');
    else router.push('/auth/login');
  };
const submitLead = async (form: FreeGSTFormData) => {
  try {
    const res = await freeGSTuser({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
    }).unwrap();

    // ✅ Show backend success message
   // alert(res.message || "Registered successfully!");

    reset();
    setShowPopup(false);
    router.push('/tools/free-gst-invoice-generator');
  } catch (err: any) {
    console.error("FreeGST error:", err);

    // ✅ Show backend error message
    alert(
      err?.data?.error ||
      err?.data?.message ||
      err?.error ||
      "Submission failed"
    );
  }
};


  if (!slug) return null;

  const data = INDUSTRIES[slug as string] || INDUSTRIES["agencies"];

  const title = `Billing Software for ${data.INDUSTRY} | GST-Compliant Invoicing & Payment Automation`;
  const description = `${data.DESCRIPTION} – Best billing software for ${data.INDUSTRY} in India. Create GST invoices, automate reminders, and reduce late payments. Free 14-day trial, no credit card.`;

  // icons for billing features
  const icons = [
    "/icons/invoice.svg",
    "/icons/payment.svg",
    "/icons/analytics.svg",
    "/icons/recurring.svg",
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`billing software for ${data.INDUSTRY}, GST invoicing for ${data.SLUG}, ${data.INDUSTRY} billing tool, cloud billing ${data.INDUSTRY}`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://billingsoftwareonline.com/billing-software-for-${data.SLUG}`}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `Is this billing software suitable for ${data.INDUSTRY}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes, it's tailored for ${data.INDUSTRY} needs, including GST compliance, automated reminders, and industry-specific invoicing.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Is the software GST compliant for ${data.INDUSTRY} businesses?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, fully compliant with Indian GST regulations, e-invoicing, and tax reporting.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://billingsoftwareonline.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: `Billing Software for ${data.INDUSTRY}`,
                  item: `https://billingsoftwareonline.com/billing-software-for-${data.SLUG}`,
                },
              ],
            }),
          }}
        />
      </Head>

      <style jsx global>{`
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0;
          padding: 0;
          color: #0f172a;
          background: #f8fafc;
          line-height: 1.6;
        }
        .container {
          max-width: 1100px;
          margin: auto;
          padding: 40px 20px;
        }
        h1 { font-size: 42px; line-height: 1.2; }
        h2 { font-size: 28px; margin-top: 40px; }
        h3 { font-size: 20px; margin-top: 25px; }
        p { color: #334155; font-size: 17px; }
        ul {
          padding-left: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        ul li {
          list-style: none;
          background: #ffffff;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          position: relative;
          padding-left: 60px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        ul li:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }
        ul li img {
          position: absolute;
          left: 15px;
          top: 18px;
          width: 24px;
          height: 24px;
        }
        .btn {
          padding: 14px 26px;
          background: linear-gradient(135deg, #0a66ff, #0052d4);
          color: #fff;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 700;
          transition: all 0.2s ease;
          display: inline-block;
          box-shadow: 0 10px 25px rgba(10, 102, 255, 0.35);
        }
        .btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 14px 35px rgba(10, 102, 255, 0.45);
        }
        .hero {
          background: linear-gradient(135deg, #e6f0ff 0%, #f8fbff 60%, #ffffff 100%);
          padding: 20px 0 80px;
          text-align: center;
          position: relative;
        }
.hero-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}
  .hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 30px;
}
  .popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-box {
  background: white;
  padding: 30px;
  border-radius: 14px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.popup-box h2 {
  margin-bottom: 20px;
}

.popup-box input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
  button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


        .hero p {
          max-width: 720px;
          margin: 20px auto 30px;
          font-size: 18px;
        }
        hr { border: 0; border-top: 1px solid #e5e7eb; margin: 60px 0; }
        footer.container {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }
        footer a { color: #0a66ff; text-decoration: none; font-weight: 600; }
        footer a:hover { text-decoration: underline; }
        @media (max-width: 768px) {
          h1 { font-size: 32px; }
          h2 { font-size: 24px; }
          .hero { padding: 70px 0 60px; }
          .hero-logo { position: relative; top: 0; left: 0; margin-bottom: 20px; }
        }
      `}</style>

    <div className="hero">
  <div className="container">
    {/* Centered logo */}
<div className="hero-logo">
  <Image
    src="/logo.png"
    alt="Billing Software Logo"
    width={140}
    height={60}
    priority
  />
</div>

    <h1>Billing Software for {data.INDUSTRY}</h1>
    <p>
      {data.DESCRIPTION} Our cloud-based billing software simplifies invoicing,
      payments, and compliance for {data.INDUSTRY} businesses in India.
    </p>
    <div className="hero-buttons">
    <a onClick={handleGetStarted} className="btn">
      Start Free 15-Day Trial – No Credit Card
    </a>
      <a
    onClick={() => setShowPopup(true)}
    className="btn"
    style={{ cursor: "pointer" }}
  >
    Free GST Billing
  </a>
    </div>
  </div>
</div>


      <div className="container">
        <h2>Why {data.INDUSTRY} Businesses Choose Our Billing Software</h2>
        <ul>
          {data.BENEFITS.map((b: string, i: number) => (
            <li key={i}>
              <Image src={icons[i % icons.length]} alt="Icon" width={24} height={24} />
              {b}
            </li>
          ))}
          <li>
            <Image src="/icons/invoice.svg" alt="Invoice" width={24} height={24} />
            GST-compliant invoicing and automated tax reports
          </li>
          <li>
            <Image src="/icons/payment.svg" alt="Payment" width={24} height={24} />
            Automated payment reminders to reduce late payments
          </li>
          <li>
            <Image src="/icons/recurring.svg" alt="Recurring" width={24} height={24} />
            Recurring billing for subscriptions and retainers
          </li>
          <li>
            <Image src="/icons/analytics.svg" alt="Analytics" width={24} height={24} />
            Centralized dashboard for financial records and analytics
          </li>
        </ul>

        <h2>Common Problems We Solve for {data.INDUSTRY}</h2>
        <ul>
          {data.PROBLEMS.map((p: string, i: number) => (
            <li key={i}>
              <Image src="/icons/problem.svg" alt="Problem" width={24} height={24} />
              {p}
            </li>
          ))}
          <li>
            <Image src="/icons/payment.svg" alt="Late Payment" width={24} height={24} />
            Delayed client payments and cash flow issues
          </li>
          <li>
            <Image src="/icons/invoice.svg" alt="GST Error" width={24} height={24} />
            Manual GST calculations and compliance errors
          </li>
          <li>
            <Image src="/icons/analytics.svg" alt="Records" width={24} height={24} />
            Disorganized records and time-consuming data entry
          </li>
        </ul>

        <h2>Get Started in Minutes</h2>
        <p>No credit card required. Simple setup for {data.INDUSTRY} workflows.</p>
        <a onClick={handleGetStarted} className="btn">Start Free Trial Now</a>

        <hr />

        <h2>Frequently Asked Questions for {data.INDUSTRY} Billing</h2>
        <h3>Is this software GST compliant?</h3>
        <p>Yes, fully compliant with Indian GST regulations, including automated reports.</p>

        <h3>Can freelancers and teams use it?</h3>
        <p>Yes, it supports individual users, teams, and multi-user access.</p>
      </div>

      <footer className="container">
        © 2026 Billing Software Online • Tailored Billing Solutions for {data.INDUSTRY}
         {/* •{" "} */}
        {/* <a href="/">Home</a> */}
      </footer>
      {showPopup && (
<div className="popup-overlay" onClick={() => setShowPopup(false)}>
  
    <div className="popup-box" onClick={(e) => e.stopPropagation()}>
      <h2>Get Free GST Billing</h2>

   <form onSubmit={handleSubmit(submitLead)}>
  <input placeholder="Full Name" {...register("fullName")} />
  {errors.fullName && <p style={{color:"red"}}>{errors.fullName.message}</p>}

  <input placeholder="Email" {...register("email")} />
  {errors.email && <p style={{color:"red"}}>{errors.email.message}</p>}

  <input placeholder="Phone" {...register("phone")} />
  {errors.phone && <p style={{color:"red"}}>{errors.phone.message}</p>}

  <div className="popup-actions">
    <button type="button" onClick={() => setShowPopup(false)} className="btn btn-secondary">
      Cancel
    </button>

    <button type="submit" className="btn" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  </div>
</form>
    </div>
  </div>
)}

    </>
  );
}





























// import { useRouter } from "next/router";
// import Head from "next/head";

// const INDUSTRIES: Record<string, any> = {
//   agencies: {
//     INDUSTRY: "Agencies",
//     SLUG: "agencies",
//     DESCRIPTION: "All-in-one billing and invoicing software for agencies",
//     BENEFITS: [
//       "Manage multiple clients and projects easily",
//       "Automate retainer billing",
//     ],
//     PROBLEMS: [
//       "Manual invoicing for multiple clients",
//       "Time wasted in payment follow-ups",
//     ],
//   },
//   consultants: {
//     INDUSTRY: "Consultants",
//     SLUG: "consultants",
//     DESCRIPTION: "Smart billing software for consultants and advisory firms",
//     BENEFITS: ["Bill by hours or projects", "Professional GST invoices"],
//     PROBLEMS: ["Untracked billable hours", "Delayed client payments"],
//   },
//   freelancers: {
//     INDUSTRY: "Freelancers",
//     SLUG: "freelancers",
//     DESCRIPTION: "Simple and fast billing software for freelancers",
//     BENEFITS: ["Create invoices in 30 seconds", "Recurring billing for clients"],
//     PROBLEMS: ["Chasing payments", "Manual invoice creation"],
//   },
//   gyms: {
//     INDUSTRY: "Gyms",
//     SLUG: "gyms",
//     DESCRIPTION: "Billing and membership management software for gyms",
//     BENEFITS: ["Membership billing automation", "Monthly subscription management"],
//     PROBLEMS: ["Manual fee collection", "Missed renewals"],
//   },
//   "retail-shops": {
//     INDUSTRY: "Retail Shops",
//     SLUG: "retail-shops",
//     DESCRIPTION: "GST billing software for retail shops and stores",
//     BENEFITS: ["Fast POS billing", "Stock and billing integration"],
//     PROBLEMS: ["Manual billing", "Stock mismatch issues"],
//   },
// };

// export default function IndustryPage() {
//   const router = useRouter();
//   const { slug } = router.query;

//   if (!slug) return null;

//   const data = INDUSTRIES[slug as string] || INDUSTRIES["agencies"];

//   const title = `Billing Software for ${data.INDUSTRY} | GST-Compliant Invoicing & Payment Automation`;
//   const description = `${data.DESCRIPTION} – Best billing software for ${data.INDUSTRY} in India. Create GST invoices, automate reminders, and reduce late payments. Free 14-day trial, no credit card.`;

//   return (
//     <>
//       <Head>
//         <title>{title}</title>
//         <meta name="description" content={description} />
//         <meta
//           name="keywords"
//           content={`billing software for ${data.INDUSTRY}, GST invoicing for ${data.SLUG}, ${data.INDUSTRY} billing tool, cloud billing ${data.INDUSTRY}`}
//         />
//         <meta name="robots" content="index, follow" />
//         <link
//           rel="canonical"
//           href={`https://billingsoftwareonline.com/billing-software-for-${data.SLUG}`}
//         />

//         {/* FAQ Schema */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: [
//                 {
//                   "@type": "Question",
//                   name: `Is this billing software suitable for ${data.INDUSTRY}?`,
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: `Yes, it's tailored for ${data.INDUSTRY} needs, including GST compliance, automated reminders, and industry-specific invoicing.`,
//                   },
//                 },
//                 {
//                   "@type": "Question",
//                   name: `Is the software GST compliant for ${data.INDUSTRY} businesses?`,
//                   acceptedAnswer: {
//                     "@type": "Answer",
//                     text: "Yes, fully compliant with Indian GST regulations, e-invoicing, and tax reporting.",
//                   },
//                 },
//               ],
//             }),
//           }}
//         />

//         {/* Breadcrumb Schema */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               itemListElement: [
//                 {
//                   "@type": "ListItem",
//                   position: 1,
//                   name: "Home",
//                   item: "https://billingsoftwareonline.com/",
//                 },
//                 {
//                   "@type": "ListItem",
//                   position: 2,
//                   name: `Billing Software for ${data.INDUSTRY}`,
//                   item: `https://billingsoftwareonline.com/billing-software-for-${data.SLUG}`,
//                 },
//               ],
//             }),
//           }}
//         />
//       </Head>

//       {/* SAME CSS AS HTML */}
// <style jsx global>{`
//   body {
//     font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
//     margin: 0;
//     padding: 0;
//     color: #0f172a;
//     background: #f8fafc;
//     line-height: 1.6;
//   }

//   .container {
//     max-width: 1100px;
//     margin: auto;
//     padding: 40px 20px;
//   }

//   h1 {
//     font-size: 42px;
//     line-height: 1.2;
//   }

//   h2 {
//     font-size: 28px;
//     margin-top: 40px;
//   }

//   h3 {
//     font-size: 20px;
//     margin-top: 25px;
//   }

//   p {
//     color: #334155;
//     font-size: 17px;
//   }

//   ul {
//     padding-left: 0;
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//     gap: 16px;
//     margin-top: 20px;
//   }

//   ul li {
//     list-style: none;
//     background: #ffffff;
//     border-radius: 12px;
//     padding: 18px 20px;
//     box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
//     position: relative;
//     padding-left: 48px;
//     transition: transform 0.2s ease, box-shadow 0.2s ease;
//   }

//   ul li:hover {
//     transform: translateY(-3px);
//     box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
//   }

//   ul li::before {
//     content: "✔";
//     position: absolute;
//     left: 18px;
//     top: 18px;
//     color: #0a66ff;
//     font-weight: bold;
//   }

//   .btn {
//     padding: 14px 26px;
//     background: linear-gradient(135deg, #0a66ff, #0052d4);
//     color: #fff;
//     text-decoration: none;
//     border-radius: 10px;
//     font-weight: 700;
//     transition: all 0.2s ease;
//     display: inline-block;
//     box-shadow: 0 10px 25px rgba(10, 102, 255, 0.35);
//   }

//   .btn:hover {
//     transform: translateY(-2px) scale(1.02);
//     box-shadow: 0 14px 35px rgba(10, 102, 255, 0.45);
//   }

//   .hero {
//     background: linear-gradient(135deg, #e6f0ff 0%, #f8fbff 60%, #ffffff 100%);
//     padding: 90px 0 80px;
//     text-align: center;
//   }

//   .hero p {
//     max-width: 720px;
//     margin: 20px auto 30px;
//     font-size: 18px;
//   }

//   hr {
//     border: 0;
//     border-top: 1px solid #e5e7eb;
//     margin: 60px 0;
//   }

//   footer.container {
//     margin-top: 40px;
//     text-align: center;
//     font-size: 14px;
//     color: #64748b;
//   }

//   footer a {
//     color: #0a66ff;
//     text-decoration: none;
//     font-weight: 600;
//   }

//   footer a:hover {
//     text-decoration: underline;
//   }

//   /* Mobile optimization */
//   @media (max-width: 768px) {
//     h1 {
//       font-size: 32px;
//     }
//     h2 {
//       font-size: 24px;
//     }
//     .hero {
//       padding: 70px 0 60px;
//     }
//   }
// `}</style>


//       {/* HERO */}
//       <div className="hero">
//         <div className="container">
//           <h1>Billing Software for {data.INDUSTRY}</h1>
//           <p>
//             {data.DESCRIPTION} Our cloud-based billing software simplifies invoicing,
//             payments, and compliance for {data.INDUSTRY} businesses in India.
//           </p>
//           <a href="/signup" className="btn">
//             Start Free 14-Day Trial – No Credit Card
//           </a>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="container">
//         <h2>Why {data.INDUSTRY} Businesses Choose Our Billing Software</h2>
//         <ul>
//           {data.BENEFITS.map((b: string, i: number) => (
//             <li key={i}>{b}</li>
//           ))}
//           <li>GST-compliant invoicing and automated tax reports</li>
//           <li>Automated payment reminders to reduce late payments</li>
//           <li>Recurring billing for subscriptions and retainers</li>
//           <li>Centralized dashboard for financial records and analytics</li>
//         </ul>

//         <h2>Common Problems We Solve for {data.INDUSTRY}</h2>
//         <ul>
//           {data.PROBLEMS.map((p: string, i: number) => (
//             <li key={i}>{p}</li>
//           ))}
//           <li>Delayed client payments and cash flow issues</li>
//           <li>Manual GST calculations and compliance errors</li>
//           <li>Disorganized records and time-consuming data entry</li>
//         </ul>

//         <h2>Get Started in Minutes</h2>
//         <p>No credit card required. Simple setup for {data.INDUSTRY} workflows.</p>
//         <a href="/signup" className="btn">Start Free Trial Now</a>

//         <hr />

//         <h2>Frequently Asked Questions for {data.INDUSTRY} Billing</h2>
//         <h3>Is this software GST compliant?</h3>
//         <p>Yes, fully compliant with Indian GST regulations, including automated reports.</p>

//         <h3>Can freelancers and teams use it?</h3>
//         <p>Yes, it supports individual users, teams, and multi-user access.</p>
//       </div>

//       <footer className="container">
//         © 2026 Billing Software Online • Tailored Billing Solutions for {data.INDUSTRY} •{" "}
//         <a href="/">Home</a>
//       </footer>
//     </>
//   );
// }
