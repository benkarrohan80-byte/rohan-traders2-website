import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { BillEntry, CurrencyConfig } from "../types";
import { formatCurrency } from "../utils/formatters";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bill: BillEntry | null;
  currency: CurrencyConfig;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bill,
  currency,
}) => {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-sm">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <Trash2 className="w-4 h-4 text-rose-400" />
            </div>
            <span>Delete Bill Record</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm text-slate-300">
            Are you sure you want to delete this bill record? This action will permanently remove it from your ledger.
          </p>

          {/* Bill summary card */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Name:</span>
              <span className="font-semibold text-white">{bill.clientName}</span>
            </div>
            {bill.invoiceNo && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Bill No:</span>
                <span className="font-mono text-slate-200">#{bill.invoiceNo}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Billed:</span>
              <span className="font-bold text-white">
                {formatCurrency(bill.billAmount, currency.symbol)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Received:</span>
              <span className="font-bold text-emerald-400">
                {formatCurrency(bill.receivedAmount, currency.symbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-slate-950/50 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
