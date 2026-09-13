const fs = require('fs');
let code = fs.readFileSync('Tulsi interior/src/components/Settings.jsx', 'utf8');

const routerImports = `import { createFileRoute } from "@tanstack/react-router";
import { useBusinessProfile, useSaveRow } from "@/hooks/use-admin";
import { toast } from "sonner";
`;

code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\n" + routerImports);
code = code.replace("import { useClients } from '../context/ClientContext';", "");

code = code.replace("const Settings = () => {", "export const Route = createFileRoute('/admin/business')({\n  component: Settings,\n});\n\nfunction Settings() {");
code = code.replace("export default Settings;", "");

const hooksReplacement = `
  const { data: operatorData, refetch } = useBusinessProfile();
  const saveBusinessProfile = useSaveRow('business_profile');

  // We can strip out addItem and deleteItem logic here, because we're focusing purely on business profile.
`;

code = code.replace("  const { items, addItem, deleteItem, operatorSettings, setOperatorSettings } = useClients();", hooksReplacement);

// Replace operatorSettings with operatorData and handle form state correctly
code = code.replace(/operatorSettings/g, 'operatorData');
code = code.replace("setOperatorSettings(profileData);", `
  saveBusinessProfile.mutateAsync({
    id: operatorData?.id,
    name: profileData.name,
    role: profileData.role,
    company: profileData.businessName, // Ensure backend schema mapping
    address: profileData.address,
    phone: profileData.phone,
    panCard: profileData.panCard,
    jurisdiction: profileData.jurisdiction
  }).then(() => refetch());
`);

fs.writeFileSync('src/routes/admin.business.tsx', code);
console.log('Successfully ported Settings.jsx to admin.business.tsx');
