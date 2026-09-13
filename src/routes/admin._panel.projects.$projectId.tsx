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
import { ArrowLeft, MapPin, Calendar, Clock, Receipt, IndianRupee, PieChart, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_panel/projects/$projectId")({
  component: ProjectDetails,
});

function ProjectDetails() {
  const { projectId } = useParams({ strict: false });

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          clients (name, company),
          invoices (*),
          quotations (*),
          expenses (*)
        `)
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  const totalInvoiced = project.invoices?.reduce((acc, inv) => acc + (inv.grand_total || 0), 0) || 0;
  const totalReceived = project.invoices?.reduce((acc, inv) => acc + (inv.amount_paid || 0), 0) || 0;
  const outstanding = totalInvoiced - totalReceived;
  const totalExpenses = project.expenses?.reduce((acc, exp) => acc + (exp.amount || 0), 0) || 0;
  const estimatedProfit = totalReceived - totalExpenses; // Just a simple calculation

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            Client: <Link to={`/admin/clients/${project.client_id}`} className="hover:underline text-champagne">{project.clients?.name}</Link>
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="text-sm">{project.status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(project.budget || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billed</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-champagne">₹{totalInvoiced.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">₹{totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Profit (Cash)</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{estimatedProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {project.location || "No location set"}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              End: {project.expected_completion ? new Date(project.expected_completion).toLocaleDateString() : "Not set"}
            </div>
            {project.notes && (
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                <span className="font-medium text-foreground block mb-1">Notes:</span>
                {project.notes}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5" /> Invoices
              </h3>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/invoices/new" search={{ projectId: project.id, clientId: project.client_id }}>
                  New Invoice
                </Link>
              </Button>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.invoices?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No invoices generated.</TableCell>
                    </TableRow>
                  ) : (
                    project.invoices?.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <Link to={`/admin/invoices/${inv.id}`} className="hover:underline font-medium">
                            {inv.number}
                          </Link>
                        </TableCell>
                        <TableCell>{new Date(inv.invoice_date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{(inv.grand_total || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={inv.status === "PAID" ? "default" : "secondary"}>{inv.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TrendingDown className="h-5 w-5" /> Expenses
              </h3>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/expenses/new" search={{ projectId: project.id }}>
                  Log Expense
                </Link>
              </Button>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor/Desc</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.expenses?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No expenses logged.</TableCell>
                    </TableRow>
                  ) : (
                    project.expenses?.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell>{new Date(exp.expense_date).toLocaleDateString()}</TableCell>
                        <TableCell>{exp.category}</TableCell>
                        <TableCell>{exp.vendor || exp.description}</TableCell>
                        <TableCell className="text-right">₹{(exp.amount || 0).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


