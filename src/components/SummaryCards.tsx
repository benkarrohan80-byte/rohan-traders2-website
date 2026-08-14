import React from "react";
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Building2,
  QrCode
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { BillEntry, CurrencyConfig } from "../types";

interface SummaryCardsProps {
  bills: BillEntry[];
  currency: CurrencyConfig;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ bills, currency }) => {
  const totalBilled = bills.reduce((acc, b) => acc + b.billAmount, 0);
  const totalReceived = bills.reduce((acc, b) => acc + b.receivedAmount, 0);
  const pendingAmount = Math.max(0, totalBilled - totalReceived);

  const collectionRate = totalBilled > 0 ? Math.min(100, Math.round((totalReceived / totalBilled) * 100)) : 100;

  // Breakdown by payment methods
  const methodTotals: Record<string, number> = {
    Cash: 0,
    UPI: 0,
    Bank: 0,
  };

  bills.forEach((b) => {
    b.paymentHistory.forEach((p) => {
      const key = p.method in methodTotals ? p.method : "Cash";
      methodTotals[key] = (methodTotals[key] || 0) + p.amount;
    });
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Billed Amount Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Billed
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {formatCurrency(totalBilled, currency.symbol)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">{bills.length}</span> total invoices recorded
        </div>
      </div>

      {/* 2. Total Received Amount Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Received
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-400 tracking-tight">
          {formatCurrency(totalReceived, currency.symbol)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400/80 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{collectionRate}% Collected</span>
        </div>
      </div>

      {/* 3. Pending Balance Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Pending Balance
          </span>
          <div
            className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              pendingAmount > 0
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {pendingAmount > 0 ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
        </div>
        <div
          className={`text-2xl font-bold tracking-tight ${
            pendingAmount > 0 ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          {formatCurrency(pendingAmount, currency.symbol)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
          {pendingAmount > 0 ? (
            <span className="text-amber-400 font-medium">
              Requires customer follow-up
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              All accounts settled!
            </span>
          )}
        </div>
      </div>

      {/* 4. Collection Ratio & Tally Status Gauge */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Tally Health Ratio
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              pendingAmount === 0
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
            }`}
          >
            {pendingAmount === 0 ? "Tally Balanced" : "Pending Tally"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-slate-300">{collectionRate}% Received</span>
            <span className="text-slate-400">Target 100%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        {/* Payment mode quick tags */}
        <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
          <span className="flex items-center gap-1" title="Cash">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            Cash: {formatCurrency(methodTotals["Cash"], currency.symbol)}
          </span>
          <span className="flex items-center gap-1" title="UPI">
            <QrCode className="w-3 h-3 text-cyan-400" />
            UPI: {formatCurrency(methodTotals["UPI"], currency.symbol)}
          </span>
          <span className="flex items-center gap-1" title="Bank">
            <Building2 className="w-3 h-3 text-indigo-400" />
            Bank: {formatCurrency(methodTotals["Bank"], currency.symbol)}
          </span>
        </div>
      </div>
    </div>
  );
};
