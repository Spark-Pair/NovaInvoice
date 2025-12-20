
export interface Entity {
  id: string;
  businessName: string;
  registrationType: 'Registered' | 'Unregistered' | 'Unregistered Distributor' | 'Retail Customer';
  ntn: string;
  cnic: string;
  strn?: string;
  province: 'BALOCHISTAN' | 'AZAD JAMMU AND KASHMIR' | 'CAPITAL TERRITORY' | 'KHYBER PAKHTUNKHWA' | 'PUNJAB' | 'SINDH' | 'GILGIT BALTISTAN';
  fullAddress: string;
  logoUrl?: string;
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
