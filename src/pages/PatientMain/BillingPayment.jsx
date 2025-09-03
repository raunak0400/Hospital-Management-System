import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  DocumentTextIcon,
  DownloadIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XIcon,
} from "@heroicons/react/outline";

const BillingPage = () => {
  const [bills, setBills] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const [selectedReceipt, setSelectedReceipt] = useState(null); // For modal

  // Load mock billing data
  useEffect(() => {
   
   
const mockBills = [
  {
    id: 1,
    billNo: "BILL-2025-001",
    service: "General Consultation",
    doctor: "Dr. Rajesh Sharma",
    department: "General Medicine",
    date: "2025-08-12",
    amount: 600,
    status: "Paid",
    paymentMethod: "UPI (Google Pay)",
    receiptUrl: "/mock-receipts/consultation.pdf",
  },
  {
    id: 2,
    billNo: "BILL-2025-002",
    service: "Blood Test (Complete Hemogram)",
    doctor: "Dr. Neha Mehta",
    department: "Pathology",
    date: "2025-08-14",
    amount: 1100,
    status: "Paid",
    paymentMethod: "Credit Card",
    receiptUrl: "/mock-receipts/blood-test.pdf",
  },
  {
    id: 3,
    billNo: "BILL-2025-003",
    service: "X-Ray (Chest)",
    doctor: "Dr. Anil Patel",
    department: "Radiology",
    date: "2025-08-16",
    amount: 750,
    status: "Unpaid",
    paymentMethod: null,
    receiptUrl: null,
  },
  {
    id: 4,
    billNo: "BILL-2025-004",
    service: "MRI Brain Scan",
    doctor: "Dr. Kavita Nair",
    department: "Radiology",
    date: "2025-08-18",
    amount: 5200,
    status: "Paid",
    paymentMethod: "Net Banking",
    receiptUrl: "/mock-receipts/mri-brain.pdf",
  },
  {
    id: 5,
    billNo: "BILL-2025-005",
    service: "Physiotherapy Session",
    doctor: "Dr. Arjun Menon",
    department: "Physiotherapy",
    date: "2025-08-20",
    amount: 800,
    status: "Unpaid",
    paymentMethod: null,
    receiptUrl: null,
  },
  {
    id: 6,
    billNo: "BILL-2025-006",
    service: "ECG Test",
    doctor: "Dr. Priya Verma",
    department: "Cardiology",
    date: "2025-08-22",
    amount: 950,
    status: "Paid",
    paymentMethod: "Cash",
    receiptUrl: "/mock-receipts/ecg.pdf",
  },
  {
    id: 7,
    billNo: "BILL-2025-007",
    service: "Ultrasound (Abdomen)",
    doctor: "Dr. Suresh Reddy",
    department: "Radiology",
    date: "2025-08-23",
    amount: 1400,
    status: "Paid",
    paymentMethod: "Debit Card",
    receiptUrl: "/mock-receipts/ultrasound.pdf",
  },
  {
    id: 8,
    billNo: "BILL-2025-008",
    service: "Admission Charges (2 days)",
    doctor: "Dr. Rekha Joshi",
    department: "Internal Medicine",
    date: "2025-08-25",
    amount: 3500,
    status: "Unpaid",
    paymentMethod: null,
    receiptUrl: null,
  },
  {
    id: 9,
    billNo: "BILL-2025-009",
    service: "COVID-19 RTPCR Test",
    doctor: "Dr. Anjali Singh",
    department: "Pathology",
    date: "2025-08-26",
    amount: 500,
    status: "Paid",
    paymentMethod: "UPI (PhonePe)",
    receiptUrl: "/mock-receipts/rtpcr.pdf",
  },
  {
    id: 10,
    billNo: "BILL-2025-010",
    service: "Surgery (Appendicitis)",
    doctor: "Dr. Vikram Malhotra",
    department: "Surgery",
    date: "2025-08-28",
    amount: 15000,
    status: "Unpaid",
    paymentMethod: null,
    receiptUrl: null,
  },
];

    setBills(mockBills);

    // Calculate totals
    const paid = mockBills
      .filter((b) => b.status === "Paid")
      .reduce((sum, b) => sum + b.amount, 0);

    const pending = mockBills
      .filter((b) => b.status !== "Paid")
      .reduce((sum, b) => sum + b.amount, 0);

    setTotalPaid(paid);
    setTotalPending(pending);
  }, []);

  // Mock payment handler
  const handlePayment = (billId) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: "Paid",
              paymentMethod: "UPI",
              receiptUrl: `/mock-receipts/${bill.service
                .toLowerCase()
                .replace(/\s+/g, "-")}.pdf`,
            }
          : bill
      )
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        My Bills & Payments
      </h2>

      {bills.length === 0 ? (
        <p className="text-gray-500">No billing records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">Bill No</th>
                <th className="p-3">Service</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{bill.billNo}</td>
                  <td className="p-3">{bill.service}</td>
                  <td className="p-3">{bill.doctor}</td>
                  <td className="p-3">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold">₹{bill.amount}</td>
                  <td className="p-3">
                    {bill.status === "Paid" ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircleIcon className="h-5 w-5 mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-medium">
                        <ExclamationCircleIcon className="h-5 w-5 mr-1" />{" "}
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {bill.paymentMethod ? bill.paymentMethod : "—"}
                  </td>
                  <td className="p-3 flex space-x-3">
                    {bill.status === "Paid" && bill.receiptUrl && (
                      <>
                        {/* View receipt button */}
                        <button
                          onClick={() => setSelectedReceipt(bill)}
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-1" />
                          View
                        </button>

                        {/* Download receipt */}
                        <a
                          href={bill.receiptUrl}
                          download
                          className="flex items-center text-green-600 hover:underline"
                        >
                          <DownloadIcon className="h-5 w-5 mr-1" />
                          Download
                        </a>
                      </>
                    )}

                    {bill.status === "Unpaid" && (
                      <button
                        onClick={() => handlePayment(bill.id)}
                        className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        <CreditCardIcon className="h-5 w-5 mr-1" />
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 border-t pt-4 flex justify-between text-gray-700 font-medium">
        <span>Total Paid: ₹{totalPaid}</span>
        <span>Total Pending: ₹{totalPending}</span>
      </div>

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <XIcon className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Receipt – {selectedReceipt.billNo}
            </h3>

            <iframe
              src={selectedReceipt.receiptUrl}
              title="Receipt Preview"
              className="w-full h-96 border rounded"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
