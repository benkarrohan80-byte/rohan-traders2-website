import React, { useState, useRef } from "react";
import {
  X,
  Printer,
  CheckCircle,
  Clock,
  Receipt,
  FileText,
  Copy,
  Check,
  Building2,
  QrCode,
  DollarSign,
  Calendar,
  CreditCard,
  BadgeCheck,
  Trash2,
} from "lucide-react";
import { BillEntry, CurrencyConfig, PaymentMethod } from "../types";
import {
  formatCurrency,
  formatDate,
  generateReceiptPlainText,
} from "../utils/formatters";

interface InvoiceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: BillEntry | null;
  currency: CurrencyConfig;
  onDelete?: (id: string) => void;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({
  isOpen,
  onClose,
  bill,
  currency,
  onDelete,
}) => {
  if (!isOpen || !bill) return null;

  const [activeTab, setActiveTab] = useState<"receipt" | "invoice">("receipt");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const balance = Math.max(0, bill.billAmount - bill.receivedAmount);
  const isFullyPaid = balance <= 0 || bill.receivedAmount >= bill.billAmount;

  // Normalized payment history items
  const paymentsList =
    bill.paymentHistory && bill.paymentHistory.length > 0
      ? bill.paymentHistory
      : bill.receivedAmount > 0
      ? [
          {
            id: `pay-init-${bill.id}`,
            amount: bill.receivedAmount,
            date: bill.date,
            method: bill.paymentMethod,
            notes: "Direct payment received on bill date",
          },
        ]
      : [];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReceipt = () => {
    const text = generateReceiptPlainText(bill, currency.symbol);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Cash":
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case "UPI":
        return <QrCode className="w-3.5 h-3.5 text-cyan-400" />;
      case "Bank":
        return <Building2 className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <CreditCard className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "Cash":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 print:border-black print:text-black">
            <DollarSign className="w-3 h-3" /> Cash
          </span>
        );
      case "UPI":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 print:border-black print:text-black">
            <QrCode className="w-3 h-3" /> UPI
          </span>
        );
      case "Bank":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 print:border-black print:text-black">
            <Building2 className="w-3 h-3" /> Bank
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Top Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/95 print:hidden gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("receipt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "receipt"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Payment Receipt</span>
            </button>
            <button
              onClick={() => setActiveTab("invoice")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "invoice"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Copy Receipt Text */}
            <button
              onClick={handleCopyReceipt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Copy receipt details to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Receipt</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Print Receipt or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>Print</span>
            </button>

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(bill.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                title="Delete this bill"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-950 text-slate-100 flex-1 print:p-0 print:bg-white print:text-black print:overflow-visible">
          <div
            ref={printRef}
            className="max-w-2xl mx-auto space-y-6 print:space-y-4 print:text-black print:max-w-full"
          >
            {activeTab === "receipt" ? (
              /* =================== PAYMENT RECEIPT VIEW =================== */
              <div className="border border-slate-800 bg-slate-900/90 rounded-2xl p-6 sm:p-8 space-y-6 print:border-black print:bg-white print:p-4 print:rounded-none">
                {/* Receipt Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 print:border-slate-300 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 print:border print:border-black">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold text-white tracking-tight print:text-black">
                        OFFICIAL PAYMENT RECEIPT
                      </h1>
                      <p className="text-xs text-emerald-400 font-semibold print:text-slate-700">
                        Payment Acknowledgment & Voucher
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono space-y-0.5">
                    <div className="text-xs text-slate-400 print:text-slate-600">
                      Receipt No: <strong className="text-emerald-400 font-bold print:text-black">RCPT-{bill.invoiceNo || bill.id.slice(-6)}</strong>
                    </div>
                    <div className="text-xs text-slate-400 print:text-slate-600">
                      Bill No: {bill.invoiceNo ? `#${bill.invoiceNo}` : "—"}
                    </div>
                    <div className="text-xs text-slate-400 print:text-slate-600">
                      Date: {formatDate(bill.date)}
                    </div>
                  </div>
                </div>

                {/* Client & Received From Info Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Received From / Billed To
                    </span>
                    <div className="text-base font-bold text-white print:text-black">
                      {bill.clientName}
                    </div>
                    {bill.clientPhone && (
                      <div className="text-xs text-slate-400 print:text-slate-700 mt-0.5">
                        Phone: {bill.clientPhone}
                      </div>
                    )}
                    {bill.clientEmail && (
                      <div className="text-xs text-slate-400 print:text-slate-700">
                        Email: {bill.clientEmail}
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Payment Settlement Status
                    </span>
                    <div>
                      {isFullyPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:border-black print:text-black">
                          <CheckCircle className="w-3.5 h-3.5" /> PAID IN FULL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 print:border-black print:text-black">
                          <Clock className="w-3.5 h-3.5" /> PARTIAL PAYMENT
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 print:text-slate-700 pt-1">
                      Category: <span className="text-white font-medium print:text-black">{bill.category}</span>
                    </div>
                  </div>
                </div>

                {/* THE CORE RECEIPT TABLE: WHEN, HOW MUCH, HOW */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      <span>Received Payment Breakdown</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 print:text-slate-600">
                      {paymentsList.length} Payment Entry(s)
                    </span>
                  </div>

                  {paymentsList.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/50 text-slate-400 text-xs">
                      No payments received yet for this bill.
                    </div>
                  ) : (
                    <div className="border border-slate-800 rounded-xl overflow-hidden print:border-slate-300">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300">
                            <th className="py-2.5 px-3 font-semibold">#</th>
                            <th className="py-2.5 px-3 font-semibold">Date Received</th>
                            <th className="py-2.5 px-3 font-semibold">Payment Mode</th>
                            <th className="py-2.5 px-3 font-semibold">Notes / Ref</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Amount Received</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 bg-slate-900/40 print:bg-white">
                          {paymentsList.map((pay, idx) => (
                            <tr key={pay.id || idx} className="hover:bg-slate-800/30">
                              <td className="py-3 px-3 text-slate-500 font-mono">
                                #{idx + 1}
                              </td>
                              <td className="py-3 px-3 font-medium text-slate-200 print:text-black">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{formatDate(pay.date)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {getMethodBadge(pay.method)}
                              </td>
                              <td className="py-3 px-3 text-slate-400 text-[11px] italic print:text-slate-700">
                                {pay.notes || "—"}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 print:text-black text-sm">
                                {formatCurrency(pay.amount, currency.symbol)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Tally Financial Summary Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 print:bg-slate-100 print:border-slate-300">
                  <div className="flex justify-between text-xs text-slate-400 print:text-slate-700">
                    <span>Total Billed Amount:</span>
                    <span className="font-semibold text-white print:text-black">
                      {formatCurrency(bill.billAmount, currency.symbol)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-emerald-400 font-bold print:text-emerald-800">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Total Amount Received:</span>
                    </span>
                    <span className="font-mono text-base">
                      {formatCurrency(bill.receivedAmount, currency.symbol)}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2 flex justify-between text-sm font-extrabold print:border-slate-300">
                    <span className="text-slate-300 print:text-black">
                      Pending Balance Due:
                    </span>
                    <span
                      className={`font-mono text-base ${
                        balance > 0
                          ? "text-amber-400 print:text-amber-800"
                          : "text-emerald-400 print:text-black"
                      }`}
                    >
                      {formatCurrency(balance, currency.symbol)}
                    </span>
                  </div>
                </div>

                {/* Notes / Remarks */}
                {bill.notes && (
                  <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 print:bg-white print:border-slate-200">
                    <strong className="text-slate-300 block mb-0.5 print:text-black">
                      Remarks / Instructions:
                    </strong>
                    {bill.notes}
                  </div>
                )}

                {/* Receipt Footer / Signature Block */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-400 print:border-slate-300 print:text-black">
                  <div>
                    <p className="text-[11px] text-slate-500 print:text-slate-600">
                      • Computer generated receipt.
                      <br />• All payments received are verified in the ledger statement.
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="w-36 border-b border-slate-700 pb-1 mb-1 print:border-black" />
                    <span className="font-bold text-slate-300 text-[11px] print:text-black">
                      Authorized Signatory / Seal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* =================== FULL TAX INVOICE VIEW =================== */
              <div className="border border-slate-800 bg-slate-900/90 rounded-2xl p-6 sm:p-8 space-y-6 print:border-black print:bg-white print:p-4 print:rounded-none">
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 print:border-slate-300 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-extrabold text-white print:text-black">
                        TAX INVOICE STATEMENT
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                      Official Billing Record & Payment Summary
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <div className="text-sm font-bold text-emerald-400 print:text-emerald-700">
                      INVOICE #{bill.invoiceNo}
                    </div>
                    <div className="text-xs text-slate-400 print:text-slate-600">
                      Date: {formatDate(bill.date)}
                    </div>
                  </div>
                </div>

                {/* Client Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Billed To
                    </span>
                    <div className="text-base font-bold text-white print:text-black">
                      {bill.clientName}
                    </div>
                    {bill.clientPhone && (
                      <div className="text-xs text-slate-400 print:text-slate-700 mt-0.5">
                        Phone: {bill.clientPhone}
                      </div>
                    )}
                    {bill.clientEmail && (
                      <div className="text-xs text-slate-400 print:text-slate-700">
                        Email: {bill.clientEmail}
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Current Status
                    </span>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-white print:bg-white print:border-slate-400 print:text-black">
                      {bill.status} ({bill.paymentMethod})
                    </div>
                    <div className="mt-2 text-xs text-slate-400 print:text-slate-700">
                      Category: <strong className="text-white print:text-black">{bill.category}</strong>
                    </div>
                  </div>
                </div>

                {/* Itemized Line Items if any */}
                {bill.lineItems && bill.lineItems.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 print:text-black">
                      Itemized Line Items
                    </h3>
                    <div className="border border-slate-800 rounded-xl overflow-hidden print:border-slate-300">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase text-[10px] print:bg-slate-100 print:text-black">
                            <th className="py-2.5 px-3 text-left">Description</th>
                            <th className="py-2.5 px-3 text-center">Qty</th>
                            <th className="py-2.5 px-3 text-right">Unit Price</th>
                            <th className="py-2.5 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                          {bill.lineItems.map((item) => (
                            <tr key={item.id}>
                              <td className="py-2.5 px-3 text-slate-200 print:text-black font-medium">
                                {item.description}
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-400 print:text-slate-700">
                                {item.quantity}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-400 print:text-slate-700">
                                {formatCurrency(item.unitPrice, currency.symbol)}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-100 print:text-black font-bold">
                                {formatCurrency(item.total, currency.symbol)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Payment History Log */}
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 print:text-black">
                    Payment Received History
                  </h3>
                  <div className="space-y-1.5">
                    {paymentsList.map((pay, idx) => (
                      <div
                        key={pay.id || idx}
                        className="flex items-center justify-between bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs print:bg-slate-50 print:border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white print:text-black">
                            {formatCurrency(pay.amount, currency.symbol)}
                          </span>
                          <span className="text-[11px] text-slate-400 print:text-slate-600">
                            received on <strong>{formatDate(pay.date)}</strong> via{" "}
                            <strong>{pay.method}</strong>
                          </span>
                        </div>
                        {pay.notes && (
                          <span className="text-[11px] text-slate-400 italic">
                            "{pay.notes}"
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="border-t border-slate-800 pt-4 space-y-2 text-sm font-semibold print:border-slate-300">
                  <div className="flex justify-between text-slate-400 print:text-slate-700">
                    <span>Total Billed Amount:</span>
                    <span className="text-white print:text-black">
                      {formatCurrency(bill.billAmount, currency.symbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400 print:text-emerald-800">
                    <span>Total Received Amount:</span>
                    <span>{formatCurrency(bill.receivedAmount, currency.symbol)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-800/80 print:border-slate-300">
                    <span className="text-slate-200 print:text-black">Pending Balance:</span>
                    <span
                      className={
                        balance > 0
                          ? "text-amber-400 print:text-amber-700"
                          : "text-emerald-400"
                      }
                    >
                      {formatCurrency(balance, currency.symbol)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
