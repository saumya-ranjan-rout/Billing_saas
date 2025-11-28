import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { toast } from "sonner";

interface PaymentHistoryModalProps {
  customer: any;
  onClose: () => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ customer, onClose }) => {
  const { get } = useApi<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
        // alert(customer.id);
      try {
        const res = await get(`/api/customers/${customer.id}/paymentHistory`);
        console.log(res);
        setHistory(res.PaymentHistory || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [customer]);

  return (
 <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
  <div className="bg-blue-50 p-6 rounded-xl shadow-lg w-[500px] max-h-[80vh] flex flex-col">
    
    {/* Title */}
    <h2 className="text-xl font-semibold mb-4 flex-shrink-0">
      Payment History
    </h2>

    {/* Scrollable payment list */}
    <div className="flex-1 overflow-y-auto pr-1">
      {loading && <div>Loading...</div>}

      {!loading && history.length === 0 && (
        <div className="text-gray-600 text-center py-4">
          No payment history found
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-2">
          {history.map((payment: any) => (
            <div
              key={payment.id}
              className="border p-2 rounded-md bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">₹{payment.amount}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {payment.method.toUpperCase()}
                </div>
              </div>

              {payment.notes && (
                <div className="mt-2 text-sm text-gray-700">
                  Notes: {payment.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Close button */}
    <div className="mt-4 flex justify-end flex-shrink-0">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded bg-red-300 hover:bg-red-400"
      >
        Close
      </button>
    </div>
  </div>
</div>

  );
};

export default PaymentHistoryModal;
