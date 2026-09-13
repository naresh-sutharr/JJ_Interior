import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRows, useBusinessProfile } from "@/hooks/use-admin";
import { toast } from "sonner";
import { Users, IndianRupee, ShieldAlert, ArrowRight, FileSpreadsheet, Eye, Download, X, Calendar, CreditCard, Sparkles, FileText } from 'lucide-react';
import { GaneshaSVG, SofaSVG } from './admin.billing';
import { logoBase64 } from '@/utils/logoBase64';
import { downloadPDF } from '@/utils/pdfExport';

export const Route = createFileRoute('/admin/_panel/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { data: dbClients = [] } = useRows('clients');
  const { data: dbInvoices = [] } = useRows('invoices');
  const { data: operatorData } = useBusinessProfile();

  const clients = dbClients.map(c => ({
    id: c.id,
    name: c.name,
    city: c.city || 'Surat',
    phone: c.phone || '',
    billed: c.total_billed || 0,
    paid: c.total_paid || 0
  }));

  const invoices = dbInvoices;

  const operatorSettings = operatorData || {
    name: 'Mukesh bhai Suthar',
    role: 'Authorized Operator',
    businessName: 'JAY JASOL INTERIORS & MODUTECH',
    address: 'Surat, Surat - 390008',
    phone: '94270549218',
    panCard: 'CMYPS4786H',
    jurisdiction: 'Surat'
  };
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Dynamic KPI calculations
  const totalClients = clients.length;
  const totalBilled = clients.reduce((sum, c) => sum + Number(c.billed), 0);
  const totalPaid = clients.reduce((sum, c) => sum + Number(c.paid), 0);
  const totalOutstanding = totalBilled - totalPaid;

  const collectedPercentage = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  // Outstanding accounts list
  const outstandingClients = [...clients]
    .map(c => ({ ...c, due: c.billed - c.paid }))
    .filter(c => c.due > 0)
    .sort((a, b) => b.due - a.due);

  // Recent 3 invoices
  const recentInvoices = invoices.slice(0, 3);

  // Download Past Invoice PDF - direct download, no modal required
  const handleDownloadPastPDF = async (inv) => {
    const clientNameFile = inv.clientName.replace(/\s+/g, '_');
    const filename = `${clientNameFile}_${inv.invoiceNo}.pdf`;
    await downloadPDF(`dash-invoice-capture-${inv.invoiceNo}`, filename);
  };

  const renderDashboardA4Sheet = (captureId, inv) => {
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
                      {/* Main Header text */}
                      <div className="text-center flex-1 px-2">
                        <h1 
                          className="select-none text-[28px] font-semibold text-brand-red leading-tight"
                          style={{ fontFamily: "'Times New Roman', Times, serif" }}
                        >
                          JAY JASOL INTERIORS & MODUTECH
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
                                ❖ {row.name}
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
                    <span className="font-extrabold text-slate-900 text-base">₹{inv.totalAmount.toLocaleString('en-IN')}.00</span>
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
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-24 md:pb-0 font-sans">
      
      {/* Top Premium Banner Header */}
      <div 
        className="relative overflow-hidden bg-[#111] dark:bg-[#050505] p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 z-10 border border-[#333] dark:border-[#222]"
        style={{
          backgroundImage: `url('https://d3pc8mc492u0e.cloudfront.net/shaswat.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/85 z-0"></div>
        
        {/* Decorative background elements */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[var(--brand-accent)] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 z-0"></div>
        
        <div className="relative z-20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[var(--brand-accent)]" />
            <span className="text-[10px] md:text-xs font-bold text-[var(--brand-accent)] uppercase tracking-[0.2em] bg-[var(--brand-accent)]/10 px-3 py-1.5 rounded-full border border-[var(--brand-accent)]/20">
              Overview Dashboard
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-wide leading-tight">
            JAY JASOL INTERIORS & MODUTECH Ledger
          </h1>
          
          {/* Cursive greeting text */}
          <p 
            className="text-xl md:text-2xl font-bold text-[var(--brand-accent)] mt-1.5 select-none drop-shadow-md"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Welcome, {operatorSettings?.name?.split(' ')[0] || 'Mukesh bhai'}! ✨
          </p>
          <p className="text-gray-400 text-xs mt-2.5 md:mt-3 max-w-lg font-medium leading-relaxed">
            Crafting premium spaces & custom wooden furniture since 1998. Monitor your client accounts, billings, and cashflow in real-time.
          </p>
        </div>
        
        <button
          onClick={() => navigate({ to: '/admin/billing' })}
          className="relative z-20 flex items-center justify-center gap-2 px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-dark)] hover:from-[var(--brand-accent-dark)] hover:to-[var(--brand-accent)] text-white rounded-2xl text-sm md:text-base font-bold transition-all duration-300 shadow-xl shadow-[var(--brand-accent)]/40 hover:shadow-[var(--brand-accent)]/60 hover:-translate-y-1 cursor-pointer w-full md:w-auto overflow-hidden group border border-[#e5b974]/30"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          <span className="relative z-10 flex items-center gap-2">
            Create New Bill 📝 <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </span>
        </button>
      </div>

      {/* KPI Cards Grid - Optimized for Mobile */}
      <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-6 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
        {/* KPI 1: Active Clients */}
        <div className="glass-card glass-card-hover p-5 md:p-6 flex items-center justify-between group min-w-[85vw] snap-center md:min-w-0 flex-shrink-0">
          <div className="space-y-1.5 md:space-y-2">
            <span className="text-[10px] md:text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em] block">
              Total Clients 👥
            </span>
            <span className="text-3xl md:text-4xl font-extrabold font-display text-[var(--text-primary)] block group-hover:scale-105 origin-left transition-transform duration-400">
              {totalClients}
            </span>
            <span 
              className="text-xs md:text-sm text-[var(--brand-accent-dark)] font-semibold block"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Active custom furniture books
            </span>
          </div>
          <div className="bg-[var(--brand-beige)] dark:bg-[var(--brand-accent)]/10 p-4 md:p-5 rounded-[1.25rem] text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)]">
            <Users className="h-6 w-6 md:h-8 md:w-8 stroke-[1.5]" />
          </div>
        </div>

        {/* KPI 2: Total Revenue Billed */}
        <div className="glass-card glass-card-hover p-5 md:p-6 flex items-center justify-between group min-w-[85vw] snap-center md:min-w-0 flex-shrink-0">
          <div className="space-y-1.5 md:space-y-2">
            <span className="text-[10px] md:text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em] block">
              Total Revenue Billed 💵
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-display text-[var(--text-primary)] block flex items-center group-hover:scale-105 origin-left transition-transform duration-400">
              <IndianRupee className="h-5 w-5 md:h-7 md:w-7 stroke-[2.5]" />
              {totalBilled.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 font-bold block bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg inline-block border border-emerald-100 dark:border-emerald-800/50">
              Realized: ₹{totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 md:p-5 rounded-[1.25rem] text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="h-6 w-6 md:h-8 md:w-8 stroke-[1.5]" />
          </div>
        </div>

        {/* KPI 3: Total Outstanding Due */}
        <div className="glass-card glass-card-hover p-5 md:p-6 flex items-center justify-between group min-w-[85vw] snap-center md:min-w-0 flex-shrink-0">
          <div className="space-y-1.5 md:space-y-2">
            <span className="text-[10px] md:text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em] block">
              Outstanding Dues ⚠️
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-display text-[var(--brand-red)] block flex items-center group-hover:scale-105 origin-left transition-transform duration-400">
              <IndianRupee className="h-5 w-5 md:h-7 md:w-7 stroke-[2.5]" />
              {totalOutstanding.toLocaleString('en-IN')}
            </span>
            <span 
              className="text-xs md:text-sm text-[var(--brand-red)]/90 font-semibold block"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Payment collection follow-ups
            </span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 md:p-5 rounded-[1.25rem] text-[var(--brand-red)]">
            <ShieldAlert className="h-6 w-6 md:h-8 md:w-8 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Interactive Middle Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Collections progress dial */}
        <div className="glass-card p-5 md:p-6 lg:col-span-1 flex flex-col justify-between group">
          <div>
            <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              Collections Status 📊
            </h3>
            <p className="text-[10px] md:text-xs text-[var(--text-secondary)] mt-1">
              Current ratio of payment realization versus billed.
            </p>
          </div>

          <div className="my-8 text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[10px] border-[var(--border-color)] flex items-center justify-center relative shadow-sm">
                {/* SVG Progress Circle (Decorative) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-transparent" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="url(#accentGrad)" strokeWidth="10" 
                    strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * collectedPercentage) / 100}
                    strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-md" 
                  />
                  <defs>
                    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--brand-accent)" />
                      <stop offset="100%" stopColor="var(--brand-accent-dark)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center z-10">
                  <span className="text-3xl md:text-5xl font-black font-display text-[var(--text-primary)]">{collectedPercentage}%</span>
                </div>
              </div>
            </div>
            <div>
              <span 
                className="text-sm md:text-lg text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)] block font-bold"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Collected from overall bookings
              </span>
            </div>
          </div>

          <div className="bg-[var(--brand-beige)] dark:bg-[#111111] p-3 md:p-4 rounded-xl border border-[var(--border-color)] text-[10px] md:text-xs flex justify-between items-center transition-all duration-300">
            <span className="text-[var(--text-secondary)] font-semibold">Outstanding Pending:</span>
            <span className="font-extrabold text-[var(--brand-red)] group-hover:scale-105 transition-transform">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Ledger Pending Balance Overview */}
        <div className="glass-card p-5 md:p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
              <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)] font-display">
                Pending Ledger Follow-ups ⏰
              </h3>
              <p className="text-[10px] md:text-xs text-[var(--text-secondary)] mt-1">
                Client statements awaiting final payments.
              </p>
            </div>
            <button
              onClick={() => navigate({ to: '/admin/clients' })}
              className="px-3 py-2 md:px-4 md:py-2.5 bg-[var(--brand-beige)] dark:bg-[#222] hover:bg-[var(--brand-accent)] hover:text-white dark:hover:bg-[var(--brand-accent)] text-[var(--text-primary)] rounded-xl text-[10px] md:text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              View Ledger <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {outstandingClients.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)] text-sm py-8 md:py-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800 shadow-inner">
                <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-emerald-500" />
              </div>
              <p className="font-bold text-[var(--text-primary)] text-base md:text-lg">Awesome! All payments cleared! 🏆</p>
              <p className="text-xs md:text-sm mt-1">Your ledger is perfectly balanced.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 md:space-y-4 max-h-[280px] md:max-h-72 scrollbar-thin">
              {outstandingClients.map((client) => {
                const clientDue = client.billed - client.paid;
                const progress = client.billed > 0 ? Math.round((client.paid / client.billed) * 100) : 0;
                return (
                  <div key={client.id} className="p-3 md:p-4 rounded-[1.25rem] border border-[var(--border-color)] bg-[var(--brand-light)] hover:border-[var(--brand-accent)]/50 transition-all duration-300 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[var(--brand-accent)]/20 to-[var(--brand-accent-dark)]/20 border border-[var(--brand-accent)]/30 flex items-center justify-center text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)] font-bold text-sm md:text-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs md:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-accent-dark)] transition-colors">{client.name}</div>
                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-[var(--text-secondary)]">
                          <span className="bg-[var(--brand-beige)] dark:bg-[#222] px-2 py-0.5 rounded-md border border-[var(--border-color)]">{client.city}</span>
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1 md:space-y-1.5">
                      <div className="text-xs md:text-sm font-black text-[var(--brand-red)] flex items-center justify-end">
                        <IndianRupee className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        {clientDue.toLocaleString('en-IN')}
                      </div>
                      <div className="w-20 md:w-28 h-1.5 md:h-2 bg-[var(--brand-beige)] dark:bg-[#222] rounded-full overflow-hidden ml-auto shadow-inner border border-[var(--border-color)]">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-[8px] md:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        Paid: {progress}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Registry History */}
      <div className="glass-card p-5 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
          <div>
            <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)] font-display flex items-center gap-2">
              Recent Activity Logs 📝
            </h3>
            <p className="text-[10px] md:text-xs text-[var(--text-secondary)] mt-1">
              Preview and manage recently generated estimates and tax invoices.
            </p>
          </div>

          <button
            onClick={() => navigate({ to: '/admin/invoices' })}
            className="px-3 py-2 md:px-4 md:py-2.5 bg-[var(--brand-beige)] dark:bg-[#222] hover:bg-[var(--brand-accent)] hover:text-white dark:hover:bg-[var(--brand-accent)] text-[var(--text-primary)] rounded-xl text-[10px] md:text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            All Invoices <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="py-12 md:py-16 flex flex-col items-center justify-center text-[var(--text-secondary)]">
             <FileSpreadsheet className="h-12 w-12 md:h-16 md:w-16 mb-4 opacity-20" />
            <p className="text-xs md:text-sm font-medium">No billing invoices have been created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 -mx-5 md:mx-0 px-5 md:px-0 scrollbar-thin">
            <table className="w-full text-left text-sm border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b-2 border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] md:text-xs font-bold uppercase tracking-widest bg-[var(--brand-beige)] dark:bg-[#111]">
                  <th className="px-5 py-4 rounded-tl-2xl">Bill No</th>
                  <th className="px-5 py-4">Client Name</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4 text-right">Invoice Sum</th>
                  <th className="px-5 py-4 text-center rounded-tr-2xl w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {recentInvoices.map((inv) => (
                  <tr key={inv.invoiceNo} className="hover:bg-[var(--brand-beige)] dark:hover:bg-[#111] text-[11px] md:text-sm transition-colors group">
                    <td className="px-5 py-4 md:py-5 font-black text-[var(--text-primary)]">
                      <span className="bg-[var(--brand-light)] border border-[var(--border-color)] px-2.5 py-1.5 rounded-lg font-mono shadow-sm">{inv.invoiceNo}</span>
                    </td>
                    <td className="px-5 py-4 md:py-5 font-bold text-[var(--text-primary)]">{inv.clientName}</td>
                    <td className="px-5 py-4 md:py-5 text-[var(--text-secondary)] font-medium">
                      {inv.date.split('-').reverse().join('/')}
                    </td>
                    <td className="px-5 py-4 md:py-5">
                      <span className={`px-3 py-1.5 border rounded-lg text-[9px] md:text-[10px] font-extrabold uppercase shadow-sm ${
                        inv.billType === 'Kachcha'
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700/50'
                          : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/50'
                      }`}>
                        {inv.billType === 'Kachcha' ? 'Estimate' : 'Tax Invoice'}
                      </span>
                    </td>
                    <td className="px-5 py-4 md:py-5 font-black text-[var(--text-primary)] text-right text-sm md:text-base">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 md:py-5 text-center flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-2.5 bg-[var(--brand-light)] hover:bg-[var(--brand-accent)] text-[var(--brand-accent-dark)] hover:text-white border border-[var(--border-color)] hover:border-[var(--brand-accent)] rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 md:h-4.5 md:w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadPastPDF(inv)}
                        className="p-2.5 bg-[#111] dark:bg-[#222] hover:bg-[#333] dark:hover:bg-[#444] text-white rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-[#333]"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4 md:h-4.5 md:w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* A4 Invoice Preview Modal - Mobile Optimized */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center z-[100] p-0 md:p-6">
          <div className="bg-[var(--brand-light)] rounded-t-[2rem] md:rounded-[2rem] w-full max-w-6xl p-5 md:p-8 shadow-2xl border border-[var(--border-color)] animate-slideUp md:animate-scaleUp relative flex flex-col md:flex-row gap-6 md:gap-8 max-h-[95vh]">
            
            {/* Left Area (Details & Actions) */}
            <div className="md:w-1/3 flex flex-col justify-between order-2 md:order-1 h-full max-h-[45vh] md:max-h-full overflow-y-auto pr-2 scrollbar-thin">
              <div>
                <div className="flex justify-between items-start sticky top-0 bg-[var(--brand-light)]/95 backdrop-blur-sm pb-4 z-10">
                  <div>
                    <h3 className="font-display font-black text-xl md:text-3xl text-[var(--text-primary)] flex items-center gap-2">
                      <FileText className="h-6 w-6 md:h-8 md:w-8 text-[var(--brand-accent)]" />
                      Bill: {selectedInvoice.invoiceNo}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[var(--text-secondary)] mt-1.5 uppercase tracking-widest font-bold">Archived generated invoice</p>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2 md:p-2.5 hover:bg-[var(--brand-beige)] dark:hover:bg-[#222] rounded-full transition-colors text-[var(--text-secondary)] bg-[var(--brand-beige)]/50 border border-[var(--border-color)]"
                  >
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                </div>

                <div className="mt-2 md:mt-4 space-y-4 md:space-y-6 text-xs md:text-sm">
                  <div className="bg-[var(--brand-beige)] dark:bg-[#111] p-5 md:p-6 rounded-[1.5rem] border border-[var(--border-color)] space-y-4 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="p-2 md:p-2.5 bg-[var(--brand-light)] rounded-xl shadow-sm border border-[var(--border-color)]">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5 text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)]" />
                      </div>
                      <span className="text-[var(--text-secondary)] text-xs md:text-sm">Date: <strong className="text-[var(--text-primary)] font-bold ml-1 text-sm md:text-base">{selectedInvoice.date.split('-').reverse().join('/')}</strong></span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 md:p-2.5 bg-[var(--brand-light)] rounded-xl shadow-sm border border-[var(--border-color)]">
                        <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)]" />
                      </div>
                      <span className="text-[var(--text-secondary)] text-xs md:text-sm">Payment: <strong className="text-emerald-600 dark:text-emerald-400 font-bold ml-1 uppercase bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md">{selectedInvoice.paymentMode}</strong></span>
                    </div>
                    
                    <div className="border-t border-[var(--border-color)] pt-4 mt-4">
                      <div className="text-[9px] md:text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-widest mb-2">Billed To</div>
                      <div className="font-black text-[var(--text-primary)] text-sm md:text-lg">{selectedInvoice.clientName}</div>
                      {selectedInvoice.clientPhone && <div className="text-[var(--text-secondary)] font-medium text-[11px] md:text-xs mt-1.5 flex items-center gap-1.5">📞 {selectedInvoice.clientPhone}</div>}
                      {selectedInvoice.clientAddress && <div className="text-[var(--text-secondary)] italic text-[10px] md:text-[11px] mt-2 bg-[var(--brand-light)] p-2.5 rounded-xl border border-[var(--border-color)]">{selectedInvoice.clientAddress}</div>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-5 py-4 bg-[var(--brand-accent)]/10 dark:bg-[var(--brand-accent)]/5 rounded-[1.5rem] border border-[var(--brand-accent)]/20">
                    <span className="font-bold text-[var(--text-primary)] font-display text-sm md:text-base">Invoice Sum</span>
                    <span className="font-black text-[var(--brand-accent-dark)] dark:text-[var(--brand-accent)] text-xl md:text-2xl drop-shadow-sm">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 md:pt-8 mt-auto sticky bottom-0 bg-[var(--brand-light)] pb-2">
                <button
                  onClick={() => handleDownloadPastPDF(selectedInvoice)}
                  className="w-full flex items-center justify-center gap-2 py-4 md:py-5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-dark)] hover:from-[var(--brand-accent-dark)] hover:to-[var(--brand-accent)] text-white rounded-[1.25rem] text-xs md:text-sm font-bold transition-all duration-300 shadow-xl shadow-[var(--brand-accent)]/30 hover:shadow-[var(--brand-accent)]/50 hover:-translate-y-1 cursor-pointer"
                >
                  <Download className="h-4 w-4 md:h-5 md:w-5" /> Download Digital PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-full py-3.5 md:py-4 bg-[var(--brand-beige)] dark:bg-[#111] hover:bg-[#e2dfd5] dark:hover:bg-[#222] text-[var(--text-primary)] rounded-[1.25rem] text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer border border-[var(--border-color)]"
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* Right Area (A4 Preview) */}
            <div className="md:w-2/3 bg-[var(--brand-beige)] dark:bg-[#111] p-4 md:p-8 rounded-[1.5rem] overflow-auto flex justify-center h-[55vh] md:h-full max-h-[55vh] md:max-h-[85vh] border border-[var(--border-color)] shadow-inner order-1 md:order-2 custom-scrollbar">
              <div className="origin-top scale-[0.45] sm:scale-[0.55] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.85] transition-transform duration-300 bg-white shadow-2xl">
                {/* A4 Physical Page Live Preview */}
                {renderDashboardA4Sheet(`dash-invoice-preview-${selectedInvoice.invoiceNo}`, selectedInvoice)}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hidden containers for recent invoices PDF export - always rendered */}
      <div style={{ position: 'absolute', top: '-99999px', left: '-99999px', width: '794px', opacity: 0, pointerEvents: 'none', zIndex: -9999 }}>
        {invoices.map((inv) => (
          <div key={inv.invoiceNo} style={{ backgroundColor: '#ffffff', width: '794px' }}>
            {renderDashboardA4Sheet(`dash-invoice-capture-${inv.invoiceNo}`, inv)}
          </div>
        ))}
      </div>
    </div>
  );
};







