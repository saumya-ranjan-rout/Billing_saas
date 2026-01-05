import React from 'react';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReportViewerProps {
  report: {
    name: string;
  };
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const handlePrint = () => window.print();

  return (
    <>
      {/* ================= SCREEN VIEW ================= */}
      <div className="bg-white rounded-lg shadow max-w-6xl mx-auto print-hide">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{report.name}</h2>
          <div className="space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer size={16} /> Print
            </Button>
            <Button variant="outline">
              <Download size={16} /> Download
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-auto">
          <p className="text-gray-600">
            This is screen-only preview. Printing will show selected paragraphs only.
          </p>
        </div>

        <div className="p-4 border-t text-right">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* ================= PRINT ONLY CONTENT ================= */}
      <div className="print-only">

        {/* ===== PAGE 1 ===== */}
        <div className="print-section">
          <h1 className="text-xl font-bold mb-4">Sales Register – Detailed Explanation</h1>

          <p>
            This report provides a detailed view of sales transactions recorded during the
            selected period. It includes invoice-wise details, taxable values, GST components,
            customer information, and total amounts. The purpose of this report is to assist
            businesses in statutory compliance, internal audits, and financial analysis.
          </p>

          <p>
            Each transaction recorded in this report reflects actual sales activity generated
            through the billing system. The accuracy of this data depends on timely invoice
            generation and correct tax configuration. Any mismatch in tax rates or customer
            GSTIN details can lead to discrepancies during return filing.
          </p>

          <p>
            Businesses are advised to periodically review this report to ensure consistency
            between outward supplies reported here and those declared in GSTR-1 and GSTR-3B.
            Regular reconciliation helps avoid notices and penalties from tax authorities.
          </p>
        </div>

        <div className="page-break"></div>

        {/* ===== PAGE 2 ===== */}
        <div className="print-section">
          <h2 className="text-lg font-semibold mb-3">Compliance & Audit Notes</h2>

          <p>
            During statutory audits, this report serves as a primary reference document.
            Auditors verify invoice sequences, tax breakup, and customer classification
            (B2B/B2C) using this report. Any missing invoice or incorrect tax value can be flagged
            as a compliance risk.
          </p>

          <p>
            It is important to note that amendments, credit notes, and debit notes issued
            during the reporting period should be properly reflected. Failure to include these
            adjustments may result in overpayment or underpayment of tax liabilities.
          </p>

          <p>
            Businesses operating across multiple states must pay close attention to
            place-of-supply rules. Incorrect classification between IGST and CGST/SGST can
            cause serious reconciliation issues and may require revised filings.
          </p>

          <p>
            This report should always be preserved for a minimum period as prescribed under
            GST law, as it may be required for future assessments, investigations, or audits.
          </p>
        </div>

        <div className="page-break"></div>

        {/* ===== PAGE 3 ===== */}
        <div className="print-section">
          <h2 className="text-lg font-semibold mb-3">Management Summary & Usage</h2>

          <p>
            From a management perspective, this report provides insights into revenue trends,
            customer contribution, and tax outflow. Decision-makers can use this data to analyze
            monthly or quarterly performance and identify high-value customers or regions.
          </p>

          <p>
            Comparing this report across periods helps in forecasting future revenue and tax
            obligations. Sudden spikes or drops in taxable value should be investigated to
            understand underlying business or operational causes.
          </p>

          <p>
            In conclusion, the Sales Register Report is not only a statutory requirement but
            also a powerful analytical tool. Proper understanding and regular review of this
            report contribute significantly to financial discipline and regulatory compliance.
          </p>
        </div>

      </div>
    </>
  );
};

export default ReportViewer;
