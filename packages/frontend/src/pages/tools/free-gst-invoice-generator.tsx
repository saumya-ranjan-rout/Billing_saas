import Head from "next/head";
import { useEffect, useState, ChangeEvent } from "react";
import { jsPDF } from "jspdf";
import { useApi } from '../../hooks/useApi';
import { useRouter } from 'next/router';
type InvoiceItem = {
    description: string;
    hsn: string;
    qty: number;
    rate: number;
    total: number;
};
export default function FreeGSTInvoiceGenerator() {
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState<string>("");
    const [items, setItems] = useState<InvoiceItem[]>([
        { description: "", hsn: "", qty: 1, rate: 0, total: 0 },
    ]);
    const [gstRate, setGstRate] = useState(18);
    const [grandTotal, setGrandTotal] = useState(0);
    const [seller, setSeller] = useState("");
    const [sellerGst, setSellerGst] = useState("");
    const [sellerAddr, setSellerAddr] = useState("");
    const [buyer, setBuyer] = useState("");
    const [buyerGst, setBuyerGst] = useState("");
    const [buyerAddr, setBuyerAddr] = useState("");
    const [bank, setBank] = useState("");
    const [terms, setTerms] = useState("Payment due within 15 days.");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    // new
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailTo, setEmailTo] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const { postForm } = useApi<any>();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo);
  const router = useRouter();

    useEffect(() => {
        setInvoiceNo("INV-" + Date.now());
        setInvoiceDate(new Date().toISOString().split("T")[0]);
    }, []);

    useEffect(() => {
        let subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
        let gst = (subtotal * gstRate) / 100;
        setGrandTotal(subtotal + gst);
        setItems((prev) =>
            prev.map((i) => ({ ...i, total: parseFloat((i.qty * i.rate).toFixed(2)) }))
        );
    }, [items, gstRate]);

    const handleItemChange = <
        K extends keyof InvoiceItem
    >(
        index: number,
        field: K,
        value: InvoiceItem[K]
    ) => {
        setItems((prev) => {
            const newItems = [...prev];
            newItems[index][field] =
                field === "qty" || field === "rate"
                    ? Number(value)
                    : (value as any);
            return newItems;
        });
    };

useEffect(() => {
  const previousBg = document.body.style.background;

  document.body.style.background =
    "linear-gradient(180deg, #e8ecf3 0%, #b9c8f8 100%)";

  return () => {
    document.body.style.background = previousBg;
  };
}, []);
    const addItem = () => setItems((prev) => [...prev, { description: "", hsn: "", qty: 1, rate: 0, total: 0 }]);
    const removeItem = (index: number) => setItems((prev) => prev.filter((_, idx) => idx !== index));

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setLogoFile(e.target.files[0]);
    };

    const generatePDF = async () => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        const startX = 14;
        let currentY = 20;
        const addImageWatermark = async () => {
            const img = new Image();
            img.src = "/background.png"; // must be in /public folder

            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
            });

            const pageCount = doc.getNumberOfPages();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                doc.saveGraphicsState();
                doc.setGState(new (doc as any).GState({ opacity: 0.08 }));

                const imgWidth = 120;
                const imgHeight = 120;

                doc.addImage(
                    img,
                    "PNG",
                    (pageWidth - imgWidth) / 2,
                    (pageHeight - imgHeight) / 2,
                    imgWidth,
                    imgHeight
                );

                doc.restoreGraphicsState();
            }
        };

        const drawLine = (y: number) => {
            doc.setDrawColor(220);
            doc.line(startX, y, pageWidth - startX, y);
        };

        const renderContent = async () => {
            /* ================= HEADER ================= */
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("GST TAX INVOICE", pageWidth / 2, currentY, { align: "center" });

            currentY += 10;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            doc.text(`Invoice No: ${invoiceNo}`, pageWidth - 70, currentY);
            doc.text(`Date: ${invoiceDate}`, pageWidth - 70, currentY + 5);

            currentY += 10;
            drawLine(currentY);
            currentY += 6;

            /* ================= SELLER & BUYER ================= */
            doc.setFont("helvetica", "bold");
            doc.text("Seller Details", startX, currentY);
            doc.text("Buyer Details", pageWidth / 2 + 5, currentY);

            doc.setFont("helvetica", "normal");
            currentY += 6;

            doc.text(seller || "-", startX, currentY);
            doc.text(buyer || "-", pageWidth / 2 + 5, currentY);

            currentY += 5;
            doc.text(`GSTIN: ${sellerGst || "-"}`, startX, currentY);
            doc.text(`GSTIN: ${buyerGst || "-"}`, pageWidth / 2 + 5, currentY);

            currentY += 5;
            doc.text(`Address: ${sellerAddr || "-"}`, startX, currentY, { maxWidth: 80 });
            doc.text(`Address: ${buyerAddr || "-"}`, pageWidth / 2 + 5, currentY, {
                maxWidth: 80,
            });

            currentY += 12;
            drawLine(currentY);
            currentY += 8;

            /* ================= TABLE HEADER ================= */
            doc.setFont("helvetica", "bold");
            doc.setFillColor(245, 247, 250);
            doc.rect(startX, currentY - 5, pageWidth - 28, 8, "F");

            doc.text("Description", startX + 2, currentY);
            doc.text("HSN", startX + 80, currentY);
            doc.text("Qty", startX + 100, currentY, { align: "right" });
            doc.text("Rate", startX + 120, currentY, { align: "right" });
            doc.text("Amount", pageWidth - 20, currentY, { align: "right" });

            currentY += 6;
            doc.setFont("helvetica", "normal");

            /* ================= TABLE ROWS ================= */
            let subTotal = 0;

            items.forEach((item) => {
                const amount = item.qty * item.rate;
                subTotal += amount;

                if (currentY > 270) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.text(item.description || "-", startX + 2, currentY, { maxWidth: 70 });
                doc.text(item.hsn || "-", startX + 80, currentY);
                doc.text(String(item.qty), startX + 100, currentY, { align: "right" });
                doc.text(item.rate.toFixed(2), startX + 120, currentY, { align: "right" });
                doc.text(amount.toFixed(2), pageWidth - 20, currentY, { align: "right" });

                currentY += 6;
            });

            currentY += 4;
            drawLine(currentY);
            currentY += 6;

            /* ================= TOTALS ================= */
            const gstAmount = (subTotal * gstRate) / 100;

            doc.text("Subtotal:", pageWidth - 70, currentY);
            doc.text(subTotal.toFixed(2), pageWidth - 20, currentY, { align: "right" });

            currentY += 5;
            doc.text(`GST (${gstRate}%):`, pageWidth - 70, currentY);
            doc.text(gstAmount.toFixed(2), pageWidth - 20, currentY, { align: "right" });

            currentY += 6;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Grand Total:", pageWidth - 70, currentY);
            doc.text(
                `₹ ${grandTotal.toFixed(2)}`,
                pageWidth - 20,
                currentY,
                { align: "right" }
            );

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            /* ================= FOOTER ================= */
            currentY += 12;
            drawLine(currentY);
            currentY += 6;

            const drawBlock = (
                label: string,
                value: string,
                x: number,
                y: number,
                maxWidth: number,
                lineHeight = 6,
                gapAfter = 6
            ) => {
                doc.setFont("helvetica", "bold");
                doc.text(label, x, y);

                doc.setFont("helvetica", "normal");
                const lines = doc.splitTextToSize(value || "-", maxWidth);
                doc.text(lines, x, y + lineHeight);

                return lineHeight + lines.length * lineHeight + gapAfter;
            };

            const footerWidth = pageWidth - 28;

            // Bank details block
            currentY += drawBlock(
                "Bank Details:",
                bank,
                startX,
                currentY,
                footerWidth
            );

            // EXTRA BREAK (this is what you want 👇)
            currentY += 6;

            // Terms block
            currentY += drawBlock(
                "Terms & Conditions:",
                terms,
                startX,
                currentY,
                footerWidth
            );

            currentY += 10;
            doc.text("This is a computer generated invoice.", pageWidth / 2, currentY, {
                align: "center",
            });

            await addImageWatermark();
            doc.save(`GST-Invoice-${invoiceNo}.pdf`);
            setTimeout(() => setShowPopup(true), 1000);
        };

        /* ================= LOGO ================= */
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                doc.addImage(e.target?.result as string, "PNG", startX, 10, 30, 15);
                await renderContent();
            };
            reader.readAsDataURL(logoFile);
        } else {
            await renderContent();
        }
    };

    const loadImageAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const renderInvoice = async (doc: jsPDF) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const startX = 14;
        let currentY = 20;

        const addImageWatermark = async () => {
            const img = new Image();
            img.src = "/background.png"; // must be in /public folder

            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
            });

            const pageCount = doc.getNumberOfPages();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                doc.saveGraphicsState();
                doc.setGState(new (doc as any).GState({ opacity: 0.08 }));

                const imgWidth = 120;
                const imgHeight = 120;

                doc.addImage(
                    img,
                    "PNG",
                    (pageWidth - imgWidth) / 2,
                    (pageHeight - imgHeight) / 2,
                    imgWidth,
                    imgHeight
                );

                doc.restoreGraphicsState();
            }
        };

        const drawLine = (y: number) => {
            doc.setDrawColor(220);
            doc.line(startX, y, pageWidth - startX, y);
        };

        const renderContent = async () => {
            /* ================= HEADER ================= */
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("GST TAX INVOICE", pageWidth / 2, currentY, { align: "center" });

            currentY += 10;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            doc.text(`Invoice No: ${invoiceNo}`, pageWidth - 70, currentY);
            doc.text(`Date: ${invoiceDate}`, pageWidth - 70, currentY + 5);

            currentY += 10;
            drawLine(currentY);
            currentY += 6;

            /* ================= SELLER & BUYER ================= */
            doc.setFont("helvetica", "bold");
            doc.text("Seller Details", startX, currentY);
            doc.text("Buyer Details", pageWidth / 2 + 5, currentY);

            doc.setFont("helvetica", "normal");
            currentY += 6;

            doc.text(seller || "-", startX, currentY);
            doc.text(buyer || "-", pageWidth / 2 + 5, currentY);

            currentY += 5;
            doc.text(`GSTIN: ${sellerGst || "-"}`, startX, currentY);
            doc.text(`GSTIN: ${buyerGst || "-"}`, pageWidth / 2 + 5, currentY);

            currentY += 5;
            doc.text(`Address: ${sellerAddr || "-"}`, startX, currentY, { maxWidth: 80 });
            doc.text(`Address: ${buyerAddr || "-"}`, pageWidth / 2 + 5, currentY, {
                maxWidth: 80,
            });

            currentY += 12;
            drawLine(currentY);
            currentY += 8;

            /* ================= TABLE HEADER ================= */
            doc.setFont("helvetica", "bold");
            doc.setFillColor(245, 247, 250);
            doc.rect(startX, currentY - 5, pageWidth - 28, 8, "F");

            doc.text("Description", startX + 2, currentY);
            doc.text("HSN", startX + 80, currentY);
            doc.text("Qty", startX + 100, currentY, { align: "right" });
            doc.text("Rate", startX + 120, currentY, { align: "right" });
            doc.text("Amount", pageWidth - 20, currentY, { align: "right" });

            currentY += 6;
            doc.setFont("helvetica", "normal");

            /* ================= TABLE ROWS ================= */
            let subTotal = 0;

            items.forEach((item) => {
                const amount = item.qty * item.rate;
                subTotal += amount;

                if (currentY > 270) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.text(item.description || "-", startX + 2, currentY, { maxWidth: 70 });
                doc.text(item.hsn || "-", startX + 80, currentY);
                doc.text(String(item.qty), startX + 100, currentY, { align: "right" });
                doc.text(item.rate.toFixed(2), startX + 120, currentY, { align: "right" });
                doc.text(amount.toFixed(2), pageWidth - 20, currentY, { align: "right" });

                currentY += 6;
            });

            currentY += 4;
            drawLine(currentY);
            currentY += 6;

            /* ================= TOTALS ================= */
            const gstAmount = (subTotal * gstRate) / 100;

            doc.text("Subtotal:", pageWidth - 70, currentY);
            doc.text(subTotal.toFixed(2), pageWidth - 20, currentY, { align: "right" });

            currentY += 5;
            doc.text(`GST (${gstRate}%):`, pageWidth - 70, currentY);
            doc.text(gstAmount.toFixed(2), pageWidth - 20, currentY, { align: "right" });

            currentY += 6;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Grand Total:", pageWidth - 70, currentY);
            doc.text(
                `₹ ${grandTotal.toFixed(2)}`,
                pageWidth - 20,
                currentY,
                { align: "right" }
            );

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            /* ================= FOOTER ================= */
            currentY += 12;
            drawLine(currentY);
            currentY += 6;

            const drawBlock = (
                label: string,
                value: string,
                x: number,
                y: number,
                maxWidth: number,
                lineHeight = 6,
                gapAfter = 6
            ) => {
                doc.setFont("helvetica", "bold");
                doc.text(label, x, y);

                doc.setFont("helvetica", "normal");
                const lines = doc.splitTextToSize(value || "-", maxWidth);
                doc.text(lines, x, y + lineHeight);

                return lineHeight + lines.length * lineHeight + gapAfter;
            };

            const footerWidth = pageWidth - 28;

            // Bank details block
            currentY += drawBlock(
                "Bank Details:",
                bank,
                startX,
                currentY,
                footerWidth
            );

            // EXTRA BREAK (this is what you want 👇)
            currentY += 6;

            // Terms block
            currentY += drawBlock(
                "Terms & Conditions:",
                terms,
                startX,
                currentY,
                footerWidth
            );

            currentY += 10;
            doc.text("This is a computer generated invoice.", pageWidth / 2, currentY, {
                align: "center",
            });

            await addImageWatermark();
        };

        /* ================= LOGO ================= */
        // ✅ LOGO — awaited
        if (logoFile) {
            const logoBase64 = await loadImageAsBase64(logoFile);
            doc.addImage(logoBase64, "PNG", startX, 10, 30, 15);
        }

        // ✅ CONTENT — awaited
        await renderContent();

        // ✅ WATERMARK — awaited
        await addImageWatermark();
    };

    const generatePDFBlob = async (): Promise<Blob> => {
        const doc = new jsPDF("p", "mm", "a4");

        // IMPORTANT: wait for full rendering (including watermark & logo)
        await renderInvoice(doc);

        return doc.output("blob");
    };

    const sendInvoiceEmail = async () => {
        if (!emailTo) {
            alert("Please enter email");
            return;
        }

        try {
            setSendingEmail(true);

            const pdfBlob = await generatePDFBlob(); // ✅ now correct

            const formData = new FormData();
            formData.append("email", emailTo);
            formData.append("invoiceNo", invoiceNo);
            formData.append("pdf", pdfBlob, `GST-Invoice-${invoiceNo}.pdf`);

            await postForm("/api/invoices/send-invoicepdf", formData);

            alert("Invoice sent successfully!");
            setShowEmailModal(false);
            setEmailTo("");
        } catch (err: any) {
            alert(err.message || "Failed to send invoice");
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <>
            <Head>
                <title>Free GST Invoice Generator Online (India)</title>
                <meta
                    name="description"
                    content="Free GST invoice generator online for Indian businesses. Create GST invoices with HSN/SAC, logo, bank details & download PDF instantly. No signup required."
                />
                {/* Structured Data for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            name: "Free GST Invoice Generator",
                            applicationCategory: "BusinessApplication",
                            operatingSystem: "Web",
                            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
                        }),
                    }}
                />
            </Head>

            <div className="container ">
                <h1>Free GST Invoice Generator</h1>
                <p>
                    Create professional, GST-compliant invoices with your logo, HSN/SAC codes, bank details, and more.
                    Download as PDF instantly – no signup needed.
                </p>

                {/* Logo */}
                <h3>Invoice Logo</h3>
                <input type="file" accept="image/*" onChange={handleLogoUpload} />

                {/* Seller Details */}
                <h3>Seller Details</h3>
                <input placeholder="Business Name" value={seller} onChange={(e) => setSeller(e.target.value)} />
                <input placeholder="GSTIN" value={sellerGst} onChange={(e) => setSellerGst(e.target.value)} />
                <textarea placeholder="Address" rows={3} value={sellerAddr} onChange={(e) => setSellerAddr(e.target.value)} />

                {/* Buyer Details */}
                <h3>Buyer Details</h3>
                <input placeholder="Client Name" value={buyer} onChange={(e) => setBuyer(e.target.value)} />
                <input placeholder="Client GSTIN (Optional)" value={buyerGst} onChange={(e) => setBuyerGst(e.target.value)} />
                <textarea placeholder="Client Address" rows={3} value={buyerAddr} onChange={(e) => setBuyerAddr(e.target.value)} />

                {/* Invoice Info */}
                <h3>Invoice Info</h3>
                <input value={invoiceNo} readOnly />
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />

                {/* Items Table */}
                <h3>Items</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>HSN/SAC</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td data-label="Description">
                                        <input value={item.description} onChange={(e) => handleItemChange(idx, "description", e.target.value)} />
                                    </td>
                                    <td data-label="HSN/SAC">
                                        <input value={item.hsn} onChange={(e) => handleItemChange(idx, "hsn", e.target.value)} />
                                    </td>
                                    <td data-label="Qty">
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) =>
                                                handleItemChange(idx, "qty", Number(e.target.value))
                                            }
                                        />
                                    </td>

                                    <td data-label="Rate">
                                        <input
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) =>
                                                handleItemChange(idx, "rate", Number(e.target.value))
                                            }
                                        />
                                    </td>

                                    <td data-label="Total">{item.total.toFixed(2)}</td>
                                    <td data-label="Remove">
                                        <button className="remove" onClick={() => removeItem(idx)}>❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="add-item secondary" onClick={addItem}>+ Add Item</button>

                {/* GST Rate, Bank & Terms */}
                <h3>GST Rate</h3>
                <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))}>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                </select>

                <h3>Bank Details</h3>
                <textarea rows={3} value={bank} onChange={(e) => setBank(e.target.value)} />

                <h3>Terms & Conditions</h3>
                <textarea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} />

                <div className="total">Grand Total: ₹{grandTotal.toFixed(2)}</div>

                <div className="cta-buttons">
                    <button className="primary" onClick={generatePDF}>Download PDF</button>
                    {/* <button className="secondary" onClick={emailInvoice}>Email Invoice</button> */}
                    <button className="secondary" onClick={() => setShowEmailModal(true)}>
                        Email Invoice
                    </button>
                </div>

          <p className="note">
  Want automation, reminders & GST reports?{" "}
  <a
    onClick={() => router.push("/auth/login")}
    style={{ cursor: "pointer" }}
  >
    Try our full billing software free for 15 days
  </a>
</p>
            </div>

            {showPopup && (
                <div id="popup">
                    <div id="popupBox">
                        <h3>Automate Your Billing</h3>
                        <p>Invoices, reminders & GST reports — done automatically.</p>
                         <a
    onClick={() => router.push("/auth/login")}
    style={{ cursor: "pointer" }}
   className="primary">Start Free 15-Day Trial</a>
                        <button onClick={() => setShowPopup(false)}>Maybe Later</button>
                    </div>
                </div>
            )}
            
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">

                        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
                            Email Invoice
                        </h3>

                        <input
                            type="email"
                            placeholder="Enter recipient email"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={sendInvoiceEmail}
                                disabled={sendingEmail || !isValidEmail}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                            >
                                {sendingEmail ? "Sending..." : "Send Invoice"}
                            </button>

                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* CSS */}
            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

       
        .container {
          max-width: 950px;
          background: #fff;
          margin: 40px auto;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px;
          color: #1a202c;
        }

        h3 {
          font-size: 18px;
          font-weight: 500;
          margin: 25px 0 10px;
          color: #4a5568;
        }

        p {
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 20px;
          color: #718096;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 12px 16px;
          margin: 8px 0;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          outline: none;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        th {
          background: #f7fafc;
          font-weight: 500;
          color: #4a5568;
        }

        td input {
          margin: 0;
          border: none;
          background: transparent;
          width: 100%;
        }

        td input[type='number'] {
          text-align: right;
        }

        .lineTotal {
          text-align: right;
          font-weight: 500;
        }

        button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }

        .primary {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          color: #fff;
        }

        .secondary {
          background: #4a5568;
          color: #fff;
          margin-left: 10px;
        }

        .add-item {
          background: #edf2f7;
          color: #4a5568;
          font-size: 14px;
          padding: 8px 16px;
          margin-top: 10px;
        }

        .total {
          font-size: 18px;
          font-weight: 700;
          text-align: right;
          margin-top: 20px;
          color: #2d3748;
        }

        .note {
          font-size: 14px;
          color: #718096;
          text-align: center;
          margin-top: 30px;
        }

        .note a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
        }

        .cta-buttons {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          margin-top: 20px;
        }

        #popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #popupBox {
          background: #fff;
          max-width: 400px;
          width: 90%;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
        }

        #popupBox h3 {
          font-size: 20px;
          margin-bottom: 10px;
          color: #1a202c;
        }

        #popupBox p {
          font-size: 15px;
          margin-bottom: 20px;
          color: #718096;
        }

        #popupBox button {
          background: #e2e8f0;
          color: #4a5568;
          padding: 10px 20px;
        }

        #popupBox button:hover {
          background: #cbd5e0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px;
            margin: 20px 10px;
          }

          h1 {
            font-size: 24px;
          }

          h3 {
            font-size: 16px;
          }

          p {
            font-size: 14px;
          }

          input,
          textarea,
          select {
            padding: 10px 14px;
            font-size: 13px;
          }

          table th,
          table td {
            padding: 8px;
            font-size: 13px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-buttons button {
            width: 100%;
          }

          .add-item {
            width: 100%;
            margin-top: 15px;
          }

          .total {
            font-size: 16px;
            text-align: left;
          }
        }
          button.remove {
  background: #e53e3e;
  color: #fff;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
}

button.remove:hover {
  background: #c53030;
}
      `}</style>
        </>
    );
}
