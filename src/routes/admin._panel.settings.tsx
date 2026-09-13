import React, { useState, useEffect } from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { useBusinessProfile, useSaveRow } from "@/hooks/use-admin";
import { toast } from "sonner";


import { Plus, Trash2, Search, Sliders, Info, Archive, User, Lock, Unlock, Edit2, ShieldCheck, MapPin, Phone } from 'lucide-react';

export const Route = createFileRoute('/admin/_panel/settings')({
  component: Settings,
});

function Settings() {

  const { data: operatorData, refetch } = useBusinessProfile();
  const saveBusinessProfile = useSaveRow('business_profile');

  // We can strip out addItem and deleteItem logic here, because we're focusing purely on business profile.

  
  // Backup / Restore DB functions
  const handleExportData = () => {
    try {
      const data = {
        clients: localStorage.getItem('tulsi_clients_v3') || '[]',
        invoices: localStorage.getItem('tulsi_invoices_v3') || '[]',
        items: localStorage.getItem('tulsi_items_v3') || '[]',
        operator: localStorage.getItem('tulsi_operator_v3') || '{}'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tulsi_interior_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error generating backup: " + err.message);
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!window.confirm("Are you sure you want to restore this backup? This will overwrite your current client lists, bills, and settings!")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.clients) localStorage.setItem('tulsi_clients_v3', data.clients);
        if (data.invoices) localStorage.setItem('tulsi_invoices_v3', data.invoices);
        if (data.items) localStorage.setItem('tulsi_items_v3', data.items);
        if (data.operator) localStorage.setItem('tulsi_operator_v3', data.operator);
        
        alert('Database restored successfully! Reloading application to apply changes...');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // Settings Tabs
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'inventory'

  // Operator Profile Lock state
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Inventory Search and Form State
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFormData, setItemFormData] = useState({ name: '', rate: '' });

  // Operator Profile Form State
  const [profileData, setProfileData] = useState({
    name: operatorData?.name || 'Mukesh bhai Suthar',
    role: operatorData?.role || 'Authorized Operator',
    businessName: operatorData?.businessName || 'J.J. INTERIORS & MODUTECH',
    address: operatorData?.address || 'Surat, Surat - 390008',
    phone: operatorData?.phone || '94270549218',
    panCard: operatorData?.panCard || 'CMYPS4786H',
    jurisdiction: operatorData?.jurisdiction || 'Surat'
  });

  // Handle Profile Submit
  const handleSaveProfile = (e) => {
    e.preventDefault();
    
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

    setIsEditingProfile(false);
    alert('Operator & Business Profile details updated and locked successfully!');
  };

  // Handle Inventory Submit
  const handleInventorySubmit = (e) => {
    e.preventDefault();
    if (!itemFormData.name || !itemFormData.rate) return;

    addItem({
      name: itemFormData.name,
      rate: Number(itemFormData.rate)
    });

    setItemFormData({ name: '', rate: '' });
    alert('Item registered to master database!');
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-800 dark:text-slate-100 tracking-tight">
            Business Profile Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Configure default billing pricing and personalize your physical A4 business header templates.
          </p>
        </div>
      </div>

      {/* Operator Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!isEditingProfile ? (
              /* Premium Read-Only Profile Card Layout */
              <div className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-brand-beige dark:bg-slate-800 p-2 rounded-xl text-brand-accent-dark dark:text-brand-accent">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">
                      Business Profile Details (Locked)
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-premium cursor-pointer"
                  >
                    <Unlock className="h-3.5 w-3.5" /> Edit Business Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">Business Title</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {operatorData.businessName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">Contact Number</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block font-mono">
                      +91 {operatorData.phone}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">Header Address</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 block leading-relaxed">
                      {operatorData.address}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">Operator Signature</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {operatorData.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">Role Title</span>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
                      {operatorData.role}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">PAN Identification</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block font-mono uppercase">
                      {operatorData.panCard}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block font-medium uppercase tracking-wider">Local Court Jurisdiction</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 block">
                      {operatorData.jurisdiction}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Unlock editable form */
              <form onSubmit={handleSaveProfile} className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl text-amber-600">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">
                      Editing Business Profile (Unlocked)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileData(operatorData);
                      setIsEditingProfile(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-premium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Business Title / Trade Name</label>
                    <input
                      type="text"
                      required
                      value={profileData.businessName}
                      onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Business Base Address</label>
                  <input
                    type="text"
                    required
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Owner / Operator Signature</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium font-bold text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Operator Role Title</label>
                    <input
                      type="text"
                      required
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Local Court Jurisdiction</label>
                    <input
                      type="text"
                      required
                      value={profileData.jurisdiction}
                      onChange={(e) => setProfileData({ ...profileData, jurisdiction: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Business PAN Card No.</label>
                    <input
                      type="text"
                      required
                      value={profileData.panCard}
                      onChange={(e) => setProfileData({ ...profileData, panCard: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium uppercase font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-premium cursor-pointer shadow-md shadow-slate-950/10"
                >
                  Save & Lock Profile details
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Info and help widget */}
            <div className="bg-[var(--brand-beige)] border border-[var(--border-color)] p-5 rounded-2xl space-y-2 flex items-start gap-3">
              <Info className="h-5 w-5 text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] font-display uppercase tracking-wide">
                  Template Headers Information
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Modifying these values updates the address, signature line, PAN identification card, and judicial jurisdiction labels on all current and past generated billing invoices.
                </p>
              </div>
            </div>

            {/* Data Backup & Restore Widget */}
            <div className="glass-card p-5 rounded-2xl space-y-4 border border-[var(--border-color)]">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
                <Archive className="h-4.5 w-4.5 text-[var(--brand-accent)]" />
                <h4 className="text-xs font-bold text-[var(--text-primary)] font-display uppercase tracking-wide">
                  Data Backup & Recovery
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Download a copy of your clients ledger, pricing database, and generated bills. Restore them anytime on any laptop.
              </p>
              
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm"
                >
                  Download Backup JSON 📥
                </button>
                
                <div className="relative">
                  <label className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-primary)] rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border border-[var(--border-color)]">
                    Upload & Restore Backup 📤
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};





