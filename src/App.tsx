import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SummaryCards } from "./components/SummaryCards";
import { LedgerTable } from "./components/LedgerTable";
import { PaymentModal } from "./components/PaymentModal";
import { InvoiceViewerModal } from "./components/InvoiceViewerModal";
import { CustomerAccounts } from "./components/CustomerAccounts";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { BillEntry, CurrencyConfig, FilterOptions } from "./types";
import { INITIAL_BILLS } from "./data/initialData";
import { AVAILABLE_CURRENCIES, exportLedgerToCSV } from "./utils/formatters";

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<"ledger" | "customers">("ledger");

  // Currency Selection State
  const [currency, setCurrency] = useState<CurrencyConfig>(AVAILABLE_CURRENCIES[0]);

  // Bills State with LocalStorage Persistence
  const [bills, setBills] = useState<BillEntry[]>(() => {
    const saved = localStorage.getItem("tally_bills_ledger");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved ledger from local storage", err);
      }
    }
    return INITIAL_BILLS;
  });

  useEffect(() => {
    localStorage.setItem("tally_bills_ledger", JSON.stringify(bills));
  }, [bills]);

  // Filter options state for Ledger Table
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    status: "All",
    category: "All",
    dateRange: "all",
    sortBy: "date-desc",
  });

  // Modal Control States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillEntry | null>(null);
  const [installmentBill, setInstallmentBill] = useState<BillEntry | null>(null);

  const [viewingInvoiceBill, setViewingInvoiceBill] = useState<BillEntry | null>(null);
  const [billToDelete, setBillToDelete] = useState<BillEntry | null>(null);

  // Bill Actions
  const handleSaveBill = (savedBill: BillEntry) => {
    const validBillAmt = Math.max(0, savedBill.billAmount);
    const validRecAmt = Math.min(validBillAmt, Math.max(0, savedBill.receivedAmount));
    const sanitizedBill: BillEntry = {
      ...savedBill,
      billAmount: validBillAmt,
      receivedAmount: validRecAmt,
      status: validRecAmt >= validBillAmt ? "Received" : "Pending",
    };

    setBills((prev) => {
      const exists = prev.some((b) => b.id === sanitizedBill.id);
      if (exists) {
        return prev.map((b) => (b.id === sanitizedBill.id ? sanitizedBill : b));
      }
      return [sanitizedBill, ...prev];
    });
  };

  const handleDeleteBill = (id: string) => {
    const target = bills.find((b) => b.id === id);
    if (target) {
      setBillToDelete(target);
    }
  };

  const handleConfirmDelete = () => {
    if (billToDelete) {
      setBills((prev) => prev.filter((b) => b.id !== billToDelete.id));
      if (viewingInvoiceBill?.id === billToDelete.id) {
        setViewingInvoiceBill(null);
      }
      setBillToDelete(null);
    }
  };

  const handleOpenNewBill = () => {
    setEditingBill(null);
    setInstallmentBill(null);
    setIsPaymentModalOpen(true);
  };

  const handleOpenEditBill = (bill: BillEntry) => {
    setEditingBill(bill);
    setInstallmentBill(null);
    setIsPaymentModalOpen(true);
  };

  const handleOpenRecordPayment = (bill: BillEntry) => {
    setEditingBill(null);
    setInstallmentBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handleOpenNewBillForClient = (
    clientName: string,
    phone?: string,
    email?: string
  ) => {
    setEditingBill(null);
    setInstallmentBill(null);
    setIsPaymentModalOpen(true);
  };

  // Calculate summary stats
  const totalBilled = bills.reduce((acc, b) => acc + b.billAmount, 0);
  const totalReceived = bills.reduce((acc, b) => acc + b.receivedAmount, 0);
  const totalPending = Math.max(0, totalBilled - totalReceived);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewBill={handleOpenNewBill}
        onExportCSV={() => exportLedgerToCSV(bills, currency.symbol)}
        totalPending={totalPending}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Summary Cards */}
        <SummaryCards bills={bills} currency={currency} />

        {/* Tab Views */}
        {activeTab === "ledger" && (
          <LedgerTable
            bills={bills}
            currency={currency}
            filters={filters}
            setFilters={setFilters}
            onOpenRecordPayment={handleOpenRecordPayment}
            onViewInvoice={(b) => setViewingInvoiceBill(b)}
            onDeleteBill={handleDeleteBill}
          />
        )}

        {activeTab === "customers" && (
          <CustomerAccounts
            bills={bills}
            currency={currency}
            onSelectCustomer={(name) =>
              setFilters((prev) => ({ ...prev, searchQuery: name }))
            }
            onOpenNewBillForClient={handleOpenNewBillForClient}
          />
        )}
      </main>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSaveBill={handleSaveBill}
        editingBill={editingBill}
        installmentBill={installmentBill}
        currency={currency}
      />

      <InvoiceViewerModal
        isOpen={!!viewingInvoiceBill}
        onClose={() => setViewingInvoiceBill(null)}
        bill={viewingInvoiceBill}
        currency={currency}
        onDelete={handleDeleteBill}
      />

      <DeleteConfirmModal
        isOpen={!!billToDelete}
        onClose={() => setBillToDelete(null)}
        onConfirm={handleConfirmDelete}
        bill={billToDelete}
        currency={currency}
      />
    </div>
  );
}
