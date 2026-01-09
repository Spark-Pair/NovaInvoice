import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlobProvider, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Download, Printer, Send, X, Zap, MapPin, Building2, User as UserIcon, Hash, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/Button';

/* ---------------- PDF STYLES ---------------- */
const pdfStyles = StyleSheet.create({
  page: { padding: 16, fontSize: 8, fontFamily: 'Helvetica', lineHeight: 1.4 },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  hr: { borderBottom: '1 solid #000', marginVertical: 16 },
  row: { flexDirection: 'row' },
  rowLabel: { fontWeight: 'bold', marginRight: 4 },
  section: { marginBottom: 16 },
  label: { fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 8, fontWeight: 'bold' },
  table: {  },
  tableHeader: { borderTop: '0.5 solid #000', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5 solid #000' },
  firstColumn: { borderLeft: '0.5 solid #000' },
  column: { flex: 1, borderRight: '0.5 solid #000', textAlign: 'center', padding: 4 },
  colDesc: { width: '40%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTax: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  totalsWrapper: { marginTop: 20, alignItems: 'flex-end' },
  totals: { border: '1 solid #000', padding: 8 },
  totalHeading: { fontWeight: 'bold', fontSize: 12, marginHorizontal: 'auto', marginBottom: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200 },
  grandTotal: { fontWeight: 'bold' },
});

/* ---------------- PDF DOCUMENT ---------------- */
const InvoiceDocument = ({invoice}) => {
  const summary = {
    subtotal: invoice.items.reduce((acc, item) => acc + item.salesValue, 0).toFixed(2),
    totalDiscount: invoice.items.reduce((acc, item) => acc + item.discount, 0).toFixed(2),
    totalOtherDiscount: invoice.items.reduce((acc, item) => acc + item.otherDiscount, 0).toFixed(2),
    totalTradeDiscount: invoice.items.reduce((acc, item) => acc + item.tradeDiscount, 0).toFixed(2),
    totalTaxes: invoice.items.reduce((acc, item) => acc + item.salesTax + item.extraTax + item.furtherTax + item.federalExciseDuty, 0).toFixed(2),
    totalSalesTax: invoice.items.reduce((acc, item) => acc + item.salesTax, 0).toFixed(2),
    totalExtraTax: invoice.items.reduce((acc, item) => acc + item.extraTax, 0).toFixed(2),
    totalFurtherTax: invoice.items.reduce((acc, item) => acc + item.furtherTax, 0).toFixed(2),
    totalFed: invoice.items.reduce((acc, item) => acc + item.federalExciseDuty, 0).toFixed(2),
    totalTaxWithheld: invoice.items.reduce((acc, item) => acc + item.salesTaxWithheld, 0).toFixed(2),
    totalT236g: invoice.items.reduce((acc, item) => acc + item.t236g, 0).toFixed(2),
    totalT236h: invoice.items.reduce((acc, item) => acc + item.t236h, 0).toFixed(2),
  }
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.title}>SALES TAX INVOICE</Text>
        </View>

        <View style={pdfStyles.hr} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={pdfStyles.label}>SELLER</Text>

            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Business Name:</Text>
              <Text>{invoice.relatedEntity.businessName || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>NTN:</Text>
              <Text>{invoice.relatedEntity.ntn || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>CNIC:</Text>
              <Text>{invoice.relatedEntity.cnic || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>STRN:</Text>
              <Text>{invoice.relatedEntity.strn || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Address:</Text>
              <Text>{invoice.relatedEntity.address || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Province:</Text>
              <Text>{invoice.relatedEntity.province || '-'}</Text>
            </View>
          </View>
          
          <View>
            <Text style={pdfStyles.label}>BUYER</Text>

            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Name:</Text>
              <Text>{invoice.buyer.buyerName || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>NTN:</Text>
              <Text>{invoice.buyer.ntn || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>CNIC:</Text>
              <Text>{invoice.buyer.cnic || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>STRN:</Text>
              <Text>{invoice.buyer.strn || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Address:</Text>
              <Text>{invoice.buyer.address || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Province:</Text>
              <Text>{invoice.buyer.province || '-'}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>Registration Type:</Text>
              <Text>{invoice.buyer.registrationType || '-'}</Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.hr} />

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>INVOICE DETAILS</Text>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.rowLabel}>Invoice No:</Text>
            <Text>{invoice.invoiceNumber || '-'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.rowLabel}>Invoice Date:</Text>
            <Text>{invoice.date || '-'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.rowLabel}>Reference No:</Text>
            <Text>{invoice.referenceNumber || '-'}</Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.rowLabel}>Salesman:</Text>
            <Text>{invoice.salesman || '-'}</Text>
          </View>
        </View>

        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
            <Text style={[pdfStyles.column, pdfStyles.firstColumn]}>UOM</Text>
            <Text style={pdfStyles.column}>HS Code</Text>
            <Text style={pdfStyles.column}>Description</Text>
            <Text style={pdfStyles.column}>Sale Type</Text>
            <Text style={pdfStyles.column}>Qty</Text>
            <Text style={pdfStyles.column}>Rate</Text>
            <Text style={pdfStyles.column}>Unit Price</Text>
            <Text style={pdfStyles.column}>Sales Value Exc Tax</Text>
            <Text style={pdfStyles.column}>Discount</Text>
            <Text style={pdfStyles.column}>Other Discount</Text>
            <Text style={pdfStyles.column}>Trade Discount</Text>
            <Text style={pdfStyles.column}>Sales Tax</Text>
            <Text style={pdfStyles.column}>Tax Withheld</Text>
            <Text style={pdfStyles.column}>Extra Tax</Text>
            <Text style={pdfStyles.column}>Further Tax</Text>
            <Text style={pdfStyles.column}>FED</Text>
            <Text style={pdfStyles.column}>SRO Schedule</Text>
            <Text style={pdfStyles.column}>SRO Serial</Text>
            <Text style={pdfStyles.column}>Total</Text>
          </View>

          {invoice.items.map((item) => (
            <View key={item.id} style={pdfStyles.tableRow} wrap={false}>
              <Text style={[pdfStyles.column, pdfStyles.firstColumn]}>{item.uom}</Text>
              <Text style={pdfStyles.column}>{item.hsCode}</Text>
              <Text style={pdfStyles.column}>{item.description}</Text>
              <Text style={pdfStyles.column}>{item.saleType}</Text>
              <Text style={pdfStyles.column}>{item.quantity}</Text>
              <Text style={pdfStyles.column}>{item.rate}</Text>
              <Text style={pdfStyles.column}>{item.unitPrice}</Text>
              <Text style={pdfStyles.column}>{item.salesValue}</Text>
              <Text style={pdfStyles.column}>{item.discount}</Text>
              <Text style={pdfStyles.column}>{item.otherDiscount}</Text>
              <Text style={pdfStyles.column}>{item.tradeDiscount}</Text>
              <Text style={pdfStyles.column}>{item.salesTax}</Text>
              <Text style={pdfStyles.column}>{item.salesTaxWithheld}</Text>
              <Text style={pdfStyles.column}>{item.extraTax}</Text>
              <Text style={pdfStyles.column}>{item.furtherTax}</Text>
              <Text style={pdfStyles.column}>{item.federalExciseDuty}</Text>
              <Text style={pdfStyles.column}>{item.sroScheduleNo}</Text>
              <Text style={pdfStyles.column}>{item.sroItemSerialNo}</Text>
              <Text style={pdfStyles.column}>{item.totalItemValue}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.totalsWrapper}>
          <View style={pdfStyles.totals}>
            <View>
              <Text style={pdfStyles.totalHeading}>INVOICE SUMMARY</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>{summary.subtotal}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Total Discount:</Text>
              <Text>{summary.totalDiscount}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Total Other Discount:</Text>
              <Text>{summary.totalOtherDiscount}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Total Trade Discount:</Text>
              <Text>{summary.totalTradeDiscount}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Total Taxes (Charged):</Text>
              <Text>{summary.totalTaxes}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Sales Tax (Applicable):</Text>
              <Text>{summary.totalSalesTax}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Extra Tax:</Text>
              <Text>{summary.totalExtraTax}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Further Tax:</Text>
              <Text>{summary.totalFurtherTax}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>FED Payable:</Text>
              <Text>{summary.totalFed}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>Sales Tax Withheld at Source:</Text>
              <Text>{summary.totalTaxWithheld}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>236G:</Text>
              <Text>{summary.totalT236g}</Text>
            </View>
            <View style={pdfStyles.totalRow}>
              <Text>236H:</Text>
              <Text>{summary.totalT236h}</Text>
            </View>

            <View style={[pdfStyles.hr, {marginVertical: 8}]} />

            <View style={[pdfStyles.totalRow, pdfStyles.grandTotal]}>
              <Text>Grand Total:</Text>
              <Text>{invoice.totalValue.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
};

/* ---------------- REACT PREVIEW ---------------- */
export const InvoicePreview: React.FC<{ onClose: () => void }> = ({ invoice, onClose }) => {
  return (
    <BlobProvider document={<InvoiceDocument invoice={invoice} />}>
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
                <Button
                  variant="secondary"
                  icon={<Download size={16} />}
                  className="rounded-xl h-11"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = url!;
                    link.download = `${invoice.invoiceNumber}.pdf`;
                    link.click();
                  }}
                >
                  Download PDF
                </Button>
                <Button
                  icon={<Printer size={16} />}
                  className="rounded-xl h-11"
                  onClick={() => {
                    const printWindow = window.open(url!, '_blank');
                    if (!printWindow) return;

                    printWindow.onload = () => {
                      printWindow.focus();
                      printWindow.print();
                    };
                  }}
                >
                  Print
                </Button>
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
