import React, { useState } from "react";
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  Trash2,
  Calendar,
  DollarSign,
  ArrowUpDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Receipt,
  QrCode,
  Building2
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import { BillEntry, CurrencyConfig, FilterOptions, PaymentStatus, PaymentMethod } from "../types";

interface LedgerTableProps {
  bills: BillEntry[];
  currency: CurrencyConfig;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onOpenRecordPayment: (bill: BillEntry) => void;
  onViewInvoice: (bill: BillEntry) => void;
  onDeleteBill: (id: string) => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({
  bills,
  currency,
  filters,
  setFilters,
  onOpenRecordPayment,
  onViewInvoice,
  onDeleteBill,
}) => {
  // Dynamic unique categories from recorded bills
  const dynamicCategories = Array.from(
    new Set(bills.map((b) => b.category?.trim()).filter(Boolean))
  );

  // Apply Search, Status, Category, and Sorting Filters
  const filteredBills = bills.filter((b) => {
    // Search matching
    const query = filters.searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      b.clientName.toLowerCase().includes(query) ||
      b.invoiceNo.toLowerCase().includes(query) ||
      (b.notes || "").toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query);

    // Status matching
    const matchesStatus = filters.status === "All" || b.status === filters.status;

    // Category matching
    const matchesCategory =
      filters.category === "All" || b.category.toLowerCase() === filters.category.toLowerCase();

    // Date range matching
    let matchesDate = true;
    if (filters.dateRange === "today") {
      const todayStr = new Date().toISOString().split("T")[0];
      matchesDate = b.date === todayStr;
    } else if (filters.dateRange === "week") {
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      matchesDate = new Date(b.date) >= weekAgo;
    } else if (filters.dateRange === "month") {
      const monthAgo = new Date(Date.now() - 30 * 86400000);
      matchesDate = new Date(b.date) >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Sorting
  const sortedBills = [...filteredBills].sort((a, b) => {
    if (filters.sortBy === "date-desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (filters.sortBy === "date-asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (filters.sortBy === "amount-desc") {
      return b.billAmount - a.billAmount;
    } else if (filters.sortBy === "amount-asc") {
      return a.billAmount - b.billAmount;
    } else if (filters.sortBy === "balance-desc") {
      const balA = a.billAmount - a.receivedAmount;
      const balB = b.billAmount - b.receivedAmount;
      return balB - balA;
    }
    return 0;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    if (status === "Received") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3 h-3" /> Received
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Controls Header: Search, Status Tabs, Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client, bill #, category, notes..."
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/50 p-1 rounded-xl border border-slate-800">
          {(["All", "Pending", "Received"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilters((prev) => ({ ...prev, status: st }))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filters.status === st
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Secondary Selectors (Category, Sort, Date) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {dynamicCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="balance-desc">Highest Balance Due</option>
            <option value="amount-desc">Highest Billed Amount</option>
          </select>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value as any }))}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Bill Tally List Table */}
      {sortedBills.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No matching bills found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/80">
                <th className="py-3 px-3 font-semibold">Bill No & Client</th>
                <th className="py-3 px-3 font-semibold">Date & Category</th>
                <th className="py-3 px-3 font-semibold text-right">Billed Amount</th>
                <th className="py-3 px-3 font-semibold text-right">Received Amount</th>
                <th className="py-3 px-3 font-semibold text-right">Pending Balance</th>
                <th className="py-3 px-3 font-semibold text-center">Tally Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedBills.map((bill) => {
                const balance = bill.billAmount - bill.receivedAmount;
                const percentPaid =
                  bill.billAmount > 0
                    ? Math.min(100, Math.round((bill.receivedAmount / bill.billAmount) * 100))
                    : 100;
                const isFullyReceived = bill.status === "Received" || balance <= 0 || bill.receivedAmount >= bill.billAmount;

                return (
                  <tr
                    key={bill.id}
                    className="hover:bg-slate-800/40 transition group"
                  >
                    {/* Invoice No & Client */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white text-sm">
                        {bill.clientName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <span>{bill.invoiceNo ? `#${bill.invoiceNo}` : "—"}</span>
                        {bill.receivedAmount > 0 && bill.paymentMethod && (
                          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded">
                            {bill.paymentMethod}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date & Category */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formatDate(bill.date)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                          {bill.category}
                        </span>
                      </div>
                    </td>

                    {/* Billed Amount */}
                    <td className="py-3.5 px-3 text-right font-medium text-slate-200">
                      {formatCurrency(bill.billAmount, currency.symbol)}
                    </td>

                    {/* Received Amount */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-semibold text-emerald-400 text-sm">
                        {formatCurrency(bill.receivedAmount, currency.symbol)}
                      </div>
                      {bill.paymentHistory && bill.paymentHistory.length > 0 ? (
                        <div className="flex flex-wrap items-center justify-end gap-1 mt-1">
                          {bill.paymentHistory.map((p, idx) => (
                            <span
                              key={p.id || idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 inline-flex items-center gap-0.5"
                              title={`${formatCurrency(p.amount, currency.symbol)} via ${p.method} on ${formatDate(p.date)}${p.notes ? ` - ${p.notes}` : ""}`}
                            >
                              <span className="text-emerald-400 font-bold">
                                {formatCurrency(p.amount, currency.symbol)}
                              </span>
                              <span className="text-slate-400">({p.method})</span>
                            </span>
                          ))}
                        </div>
                      ) : bill.receivedAmount > 0 ? (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          via {bill.paymentMethod}
                        </div>
                      ) : null}
                    </td>

                    {/* Pending Balance & Progress */}
                    <td className="py-3.5 px-3 text-right">
                      <div
                        className={`font-bold ${
                          balance > 0
                            ? "text-amber-400"
                            : "text-slate-400"
                        }`}
                      >
                        {formatCurrency(Math.max(0, balance), currency.symbol)}
                      </div>
                      {/* Bill Progress Bar */}
                      <div className="w-20 ml-auto bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            percentPaid >= 100
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${percentPaid}%` }}
                        />
                      </div>
                    </td>

                    {/* Tally Status */}
                    <td className="py-3.5 px-3 text-center">
                      {getStatusBadge(isFullyReceived ? "Received" : bill.status)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Record Payment button - hidden once fully received */}
                        {!isFullyReceived && (
                          <button
                            onClick={() => onOpenRecordPayment(bill)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition cursor-pointer inline-flex items-center gap-1"
                            title="Record received payment"
                          >
                            + Receive
                          </button>
                        )}

                        {/* View Receipt / Invoice */}
                        <button
                          onClick={() => onViewInvoice(bill)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                          title="View Payment Receipt & Voucher"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Receipt</span>
                        </button>

                        {/* Delete Bill */}
                        <button
                          onClick={() => onDeleteBill(bill.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Bill Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
