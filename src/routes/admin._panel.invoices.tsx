import React, { useState } from 'react';
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRows, useBusinessProfile } from "@/hooks/use-admin";


import { Search, Eye, Download, X, Calendar, CreditCard, ChevronDown, Award, FileText, LayoutGrid, CheckCircle, Edit2, Share2 } from 'lucide-react';
import { GaneshaSVG, SofaSVG, BillHeaderLogo } from './admin.billing';
import { logoBase64 } from '@/utils/logoBase64';
import { downloadPDF } from '@/utils/pdfExport';

export const Route = createFileRoute('/admin/_panel/invoices')({
  component: InvoicesArchive,
});

function InvoicesArchive() {

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
    name: 'Mukesh bhai Suthar',
    phone: '94270549218',
    address: '148, RANDALDHAM SOCIETY, CHANAKYAPURI, NEW SAMA ROAD, Surat - 390008',
    businessName: 'J.J. INTERIORS & MODUTECH'
  };

  const setDraftInvoice = () => {
    // For now, redirect to billing, state handling would be via URL/storage
    navigate({ to: '/admin/billing' });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Kachcha' | 'Pakka'

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientPhone && inv.clientPhone.includes(searchTerm));
      
    const matchesType =
      typeFilter === 'All' ||
      (typeFilter === 'Kachcha' && inv.billType === 'Kachcha') ||
      (typeFilter === 'Pakka' && inv.billType === 'Pakka');

    return matchesSearch && matchesType;
  });

  // Download Past Invoice PDF - direct download, no modal required
  const handleDownloadPastPDF = async (inv) => {
    const clientNameFile = inv.clientName.replace(/\s+/g, '_');
    const filename = `${clientNameFile}_${inv.invoiceNo}.pdf`;
    await downloadPDF(`archive-invoice-capture-${inv.invoiceNo}`, filename);
  };

  const handleEditInvoice = (inv) => {
    setDraftInvoice(inv);
    if (setActiveTab) navigate({ to: '/admin/billing' });
  };

  const handleShareInvoice = async (inv) => {
    const text = `*${operatorSettings?.businessName || 'J.J. INTERIORS & MODUTECH'}*\n\nBill No: ${inv.invoiceNo}\nClient: ${inv.clientName}\nDate: ${inv.date.split('-').reverse().join('/')}\nTotal Amount: â‚¹${inv.totalAmount.toLocaleString('en-IN')}\n\nThank you for your business!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${inv.invoiceNo} - ${inv.clientName}`,
          text: text,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to WhatsApp URL scheme
      const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const renderArchiveA4Sheet = (captureId, inv) => {
    if (!inv) return null;
    const allRows = [];
    (inv.sections || []).forEach((sec) => {
      if (!sec.items || sec.items.length === 0) return;
      allRows.push({ type: 'section-header', name: sec.name });
      let roomItemCounter = 1;
      sec.items.forEach((item) => {
        allRows.push({ type: 'item', data: item, index: roomItemCounter++ });
      });
    });

    const ITEMS_PER_PAGE = 20;
    const pageChunks = [];
    if (allRows.length === 0) {
      pageChunks.push([]);
    } else {
      for (let i = 0; i < allRows.length; i += ITEMS_PER_PAGE) {
        pageChunks.push(allRows.slice(i, i + ITEMS_PER_PAGE));
      }
    }
    const totalPages = pageChunks.length;

    return (
      <div id={captureId} className="w-[794px] flex flex-col gap-6">
        {pageChunks.map((pageRows, pageIdx) => {
          const fillerRowsCount = Math.max(0, ITEMS_PER_PAGE - pageRows.length);

          return (
            <div 
              key={`a4-page-${pageIdx}`}
              className="a4-page text-slate-900 bg-white p-6 pb-8 flex flex-col justify-between relative shadow-md" 
              style={{ 
                width: '794px', 
                minHeight: '1123px', 
                maxHeight: '1123px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                fontFamily: 'sans-serif',
                overflow: 'hidden'
              }}
            >
              {/* Main Outer Box wrapping entire A4 sheet content */}
              <div className="w-full h-full border-2 border-slate-900 p-2 flex flex-col justify-between" style={{ boxSizing: 'border-box', height: '1050px' }}>
                
                {/* Top Group */}
                <div className="w-full flex flex-col justify-start gap-1.5">
                  {/* Header Box (Greetings inside top row, Logo & Sofa larger, rounded corners) */}
                  <div className="w-full border border-slate-900 rounded-xl p-2.5 relative flex flex-col bg-white overflow-hidden">
                    {/* Greetings Top Line */}
                    <div className="w-full text-[10px] font-extrabold text-slate-900 flex justify-between items-center pb-1 select-none">
                      <span>|| Shree Ganeshaya Namah ||</span>
                      <span>|| Shree Tulsi Krupa ||</span>
                      <span>M. : {operatorSettings?.phone || '94270549218'}</span>
                    </div>

                    {/* Main Header Content */}
                    <div className="w-full flex items-center justify-between pt-1.5 px-1">
                      {/* Brand Logo - LARGER */}
                      <div className="flex-shrink-0">
                        <img src={logoBase64} alt="Tulsi Logo" className="h-[80px] w-[80px] object-contain rounded-md" />
                      </div>
                      
                      {/* Main Header text */}
                      <div className="text-center flex-1 px-2">
                        <h1 
                          className="select-none text-[28px] font-semibold text-brand-red leading-tight"
                          style={{ fontFamily: "'Times New Roman', Times, serif" }}
                        >
                          J.J. INTERIORS & MODUTECH
                        </h1>
                        <div className="text-slate-900 font-display font-black text-[10px] tracking-[0.25em] uppercase mt-0.5 leading-none select-none">
                          WOODEN FURNITURE MAKERS
                        </div>
                        <div className="text-[8px] text-slate-800 font-bold mt-1.5 uppercase select-none tracking-widest text-center">
                          {operatorSettings?.address || '148, RANDALDHAM SOCIETY, CHANAKYAPURI, NEW SAMA ROAD, Surat - 390008'}
                        </div>
                      </div>

                      {/* Sofa Right Icon - LARGER */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <img src="/sofa.jpeg" alt="Sofa" className="h-[65px] w-[95px] object-contain" />
                      </div>
                    </div>
                  </div>

                  {/* Client Info Address Box */}
                  <div className="w-full grid grid-cols-12 gap-3 border border-slate-900 bg-slate-50/20 relative text-[9.5px] p-1.5">
                    <div className="col-span-8 space-y-0.5">
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16 flex-shrink-0">M/s.</span>
                        <div className="flex-1 font-bold text-slate-900 border-b border-slate-300 pb-[2px] pl-1 min-h-[14px] text-left uppercase">
                          {inv.clientName}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16 flex-shrink-0">Address:</span>
                        <div className="flex-1 text-slate-800 border-b border-slate-300 pb-[2px] pl-1 min-h-[14px] text-left uppercase">
                          {inv.clientAddress || 'Surat'}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16 flex-shrink-0">Phone:</span>
                        <div className="flex-1 text-slate-800 border-b border-slate-300 pb-[2px] pl-1 min-h-[14px] text-left">
                          {inv.clientPhone || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4 space-y-0.5 pl-3 border-l border-slate-300">
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16">Bill No. :</span>
                        <span className="font-extrabold text-slate-900 border-b border-slate-300 pb-[2px] min-w-[70px] text-left pl-2 font-mono">
                          {inv.invoiceNo}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16">Date :</span>
                        <span className="text-slate-800 border-b border-slate-300 pb-[2px] min-w-[70px] text-left pl-2">
                          {inv.date ? inv.date.split('-').reverse().join('/') : '-'}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16">Payment :</span>
                        <span className={`border-b border-slate-300 pb-[2px] min-w-[70px] text-left pl-2 font-bold ${inv.paymentMode === 'Pending' ? 'text-rose-600' : 'text-slate-800'}`}>
                          {inv.paymentMode === 'None' ? '' : (inv.paymentMode || 'UPI')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Details - Flex 1 Container so it fills the middle space */}
                <div className="w-full flex-1 my-1.5 border border-slate-900 flex flex-col justify-between overflow-hidden">
                  <table className="w-full h-full text-[9px] select-none border-collapse" style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-900 font-extrabold text-center text-slate-900">
                        <th style={{ width: '45px' }} className="border-r border-slate-900 py-1 text-center align-middle">Sr.<br/>No.</th>
                        <th className="border-r border-slate-900 py-1 px-3 text-center align-middle">Particular</th>
                        <th style={{ width: '70px' }} className="border-r border-slate-900 py-1 text-center align-middle">Size</th>
                        <th style={{ width: '70px' }} className="border-r border-slate-900 py-1 text-center align-middle">S.F.T.</th>
                        <th style={{ width: '80px' }} className="border-r border-slate-900 py-1 text-center align-middle">Rate (Rs.)</th>
                        <th style={{ width: '100px' }} className="py-1 text-center align-middle">Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody className="h-full">
                      {pageRows.map((row, rIdx) => {
                        if (row.type === 'section-header') {
                          return (
                            <tr key={`sec-${rIdx}`} className="bg-slate-100 border-t border-b border-slate-900 break-inside-avoid">
                              <td className="border-r border-slate-900 py-1 text-center align-middle"></td>
                              <td className="border-r border-slate-900 py-1 text-center text-slate-900 font-extrabold uppercase tracking-wider text-[9.5px] align-middle">
                                â– {row.name}
                              </td>
                              <td className="border-r border-slate-900"></td>
                              <td className="border-r border-slate-900"></td>
                              <td className="border-r border-slate-900"></td>
                              <td></td>
                            </tr>
                          );
                        } else {
                          const item = row.data;
                          return (
                            <tr key={`item-${rIdx}`} className="border-b border-slate-200 break-inside-avoid">
                              <td className="border-r border-slate-900 px-2 py-1 text-center font-bold text-slate-600 align-middle">{row.index}</td>
                              <td className="border-r border-slate-900 px-3 py-1 text-left font-bold text-slate-900 leading-tight align-middle" style={{ wordBreak: 'break-word' }}>{item.name}</td>
                              <td className="border-r border-slate-900 px-2 py-1 text-center font-medium align-middle">{item.size || ''}</td>
                              <td className="border-r border-slate-900 px-2 py-1 text-center font-medium align-middle">{item.sft || ''}</td>
                              <td className="border-r border-slate-900 px-2 py-1 text-center font-medium align-middle">{item.rate > 0 ? item.rate.toFixed(2) : ''}</td>
                              <td className="px-3 py-1 text-center font-extrabold text-slate-900 align-middle">{item.amount.toLocaleString('en-IN')}.00</td>
                            </tr>
                          );
                        }
                      })}

                      {/* Single empty filler row to absorb all remaining space so table vertical lines hit the bottom border without stretching data rows */}
                      {fillerRowsCount > 0 && (
                        <tr className="border-b-0 h-full">
                          <td className="border-r border-slate-900"></td>
                          <td className="border-r border-slate-900"></td>
                          <td className="border-r border-slate-900"></td>
                          <td className="border-r border-slate-900"></td>
                          <td className="border-r border-slate-900"></td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Group */}
                <div className="w-full flex flex-col justify-end gap-1.5 mb-1.5">
                  {/* Total Row */}
                  <div className="border border-slate-900 flex justify-between items-center px-4 py-1.5 bg-slate-50 font-extrabold text-[11.5px]">
                    <span className="uppercase text-slate-800 tracking-wider">TOTAL BILL AMOUNT</span>
                    <span className="font-extrabold text-slate-900 text-base">â‚¹{inv.totalAmount.toLocaleString('en-IN')}.00</span>
                  </div>

                  {/* Print signature footer details matching user reference image */}
                  <div className="w-full border border-slate-900 p-2 flex justify-between items-end text-[9px] select-none bg-white">
                    <div className="space-y-0.5">
                      <div className="text-slate-800 font-bold">
                        Subject to {operatorSettings?.jurisdiction || 'Surat'} Jurisdiction.
                      </div>
                      {inv.billType === 'Pakka' && (
                        <div className="font-extrabold text-slate-900">
                          PAN CARD No. {operatorSettings?.panCard || 'CMYPS4786H'}
                        </div>
                      )}
                      {inv.billType === 'Kachcha' && (
                        <div className="text-[8px] text-slate-500 italic">
                          Quotation / Estimate Only - Valued Draft
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-end pb-1">
                      <div className="font-extrabold text-slate-900 text-[10px]">
                        E. & O.E.
                      </div>
                    </div>

                    <div className="text-right pt-10">
                      <div className="font-extrabold text-slate-900 text-[9.5px]">
                        For {operatorSettings?.name || 'Mukesh bhai Suthar'}
                      </div>
                      <div className="text-[8px] font-bold text-slate-600 uppercase tracking-wider">
                        {operatorSettings?.role || 'AUTHORIZED OPERATOR'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-800 dark:text-slate-100 tracking-tight">
          Invoices & Estimates Archive
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          A dedicated repository to search, preview, and re-export generated quotes (Kachcha) and formal invoices (Pakka).
        </p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-2 glass-card p-3 rounded-2xl flex items-center space-x-3 border border-slate-200/50 dark:border-slate-800">
          <Search className="h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Bill No, Client Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 focus:outline-none text-xs placeholder-slate-400"
          />
        </div>

        {/* Type Toggle Filter */}
        <div className="md:col-span-2 flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-250/20 w-fit justify-self-end">
          {['All', 'Pakka', 'Kachcha'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-premium cursor-pointer ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-700 text-brand-accent-dark dark:text-brand-accent shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {t === 'All' ? 'All Books' : t === 'Pakka' ? 'Tax Invoices' : 'Estimates'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of Past Bills */}
      {filteredInvoices.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <FileText className="h-10 w-10 mx-auto text-slate-300 stroke-[1.5] mb-2" />
          No invoices match the specified criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.invoiceNo}
              className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 glass-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      Bill Serial No
                    </span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                      {inv.invoiceNo}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 border rounded text-[9px] font-extrabold uppercase ${
                    inv.billType === 'Kachcha'
                      ? 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
                      : 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                  }`}>
                    {inv.billType === 'Kachcha' ? 'Estimate' : 'Tax Invoice'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {inv.clientName}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    {inv.clientPhone && <div>Phone: {inv.clientPhone}</div>}
                    <div>Date: {inv.date.split('-').reverse().join('/')}</div>
                    <div className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold rounded">
                      Pay: {inv.paymentMode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Total Sum</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    â‚¹{inv.totalAmount.toLocaleString('en-IN')}/-
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShareInvoice(inv)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800 rounded-xl transition-premium cursor-pointer"
                    title="Share Invoice Summary"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditInvoice(inv)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800 rounded-xl transition-premium cursor-pointer"
                    title="Edit Invoice"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 bg-brand-beige/65 hover:bg-brand-beige text-brand-accent-dark dark:text-brand-accent dark:bg-slate-800 border border-brand-accent/20 dark:border-slate-700 rounded-xl transition-premium cursor-pointer"
                    title="View A4 Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadPastPDF(inv)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-premium cursor-pointer"
                    title="Download high-res PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Print & Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative animate-scaleUp">
            {/* Close Button Top Right */}
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="bg-white rounded-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin">
              <div className="origin-top scale-[0.62] sm:scale-75 md:scale-90 lg:scale-100 transition-premium bg-white">
                {/* A4 Physical Page Live Preview */}
                {renderArchiveA4Sheet(`archive-invoice-preview-${selectedInvoice.invoiceNo}`, selectedInvoice)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden containers for ALL invoices PDF export - always rendered, never conditional */}
      <div style={{ position: 'absolute', top: '-99999px', left: '-99999px', width: '794px', opacity: 0, pointerEvents: 'none', zIndex: -9999 }}>
        {invoices.map((inv) => (
          <div key={inv.invoiceNo} style={{ backgroundColor: '#ffffff', width: '794px' }}>
            {renderArchiveA4Sheet(`archive-invoice-capture-${inv.invoiceNo}`, inv)}
          </div>
        ))}
      </div>
    </div>
  );
};







