import { BillEntry } from "../types";

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

export const INITIAL_BILLS: BillEntry[] = [
  {
    id: "bill-101",
    clientName: "Sharma Traders & Enterprises",
    clientPhone: "+91 98200 12345",
    clientEmail: "accounts@sharmatraders.in",
    invoiceNo: "INV-2026-001",
    date: today,
    category: "Services",
    billAmount: 35000.0,
    receivedAmount: 20000.0,
    paymentMethod: "UPI",
    status: "Pending",
    notes: "Advance ₹20,000 received via PhonePe. Remaining ₹15,000 pending.",
    createdAt: new Date().toISOString(),
    lineItems: [
      { id: "li-1", description: "GST Filing & Web Portal Setup", quantity: 1, unitPrice: 20000, total: 20000 },
      { id: "li-2", description: "Software Licensing & Support", quantity: 1, unitPrice: 15000, total: 15000 }
    ],
    paymentHistory: [
      {
        id: "pay-101-1",
        amount: 20000.0,
        date: today,
        method: "UPI",
        notes: "Advance payment via UPI"
      }
    ]
  },
  {
    id: "bill-102",
    clientName: "Verma Logistics & Freight",
    clientPhone: "+91 98765 43210",
    clientEmail: "billing@vermalogistics.in",
    invoiceNo: "INV-2026-002",
    date: yesterday,
    category: "Freight & Shipping",
    billAmount: 18500.0,
    receivedAmount: 18500.0,
    paymentMethod: "UPI",
    status: "Received",
    notes: "Paid in full via GPay instant confirmation.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lineItems: [
      { id: "li-3", description: "Interstate Transport Cargo 10T", quantity: 2, unitPrice: 9250, total: 18500 }
    ],
    paymentHistory: [
      {
        id: "pay-102-1",
        amount: 18500.0,
        date: yesterday,
        method: "UPI",
        notes: "Full payment received"
      }
    ]
  },
  {
    id: "bill-103",
    clientName: "Mehta Event Planners",
    clientPhone: "+91 99100 88776",
    clientEmail: "contact@mehtaevents.in",
    invoiceNo: "INV-2026-003",
    date: threeDaysAgo,
    category: "Event Management",
    billAmount: 42000.0,
    receivedAmount: 0.0,
    paymentMethod: "Bank",
    status: "Pending",
    notes: "Tax Invoice emailed. Payment pending via NEFT/RTGS.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lineItems: [
      { id: "li-4", description: "Corporate Gala Venue Booking", quantity: 1, unitPrice: 42000, total: 42000 }
    ],
    paymentHistory: []
  },
  {
    id: "bill-104",
    clientName: "Rajesh Kumar (Advisory)",
    clientPhone: "+91 97111 22334",
    clientEmail: "rajesh@advisorykumar.in",
    invoiceNo: "INV-2026-004",
    date: lastWeek,
    category: "Consulting",
    billAmount: 12000.0,
    receivedAmount: 12000.0,
    paymentMethod: "Cash",
    status: "Received",
    notes: "Client paid ₹12,000 cash.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lineItems: [
      { id: "li-5", description: "Tax Strategy & Audit Consultation", quantity: 6, unitPrice: 2000, total: 12000 }
    ],
    paymentHistory: [
      {
        id: "pay-104-1",
        amount: 12000.0,
        date: lastWeek,
        method: "Cash",
        notes: "Paid in full"
      }
    ]
  },
  {
    id: "bill-105",
    clientName: "Patel Electronics & Supplies",
    clientPhone: "+91 98450 99887",
    invoiceNo: "INV-2026-005",
    date: today,
    category: "Retail Supplies",
    billAmount: 8900.0,
    receivedAmount: 4000.0,
    paymentMethod: "UPI",
    status: "Pending",
    notes: "First installment ₹4,000 received via Paytm.",
    createdAt: new Date().toISOString(),
    lineItems: [
      { id: "li-6", description: "Cables & Power Modules", quantity: 5, unitPrice: 1100, total: 5500 },
      { id: "li-7", description: "Custom Enclosure Fittings", quantity: 10, unitPrice: 340, total: 3400 }
    ],
    paymentHistory: [
      {
        id: "pay-105-1",
        amount: 4000.0,
        date: today,
        method: "UPI",
        notes: "Part payment via Paytm"
      }
    ]
  }
];

export const CATEGORIES = [
  "General",
  "Services",
  "Retail Supplies",
  "Consulting",
  "Freight & Shipping",
  "Event Management",
  "Rent & Utilities",
  "Maintenance",
  "Personal"
];
