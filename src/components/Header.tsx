import React from "react";
import {
  PlusCircle,
  Download,
  Users,
  Calculator
} from "lucide-react";

interface HeaderProps {
  activeTab: "ledger" | "customers";
  setActiveTab: (tab: "ledger" | "customers") => void;
  onOpenNewBill: () => void;
  onExportCSV: () => void;
  totalPending: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewBill,
  onExportCSV,
  totalPending
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Tally Ledger
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Bill vs Received
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instant billing reconciliation, installment logs & cash tally
              </p>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Currency Badge (INR Only) */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-400">
              <span className="text-sm">₹</span>
              <span>INR</span>
            </div>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Export Ledger CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Add New Bill */}
            <button
              onClick={onOpenNewBill}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Bill</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 mt-4 border-t border-slate-800 pt-3">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "ledger"
                ? "bg-slate-800 text-emerald-400 border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Bill Ledger & Tally</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "customers"
                ? "bg-slate-800 text-emerald-400 border border-slate-700 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Accounts</span>
            {totalPending > 0 && (
              <span className="ml-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 text-[10px] rounded-full">
                ₹{totalPending.toLocaleString("en-IN")}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
