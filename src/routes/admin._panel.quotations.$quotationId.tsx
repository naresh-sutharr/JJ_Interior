import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_panel/quotations/$quotationId")({
  component: QuotationView,
});

function QuotationView() {
  const { quotationId } = useParams({ strict: false });

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          *,
          clients (*),
          projects (name),
          quotation_items (*)
        `)
        .eq("id", quotationId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!quotationId,
  });

  const { data: profile } = useQuery({
    queryKey: ["business_profile"],
    queryFn: async () => {
      const { data } = await supabase.from("business_profile").select("*").maybeSingle();
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!quotation) return <div>Quotation not found.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Controls - Hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/quotations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Quotation {quotation.number}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={quotation.status === "Accepted" ? "default" : quotation.status === "Rejected" ? "destructive" : "secondary"}>
                {quotation.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print / PDF
          </Button>
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
            <h1 className="text-4xl font-light text-gray-300 uppercase tracking-widest">Quotation</h1>
            <div className="mt-6 space-y-1 text-sm">
              <p><span className="font-semibold text-gray-700">Quote No:</span> {quotation.number}</p>
              <p><span className="font-semibold text-gray-700">Date:</span> {new Date(quotation.quote_date).toLocaleDateString()}</p>
              {quotation.valid_until && <p><span className="font-semibold text-gray-700">Valid Until:</span> {new Date(quotation.valid_until).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex justify-between items-start py-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Proposal For</p>
            <h3 className="text-lg font-bold text-gray-900">{quotation.clients?.name}</h3>
            {quotation.clients?.company && <p className="text-gray-700">{quotation.clients.company}</p>}
            <div className="mt-2 text-sm text-gray-600 space-y-1 max-w-[250px]">
              {quotation.clients?.project_address && <p className="whitespace-pre-wrap">{quotation.clients.project_address}</p>}
              {quotation.clients?.phone && <p>Phone: {quotation.clients.phone}</p>}
              {quotation.clients?.email && <p>{quotation.clients.email}</p>}
            </div>
          </div>
          {quotation.projects && (
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project</p>
              <h3 className="text-md font-medium text-gray-800">{quotation.projects.name}</h3>
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
                <th className="py-3 px-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotation.quotation_items?.sort((a, b) => (a.position || 0) - (b.position || 0)).map((item, index) => (
                <tr key={item.id} className="text-gray-700">
                  <td className="py-3 px-2 align-top">{index + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    {item.room && <p className="text-xs text-gray-500 mt-1">Room: {item.room}</p>}
                  </td>
                  <td className="py-3 px-2 text-center align-top">{item.quantity}</td>
                  <td className="py-3 px-2 text-right align-top">₹{(item.rate || 0).toLocaleString()}</td>
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
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{(quotation.subtotal || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span>Estimated Tax ({(quotation.tax_total || 0) > 0 ? "GST" : "0%"})</span>
                <span className="font-medium text-gray-900">₹{(quotation.tax_total || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between pt-2 text-lg font-bold text-gray-900">
                <span>Total Estimate</span>
                <span>₹{(quotation.grand_total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Terms) */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-sm">
          <div>
            {quotation.terms && (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{quotation.terms}</p>
              </>
            )}
          </div>
          <div>
            {quotation.notes && (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{quotation.notes}</p>
              </>
            )}
          </div>
        </div>

        {/* Authorized Signatory */}
        <div className="mt-24 text-right pr-8">
          <div className="inline-block border-t border-gray-800 pt-2 w-48 text-center text-sm font-semibold text-gray-900">
            Prepared By
          </div>
        </div>

      </div>
    </div>
  );
}


