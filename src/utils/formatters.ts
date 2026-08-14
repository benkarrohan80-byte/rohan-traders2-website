import { BillEntry, CurrencyConfig, PaymentStatus } from "../types";

export const AVAILABLE_CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "₹", name: "INR (₹)" },
];

export function formatCurrency(amount: number, currencySymbol: string = "₹"): string {
  const absVal = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${currencySymbol}${absVal}` : `${currencySymbol}${absVal}`;
}

export function calculatePaymentStatus(billed: number, received: number): PaymentStatus {
  if (received >= billed) return "Received";
  return "Pending";
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function generateWhatsAppReminder(bill: BillEntry, currencySymbol: string = "₹"): string {
  const balance = bill.billAmount - bill.receivedAmount;
  const greeting = `Namaste ${bill.clientName},\n\n`;
  const body = `This is a payment tally reminder regarding Invoice #${bill.invoiceNo}.\n` +
    `• Billed Amount: ${currencySymbol}${bill.billAmount.toFixed(2)}\n` +
    `• Received Amount: ${currencySymbol}${bill.receivedAmount.toFixed(2)}\n` +
    `• Pending Balance: ${currencySymbol}${balance.toFixed(2)}\n` +
    `\nPlease let us know when we can expect the remaining payment. Thank you!`;
  
  return encodeURIComponent(greeting + body);
}

export function generateReceiptPlainText(bill: BillEntry, currencySymbol: string = "₹"): string {
  const balance = Math.max(0, bill.billAmount - bill.receivedAmount);
  const isPaid = balance <= 0;

  let text = `====================================\n`;
  text += `      OFFICIAL PAYMENT RECEIPT       \n`;
  text += `====================================\n`;
  text += `Bill No: ${bill.invoiceNo}\n`;
  text += `Client Name: ${bill.clientName}\n`;
  if (bill.clientPhone) text += `Phone: ${bill.clientPhone}\n`;
  text += `Date: ${formatDate(bill.date)}\n`;
  text += `Category: ${bill.category}\n`;
  text += `------------------------------------\n`;
  text += `Total Bill Amount: ${formatCurrency(bill.billAmount, currencySymbol)}\n`;
  text += `------------------------------------\n`;
  text += `PAYMENT RECEIVED BREAKDOWN:\n`;

  if (bill.paymentHistory && bill.paymentHistory.length > 0) {
    bill.paymentHistory.forEach((p, idx) => {
      text += `${idx + 1}. Amount: ${formatCurrency(p.amount, currencySymbol)} | Date: ${formatDate(p.date)} | Mode: ${p.method}${p.notes ? ` (${p.notes})` : ""}\n`;
    });
  } else if (bill.receivedAmount > 0) {
    text += `1. Amount: ${formatCurrency(bill.receivedAmount, currencySymbol)} | Date: ${formatDate(bill.date)} | Mode: ${bill.paymentMethod}\n`;
  } else {
    text += `No payments received yet.\n`;
  }

  text += `------------------------------------\n`;
  text += `Total Received Amount: ${formatCurrency(bill.receivedAmount, currencySymbol)}\n`;
  text += `Pending Balance Due:   ${formatCurrency(balance, currencySymbol)}\n`;
  text += `Status: ${isPaid ? "PAID IN FULL" : "PARTIAL / PENDING BALANCE"}\n`;
  if (bill.notes) text += `Remarks: ${bill.notes}\n`;
  text += `====================================\n`;
  text += `Thank you for your business!`;

  return text;
}

export function generatePaymentReceiptWhatsApp(bill: BillEntry, currencySymbol: string = "₹"): string {
  const balance = Math.max(0, bill.billAmount - bill.receivedAmount);
  const isPaid = balance <= 0;

  let msg = `🧾 *OFFICIAL PAYMENT RECEIPT*\n\n`;
  msg += `👤 *Client:* ${bill.clientName}\n`;
  msg += `📄 *Invoice No:* #${bill.invoiceNo}\n`;
  msg += `📅 *Date:* ${formatDate(bill.date)}\n`;
  msg += `💰 *Total Bill Amount:* ${formatCurrency(bill.billAmount, currencySymbol)}\n\n`;
  msg += `💳 *Received Payment Details:*\n`;

  if (bill.paymentHistory && bill.paymentHistory.length > 0) {
    bill.paymentHistory.forEach((p, idx) => {
      msg += `  ${idx + 1}. *${formatCurrency(p.amount, currencySymbol)}* on _${formatDate(p.date)}_ via *${p.method}*${p.notes ? ` (${p.notes})` : ""}\n`;
    });
  } else if (bill.receivedAmount > 0) {
    msg += `  1. *${formatCurrency(bill.receivedAmount, currencySymbol)}* on _${formatDate(bill.date)}_ via *${bill.paymentMethod}*\n`;
  } else {
    msg += `  (No payment recorded yet)\n`;
  }

  msg += `\n--------------------------------\n`;
  msg += `✅ *Total Received:* ${formatCurrency(bill.receivedAmount, currencySymbol)}\n`;
  msg += `⏳ *Pending Balance:* ${formatCurrency(balance, currencySymbol)}\n`;
  msg += `📌 *Status:* ${isPaid ? "✅ PAID IN FULL" : "⚠️ PENDING BALANCE"}\n\n`;
  msg += `_Thank you for your business!_`;

  return encodeURIComponent(msg);
}

export function exportLedgerToCSV(bills: BillEntry[], currencySymbol: string = "₹"): void {
  const headers = [
    "Bill No",
    "Client Name",
    "Date",
    "Category",
    "Billed Amount",
    "Received Amount",
    "Balance Due",
    "Status",
    "Payment Method",
    "Notes"
  ];

  const rows = bills.map((b) => {
    const balance = b.billAmount - b.receivedAmount;
    return [
      `"${b.invoiceNo || ""}"`,
      `"${b.clientName.replace(/"/g, '""')}"`,
      `"${b.date}"`,
      `"${b.category}"`,
      b.billAmount,
      b.receivedAmount,
      balance,
      `"${b.status}"`,
      `"${b.paymentMethod}"`,
      `"${(b.notes || "").replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Tally_Ledger_Report_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
