const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/InvoicesArchive.jsx', 'utf8');

const routerImports = `import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRows, useBusinessProfile } from "@/hooks/use-admin";
`;

code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + routerImports);
code = code.replace("import { useClients } from '../context/ClientContext';", "");

code = code.replace("const InvoicesArchive = ({ setActiveTab }) => {", "export const Route = createFileRoute('/admin/invoices')({\n  component: InvoicesArchive,\n});\n\nfunction InvoicesArchive() {");
code = code.replace("export default InvoicesArchive;", "");

const hooksReplacement = `
  const { data: dbInvoices = [] } = useRows('invoices');
  const { data: operatorData } = useBusinessProfile();
  const navigate = useNavigate();

  // Adapt Supabase data to match component expectations
  const invoices = dbInvoices.map(inv => ({
    ...inv,
    invoiceNo: inv.number,
    clientName: inv.client_id ? 'Client' : 'Unknown', // Ideally join with clients table
    date: inv.date,
    paymentMode: inv.status === 'pending' ? 'Pending' : 'UPI',
    totalAmount: inv.grand_total,
    sections: inv.items || []
  }));

  const operatorSettings = operatorData || {
    name: 'Gopalram P. Suthar',
    phone: '94270549218',
    address: '148, RANDALDHAM SOCIETY, CHANAKYAPURI, NEW SAMA ROAD, VADODARA - 390008',
    businessName: 'TULSI INTERIOR'
  };

  const setDraftInvoice = () => {
    // For now, redirect to billing, state handling would be via URL/storage
    navigate({ to: '/admin/billing' });
  };
`;

code = code.replace("  const { invoices, operatorSettings, setDraftInvoice } = useClients();", hooksReplacement);

// Fix paths for utilities and images
code = code.replace(/..\/assets\/logoBase64/g, '@/utils/logoBase64');
code = code.replace(/..\/utils\/pdfExport/g, '@/utils/pdfExport');
code = code.replace(/from '.\/Billing'/g, "from './admin.billing'");

fs.writeFileSync('src/routes/admin.invoices.tsx', code);
console.log('Successfully ported InvoicesArchive.jsx to admin.invoices.tsx');
