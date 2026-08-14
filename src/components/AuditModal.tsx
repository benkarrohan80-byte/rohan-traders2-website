import React, { useState, useEffect } from "react";
import { X, ReceiptText, Sparkles, Loader2, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import { BillEntry, CurrencyConfig } from "../types";
import { formatCurrency } from "../utils/formatters";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: BillEntry[];
  currency: CurrencyConfig;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  bills,
  currency,
}) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [auditText, setAuditText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalBilled = bills.reduce((acc, b) => acc + b.billAmount, 0);
  const totalReceived = bills.reduce((acc, b) => acc + b.receivedAmount, 0);
  const totalPending = Math.max(0, totalBilled - totalReceived);

  useEffect(() => {
    if (isOpen) {
      runAudit();
    }
  }, [isOpen]);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = {
        totalBills: bills.length,
        totalBilled,
        totalReceived,
        totalPending,
        currency: currency.code,
      };

      const res = await fetch("/api/tally-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, records: bills }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Audit failed.");
      }

      setAuditText(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate AI Audit analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Financial Tally Audit</h2>
              <p className="text-[11px] text-slate-400">
                Automated Ledger Health Assessment & Collection Insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-300">
          {/* Executive KPI Header */}
          <div className="grid grid-cols-3 gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Total Billed</div>
              <div className="text-sm font-bold text-white">
                {formatCurrency(totalBilled, currency.symbol)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Total Received</div>
              <div className="text-sm font-bold text-emerald-400">
                {formatCurrency(totalReceived, currency.symbol)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Pending Tally</div>
              <div className="text-sm font-bold text-amber-400">
                {formatCurrency(totalPending, currency.symbol)}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-slate-400 text-xs">
                Analyzing ledger collection history & customer accounts...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="prose prose-invert prose-xs max-w-none bg-slate-800/30 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap font-sans text-slate-200 leading-relaxed">
              {auditText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={runAudit}
            disabled={loading}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            Refresh Audit Analysis
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
