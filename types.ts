
export interface Entity {
  id: string;
  name: string;
  taxId: string;
  email: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Buyer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  industry: string;
  totalSpent: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  number: string;
  buyerId: string;
  entityId: string;
  items: InvoiceItem[];
  status: 'Paid' | 'Draft' | 'Overdue' | 'Pending';
  dueDate: string;
  issueDate: string;
  total: number;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingInvoices: number;
  activeBuyers: number;
  monthlyGrowth: number;
}

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
}
