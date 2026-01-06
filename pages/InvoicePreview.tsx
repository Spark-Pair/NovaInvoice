import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlobProvider, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Download, Printer, Send, X, Zap, MapPin, Building2, User as UserIcon, Hash, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/Button';

/* ---------------- MOCK DATA ---------------- */
const entity = {
  businessName: 'SparkPair Pvt Ltd',
  fullAddress: 'Office #12, Tech Avenue, Lahore',
  ntn: '1234567-8',
  registrationType: 'Pvt Ltd',
};

const buyer = {
  name: 'ABC Traders',
  address: 'Main Market, Karachi',
  ntn: '9876543-2',
  registrationType: 'Trader',
};

const invoice = {
  documentType: 'Sales Invoice',
  number: 'INV-0001',
  issueDate: '05-01-2026',
  dueDate: '20-01-2026',
  status: 'Paid',
  totalValue: 245000,
  items: [
    {
      id: 1,
      description: 'Cotton Fabric',
      hsCode: '5201',
      quantity: 100,
      uom: 'pcs',
      unitPrice: 1200,
      salesValue: 120000,
      salesTax: 18000,
      totalItemValue: 138000,
      discount: 0,
      extraTax: 0,
      furtherTax: 0,
      fedPayable: 0,
      otherDiscount: 0,
      tradeDiscount: 0,
    },
    {
      id: 2,
      description: 'Polyester Fabric',
      hsCode: '5401',
      quantity: 50,
      uom: 'pcs',
      unitPrice: 1400,
      salesValue: 71000,
      salesTax: 10500,
      totalItemValue: 81500,
      discount: 0,
      extraTax: 0,
      furtherTax: 0,
      fedPayable: 0,
      otherDiscount: 0,
      tradeDiscount: 0,
    },
    {
      id: 3,
      description: 'Stitching Charges',
      hsCode: '-',
      quantity: 1,
      uom: 'job',
      unitPrice: 25000,
      salesValue: 25000,
      salesTax: 0,
      totalItemValue: 25000,
      discount: 0,
      extraTax: 0,
      furtherTax: 0,
      fedPayable: 0,
      otherDiscount: 0,
      tradeDiscount: 0,
    },
  ],
};

/* ---------------- PDF STYLES ---------------- */
const pdfStyles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.4 },
  header: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginBottom: 16 },
  label: { fontSize: 8, color: '#666', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 10, fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #000', paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, borderBottom: '0.5 solid #ddd' },
  colDesc: { width: '40%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTax: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  totals: { marginTop: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200 },
  grandTotal: { fontSize: 14, fontWeight: 'bold' },
});

/* ---------------- PDF DOCUMENT ---------------- */
const InvoiceDocument = () => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>{invoice.documentType}</Text>
        <Text>Invoice #: {invoice.number}</Text>
        <Text>Date: {invoice.issueDate}</Text>
      </View>

      <View style={[pdfStyles.row, pdfStyles.section]}>
        <View>
          <Text style={pdfStyles.label}>From</Text>
          <Text style={pdfStyles.value}>{entity.businessName}</Text>
          <Text>{entity.fullAddress}</Text>
          <Text>NTN: {entity.ntn}</Text>
        </View>
        <View>
          <Text style={pdfStyles.label}>To</Text>
          <Text style={pdfStyles.value}>{buyer.name}</Text>
          <Text>{buyer.address}</Text>
          <Text>NTN: {buyer.ntn}</Text>
        </View>
      </View>

      <View style={pdfStyles.tableHeader}>
        <Text style={pdfStyles.colDesc}>Description</Text>
        <Text style={pdfStyles.colQty}>Qty</Text>
        <Text style={pdfStyles.colPrice}>Unit</Text>
        <Text style={pdfStyles.colTax}>Tax</Text>
        <Text style={pdfStyles.colTotal}>Total</Text>
      </View>

      {invoice.items.map((item) => (
        <View key={item.id} style={pdfStyles.tableRow}>
          <Text style={pdfStyles.colDesc}>{item.description}</Text>
          <Text style={pdfStyles.colQty}>{item.quantity}</Text>
          <Text style={pdfStyles.colPrice}>{item.unitPrice.toLocaleString()}</Text>
          <Text style={pdfStyles.colTax}>{item.salesTax.toLocaleString()}</Text>
          <Text style={pdfStyles.colTotal}>{item.totalItemValue.toLocaleString()}</Text>
        </View>
      ))}

      <View style={pdfStyles.totals}>
        <View style={pdfStyles.totalRow}>
          <Text>Grand Total</Text>
          <Text style={pdfStyles.grandTotal}>{invoice.totalValue.toLocaleString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

/* ---------------- REACT PREVIEW ---------------- */
export const InvoicePreview: React.FC<{ onClose: () => void }> = ({ invoice, entity, buyer, onClose }) => {
  const subtotal = invoice.items.reduce((acc, item) => acc + item.salesValue, 0);
  const totalTax = invoice.items.reduce((acc, item) => acc + item.salesTax, 0);

  return (
    <BlobProvider document={<InvoiceDocument invoice entity buyer />}>
      {({ url, loading, error }) => {
        if (loading) return <p>Loading invoice preview…</p>;
        if (error) return <p>Failed to load invoice</p>;

        return (
          <div className="fixed inset-0 z-[120] bg-slate-100 dark:bg-[#04060b]">
            {/* Action Bar */}
            <div className="h-20 bg-white dark:bg-[#080C1C] border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                  <X size={20} />
                </button>
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Preview: {invoice.number}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" icon={<Printer size={16} />} className="rounded-xl h-11">Print</Button>
                <Button variant="secondary" icon={<Download size={16} />} className="rounded-xl h-11">Download PDF</Button>
                <Button icon={<Send size={16} />} className="rounded-xl h-11 px-8">Send to Buyer</Button>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-4 custom-scrollbar" style={{ height: 'calc(100vh - 5rem)' }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#080C1C] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-full">
                <iframe src={`${url}#toolbar=0`} className="w-full h-full" />
              </motion.div>
            </div>
          </div>
        );
      }}
    </BlobProvider>
  );
};
