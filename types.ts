
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
  username?: string;
  password?: string;
}

export interface Buyer {
  id: string;
  name: string;
  registrationType: 'Registered' | 'Unregistered' | 'Unregistered Distributor' | 'Retail Customer';
  ntn: string;
  cnic: string;
  strn?: string;
  province: 'BALOCHISTAN' | 'AZAD JAMMU AND KASHMIR' | 'CAPITAL TERRITORY' | 'KHYBER PAKHTUNKHWA' | 'PUNJAB' | 'SINDH' | 'GILGIT BALTISTAN';
  address: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  hsCode: string;
  description: string;
  saleType: string;
  quantity: number;
  uom: string;
  rate: number;
  unitPrice: number;
  salesValueExclTax: number;
  salesTax: number;
  discount: number;
  otherDiscount: number;
  taxWithheld: number;
  extraTax: number;
  furtherTax: number;
  fedPayable: number;
  t236g: number;
  t236h: number;
  tradeDiscount: number;
  fixedValue: number;
  sroSchedule?: string;
  sroItemSerial?: string;
  totalItemValue: number;
}

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  referenceNumber?: string;
  documentType: 'Sale Invoice' | 'Debit Note' | 'Credit Note';
  salesman?: string;
  buyerId: string;
  entityId: string;
  items: InvoiceItem[];
  status: 'Paid' | 'Draft' | 'Overdue' | 'Pending';
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
