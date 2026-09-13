const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/Billing.jsx', 'utf8');

const routerImports = `import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow, useBusinessProfile } from "@/hooks/use-admin";
import { toast } from "sonner";
`;

code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\n" + routerImports);
code = code.replace("import { useClients } from '../context/ClientContext';", "");

code = code.replace("const Billing = ({ activeTab }) => {", "export const Route = createFileRoute('/admin/billing')({\n  component: Billing,\n});\n\nfunction Billing() {");
code = code.replace("export default Billing;", "");

const hooksReplacement = `
  const { data: dbClients = [] } = useRows('clients');
  const { data: dbItems = [] } = useRows('catalog');
  const { data: dbInvoices = [] } = useRows('invoices');
  const { data: operatorData } = useBusinessProfile();
  
  const addInvoiceRow = useSaveRow('invoices');

  const clients = dbClients.map(c => ({
    id: c.id,
    name: c.name,
    city: c.city || 'Vadodara',
    phone: c.phone || '',
    billed: c.total_billed || 0,
    paid: c.total_paid || 0
  }));

  const items = dbItems.map(c => ({
    id: c.id,
    name: c.name,
    type: c.category || 'With Material',
    rate: c.default_rate || 0
  }));

  const operatorSettings = operatorData || {
    name: 'Gopalram P. Suthar',
    role: 'Authorized Operator',
    businessName: 'Tulsi Interior',
    address: '148, Randaldham Socity, Chanakyapuri, New Sama Road, VADODARA - 390008',
    phone: '94270549218',
    panCard: 'CMYPS4786H',
    jurisdiction: 'Vadodara'
  };

  const draftInvoice = null;
  const setDraftInvoice = () => {};
  const addInvoice = async (invoiceData) => {
    try {
      await addInvoiceRow.mutateAsync({
        number: invoiceData.invoiceNo,
        date: invoiceData.date,
        client_id: null,
        grand_total: invoiceData.totalAmount,
        status: invoiceData.paymentMode === 'Pending' ? 'pending' : 'paid',
        items: invoiceData.sections
      });
      toast.success('Invoice saved to database!');
    } catch (e) {
      toast.error('Failed to save invoice');
    }
  };
`;

code = code.replace("  const { clients, items, addInvoice, draftInvoice, setDraftInvoice, operatorSettings } = useClients();", hooksReplacement);

// Fix paths for utilities and images
code = code.replace(/..\/assets\/logoBase64/g, '@/utils/logoBase64');
code = code.replace(/..\/utils\/pdfExport/g, '@/utils/pdfExport');

fs.writeFileSync('src/routes/admin.billing.tsx', code);
console.log('Successfully re-ported Billing.jsx to admin.billing.tsx cleanly');
