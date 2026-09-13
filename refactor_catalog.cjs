const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/Inventory.jsx', 'utf8');

const routerImports = `import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow, useDeleteRow } from "@/hooks/use-admin";
import { toast } from "sonner";
`;

code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + routerImports);
code = code.replace("import { useClients } from '../context/ClientContext';", "");

code = code.replace("const Inventory = () => {", "export const Route = createFileRoute('/admin/catalog')({\n  component: Inventory,\n});\n\nfunction Inventory() {");
code = code.replace("export default Inventory;", "");

const hooksReplacement = `
  const { data: dbItems = [], refetch } = useRows('catalog');
  const addCatalogRow = useSaveRow('catalog');
  const deleteCatalogRow = useDeleteRow('catalog');

  // Adapt Supabase data to match component expectations
  const items = dbItems.map(c => ({
    id: c.id,
    name: c.name,
    type: c.category || 'With Material',
    rate: c.default_rate || 0
  }));

  const addItem = async (itemData) => {
    try {
      await addCatalogRow.mutateAsync({
        name: itemData.name,
        category: itemData.type,
        default_rate: itemData.rate
      });
      refetch();
      toast.success('Item added successfully');
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteCatalogRow.mutateAsync(id);
        refetch();
        toast.success('Item deleted');
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };
`;

code = code.replace("  const { items, addItem, deleteItem } = useClients();", hooksReplacement);

fs.writeFileSync('src/routes/admin.catalog.tsx', code);
console.log('Successfully ported Inventory.jsx to admin.catalog.tsx');
