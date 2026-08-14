export type PaymentMethod = "Cash" | "UPI" | "Bank";

export type PaymentStatus = "Received" | "Pending";

export interface PaymentInstallment {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  notes?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BillEntry {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  invoiceNo: string;
  date: string;
  category: string;
  billAmount: number;
  receivedAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  lineItems?: LineItem[];
  paymentHistory: PaymentInstallment[];
  notes?: string;
  createdAt: string;
}

export interface CustomerSummary {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  totalBilled: number;
  totalReceived: number;
  balanceDue: number;
  billCount: number;
  lastTransactionDate: string;
  status: "Received" | "Pending";
}

export interface CashRegisterDay {
  date: string;
  openingCash: number;
  cashReceivedToday: number;
  cashExpensesToday: number;
  expectedClosingCash: number;
  actualCashCounted: number;
  discrepancy: number; // actual - expected
  notes?: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export interface FilterOptions {
  searchQuery: string;
  status: "All" | PaymentStatus;
  category: string;
  dateRange: "all" | "today" | "week" | "month" | "custom";
  startDate?: string;
  endDate?: string;
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "balance-desc";
}
