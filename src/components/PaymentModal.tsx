import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, DollarSign, Calendar, CreditCard, User, Tag, FileText, AlertCircle, AlertTriangle } from "lucide-react";
import { BillEntry, CurrencyConfig, PaymentMethod, LineItem } from "../types";
import { calculatePaymentStatus, formatCurrency } from "../utils/formatters";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBill: (bill: BillEntry) => void;
  editingBill: BillEntry | null; // Null if creating new bill
  installmentBill: BillEntry | null; // Non-null if recording installment on existing bill
  currency: CurrencyConfig;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSaveBill,
  editingBill,
  installmentBill,
  currency
}) => {
  if (!isOpen) return null;

  const isInstallmentMode = !!installmentBill;

  // New/Edit Bill state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [billAmount, setBillAmount] = useState<number | "">(0);
  const [receivedAmount, setReceivedAmount] = useState<number | "">(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Installment Mode state
  const [installmentAmount, setInstallmentAmount] = useState<number | "">("");
  const [installmentDate, setInstallmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [installmentMethod, setInstallmentMethod] = useState<PaymentMethod>("Cash");
  const [installmentNotes, setInstallmentNotes] = useState("");

  useEffect(() => {
    if (editingBill) {
      setClientName(editingBill.clientName);
      setClientPhone(editingBill.clientPhone || "");
      setClientEmail(editingBill.clientEmail || "");
      setInvoiceNo(editingBill.invoiceNo);
      setDate(editingBill.date);
      setCategory(editingBill.category);
      setBillAmount(editingBill.billAmount);
      setReceivedAmount(editingBill.receivedAmount);
      setPaymentMethod(editingBill.paymentMethod);
      setNotes(editingBill.notes || "");
      setLineItems(editingBill.lineItems || []);
    } else if (installmentBill) {
      const remaining = Math.max(0, installmentBill.billAmount - installmentBill.receivedAmount);
      setInstallmentAmount(remaining);
      setInstallmentMethod("Cash");
      setInstallmentNotes("Part/Full Payment Received");
    } else {
      // Reset defaults
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setInvoiceNo("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory("");
      setBillAmount(0);
      setReceivedAmount(0);
      setPaymentMethod("Cash");
      setNotes("");
      setLineItems([]);
    }
  }, [editingBill, installmentBill]);

  // Line item helpers
  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `li-${Date.now()}-${Math.random()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ]);
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            const q = field === "quantity" ? Number(value) : item.quantity;
            const u = field === "unitPrice" ? Number(value) : item.unitPrice;
            updated.total = q * u;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Recalculate bill amount from line items if present
  useEffect(() => {
    if (lineItems.length > 0 && !isInstallmentMode) {
      const sum = lineItems.reduce((acc, item) => acc + item.total, 0);
      setBillAmount(sum);
    }
  }, [lineItems, isInstallmentMode]);

  const maxPending = installmentBill
    ? Math.max(0, installmentBill.billAmount - installmentBill.receivedAmount)
    : 0;
  const currentInstallmentNum = typeof installmentAmount === "number" ? installmentAmount : 0;
  const isInstallmentExcess = isInstallmentMode && currentInstallmentNum > maxPending;
  const isInstallmentInvalid = isInstallmentMode && (isInstallmentExcess || currentInstallmentNum <= 0);

  const currentBillNum = typeof billAmount === "number" ? billAmount : 0;
  const currentReceivedNum = typeof receivedAmount === "number" ? receivedAmount : 0;
  const isReceivedExcess = !isInstallmentMode && currentReceivedNum > currentBillNum;
  const isFormInvalid = isInstallmentMode ? isInstallmentInvalid : isReceivedExcess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isInstallmentMode && installmentBill) {
      if (isInstallmentExcess || currentInstallmentNum <= 0) return;
      const amt = currentInstallmentNum;

      const newReceivedTotal = Math.min(installmentBill.billAmount, installmentBill.receivedAmount + amt);
      const newStatus = calculatePaymentStatus(installmentBill.billAmount, newReceivedTotal);

      const newHistory = [
        ...installmentBill.paymentHistory,
        {
          id: `pay-${Date.now()}`,
          amount: amt,
          date: installmentDate,
          method: installmentMethod,
          notes: installmentNotes
        }
      ];

      const updated: BillEntry = {
        ...installmentBill,
        receivedAmount: newReceivedTotal,
        paymentHistory: newHistory,
        status: newStatus,
        paymentMethod: installmentMethod
      };

      onSaveBill(updated);
      onClose();
      return;
    }

    // New or Edit Bill mode
    if (isReceivedExcess) return;

    const finalBillAmt = Math.max(0, currentBillNum);
    const finalRecAmt = Math.min(finalBillAmt, Math.max(0, currentReceivedNum));
    const status = calculatePaymentStatus(finalBillAmt, finalRecAmt);

    let initialHistory = editingBill ? [...(editingBill.paymentHistory || [])] : [];
    if (editingBill) {
      if (finalRecAmt === 0) {
        initialHistory = [];
      } else if (initialHistory.length === 0 && finalRecAmt > 0) {
        initialHistory = [
          {
            id: `pay-${Date.now()}`,
            amount: finalRecAmt,
            date: date,
            method: paymentMethod,
            notes: "Payment recorded",
          },
        ];
      } else if (finalRecAmt > editingBill.receivedAmount) {
        const diff = finalRecAmt - editingBill.receivedAmount;
        initialHistory.push({
          id: `pay-${Date.now()}`,
          amount: diff,
          date: date,
          method: paymentMethod,
          notes: "Additional payment received",
        });
      } else if (finalRecAmt < editingBill.receivedAmount) {
        initialHistory = [
          {
            id: `pay-${Date.now()}`,
            amount: finalRecAmt,
            date: date,
            method: paymentMethod,
            notes: "Adjusted payment balance",
          },
        ];
      }
    } else {
      initialHistory =
        finalRecAmt > 0
          ? [
              {
                id: `pay-${Date.now()}`,
                amount: finalRecAmt,
                date: date,
                method: paymentMethod,
                notes: "Initial payment upon billing",
              },
            ]
          : [];
    }

    const newBill: BillEntry = {
      id: editingBill ? editingBill.id : `bill-${Date.now()}`,
      clientName: clientName.trim() || "General Customer",
      clientPhone: clientPhone.trim() || undefined,
      clientEmail: clientEmail.trim() || undefined,
      invoiceNo: invoiceNo.trim() || "",
      date: date,
      category: category.trim() || "General",
      billAmount: finalBillAmt,
      receivedAmount: finalRecAmt,
      paymentMethod: paymentMethod,
      status: status,
      lineItems: lineItems.length > 0 ? lineItems : undefined,
      paymentHistory: initialHistory,
      notes: notes.trim() || undefined,
      createdAt: editingBill ? editingBill.createdAt : new Date().toISOString()
    };

    onSaveBill(newBill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isInstallmentMode
                ? `Record Received Payment (${installmentBill?.clientName})`
                : editingBill
                ? "Edit Bill Entry"
                : "Create New Bill"}
            </h2>
            <p className="text-xs text-slate-400">
              {isInstallmentMode
                ? `Bill #${installmentBill?.invoiceNo} • Outstanding: ${formatCurrency(
                    (installmentBill?.billAmount || 0) - (installmentBill?.receivedAmount || 0),
                    currency.symbol
                  )}`
                : "Enter customer and billing amount details for tally tracking"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {isInstallmentMode && installmentBill ? (
            /* INSTALLMENT PAYMENT FORM */
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-wrap justify-between gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Total Billed:</span>{" "}
                  <strong className="text-white">
                    {formatCurrency(installmentBill.billAmount, currency.symbol)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Already Received:</span>{" "}
                  <strong className="text-emerald-400">
                    {formatCurrency(installmentBill.receivedAmount, currency.symbol)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Remaining Balance:</span>{" "}
                  <strong className="text-amber-400">
                    {formatCurrency(
                      installmentBill.billAmount - installmentBill.receivedAmount,
                      currency.symbol
                    )}
                  </strong>
                </div>
              </div>

              {/* Installment Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Received Amount ({currency.symbol})
                  </label>
                  <span className={`text-[11px] font-semibold ${isInstallmentExcess ? "text-red-400" : "text-amber-400"}`}>
                    Max: {formatCurrency(maxPending, currency.symbol)}
                  </span>
                </div>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold ${isInstallmentExcess ? "text-red-400" : "text-slate-400"}`}>
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={installmentAmount}
                    onChange={(e) => {
                      setInstallmentAmount(e.target.value === "" ? "" : Number(e.target.value));
                    }}
                    placeholder=""
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-base font-bold transition focus:outline-none ${
                      isInstallmentExcess
                        ? "bg-red-950/30 border-2 border-red-500 text-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                        : "bg-slate-800 border border-slate-700 text-emerald-400 focus:border-emerald-500"
                    }`}
                  />
                </div>

                {/* Error Banner when exceeded */}
                {isInstallmentExcess && (
                  <div className="flex items-center gap-2 mt-2 p-2.5 rounded-xl bg-red-950/60 border border-red-500/80 text-red-300 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>
                      Amount exceeds pending limit! Maximum acceptable: <strong className="text-white font-bold">{formatCurrency(maxPending, currency.symbol)}</strong>
                    </span>
                  </div>
                )}

                {/* Quick Fill Buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setInstallmentAmount(maxPending)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg transition cursor-pointer"
                  >
                    Full Pending ({formatCurrency(maxPending, currency.symbol)})
                  </button>
                  {maxPending > 1 && (
                    <button
                      type="button"
                      onClick={() => setInstallmentAmount(Math.round(maxPending / 2))}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-lg transition cursor-pointer"
                    >
                      50% ({formatCurrency(Math.round(maxPending / 2), currency.symbol)})
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Date & Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={installmentDate}
                    onChange={(e) => setInstallmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={installmentMethod}
                    onChange={(e) => setInstallmentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
              </div>

              {/* Installment Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Note / Reference
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={installmentNotes}
                  onChange={(e) => setInstallmentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          ) : (
            /* NEW / EDIT BILL FORM */
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bill No.
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Phone & Email (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bill Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tally Amount Fields: Billed Amount vs Received Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/80">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Total Billed Amount ({currency.symbol}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder=""
                      value={billAmount}
                      onChange={(e) => {
                        setBillAmount(e.target.value === "" ? "" : Number(e.target.value));
                      }}
                      className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`block text-xs font-bold ${isReceivedExcess ? "text-red-400" : "text-emerald-400"}`}>
                      Received Amount ({currency.symbol})
                    </label>
                    <span className={`text-[10px] font-semibold ${isReceivedExcess ? "text-red-400 font-bold" : "text-slate-400"}`}>
                      Max: {formatCurrency(currentBillNum, currency.symbol)}
                    </span>
                  </div>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                      isReceivedExcess ? "text-red-400" : "text-emerald-400"
                    }`}>
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder=""
                      value={receivedAmount}
                      onChange={(e) => {
                        setReceivedAmount(e.target.value === "" ? "" : Number(e.target.value));
                      }}
                      className={`w-full pl-8 pr-3 py-2 rounded-xl text-sm font-bold transition focus:outline-none ${
                        isReceivedExcess
                          ? "bg-red-950/30 border-2 border-red-500 text-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                          : "bg-slate-800 border border-slate-700 text-emerald-400 focus:border-emerald-500"
                      }`}
                    />
                  </div>

                  {/* Error Banner when exceeded */}
                  {isReceivedExcess && (
                    <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg bg-red-950/60 border border-red-500/80 text-red-300 text-[11px] font-semibold">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        Received amount cannot exceed total bill amount ({formatCurrency(currentBillNum, currency.symbol)})!
                      </span>
                    </div>
                  )}

                  {/* Quick helper buttons for full paid / unpaid */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setReceivedAmount(currentBillNum)}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                    >
                      Full Paid ({formatCurrency(currentBillNum, currency.symbol)})
                    </button>
                    <span className="text-slate-600 text-[10px]">•</span>
                    <button
                      type="button"
                      onClick={() => setReceivedAmount(0)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline font-medium cursor-pointer"
                    >
                      Unpaid ({currency.symbol}0)
                    </button>
                  </div>
                </div>

                {/* Tally Balance Preview */}
                <div className="sm:col-span-2 flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs font-semibold">
                  <span className="text-slate-400">Calculated Tally Balance:</span>
                  {isReceivedExcess ? (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      Over Bill by {formatCurrency(currentReceivedNum - currentBillNum, currency.symbol)} (Invalid Entry)
                    </span>
                  ) : (
                    <span
                      className={
                        currentBillNum - currentReceivedNum > 0
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {formatCurrency(
                        currentBillNum - currentReceivedNum,
                        currency.symbol
                      )}{" "}
                      {currentBillNum - currentReceivedNum > 0
                        ? "Pending"
                        : "Balanced"}
                    </span>
                  )}
                </div>
              </div>

              {/* Received Amount Payment Mode (Shown only when received amount > 0) */}
              {currentReceivedNum > 0 && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Received Amount Payment Mode
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
              )}

              {/* Line Items (Optional Itemized Breakdown) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Itemized Line Items (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 mb-2 bg-slate-800/40 p-2 rounded-xl border border-slate-700/50 text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "description", e.target.value)
                      }
                      className="flex-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-100"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "quantity", e.target.value)
                      }
                      className="w-14 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-100 text-center"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Rate"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "unitPrice", e.target.value)
                      }
                      className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-100 text-right"
                    />
                    <span className="w-20 text-right font-bold text-white">
                      {currency.symbol}
                      {item.total.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Payment Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder=""
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormInvalid}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isFormInvalid
                  ? "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-75"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer"
              }`}
            >
              {isFormInvalid
                ? "⚠️ Amount Exceeds Limit"
                : isInstallmentMode
                ? "Save Received Payment"
                : editingBill
                ? "Update Bill"
                : "Save Bill Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
