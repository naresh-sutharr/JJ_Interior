import React, { useState, useEffect, useRef } from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { useRows, useSaveRow, useBusinessProfile } from "@/hooks/use-admin";
import { toast } from "sonner";


import { Plus, Trash2, Download, Save, PlusCircle, User, FileText, Calendar, IndianRupee, Search, MapPin, Phone, FolderPlus, CreditCard, ChevronDown, Check, Edit2 } from 'lucide-react';
import { logoBase64 } from '@/utils/logoBase64';
import { downloadPDF } from '@/utils/pdfExport';

// Lord Ganesha SVG matching top-left stamp of the reference invoice
export const GaneshaSVG = ({ className = "h-11 w-11" }) => (
  <svg className={className} width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 15 Q 40 10 32 16 C 24 22 22 32 29 38 C 32 41 38 41 40 44 C 42 48 35 56 33 61 C 31 66 35 72 41 72 C 50 72 56 59 59 52 C 61 47 61 38 56 28 Z" stroke="#800000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M 37 25 Q 24 25 24 38 Q 24 47 34 44" stroke="#800000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 63 25 Q 76 25 76 38 Q 76 47 66 44" stroke="#800000" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 44 38 Q 44 50 38 57 Q 35 60 35 64 Q 35 69 41 69 Q 48 69 50 60 Q 52 50 52 38" stroke="#800000" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 32 63 Q 30 68 36 68 Q 40 68 38 63 Z" fill="#d4af37" stroke="#800000" strokeWidth="1" />
    <path d="M 50 19 C 50 16 52 16 52 19 C 52 22 50 22 50 19 Z" fill="#dc2626" />
    <path d="M 47 21 Q 50 23 53 21" stroke="#d4af37" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

// Green Sofa SVG matching top-right stamp of the reference invoice
export const SofaSVG = ({ className = "h-11 w-16" }) => (
  <svg className={className} width="64" height="44" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sofaGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#17351a" />
        <stop offset="100%" stopColor="#0b170c" />
      </linearGradient>
    </defs>
    <rect x="15" y="16" width="130" height="38" rx="8" fill="url(#sofaGreen)" stroke="#060c06" strokeWidth="1.5" />
    <rect x="19" y="41" width="60" height="18" rx="5" fill="#1b3d1f" stroke="#060c06" strokeWidth="1.2" />
    <rect x="81" y="41" width="60" height="18" rx="5" fill="#1b3d1f" stroke="#060c06" strokeWidth="1.2" />
    <path d="M 8 28 C 8 21, 17 21, 17 28 L 17 54 C 17 58, 8 58, 8 54 Z" fill="url(#sofaGreen)" stroke="#060c06" strokeWidth="1.2" />
    <path d="M 152 28 C 152 21, 143 21, 143 28 L 143 54 C 143 58, 152 58, 152 54 Z" fill="url(#sofaGreen)" stroke="#060c06" strokeWidth="1.2" />
    <line x1="22" y1="59" x2="18" y2="70" stroke="#a3875f" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="138" y1="59" x2="142" y2="70" stroke="#a3875f" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="80" y1="59" x2="80" y2="68" stroke="#a3875f" strokeWidth="3" strokeLinecap="round" />
    {/* Tuftings */}
    <circle cx="35" cy="24" r="1.2" fill="#d4af37" />
    <circle cx="55" cy="24" r="1.2" fill="#d4af37" />
    <circle cx="75" cy="24" r="1.2" fill="#d4af37" />
    <circle cx="95" cy="24" r="1.2" fill="#d4af37" />
    <circle cx="115" cy="24" r="1.2" fill="#d4af37" />
    <circle cx="135" cy="24" r="1.2" fill="#d4af37" />
    <circle cx="45" cy="32" r="1.2" fill="#d4af37" />
    <circle cx="65" cy="32" r="1.2" fill="#d4af37" />
    <circle cx="85" cy="32" r="1.2" fill="#d4af37" />
    <circle cx="105" cy="32" r="1.2" fill="#d4af37" />
    <circle cx="125" cy="32" r="1.2" fill="#d4af37" />
  </svg>
);

// Cropped Brand Logo for physical A4 billing invoice header next to title
export const BillHeaderLogo = ({ className = "h-11 w-11" }) => (
  <svg className={className} viewBox="50 80 320 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradBill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#f9f1d0" />
        <stop offset="100%" stopColor="#aa7c11" />
      </linearGradient>
    </defs>
    {/* House Outline (Gold) */}
    <path d="M 230 100 L 350 200 L 350 355 L 235 355" stroke="url(#goldGradBill)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 315 200 L 315 355" stroke="url(#goldGradBill)" strokeWidth="3" opacity="0.3" />
    <path d="M 327 200 L 327 355" stroke="url(#goldGradBill)" strokeWidth="3" opacity="0.3" />
    <path d="M 339 200 L 339 355" stroke="url(#goldGradBill)" strokeWidth="3" opacity="0.3" />
    {/* Pendant Lamp */}
    <line x1="295" y1="150" x2="295" y2="225" stroke="url(#goldGradBill)" strokeWidth="3" />
    <path d="M 285 225 C 285 210, 305 210, 305 225 Z" fill="url(#goldGradBill)" />
    <circle cx="295" cy="228" r="3.5" fill="#f7f6f2" />
    {/* Chair backrest */}
    <path d="M 260 270 Q 295 265 330 270 L 330 310 Q 295 315 260 310 Z" fill="#f4f1ea" stroke="#d5d0c7" strokeWidth="2.5" />
    {/* Green Cushion */}
    <path d="M 265 295 Q 295 290 325 295 L 325 318 Q 295 322 265 318 Z" fill="#4d6f54" />
    {/* Armrests */}
    <path d="M 252 285 C 252 285, 260 280, 263 295 L 260 322 C 257 325, 252 322, 252 315 Z" fill="#eae5db" stroke="#d5d0c7" />
    <path d="M 338 285 C 338 285, 330 280, 327 295 L 330 322 C 333 325, 338 322, 338 315 Z" fill="#eae5db" stroke="#d5d0c7" />
    {/* Chair Seat Base */}
    <path d="M 258 312 Q 295 310 332 312 Q 330 330 295 330 Q 260 330 258 312 Z" fill="#eae5db" />
    {/* Chair legs */}
    <line x1="265" y1="330" x2="258" y2="352" stroke="url(#goldGradBill)" strokeWidth="5" strokeLinecap="round" />
    <line x1="325" y1="330" x2="332" y2="352" stroke="url(#goldGradBill)" strokeWidth="5" strokeLinecap="round" />
    {/* Gold Serif T */}
    <path d="M 120 180 L 230 180 C 230 190, 220 195, 210 195 L 188 195 L 188 335 C 188 345, 198 348, 208 348 L 208 355 L 138 355 L 138 348 C 148 348, 158 345, 158 335 L 158 195 L 140 195 C 130 195, 120 190, 120 180 Z" fill="url(#goldGradBill)" />
    {/* Green Leafy Branch */}
    <path d="M 222 360 Q 212 280 232 195" stroke="#334e38" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M 220 330 Q 198 322 208 307 Q 221 316 220 330 Z" fill="#3d5a43" />
    <path d="M 222 310 Q 244 302 234 287 Q 221 296 222 310 Z" fill="#588162" />
    <path d="M 218 280 Q 198 270 206 255 Q 218 263 218 280 Z" fill="#3d5a43" />
    <path d="M 220 260 Q 243 250 233 235 Q 220 243 220 260 Z" fill="#588162" />
    <path d="M 221 230 Q 206 215 214 205 Q 224 212 221 230 Z" fill="#3d5a43" />
    <path d="M 226 212 Q 242 204 236 191 Q 226 196 226 212 Z" fill="#7fa687" />
  </svg>
);

export const Route = createFileRoute('/admin/_panel/billing')({
  component: Billing,
});

function Billing() {

  const { data: dbClients = [] } = useRows('clients');
  const { data: dbItems = [] } = useRows('catalog');
  const { data: dbInvoices = [] } = useRows('invoices');
  const { data: operatorData } = useBusinessProfile();
  
  const addInvoiceRow = useSaveRow('invoices');

  const clients = dbClients.map(c => ({
    id: c.id,
    name: c.name,
    city: c.city || 'Vadodara',
    phone: c.phone || '',
    billed: c.total_billed || 0,
    paid: c.total_paid || 0
  }));

  const items = dbItems.map(c => ({
    id: c.id,
    name: c.name,
    type: c.category || 'With Material',
    rate: c.default_rate || 0
  }));

  const operatorSettings = operatorData || {
    name: 'Mukesh bhai Suthar',
    role: 'Authorized Operator',
    businessName: 'J.J. INTERIORS & MODUTECH',
    address: 'Surat, Gujarat',
    phone: '9898412998',
    panCard: 'CMYPS4786H',
    jurisdiction: 'Surat'
  };

  const draftInvoice = null;
  const setDraftInvoice = () => {};
  
  // mock createInvoice, getNextInvoiceNo since they were from useClients
  const getNextInvoiceNo = React.useCallback(() => {
    return 'TI-' + Math.floor(Math.random() * 10000);
  }, []);
  const createInvoice = () => {};

  const addInvoice = async (invoiceData) => {
    try {
      await addInvoiceRow.mutateAsync({
        number: invoiceData.invoiceNo,
        date: invoiceData.date,
        client_id: null,
        grand_total: invoiceData.totalAmount,
        status: invoiceData.paymentMode === 'Pending' ? 'pending' : 'paid',
        items: invoiceData.sections
      });
      toast.success('Invoice saved to database!');
    } catch (e) {
      toast.error('Failed to save invoice');
    }
  };


  // Kachcha (Estimate) vs Pakka (Tax Invoice) billing type toggle
  const [billType, setBillType] = useState('Pakka'); // 'Kachcha' | 'Pakka'

  // Selected client autocomplete states
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('');
  const [manualClientAddress, setManualClientAddress] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  // Bill Date
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Rooms / Sections State
  const [sections, setSections] = useState([{ name: 'General', items: [] }]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [newSectionName, setNewSectionName] = useState('');

  // Item Autocomplete states
  const [itemSearch, setItemSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [particularRate, setParticularRate] = useState('');
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);

  // Billing Unit Calculation States
  const [unitType, setUnitType] = useState('sft'); // 'sft' | 'rf' | 'nos' | 'lumpsum'
  // 1. Size-based (SFT)
  const [itemLength, setItemLength] = useState('');
  const [itemWidth, setItemWidth] = useState('');
  // 2. Direct values for RF/Nos/SFT manual
  const [rawQtyVal, setRawQtyVal] = useState('');
  // 3. Custom Size label
  const [customSizeText, setCustomSizeText] = useState('');

  // Auto-calculated next sequential Bill No
  const [billNo, setBillNo] = useState('');
  const [mobileStep, setMobileStep] = useState(1);
  
  useEffect(() => {
    setBillNo(getNextInvoiceNo(billType));
  }, [billType, getNextInvoiceNo]);

  // Load from draft on mount
  useEffect(() => {
    if (draftInvoice) {
      setBillType(draftInvoice.billType || 'Pakka');
      setClientSearch(draftInvoice.clientName || '');
      setSelectedClientId(draftInvoice.clientId || '');
      setManualClientPhone(draftInvoice.clientPhone || '');
      setManualClientAddress(draftInvoice.clientAddress || '');
      if (draftInvoice.date) setInvoiceDate(draftInvoice.date);
      setPaymentMode(draftInvoice.paymentMode || 'UPI');
      if (draftInvoice.sections && draftInvoice.sections.length > 0) {
        setSections(draftInvoice.sections);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate grand total function used everywhere
  const calculateGrandTotal = () => {
    return sections.reduce((total, section) => {
      return total + section.items.reduce((secTotal, item) => secTotal + (Number(item.amount) || 0), 0);
    }, 0);
  };

  // Auto-save form state to draft
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if there's actually some data
      if (clientSearch || (sections.length > 1) || (sections[0].items.length > 0)) {
        setDraftInvoice({
          billType,
          clientName: clientSearch,
          clientId: selectedClientId,
          clientPhone: manualClientPhone,
          clientAddress: manualClientAddress,
          date: invoiceDate,
          paymentMode,
          sections,
          totalAmount: calculateGrandTotal()
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [billType, clientSearch, selectedClientId, manualClientPhone, manualClientAddress, invoiceDate, paymentMode, sections, setDraftInvoice]);

  // Click outside listener refs for autocompletes
  const clientRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientRef.current && !clientRef.current.contains(event.target)) {
        setIsClientDropdownOpen(false);
      }
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setIsItemDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter clients based on search (strict prefix match)
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().startsWith(clientSearch.toLowerCase()) ||
    c.phone.startsWith(clientSearch)
  );

  // Handle client selection
  const handleSelectClient = (client) => {
    setSelectedClientId(client.id);
    setClientSearch(client.name);
    setManualClientPhone(client.phone);
    setManualClientAddress(client.city);
    setIsClientDropdownOpen(false);
  };

  // Filter item master based on search (strict prefix match)
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().startsWith(itemSearch.toLowerCase())
  );

  // Handle item selection
  const handleSelectItem = (item) => {
    setSelectedItemId(item.id);
    // Append the type to the name so it reflects on the printed bill
    const typeSuffix = item.type ? ` [${item.type}]` : '';
    setItemSearch(item.name + typeSuffix);
    setParticularRate(item.rate);
    setIsItemDropdownOpen(false);
  };

  // Create new section
  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    if (sections.some(s => s.name.toLowerCase() === newSectionName.trim().toLowerCase())) {
      alert('Section already exists.');
      return;
    }
    setSections([...sections, { name: newSectionName.trim(), items: [] }]);
    setActiveSectionIndex(sections.length);
    setNewSectionName('');
  };

  // Remove section
  const handleRemoveSection = (index) => {
    if (sections.length <= 1) {
      alert('Must have at least one billing section.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the "${sections[index].name}" section?`)) {
      const updated = sections.filter((_, idx) => idx !== index);
      setSections(updated);
      setActiveSectionIndex(0);
    }
  };

  // Calculate Row Values
  const calculateRowData = () => {
    let size = '-';
    let sftCol = '';
    let calculatedAmount = 0;
    const rateNum = Number(particularRate) || 0;

    switch (unitType) {
      case 'sft':
        if (itemLength && itemWidth) {
          size = `${itemLength} X ${itemWidth}`;
          const sftQty = Number(itemLength) * Number(itemWidth);
          sftCol = String(Number(sftQty.toFixed(2)));
          calculatedAmount = sftQty * rateNum;
        } else if (rawQtyVal) {
          size = customSizeText || '-';
          sftCol = String(Number(rawQtyVal));
          calculatedAmount = Number(rawQtyVal) * rateNum;
        }
        break;
      case 'rf':
        size = '';
        sftCol = `${rawQtyVal} R.F.`;
        calculatedAmount = (Number(rawQtyVal) || 0) * rateNum;
        break;
      case 'nos':
        size = '';
        sftCol = `${rawQtyVal} Nos`;
        calculatedAmount = (Number(rawQtyVal) || 0) * rateNum;
        break;
      case 'lumpsum':
        size = '';
        sftCol = '';
        calculatedAmount = rateNum;
        break;
      default:
        break;
    }

    return { size, sftCol, amount: Math.round(calculatedAmount) };
  };

  const { size: previewSize, sftCol: previewSft, amount: previewAmount } = calculateRowData();

  const handleSaveAsDraft = () => {
    setDraftInvoice({
      billType,
      clientName: clientSearch,
      clientId: selectedClientId,
      clientPhone: manualClientPhone,
      clientAddress: manualClientAddress,
      date: invoiceDate,
      paymentMode,
      sections,
      totalAmount: calculateGrandTotal()
    });
    alert('Bill saved as Draft! You can navigate away and come back later.');
  };

  const resetForm = () => {
    setClientSearch('');
    setSelectedClientId('');
    setManualClientPhone('');
    setManualClientAddress('');
    setSections([{ name: 'General', items: [] }]);
    setActiveSectionIndex(0);
    setPaymentMode('UPI');
    setDraftInvoice(null);
  };

  // Add Item row to active section
  const handleAddItemRow = (e) => {
    e.preventDefault();
    if (!itemSearch.trim()) return;

    const { size, sftCol, amount } = calculateRowData();
    const rateNum = Number(particularRate) || 0;

    const newItem = {
      id: Date.now(),
      name: itemSearch.trim(),
      size,
      sft: sftCol,
      unitType,
      rate: unitType === 'lumpsum' ? 0 : rateNum,
      amount
    };

    let updatedSections = [...sections];
    let activeIndex = activeSectionIndex;
    if (updatedSections.length === 0) {
      updatedSections = [{ name: 'General', items: [] }];
      activeIndex = 0;
      setActiveSectionIndex(0);
    }
    if (!updatedSections[activeIndex]) {
      updatedSections[activeIndex] = { name: 'General', items: [] };
    }
    updatedSections[activeIndex].items.push(newItem);
    setSections(updatedSections);

    // Reset item inputs
    setItemSearch('');
    setSelectedItemId('');
    setParticularRate('');
    setItemLength('');
    setItemWidth('');
    setRawQtyVal('');
    setCustomSizeText('');
  };

  // Remove individual item row
  const handleRemoveItemRow = (sectionIndex, itemId) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].items = updatedSections[sectionIndex].items.filter(item => item.id !== itemId);
    setSections(updatedSections);
  };

  const handleEditItemRow = (sectionIndex, itemId) => {
    const section = sections[sectionIndex];
    const item = section.items.find(i => i.id === itemId);
    if (!item) return;

    setActiveSectionIndex(sectionIndex);
    setItemSearch(item.name);
    setUnitType(item.unitType || 'lumpsum');
    
    if (item.unitType === 'lumpsum' || !item.unitType) {
      setParticularRate(item.amount);
      setItemLength('');
      setItemWidth('');
      setRawQtyVal('');
    } else {
      setParticularRate(item.rate);
      setRawQtyVal(item.sft || item.size);
    }
    
    // Remove it so user can save it again without duplicating
    handleRemoveItemRow(sectionIndex, itemId);
    
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Total invoice amount sum
  const grandTotal = sections.reduce((sum, sec) => {
    const sectionSum = sec.items.reduce((s, item) => s + item.amount, 0);
    return sum + sectionSum;
  }, 0);

  // Save invoice to ledger
  const handleSaveInvoice = () => {
    const totalItemsCount = sections.reduce((c, s) => c + s.items.length, 0);
    if (totalItemsCount === 0) {
      alert('Please add at least one item to save the invoice.');
      return;
    }

    createInvoice({
      invoiceNo: billNo,
      billType,
      clientId: selectedClientId || null,
      clientName: clientSearch.trim() || 'Bhavesh Bhai',
      clientPhone: manualClientPhone || '94270549218',
      clientAddress: manualClientAddress || 'Vadodara',
      date: invoiceDate,
      paymentMode,
      sections,
      totalAmount: grandTotal
    });

    // Reset workspace states
    setSections([
      { name: 'Kitchen', items: [] },
      { name: 'Living Room', items: [] }
    ]);
    setClientSearch('');
    setSelectedClientId('');
    setManualClientPhone('');
    setManualClientAddress('');
    setActiveSectionIndex(0);
    
    alert(`Invoice ${billNo} saved successfully!`);
    setBillNo(getNextInvoiceNo(billType));
  };

  // Export high resolution vector A4 PDF using downloadPDF utility
  const handleDownloadPDF = async () => {
    const totalItemsCount = sections.reduce((c, s) => c + s.items.length, 0);
    if (totalItemsCount === 0) {
      alert('Please add at least one item to generate and download the PDF.');
      return;
    }

    const clientNameFile = (clientSearch.trim() || 'Client').replace(/\s+/g, '_');
    const filename = `${clientNameFile}_${billNo}.pdf`;
    await downloadPDF('invoice-pdf-capture', filename);
  };

  // Render method for the A4 invoice sheet
  const renderInvoiceA4Sheet = (captureId, isPreview) => {
    const allRows = [];
    sections.forEach((sec) => {
      if (sec.items.length === 0) return;
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
                        <img src="/mukeshlogo.jpg" alt="J.J. Interiors Logo" className="h-[80px] w-auto object-contain rounded-md bg-white" />
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
                          FURNITURE MAKERS
                        </div>
                        <div className="text-[8px] text-slate-800 font-bold mt-1.5 uppercase select-none tracking-widest text-center">
                          {operatorSettings?.address || '148, RANDALDHAM SOCIETY, CHANAKYAPURI, NEW SAMA ROAD, VADODARA - 390008'}
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
                          {clientSearch.trim()}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16 flex-shrink-0">Address:</span>
                        <div className="flex-1 text-slate-800 border-b border-slate-300 pb-[2px] pl-1 min-h-[14px] text-left uppercase">
                          {manualClientAddress || 'VADODARA'}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16 flex-shrink-0">Phone:</span>
                        <div className="flex-1 text-slate-800 border-b border-slate-300 pb-[2px] pl-1 min-h-[14px] text-left">
                          {manualClientPhone || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4 space-y-0.5 pl-3 border-l border-slate-300">
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16">Bill No. :</span>
                        <span className="font-extrabold text-slate-900 border-b border-slate-300 pb-[2px] min-w-[70px] text-left pl-2 font-mono">
                          {billNo}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16">Date :</span>
                        <span className="text-slate-800 border-b border-slate-300 pb-[2px] min-w-[70px] text-left pl-2">
                          {invoiceDate.split('-').reverse().join('/')}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-bold text-slate-700 w-16">Payment :</span>
                        <span className={`border-b border-slate-300 pb-[2px] min-w-[70px] text-left pl-2 font-bold ${paymentMode === 'Pending' ? 'text-rose-600' : 'text-slate-800'}`}>
                          {paymentMode === 'None' ? '' : paymentMode}
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
                    <span className="font-extrabold text-slate-900 text-base">₹{grandTotal.toLocaleString('en-IN')}.00</span>
                  </div>

                  {/* Print signature footer details matching user reference image */}
                  <div className="w-full border border-slate-900 p-2 flex justify-between items-end text-[9px] select-none bg-white">
                    <div className="space-y-0.5">
                      <div className="text-slate-800 font-bold">
                        Subject to {operatorSettings?.jurisdiction || 'Vadodara'} Jurisdiction.
                      </div>
                      {billType === 'Pakka' && (
                        <div className="font-extrabold text-slate-900">
                          PAN CARD No. {operatorSettings?.panCard || 'CMYPS4786H'}
                        </div>
                      )}
                      {billType === 'Kachcha' && (
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
                        For {operatorSettings?.name || 'Gopalram P. Suthar'}
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
          Billing Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Design high-resolution vector A4 invoices. Create room groupings with custom measurements, and choose between Estimates (Kachcha) and formal Tax bills.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Inputs & Controls (6 Columns) */}
        <div className="xl:col-span-6 space-y-6">
          
          {/* Card 1: Bill Type Toggle & Client details */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display flex items-center gap-1.5">
                  <User className="h-4.5 w-4.5 text-brand-accent-dark" /> Booking & Bill Type
                </h3>
                <p className="text-[10px] text-slate-400">Choose Quotation (Estimate) or Invoice (Tax Bill)</p>
              </div>

              {/* Quotation vs Invoice toggle buttons */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit border border-slate-200/30">
                <button
                  type="button"
                  onClick={() => setBillType('Kachcha')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-premium cursor-pointer ${
                    billType === 'Kachcha'
                      ? 'bg-white dark:bg-slate-700 text-brand-accent-dark dark:text-brand-accent shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Quotation (Estimate)
                </button>
                <button
                  type="button"
                  onClick={() => setBillType('Pakka')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-premium cursor-pointer ${
                    billType === 'Pakka'
                      ? 'bg-white dark:bg-slate-700 text-brand-accent-dark dark:text-brand-accent shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Invoice (Tax Bill)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Autocomplete */}
              <div className="relative" ref={clientRef}>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Client Name * (Search or Type Custom)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Search client or type manual..."
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setSelectedClientId('');
                      setIsClientDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (filteredClients.length > 0) {
                          e.preventDefault();
                          handleSelectClient(filteredClients[0]);
                        }
                      }
                    }}
                    onFocus={() => setIsClientDropdownOpen(true)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium font-medium"
                  />
                </div>

                {isClientDropdownOpen && clientSearch && filteredClients.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredClients.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectClient(c)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-beige/50 dark:hover:bg-slate-700 transition-premium flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{c.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>{c.city}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                            <span>{c.phone}</span>
                          </div>
                        </div>
                        <Check className="h-3.5 w-3.5 text-brand-accent opacity-0 hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Phone Number */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 9427054921"
                    value={manualClientPhone}
                    onChange={(e) => setManualClientPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Address */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Client Address / Project Site
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Gokulesh Greens Atladara"
                    value={manualClientAddress}
                    onChange={(e) => setManualClientAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              </div>

              {/* Invoice Date */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Invoice Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Payment Details / Mode
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['UPI', 'Cash', 'Bank', 'Cheque', 'Pending', 'None'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 text-[10px] font-bold rounded-xl border transition-premium cursor-pointer ${
                      paymentMode === mode
                        ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Rooms & Sections management */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FolderPlus className="h-4.5 w-4.5 text-brand-accent-dark" /> Room Groupings / Sections
            </h3>

            <div className="flex flex-wrap gap-2">
              {sections.map((sec, idx) => (
                <div
                  key={sec.name}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-premium ${
                    activeSectionIndex === idx
                      ? 'bg-brand-beige dark:bg-slate-850 border-brand-accent dark:border-slate-700 text-brand-accent-dark dark:text-brand-accent shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex(idx)}
                    className="cursor-pointer"
                  >
                    {sec.name} ({sec.items.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-slate-400 hover:text-brand-red ml-1 transition-premium"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSection} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new room (e.g. Master Bedroom)..."
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-brand-accent transition-premium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-650 text-white rounded-xl text-xs font-bold transition-premium cursor-pointer"
              >
                Add Room
              </button>
            </form>
          </div>

          {/* Card 3: Add Item Row Form */}
          <form onSubmit={handleAddItemRow} className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <PlusCircle className="h-4.5 w-4.5 text-brand-accent-dark" /> Add Particular to "{sections[activeSectionIndex]?.name}"
            </h3>

            {/* Item Search / Autocomplete */}
            <div className="relative" ref={itemRef}>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Particular Name (Search Master or Type Custom)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Type woodwork item description..."
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value);
                    setSelectedItemId('');
                    setIsItemDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (filteredItems.length > 0) {
                        e.preventDefault();
                        handleSelectItem(filteredItems[0]);
                      }
                    }
                  }}
                  onFocus={() => setIsItemDropdownOpen(true)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium font-medium"
                />
              </div>

              {isItemDropdownOpen && itemSearch && filteredItems.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-beige/50 dark:hover:bg-slate-700 transition-premium flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                        {item.type && (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shadow-sm ${item.type === 'With Material' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-500">₹{item.rate}/sft</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Unit / Billing Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Measurement & Billing Unit Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'sft', label: 'Size (S.F.T.)' },
                  { id: 'rf', label: 'R.F. (Run Feet)' },
                  { id: 'nos', label: 'Numbers (Qty)' },
                  { id: 'lumpsum', label: 'Lumpsum Fixed' }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setUnitType(u.id);
                      setItemLength('');
                      setItemWidth('');
                      setRawQtyVal('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-premium cursor-pointer ${
                      unitType === u.id
                        ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic input fields based on Unit Type */}
            <div className="grid grid-cols-3 gap-3">
              {unitType === 'sft' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Length (Ft)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 10"
                      value={itemLength}
                      onChange={(e) => setItemLength(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Width (Ft)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 2.5"
                      value={itemWidth}
                      onChange={(e) => setItemWidth(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1" title="Optional custom text override">
                      Or Manual SFT
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 25"
                      disabled={!!(itemLength || itemWidth)}
                      value={rawQtyVal}
                      onChange={(e) => setRawQtyVal(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400"
                    />
                  </div>
                </>
              )}

              {unitType === 'rf' && (
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Quantity (Running Feet)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 9"
                    value={rawQtyVal}
                    onChange={(e) => setRawQtyVal(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              )}

              {unitType === 'nos' && (
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Quantity (Number of Items)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 2"
                    value={rawQtyVal}
                    onChange={(e) => setRawQtyVal(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              )}

              {unitType === 'lumpsum' && (
                <div className="col-span-3">
                  <span className="text-xs text-slate-400 italic block py-2 select-none">
                    Lumpsum unit does not require sizes or quantity. Rate represents the final total row price.
                  </span>
                </div>
              )}
            </div>

            {/* Rate Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  {unitType === 'lumpsum' ? 'Lumpsum Amount (₹)' : 'Unit Rate (₹)'} *
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  placeholder="Rate"
                  value={particularRate}
                  onChange={(e) => setParticularRate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium font-semibold"
                />
              </div>

              {unitType === 'sft' && rawQtyVal && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Custom Size Text (e.g. 6 x 7)</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 x 7"
                    value={customSizeText}
                    onChange={(e) => setCustomSizeText(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-premium"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Preview Size:</span>{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">{previewSize}</span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-slate-400 font-medium">Qty:</span>{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">{previewSft || '-'}</span>
              </div>
              <span className="font-extrabold text-brand-accent-dark text-sm">
                ₹{previewAmount.toLocaleString('en-IN')}/-
              </span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-premium cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Row to Section
            </button>
          </form>

          {/* Section 4: Current items list grouped by rooms */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display border-b border-slate-100 dark:border-slate-800 pb-2">
              Invoice Workspace Items
            </h3>

            {sections.reduce((c, s) => c + s.items.length, 0) === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No items added to invoice draft.</p>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {sections.map((sec, secIdx) => {
                  if (sec.items.length === 0) return null;
                  return (
                    <div key={sec.name} className="space-y-2">
                      <div className="text-xs font-extrabold text-brand-red flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-100/30">
                        <span>{sec.name}</span>
                        <span>₹{sec.items.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN')}/-</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        {sec.items.map((item, itemIdx) => (
                          <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100/50 rounded-lg border border-slate-200/40 text-xs transition-premium">
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-300">
                                {itemIdx + 1}. {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {item.size && `Size: ${item.size} | `}
                                {item.sft && `Qty: ${item.sft} | `}
                                {item.rate > 0 ? `@ ₹${item.rate}/unit` : 'Lumpsum'}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-700 dark:text-slate-300">₹{item.amount.toLocaleString('en-IN')}</span>
                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => handleEditItemRow(secIdx, item.id)}
                                  className="text-slate-400 hover:text-brand-accent p-1 hover:bg-white rounded transition-premium"
                                  title="Edit Item"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemRow(secIdx, item.id)}
                                  className="text-slate-400 hover:text-brand-red p-1 hover:bg-white rounded transition-premium"
                                  title="Delete Item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {sections.reduce((c, s) => c + s.items.length, 0) > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500 font-display">Grand Total:</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200 flex items-center">
                    <IndianRupee className="h-4.5 w-4.5" />
                    {grandTotal.toLocaleString('en-IN')}/-
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-accent hover:bg-brand-accent-dark text-white rounded-xl text-xs font-bold transition-premium shadow-md shadow-amber-950/10 cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button
                    onClick={handleSaveAsDraft}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-beige hover:bg-brand-beige/80 text-brand-accent-dark dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-brand-accent rounded-xl text-xs font-bold transition-premium border border-brand-accent/20 cursor-pointer"
                  >
                    <Save className="h-4 w-4" /> Save as Draft
                  </button>
                  <button
                    onClick={handleSaveInvoice}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-premium shadow-md shadow-slate-950/10 cursor-pointer"
                  >
                    <Save className="h-4 w-4" /> Update Ledger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Exact A4 physical Layout PDF Live Preview (6 Columns) */}
        <div className="xl:col-span-6 sticky top-6 self-start bg-slate-200/50 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-300/30 flex justify-center overflow-auto min-h-[600px] max-h-[calc(100vh-80px)] scrollbar-thin">
          <div className="origin-top scale-[0.62] xl:scale-[0.64] 2xl:scale-[0.8] my-2 transition-premium bg-white">
            {/* A4 Physical Page Live Preview */}
            {renderInvoiceA4Sheet('invoice-pdf-preview', true)}
          </div>
        </div>

      </div>

      {/* Hidden container for PDF export - visibility:hidden so it renders in DOM but not visible */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', width: '794px', visibility: 'hidden', zIndex: -1, pointerEvents: 'none', backgroundColor: '#ffffff' }}>
        {renderInvoiceA4Sheet('invoice-pdf-capture', false)}
      </div>
    </div>
  );
};




