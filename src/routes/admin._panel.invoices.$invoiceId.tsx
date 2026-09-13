import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_panel/invoices/$invoiceId")({
  component: InvoiceView,
});

function InvoiceView() {
  const { invoiceId } = useParams({ strict: false });

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          clients (*),
          projects (name),
          invoice_items (*)
        `)
        .eq("id", invoiceId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!invoiceId,
  });

  const { data: profile } = useQuery({
    queryKey: ["business_profile"],
    queryFn: async () => {
      const { data } = await supabase.from("business_profile").select("*").maybeSingle();
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found.</div>;

  const handlePrint = () => {
    window.print();
  };

  const balance = (invoice.grand_total || 0) - (invoice.amount_paid || 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Controls - Hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Invoice {invoice.number}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={invoice.status === "PAID" ? "default" : invoice.status === "PENDING" ? "secondary" : "destructive"}>
                {invoice.status}
              </Badge>
              {balance > 0 && <span className="text-sm text-muted-foreground">Balance: ₹{balance.toLocaleString()}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print / PDF
          </Button>
          {balance > 0 && (
            <Button asChild>
              <Link to="/admin/payments" search={{ invoiceId: invoice.id }}>Record Payment</Link>
            </Button>
          )}
        </div>
      </div>

      {/* A4 Printable Area */}
      <div className="bg-white text-black p-8 md:p-12 shadow-sm border rounded-lg min-h-[1056px] print:shadow-none print:border-none print:p-0 print:m-0 print:bg-white print:text-black">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 tracking-tight uppercase">
              {profile?.business_name || "TULSI INTERIOR"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">{profile?.tagline || "Interior Design Studio"}</p>
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              {profile?.address && <p className="max-w-[250px] whitespace-pre-wrap">{profile.address}</p>}
              {profile?.phone && <p>Phone: {profile.phone}</p>}
              {profile?.email && <p>Email: {profile.email}</p>}
              {profile?.gstin && <p className="mt-2 font-semibold">GSTIN: {profile.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-light text-gray-300 uppercase tracking-widest">Tax Invoice</h1>
            <div className="mt-6 space-y-1 text-sm">
              <p><span className="font-semibold text-gray-700">Invoice No:</span> {invoice.number}</p>
              <p><span className="font-semibold text-gray-700">Date:</span> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
              {invoice.due_date && <p><span className="font-semibold text-gray-700">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex justify-between items-start py-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
            <h3 className="text-lg font-bold text-gray-900">{invoice.clients?.name}</h3>
            {invoice.clients?.company && <p className="text-gray-700">{invoice.clients.company}</p>}
            <div className="mt-2 text-sm text-gray-600 space-y-1 max-w-[250px]">
              {invoice.clients?.billing_address && <p className="whitespace-pre-wrap">{invoice.clients.billing_address}</p>}
              {invoice.clients?.phone && <p>Phone: {invoice.clients.phone}</p>}
              {invoice.clients?.email && <p>{invoice.clients.email}</p>}
              {invoice.clients?.gstin && <p className="mt-2 font-semibold text-gray-800">GSTIN: {invoice.clients.gstin}</p>}
            </div>
          </div>
          {invoice.projects && (
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project</p>
              <h3 className="text-md font-medium text-gray-800">{invoice.projects.name}</h3>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="mt-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900">
                <th className="py-3 px-2 font-semibold">No.</th>
                <th className="py-3 px-2 font-semibold">Description</th>
                <th className="py-3 px-2 font-semibold text-center">Qty</th>
                <th className="py-3 px-2 font-semibold text-right">Rate</th>
                <th className="py-3 px-2 font-semibold text-right">Taxable</th>
                <th className="py-3 px-2 font-semibold text-right">GST %</th>
                <th className="py-3 px-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.invoice_items?.sort((a, b) => (a.position || 0) - (b.position || 0)).map((item, index) => (
                <tr key={item.id} className="text-gray-700">
                  <td className="py-3 px-2 align-top">{index + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    {item.room && <p className="text-xs text-gray-500 mt-1">Room: {item.room}</p>}
                  </td>
                  <td className="py-3 px-2 text-center align-top">{item.quantity}</td>
                  <td className="py-3 px-2 text-right align-top">₹{(item.rate || 0).toLocaleString()}</td>
                  <td className="py-3 px-2 text-right align-top">₹{(((item.quantity || 0) * (item.rate || 0)) - (item.discount || 0)).toLocaleString()}</td>
                  <td className="py-3 px-2 text-right align-top">{item.gst_percent}%</td>
                  <td className="py-3 px-2 text-right align-top font-medium text-gray-900">₹{(item.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-1/2 md:w-1/3">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between pb-2 border-b">
                <span>Taxable Amount</span>
                <span className="font-medium text-gray-900">₹{(invoice.taxable_total || 0).toLocaleString()}</span>
              </div>
              
              {invoice.is_igst ? (
                <div className="flex justify-between pb-2 border-b">
                  <span>IGST</span>
                  <span className="font-medium text-gray-900">₹{(invoice.igst || 0).toLocaleString()}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between pb-2 border-b">
                    <span>CGST</span>
                    <span className="font-medium text-gray-900">₹{(invoice.cgst || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>SGST</span>
                    <span className="font-medium text-gray-900">₹{(invoice.sgst || 0).toLocaleString()}</span>
                  </div>
                </>
              )}
              
              {invoice.round_off !== 0 && (
                <div className="flex justify-between pb-2 border-b">
                  <span>Round Off</span>
                  <span className="font-medium text-gray-900">₹{invoice.round_off}</span>
                </div>
              )}
              
              <div className="flex justify-between pt-2 text-lg font-bold text-gray-900">
                <span>Grand Total</span>
                <span>₹{(invoice.grand_total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Bank & Terms) */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Bank Details</h4>
            <div className="text-gray-600 space-y-1">
              {profile?.bank_name ? (
                <>
                  <p>Bank: {profile.bank_name}</p>
                  <p>Account No: {profile.account_number}</p>
                  <p>IFSC: {profile.ifsc}</p>
                  {profile.upi_id && <p className="mt-2 font-medium">UPI: {profile.upi_id}</p>}
                </>
              ) : (
                <p>Bank details not configured.</p>
              )}
            </div>
          </div>
          <div>
            {invoice.terms && (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{invoice.terms}</p>
              </>
            )}
            {invoice.notes && (
              <>
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">Notes</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </>
            )}
          </div>
        </div>

        {/* Authorized Signatory */}
        <div className="mt-24 text-right pr-8">
          <div className="inline-block border-t border-gray-800 pt-2 w-48 text-center text-sm font-semibold text-gray-900">
            Authorized Signatory
          </div>
        </div>

      </div>
    </div>
  );
}


