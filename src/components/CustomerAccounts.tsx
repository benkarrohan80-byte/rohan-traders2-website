import React, { useState } from "react";
import { Users, Search, Phone, Mail, DollarSign, ArrowUpRight, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { BillEntry, CurrencyConfig, CustomerSummary } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface CustomerAccountsProps {
  bills: BillEntry[];
  currency: CurrencyConfig;
  onSelectCustomer: (clientName: string) => void;
  onOpenNewBillForClient: (clientName: string, phone?: string, email?: string) => void;
}

export const CustomerAccounts: React.FC<CustomerAccountsProps> = ({
  bills,
  currency,
  onSelectCustomer,
  onOpenNewBillForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Aggregate bills by Customer/Client Name
  const customerMap: Record<string, CustomerSummary> = {};

  bills.forEach((bill) => {
    const key = bill.clientName.trim() || "General Customer";
    if (!customerMap[key]) {
      customerMap[key] = {
        clientName: key,
        clientPhone: bill.clientPhone,
        clientEmail: bill.clientEmail,
        totalBilled: 0,
        totalReceived: 0,
        balanceDue: 0,
        billCount: 0,
        lastTransactionDate: bill.date,
        status: "Received",
      };
    }

    const c = customerMap[key];
    if (bill.clientPhone) c.clientPhone = bill.clientPhone;
    if (bill.clientEmail) c.clientEmail = bill.clientEmail;
    c.totalBilled += bill.billAmount;
    c.totalReceived += bill.receivedAmount;
    c.billCount += 1;

    if (new Date(bill.date) > new Date(c.lastTransactionDate)) {
      c.lastTransactionDate = bill.date;
    }
  });

  // Calculate final balance and status
  const customersList = Object.values(customerMap).map((c) => {
    const diff = c.totalBilled - c.totalReceived;
    c.balanceDue = diff;
    if (diff > 0.01) c.status = "Pending";
    else c.status = "Received";
    return c;
  });

  const filteredCustomers = customersList.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.clientPhone && c.clientPhone.includes(searchQuery)) ||
      (c.clientEmail && c.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Customer Accounts & Balances</span>
          </h2>
          <p className="text-xs text-slate-400">
            Track total billed vs received per client account and send instant reminders
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No customer records found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            const mockBill: BillEntry = {
              id: "cust-summary",
              clientName: cust.clientName,
              clientPhone: cust.clientPhone,
              invoiceNo: `ACC-${cust.clientName.substring(0, 3).toUpperCase()}`,
              date: cust.lastTransactionDate,
              category: "Summary",
              billAmount: cust.totalBilled,
              receivedAmount: cust.totalReceived,
              paymentMethod: "Cash",
              status: cust.balanceDue > 0 ? "Pending" : "Received",
              paymentHistory: [],
              createdAt: new Date().toISOString(),
            };

            return (
              <div
                key={cust.clientName}
                className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-600 transition shadow-sm"
              >
                <div>
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white text-sm line-clamp-1">
                      {cust.clientName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        cust.status === "Pending"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {cust.status === "Pending" ? "Pending" : "Received"}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-0.5 mb-3 text-[11px] text-slate-400">
                    {cust.clientPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{cust.clientPhone}</span>
                      </div>
                    )}
                    {cust.clientEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{cust.clientEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Balance Summary Box */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Billed:</span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(cust.totalBilled, currency.symbol)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Received:</span>
                      <span className="font-semibold text-emerald-400">
                        {formatCurrency(cust.totalReceived, currency.symbol)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                      <span className="text-slate-300">Balance Tally:</span>
                      <span
                        className={
                          cust.balanceDue > 0
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      >
                        {formatCurrency(Math.max(0, cust.balanceDue), currency.symbol)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/50">
                  <span className="text-[10px] text-slate-500">
                    {cust.billCount} {cust.billCount === 1 ? "Bill" : "Bills"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* New Bill for client */}
                    <button
                      onClick={() =>
                        onOpenNewBillForClient(cust.clientName, cust.clientPhone, cust.clientEmail)
                      }
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition cursor-pointer"
                    >
                      + New Bill
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
