import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Building2, Phone, Mail, FileText, Receipt } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/_panel/clients/$clientId")({
  component: ClientDetails,
});

function ClientDetails() {
  const { clientId } = useParams({ strict: false });

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select(`
          *,
          projects (*),
          invoices (*)
        `)
        .eq("id", clientId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!client) return <div>Client not found.</div>;

  const totalInvoiced = client.invoices?.reduce((acc, inv) => acc + (inv.grand_total || 0), 0) || 0;
  const totalPaid = client.invoices?.reduce((acc, inv) => acc + (inv.amount_paid || 0), 0) || 0;
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{client.name}</h1>
          <p className="text-sm text-muted-foreground">{client.company || "Individual Client"}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {client.phone || "-"}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {client.email || "-"}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium text-xs text-muted-foreground uppercase">Billing Address</span>
                <span>{client.billing_address || "-"}</span>
              </div>
            </div>
            {client.gstin && (
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground uppercase mr-2">GSTIN</span>
                {client.gstin}
              </div>
            )}
            {client.pan && (
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground uppercase mr-2">PAN</span>
                {client.pan}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Total Invoiced</span>
              <span className="font-medium">₹{totalInvoiced.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Total Paid</span>
              <span className="font-medium text-green-600">₹{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span>Outstanding</span>
              <span className="text-amber-600">₹{outstanding.toLocaleString()}</span>
            </div>
            <div className="pt-4 flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/admin/projects/new" search={{ clientId: client.id }}>
                  <Building2 className="mr-2 h-4 w-4" /> New Project
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/admin/invoices/new" search={{ clientId: client.id }}>
                  <Receipt className="mr-2 h-4 w-4" /> New Invoice
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Projects
        </h3>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.projects?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No projects found.</TableCell>
                </TableRow>
              ) : (
                client.projects?.map((proj) => (
                  <TableRow key={proj.id}>
                    <TableCell className="font-medium">{proj.name}</TableCell>
                    <TableCell>{proj.status}</TableCell>
                    <TableCell>₹{(proj.budget || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/projects/${proj.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Receipt className="h-5 w-5" /> Invoices
        </h3>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.invoices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No invoices found.</TableCell>
                </TableRow>
              ) : (
                client.invoices?.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell>{new Date(inv.invoice_date).toLocaleDateString()}</TableCell>
                    <TableCell>₹{(inv.grand_total || 0).toLocaleString()}</TableCell>
                    <TableCell>{inv.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/invoices/${inv.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}


