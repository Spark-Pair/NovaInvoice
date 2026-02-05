import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlobProvider, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Download, Printer, Send, X, Zap, MapPin, Building2, User as UserIcon, Hash, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

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

const hasAnyMeaningfulValue = (items = [], key: string) => {
  return items.some(item => {
    const value = item[key];
    return value !== 0 && value !== '' && value !== null && value !== undefined;
  });
};

const isFieldVisible = (
  configSection = [],
  key: string
) => {
  const field = configSection.find(f => f.key === key);
  if (!field) return true; // fallback: visible
  if (field.required) return true;
  return field.isVisible;
};

/* ---------------- PDF DOCUMENT ---------------- */
const InvoiceDocument = ({invoice, previewConfigs}) => {
  const seller = [
    { label: 'Business Name', value: invoice.relatedEntity.businessName || '-', show: isFieldVisible(previewConfigs?.business, 'business_name'), },
    { label: 'NTN', value: invoice.relatedEntity.ntn || '-', show: isFieldVisible(previewConfigs?.business, 'business_ntn'), },
    { label: 'CNIC', value: invoice.relatedEntity.cnic || '-', show: isFieldVisible(previewConfigs?.business, 'business_cnic'), },
    { label: 'STRN', value: invoice.relatedEntity.strn || '-', show: isFieldVisible(previewConfigs?.business, 'business_strn'), },
    { label: 'Address', value: invoice.relatedEntity.address || '-', show: isFieldVisible(previewConfigs?.business, 'business_address'), },
    { label: 'Province', value: invoice.relatedEntity.province || '-', show: isFieldVisible(previewConfigs?.business, 'business_province'), },
  ];

  const buyer = [
    { label: 'Name', value: invoice.buyer.buyerName || '-', show: isFieldVisible(previewConfigs?.buyer, 'buyer_name'), },
    { label: 'NTN', value: invoice.buyer.ntn || '-', show: isFieldVisible(previewConfigs?.buyer, 'buyer_ntn'), },
    { label: 'CNIC', value: invoice.buyer.cnic || '-', show: isFieldVisible(previewConfigs?.buyer, 'buyer_cnic'), },
    { label: 'STRN', value: invoice.buyer.strn || '-', show: isFieldVisible(previewConfigs?.buyer, 'buyer_strn'), },
    { label: 'Address', value: invoice.buyer.address || '-', show: isFieldVisible(previewConfigs?.buyer, 'buyer_address'), },
    { label: 'Province', value: invoice.buyer.province || '-', show: isFieldVisible(previewConfigs?.buyer, 'buyer_province'), },
    { label: 'Registration Type', value: invoice.buyer.registrationType || '-', show: isFieldVisible(previewConfigs?.buyer, 'registration_type'), },
  ];

  const meta = [
    { label: 'Invoice No', value: invoice.invoiceNumber || '-', show: isFieldVisible(previewConfigs?.meta, 'invoice_number'), },
    { label: 'Invoice Date', value: invoice.date || '-', show: isFieldVisible(previewConfigs?.meta, 'invoice_date'), },
    { label: 'Reference No', value: invoice.referenceNumber || '-', show: isFieldVisible(previewConfigs?.meta, 'reference_no'), },
    { label: 'Salesman', value: invoice.salesman || '-', show: isFieldVisible(previewConfigs?.meta, 'salesman'), },
  ];

  // const tableColumns = [
  //   { label: 'UOM', key: 'uom', show: isFieldVisible(previewConfigs?.items, 'uom') && hasAnyMeaningfulValue(invoice.items, 'uom'), },
  //   { label: 'HS Code', key: 'hsCode', show: isFieldVisible(previewConfigs?.items, 'hs_code') && hasAnyMeaningfulValue(invoice.items, 'hsCode'), },
  //   { label: 'Description', key: 'description', show: isFieldVisible(previewConfigs?.items, 'description') && hasAnyMeaningfulValue(invoice.items, 'description'), },
  //   { label: 'Sale Type', key: 'saleType', show: isFieldVisible(previewConfigs?.items, 'sale_type') && hasAnyMeaningfulValue(invoice.items, 'saleType'), },
  //   { label: 'Qty', key: 'quantity', show: isFieldVisible(previewConfigs?.items, 'quantity') && hasAnyMeaningfulValue(invoice.items, 'quantity'), },
  //   { label: 'Rate', key: 'rate', show: isFieldVisible(previewConfigs?.items, 'rate') && hasAnyMeaningfulValue(invoice.items, 'rate'), },
  //   { label: 'Unit Price', key: 'unitPrice', show: isFieldVisible(previewConfigs?.items, 'unit_price') && hasAnyMeaningfulValue(invoice.items, 'unitPrice'), },
  //   { label: 'Sales Value Exc Tax', key: 'salesValue', show: isFieldVisible(previewConfigs?.items, 'sales_value_exc_tax') && hasAnyMeaningfulValue(invoice.items, 'salesValueExcTax'), },
  //   { label: 'Discount', key: 'discount', show: isFieldVisible(previewConfigs?.items, 'discount') && hasAnyMeaningfulValue(invoice.items, 'discount'), },
  //   { label: 'Other Discount', key: 'otherDiscount', show: isFieldVisible(previewConfigs?.items, 'other_discount') && hasAnyMeaningfulValue(invoice.items, 'otherDiscount'), },
  //   { label: 'Trade Discount', key: 'tradeDiscount', show: isFieldVisible(previewConfigs?.items, 'trade_discount') && hasAnyMeaningfulValue(invoice.items, 'tradeDiscount'), },
  //   { label: 'Sales Tax', key: 'salesTax', show: isFieldVisible(previewConfigs?.items, 'sales_tax') && hasAnyMeaningfulValue(invoice.items, 'salesTax'), },
  //   { label: 'Tax Withheld', key: 'salesTaxWithheld', show: isFieldVisible(previewConfigs?.items, 'tax_withheld') && hasAnyMeaningfulValue(invoice.items, 'taxWithheld'), },
  //   { label: 'Extra Tax', key: 'extraTax', show: isFieldVisible(previewConfigs?.items, 'extra_tax') && hasAnyMeaningfulValue(invoice.items, 'extraTax'), },
  //   { label: 'Further Tax', key: 'furtherTax', show: isFieldVisible(previewConfigs?.items, 'further_tax') && hasAnyMeaningfulValue(invoice.items, 'furtherTax'), },
  //   { label: 'FED', key: 'federalExciseDuty', show: isFieldVisible(previewConfigs?.items, 'fed') && hasAnyMeaningfulValue(invoice.items, 'fed'), },
  //   { label: 'SRO Schedule', key: 'sroScheduleNo', show: isFieldVisible(previewConfigs?.items, 'sro_schedule') && hasAnyMeaningfulValue(invoice.items, 'sroSchedule'), },
  //   { label: 'SRO Serial', key: 'sroItemSerialNo', show: isFieldVisible(previewConfigs?.items, 'sro_serial') && hasAnyMeaningfulValue(invoice.items, 'sroSerial'), },
  //   { label: 'Total', key: 'totalItemValue', show: isFieldVisible(previewConfigs?.items, 'total'), },
  // ]

  const tableColumns = [
    { label: 'UOM', key: 'uom', show: isFieldVisible(previewConfigs?.items, 'uom'), },
    { label: 'HS Code', key: 'hsCode', show: isFieldVisible(previewConfigs?.items, 'hs_code'), },
    { label: 'Description', key: 'description', show: isFieldVisible(previewConfigs?.items, 'description'), },
    { label: 'Sale Type', key: 'saleType', show: isFieldVisible(previewConfigs?.items, 'sale_type'), },
    { label: 'Qty', key: 'quantity', show: isFieldVisible(previewConfigs?.items, 'quantity'), },
    { label: 'Rate', key: 'rate', show: isFieldVisible(previewConfigs?.items, 'rate'), },
    { label: 'Unit Price', key: 'unitPrice', show: isFieldVisible(previewConfigs?.items, 'unit_price'), },
    { label: 'Sales Value Exc Tax', key: 'salesValue', show: isFieldVisible(previewConfigs?.items, 'sales_value_exc_tax'), },
    { label: 'Discount', key: 'discount', show: isFieldVisible(previewConfigs?.items, 'discount'), },
    { label: 'Other Discount', key: 'otherDiscount', show: isFieldVisible(previewConfigs?.items, 'other_discount'), },
    { label: 'Trade Discount', key: 'tradeDiscount', show: isFieldVisible(previewConfigs?.items, 'trade_discount'), },
    { label: 'Sales Tax', key: 'salesTax', show: isFieldVisible(previewConfigs?.items, 'sales_tax'), },
    { label: 'Tax Withheld', key: 'salesTaxWithheld', show: isFieldVisible(previewConfigs?.items, 'tax_withheld'), },
    { label: 'Extra Tax', key: 'extraTax', show: isFieldVisible(previewConfigs?.items, 'extra_tax'), },
    { label: 'Further Tax', key: 'furtherTax', show: isFieldVisible(previewConfigs?.items, 'further_tax'), },
    { label: 'FED', key: 'federalExciseDuty', show: isFieldVisible(previewConfigs?.items, 'fed'), },
    { label: 'SRO Schedule', key: 'sroScheduleNo', show: isFieldVisible(previewConfigs?.items, 'sro_schedule'), },
    { label: 'SRO Serial', key: 'sroItemSerialNo', show: isFieldVisible(previewConfigs?.items, 'sro_serial'), },
    { label: 'Total', key: 'totalItemValue', show: isFieldVisible(previewConfigs?.items, 'total') },
  ]

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

  const totals = [
    { label: 'Subtotal', value: summary.subtotal || '-', show: isFieldVisible(previewConfigs?.totals, 'subtotal'), },
    { label: 'Total Discount', value: summary.totalDiscount || '-', show: isFieldVisible(previewConfigs?.totals, 'total_discount'), },
    { label: 'Total Other Discount', value: summary.totalOtherDiscount || '-', show: isFieldVisible(previewConfigs?.totals, 'total_other_discount'), },
    { label: 'Total Trade Discount', value: summary.totalTradeDiscount || '-', show: isFieldVisible(previewConfigs?.totals, 'total_trade_discount'), },
    { label: 'Total Taxes (Charged)', value: summary.totalTaxes || '-', show: isFieldVisible(previewConfigs?.totals, 'total_taxes'), },
    { label: 'Sales Tax (Applicable)', value: summary.totalSalesTax || '-', show: isFieldVisible(previewConfigs?.totals, 'sales_tax_applicable'), },
    { label: 'Extra Tax', value: summary.totalExtraTax || '-', show: isFieldVisible(previewConfigs?.totals, 'extra_tax_total'), },
    { label: 'Further Tax', value: summary.totalFurtherTax || '-', show: isFieldVisible(previewConfigs?.totals, 'further_tax_total'), },
    { label: 'FED Payable', value: summary.totalFed || '-', show: isFieldVisible(previewConfigs?.totals, 'fed_payable'), },
    { label: 'Sales Tax Withheld at Source', value: summary.totalTaxWithheld || '-', show: isFieldVisible(previewConfigs?.totals, 'sales_tax_withheld'), },
    { label: '236G', value: summary.totalT236g || '-', show: isFieldVisible(previewConfigs?.totals, 'tax_236g'), },
    { label: '236H', value: summary.totalT236h || '-', show: isFieldVisible(previewConfigs?.totals, 'tax_236h'), },
  ];
  
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

            {seller && seller.map((field) => field.show && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.rowLabel}>{field.label}:</Text>
                <Text>{field.value}</Text>
              </View>
            ))}
          </View>
          
          <View>
            <Text style={pdfStyles.label}>BUYER</Text>

            {buyer && buyer.map((field) => field.show && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.rowLabel}>{field.label}:</Text>
                <Text>{field.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.hr} />

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>INVOICE DETAILS</Text>

          {meta && meta.map((field) => field.show && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.rowLabel}>{field.label}:</Text>
              <Text>{field.value}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
            {tableColumns.filter(col => col.show).map((col, index) => (
              <Text key={col.key} style={[pdfStyles.column, index === 0 ? pdfStyles.firstColumn : {}]}>
                {col.label}
              </Text>
            ))}
          </View>

          {invoice.items.map(item => (
            <View key={item.id} style={pdfStyles.tableRow} wrap={false}>
              {tableColumns
                .filter(col => col.show)
                .map((col, index) => (
                  <Text
                    key={col.key}
                    style={[
                      pdfStyles.column,
                      index === 0 ? pdfStyles.firstColumn : {},
                    ]}
                  >
                    {item[col.key] ?? '-'}
                  </Text>
                ))}
            </View>
          ))}
        </View>

        <View style={pdfStyles.totalsWrapper}>
          <View style={pdfStyles.totals}>
            <View>
              <Text style={pdfStyles.totalHeading}>INVOICE SUMMARY</Text>
            </View>

            {totals && totals.map((field) => field.show && (
              <View style={pdfStyles.totalRow}>
                <Text>{field.label}:</Text>
                <Text>{field.value}</Text>
              </View>
            ))}

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
  const { user } = useAuth();
  const previewConfigs = user.settings?.configs?.invoicePreview || {};
  console.log(previewConfigs);
  
  
  return (
    <BlobProvider document={<InvoiceDocument invoice={invoice} previewConfigs={previewConfigs} />}>
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

const reportStyles = StyleSheet.create({
  page: { padding: 20, fontSize: 9, fontFamily: 'Helvetica', color: '#334155' },
  headerContainer: { marginBottom: 20, borderBottom: '2 solid #6366f1', paddingBottom: 10 },
  reportTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  
  table: { display: 'flex', width: 'auto', marginTop: 4 },
  // 'fixed' prop on this View in the component below is what repeats it
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f8fafc', 
    borderBottom: '1 solid #cbd5e1',
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottom: '0.5 solid #e2e8f0',
    paddingVertical: 8,
    alignItems: 'center',
    minHeight: 30
  },
  
  column: { paddingHorizontal: 4 },
  colDate: { width: '12%' },
  colInv: { width: '18%' },
  colBuyer: { width: '35%' },
  colStatus: { width: '15%', textAlign: 'center' },
  colAmount: { width: '20%', textAlign: 'right' },

  footer: { marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' },
  grandTotal: { fontSize: 12, fontWeight: 'bold', color: '#6366f1' }
});

export const InvoiceReportDocument = ({ invoices, currencySymbol }) => {
  const totalAmount = invoices.reduce((acc, inv) => acc + inv.totalValue, 0);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={reportStyles.page}>
        {/* Report Header */}
        <View style={reportStyles.headerContainer}>
          <Text style={reportStyles.reportTitle}>Invoice Summary Report</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Generated on: {new Date().toLocaleString()}</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Total Records: {invoices.length}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={reportStyles.table}>
          {/* Header Row - added 'fixed' prop */}
          <View style={reportStyles.tableHeader} fixed>
            <Text style={[reportStyles.colDate, reportStyles.column]}>Date</Text>
            <Text style={[reportStyles.colInv, reportStyles.column]}>Invoice #</Text>
            <Text style={[reportStyles.colBuyer, reportStyles.column]}>Buyer</Text>
            <Text style={[reportStyles.colStatus, reportStyles.column]}>Status</Text>
            <Text style={[reportStyles.colAmount, reportStyles.column]}>Amount ({currencySymbol})</Text>
          </View>

          {/* Data Rows */}
          {invoices.map((inv, index) => (
            <View key={inv.id} style={[reportStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#fdfdfd' }]} wrap={false}>
              <Text style={[reportStyles.colDate, reportStyles.column]}>{inv.date}</Text>
              <Text style={[reportStyles.colInv, reportStyles.column, { fontWeight: 'bold' }]}>{inv.invoiceNumber}</Text>
              <Text style={[reportStyles.colBuyer, reportStyles.column]}>{inv.buyer.buyerName}</Text>
              <Text style={[reportStyles.colStatus, reportStyles.column, { color: inv.isSent ? '#059669' : '#d97706' }]}>
                {inv.isSent ? 'Sent' : 'Pending'}
              </Text>
              <Text style={[reportStyles.colAmount, reportStyles.column]}>
                {inv.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={reportStyles.footer}>
          <Text style={reportStyles.grandTotal}>
            Grand Total: {currencySymbol} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};