const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/Billing.jsx', 'utf8');

// 1. Add imports
const routerImports = 'import { createFileRoute } from "@tanstack/react-router";\nimport { useRows, useSaveRow, useBusinessProfile } from "@/hooks/use-admin";\nimport { toast } from "sonner";\n';
code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\n" + routerImports);

// 2. Remove context import
code = code.replace("import { useClients } from '../context/ClientContext';", "");

// 3. Rename component and add route wrapper
code = code.replace("const Billing = () => {", "export const Route = createFileRoute('/admin/dashboard')({\n  component: Dashboard,\n});\n\nfunction Dashboard() {");
code = code.replace("export default Billing;", "");

// 4. Swap useClients with Supabase hooks
const hooksReplacement = `
  const { data: clients = [] } = useRows('clients');
  const { data: items = [] } = useRows('catalog');
  const { data: invoices = [] } = useRows('invoices');
  const { data: operatorData } = useBusinessProfile();
  
  const saveInvoice = useSaveRow('invoices');
  const saveClient = useSaveRow('clients');
  
  // Default operator settings
  const operatorSettings = operatorData || {
    name: 'Gopalram P. Suthar',
    role: 'Authorized Operator',
    businessName: 'Tulsi Interior',
    address: '148, Randaldham Socity, Chanakyapuri, New Sama Road, VADODARA - 390008',
    phone: '94270549218',
    panCard: 'CMYPS4786H',
    jurisdiction: 'Vadodara'
  };

  const [draftInvoice, setDraftInvoice] = useState(null);

  const getNextInvoiceNo = (billType = 'Pakka') => {
    const prefix = billType === 'Kachcha' ? 'EST-' : '';
    const relevantInvoices = invoices.filter(inv => {
      if (billType === 'Kachcha') return (inv.number || '').startsWith('EST-');
      return !(inv.number || '').startsWith('EST-');
    });
    if (relevantInvoices.length === 0) return prefix + '018';
    const numbers = relevantInvoices.map(inv => {
      const plainNum = (inv.number || '').replace('EST-', '');
      const parsed = parseInt(plainNum, 10);
      return isNaN(parsed) ? 0 : parsed;
    });
    const maxNum = Math.max(...numbers, 0);
    return prefix + String(maxNum + 1).padStart(3, '0');
  };

  const createInvoice = async (invoice) => {
    try {
      const invoiceData = {
        number: invoice.invoiceNo,
        client_id: invoice.clientId || null,
        date: invoice.date,
        due_date: invoice.date,
        subtotal: invoice.totalAmount,
        grand_total: invoice.totalAmount,
        amount_paid: invoice.paymentMode === 'Pending' ? 0 : invoice.totalAmount,
        status: invoice.paymentMode === 'Pending' ? 'pending' : 'paid',
        items: invoice.sections,
        terms: 'Generated via Billing Dashboard',
        notes: \`Bill Type: \${invoice.billType}, Payment Mode: \${invoice.paymentMode}\`
      };
      
      await saveInvoice.mutateAsync(invoiceData);
      toast.success('Invoice saved to database!');
    } catch (error) {
      toast.error('Failed to save invoice: ' + error.message);
    }
  };
`;

code = code.replace("  const { clients, items, createInvoice, getNextInvoiceNo, operatorSettings, draftInvoice, setDraftInvoice } = useClients();", hooksReplacement);

// Fix paths for utilities and images
code = code.replace(/..\/assets\/logoBase64/g, '@/utils/logoBase64');
code = code.replace(/..\/utils\/pdfExport/g, '@/utils/pdfExport');

fs.writeFileSync('src/routes/admin.dashboard.tsx', code);
console.log('Successfully ported Billing.jsx to admin.dashboard.tsx');
