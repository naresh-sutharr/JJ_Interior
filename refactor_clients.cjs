const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/ClientLedger.jsx', 'utf8');

const routerImports = `import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow, useUpdateRow, useDeleteRow } from "@/hooks/use-admin";
import { toast } from "sonner";
`;

code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + routerImports);
code = code.replace("import { useClients } from '../context/ClientContext';", "");

code = code.replace("const ClientLedger = () => {", "export const Route = createFileRoute('/admin/clients')({\n  component: ClientLedger,\n});\n\nfunction ClientLedger() {");
code = code.replace("export default ClientLedger;", "");

const hooksReplacement = `
  const { data: dbClients = [], refetch } = useRows('clients');
  const addClientRow = useSaveRow('clients');
  const updateClientRow = useUpdateRow('clients');
  const deleteClientRow = useDeleteRow('clients');

  // Adapt Supabase data to match component expectations
  const clients = dbClients.map(c => ({
    id: c.id,
    name: c.name,
    city: c.city || 'Vadodara',
    phone: c.phone || '',
    billed: c.total_billed || 0,
    paid: c.total_paid || 0
  }));

  const addClient = async (clientData) => {
    try {
      await addClientRow.mutateAsync({
        name: clientData.name,
        city: clientData.city,
        phone: clientData.phone,
        total_billed: clientData.billed,
        total_paid: clientData.paid
      });
      refetch();
      toast.success('Client added successfully');
    } catch (err) {
      toast.error('Failed to add client');
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      await updateClientRow.mutateAsync({
        id,
        name: clientData.name,
        city: clientData.city,
        phone: clientData.phone,
        total_billed: clientData.billed,
        total_paid: clientData.paid
      });
      refetch();
      toast.success('Client updated successfully');
    } catch (err) {
      toast.error('Failed to update client');
    }
  };

  const deleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClientRow.mutateAsync(id);
        refetch();
        toast.success('Client deleted');
      } catch (err) {
        toast.error('Failed to delete client');
      }
    }
  };
`;

code = code.replace("  const { clients, addClient, updateClient, deleteClient } = useClients();", hooksReplacement);

fs.writeFileSync('src/routes/admin.clients.tsx', code);
console.log('Successfully ported ClientLedger.jsx to admin.clients.tsx');
