import React, { forwardRef } from "react";

interface ReportPrintProps {
    children: React.ReactNode;
}

const ReportPrint = forwardRef<HTMLDivElement, ReportPrintProps>(
    ({ children }, ref) => {
        return (
            <div ref={ref} className="print-wrapper">
                {children}
            </div>
        );
    }
);

export default ReportPrint;
