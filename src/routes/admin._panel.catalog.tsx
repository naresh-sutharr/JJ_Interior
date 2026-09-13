import React, { useState } from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow, useDeleteRow } from "@/hooks/use-admin";
import { toast } from "sonner";


import { Plus, Trash2, Search, Sliders, Archive } from 'lucide-react';

export const Route = createFileRoute('/admin/_panel/catalog')({
  component: Inventory,
});

function Inventory() {

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


  // Inventory Search and Form State
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFormData, setItemFormData] = useState({ name: '', type: 'With Material', rate: '' });

  // Handle Inventory Submit
  const handleInventorySubmit = (e) => {
    e.preventDefault();
    if (!itemFormData.name || !itemFormData.rate) return;

    addItem({
      name: itemFormData.name,
      type: itemFormData.type,
      rate: Number(itemFormData.rate)
    });

    setItemFormData({ name: '', type: 'With Material', rate: '' });
    alert('Item registered to master database!');
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800 dark:text-slate-100 tracking-tight">
          Item Catalog
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Manage your furniture items and specify standard billing rates for "With Material" vs "Labor Only".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[var(--border-color)]">
              <div className="bg-[var(--brand-beige)] dark:bg-slate-800 p-2 rounded-xl text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)]">
                <Sliders className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Register Master Item
              </h3>
            </div>

            <form onSubmit={handleInventorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Particulars Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TV Console panel (Veneer)"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--brand-light)] border border-[var(--border-color)] rounded-xl text-xs focus:outline-none focus:border-[var(--brand-accent)] transition-premium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Item Type (Pricing Mode) *
                </label>
                <select
                  required
                  value={itemFormData.type}
                  onChange={(e) => setItemFormData({ ...itemFormData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--brand-light)] border border-[var(--border-color)] rounded-xl text-xs focus:outline-none focus:border-[var(--brand-accent)] transition-premium cursor-pointer"
                >
                  <option value="With Material">With Material</option>
                  <option value="Labor Only">Labor Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Standard Rate (₹ / S.F.T.) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={itemFormData.rate}
                  onChange={(e) => setItemFormData({ ...itemFormData, rate: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--brand-light)] border border-[var(--border-color)] rounded-xl text-xs focus:outline-none focus:border-[var(--brand-accent)] transition-premium"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-premium cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Save Item Particular
              </button>
            </form>
          </div>
        </div>

        {/* Right Side List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 border border-[var(--border-color)]">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search saved item database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none text-[var(--text-primary)] focus:outline-none text-xs placeholder-slate-400"
            />
          </div>

          {/* List */}
          <div className="glass-card rounded-2xl border border-[var(--border-color)] overflow-hidden">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <Archive className="h-10 w-10 text-slate-400 stroke-[1.5] mb-2" />
                <span>No items match selection.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--brand-beige)] dark:bg-slate-800/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Sr. No</th>
                      <th className="px-6 py-4 font-semibold">Particulars Description</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold text-right">Default Rate</th>
                      <th className="px-6 py-4 font-semibold text-center w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[var(--brand-beige)]/50 dark:hover:bg-slate-800/30 transition-premium">
                        <td className="px-6 py-4 font-medium text-slate-500">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase shadow-sm ${item.type === 'With Material' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700'}`}>
                            {item.type || 'With Material'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-[var(--text-primary)]">
                          ₹{item.rate.toLocaleString('en-IN')}/-
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-[var(--brand-red)] hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-premium cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




