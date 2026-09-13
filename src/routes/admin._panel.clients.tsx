import React, { useState } from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow, useUpdateRow, useDeleteRow } from "@/hooks/use-admin";
import { toast } from "sonner";


import { Search, Plus, UserPlus, Phone, MapPin, IndianRupee, Trash2, Edit3, X, Check } from 'lucide-react';

export const Route = createFileRoute('/admin/_panel/clients')({
  component: ClientLedger,
});

function ClientLedger() {

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

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: 'Vadodara',
    phone: '',
    billed: '',
    paid: ''
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    city: '',
    phone: '',
    billed: '',
    paid: ''
  });

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      client.city.toLowerCase().includes(term)
    );
  });

  // Handle Create Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addClient({
      name: formData.name,
      city: formData.city,
      phone: formData.phone,
      billed: Number(formData.billed) || 0,
      paid: Number(formData.paid) || 0
    });

    setFormData({ name: '', city: 'Vadodara', phone: '', billed: '', paid: '' });
    setIsModalOpen(false);
  };

  // Handle Edit Trigger
  const handleStartEdit = (client) => {
    setEditingClientId(client.id);
    setEditFormData({
      name: client.name,
      city: client.city,
      phone: client.phone,
      billed: client.billed,
      paid: client.paid
    });
  };

  // Handle Edit Submit
  const handleSaveEdit = (id) => {
    updateClient(id, {
      name: editFormData.name,
      city: editFormData.city,
      phone: editFormData.phone,
      billed: Number(editFormData.billed) || 0,
      paid: Number(editFormData.paid) || 0
    });
    setEditingClientId(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight">
            Client Ledger
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage clients, track overall billing values, and follow outstanding payment progress.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-sm font-semibold transition-premium shadow-md shadow-slate-950/10 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" /> Add Client
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 border border-slate-200/50">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by client name, phone number, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none text-slate-800 focus:outline-none text-sm placeholder-slate-400"
        />
      </div>

      {/* Grid of Client Cards */}
      {filteredClients.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 rounded-2xl">
          No clients found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const isEditing = editingClientId === client.id;
            const outstanding = client.billed - client.paid;
            const collectionProgress =
              client.billed > 0 ? Math.round((client.paid / client.billed) * 100) : 0;

            return (
              <div
                key={client.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200/60 glass-card-hover group relative"
              >
                {/* Edit State */}
                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <div className="text-xs font-semibold text-brand-accent-dark uppercase tracking-wider">
                      Editing Client Details
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Client Name"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-accent"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Phone"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-accent"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={editFormData.city}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-accent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Total Billed</label>
                          <input
                            type="number"
                            placeholder="Billed (₹)"
                            value={editFormData.billed}
                            onChange={(e) => setEditFormData({ ...editFormData, billed: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Total Paid</label>
                          <input
                            type="number"
                            placeholder="Paid (₹)"
                            value={editFormData.paid}
                            onChange={(e) => setEditFormData({ ...editFormData, paid: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-accent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handleSaveEdit(client.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-premium"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={() => setEditingClientId(null)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-premium"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Display State */
                  <div className="flex flex-col justify-between h-full space-y-5">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">
                          {client.name}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {client.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {client.phone}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action buttons (only show on card hover) */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-premium bg-white/90 p-1 rounded-lg border border-slate-100 shadow-sm absolute top-4 right-4">
                        <button
                          onClick={() => handleStartEdit(client)}
                          title="Edit Client"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-md transition-premium"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteClient(client.id)}
                          title="Delete Client"
                          className="p-1.5 text-brand-red hover:bg-rose-50 rounded-md transition-premium"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-brand-beige/30 p-3.5 rounded-xl border border-brand-accent/5 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Total Billed</span>
                          <span className="font-bold text-slate-700 flex items-center">
                            <IndianRupee className="h-3 w-3 inline" />
                            {client.billed.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium font-display">Paid Amount</span>
                          <span className="font-bold text-emerald-600 flex items-center">
                            <IndianRupee className="h-3 w-3 inline" />
                            {client.paid.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Collection Progress */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-slate-400">Paid Ratio</span>
                          <span className="text-emerald-600">{collectionProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${collectionProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Outstanding Due */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-400">Outstanding Due</span>
                      <span className={`text-sm font-bold flex items-center ${outstanding > 0 ? 'text-brand-red' : 'text-slate-500'}`}>
                        <IndianRupee className="h-3.5 w-3.5" />
                        {outstanding.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-100 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-beige p-2 rounded-xl text-brand-accent-dark">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800">
                  Add New Client Ledger
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-premium text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gopalram Suthar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9427054921"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    City / Jurisdiction
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vadodara"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Total Billed Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.billed}
                    onChange={(e) => setFormData({ ...formData, billed: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Amount Paid to Date (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.paid}
                    onChange={(e) => setFormData({ ...formData, paid: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-premium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-sm font-semibold transition-premium shadow-md shadow-slate-950/10"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};




