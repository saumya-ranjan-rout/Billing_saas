import React, { useState,useEffect } from "react";
import { useApi } from '../../hooks/useApi';
import { toast } from "sonner";

interface PaymentModalProps {
  vendor: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYMENT_METHODS = [
  "cash",
  "bank_transfer",
  "cheque",
  "credit_card",
  "debit_card",
  "upi",
  "wallet",
  "other",
];

const PaymentModal: React.FC<PaymentModalProps> = ({ vendor, onClose, onSuccess }) => {
  const { post,get } = useApi<any>();
 const [redeemStatus, setRedeemStatus] = useState<"redeem" | "redeemed">("redeem");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  //    const [loyaltyData, setLoyaltyData] = useState<any>(null);
const [balance, setBalance] = useState(0);
useEffect(() => {
  const fetchBalance = async () => {
    // alert(customer.id);
    try {
      const res = await get(`/api/vendors/${vendor.id}/balance`);
    //   const data = await res.json();
    //   alert(res.balance);
setBalance(parseFloat(Number(res.balance || 0).toFixed(2)));
setAmount(parseFloat(Number(res.balance || 0).toFixed(2)));

    } catch (err) {
      console.error(err);
    }
  };
  fetchBalance();
}, [vendor]);

 const handleSubmit = async () => {
  if (!amount || amount <= 0) {
    toast.error("Please enter a valid amount.");
    return;
  }

  if (amount > balance) {
    toast.error("Payment cannot be more than outstanding balance.");
    setAmount(0);
    return;
  }
  
  let status = "partial"; // default

if (amount == balance) {
  status = "completed";
}

  try {
    const payload = {
      amount,
      method: paymentMethod,
      vendorId: vendor.id,
      paymentDate: new Date(),
      notes,
      status,
      paymentType: "expense",
      tenantId: vendor.tenantId
    };

    await post("/api/vendors/payments", payload);

    toast.success("Payment recorded successfully 💰");
    onSuccess();
  } catch (err: any) {
    toast.error(err.message || "Payment failed ❌");
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Record Payment</h2>

        <div className="space-y-4">
          {/* Payment Method */}
          <div className="text-sm text-red-600 font-semibold">
  Outstanding Amount: ₹{balance}
</div>
          <div>
            <label className="block mb-1 text-sm font-medium">Payment Method</label>
            <select
              className="border rounded w-full px-3 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}


          <div>
            <label className="block mb-1 text-sm font-medium">Amount</label>
      <input
  type="number"
  className="border rounded w-full px-3 py-2"
  value={amount}
  onChange={(e) => {
    const value = Number(e.target.value);
    if (value > balance) {
      toast.error("Amount cannot exceed outstanding balance.");
      setAmount(0);
      return;
    }
    setAmount(value);
  }}
/>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-sm font-medium">Notes</label>
            <textarea
              className="border rounded w-full px-3 py-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
