const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/Dashboard.jsx', 'utf8');

// 1. Add imports
const routerImports = 'import { createFileRoute } from "@tanstack/react-router";\nimport { useRows, useBusinessProfile } from "@/hooks/use-admin";\nimport { toast } from "sonner";\n';
code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + routerImports);

// 2. Remove context import
code = code.replace("import { useClients } from '../context/ClientContext';", "");

// 3. Rename component and add route wrapper
code = code.replace("const Dashboard = ({ setActiveTab }) => {", "export const Route = createFileRoute('/admin/dashboard')({\n  component: Dashboard,\n});\n\nfunction Dashboard() {");
code = code.replace("export default Dashboard;", "");

// 4. Swap useClients with Supabase hooks
const hooksReplacement = `
  const { data: dbClients = [] } = useRows('clients');
  const { data: dbInvoices = [] } = useRows('invoices');
  const { data: operatorData } = useBusinessProfile();
  
  // Adapt Supabase data to match the component's expectations
  const clients = dbClients.map(c => ({ ...c, billed: c.total_billed || 0, paid: c.total_paid || 0 }));
  const invoices = dbInvoices.map(inv => ({ 
    ...inv, 
    invoiceNo: inv.number, 
    clientName: inv.client_id ? 'Client' : 'Unknown', // Ideally join with clients table
    date: inv.date,
    paymentMode: inv.status === 'pending' ? 'Pending' : 'UPI',
    totalAmount: inv.grand_total,
    sections: inv.items || []
  }));

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
`;

code = code.replace("  const { clients, invoices, operatorSettings } = useClients();", hooksReplacement);

// Fix paths for utilities and images
code = code.replace(/..\/assets\/logoBase64/g, '@/utils/logoBase64');
code = code.replace(/..\/utils\/pdfExport/g, '@/utils/pdfExport');
code = code.replace(/from '.\/Billing'/g, "from './admin.billing'");

fs.writeFileSync('src/routes/admin.dashboard.tsx', code);
console.log('Successfully ported Dashboard.jsx to admin.dashboard.tsx');
