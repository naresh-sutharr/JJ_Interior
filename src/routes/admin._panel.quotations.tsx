import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_panel/quotations")({
  component: QuotationsList,
});

function QuotationsList() {
  const [search, setSearch] = useState("");

  const { data: quotations, isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          *,
          clients (name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredQuotations = quotations?.filter((q) =>
    q.number?.toLowerCase().includes(search.toLowerCase()) ||
    q.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Quotations</h1>
          <p className="text-sm text-muted-foreground">Manage project estimates and proposals.</p>
        </div>
        <Button asChild>
          <Link to="/admin/quotations/new">
            <Plus className="mr-2 h-4 w-4" /> Create Quotation
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quote # or client..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quotation #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Loading quotations...</TableCell>
              </TableRow>
            ) : filteredQuotations?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No quotations found.</TableCell>
              </TableRow>
            ) : (
              filteredQuotations?.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.number}</TableCell>
                  <TableCell>{new Date(q.quote_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {q.client_id ? (
                      <Link to={`/admin/clients/${q.client_id}`} className="hover:underline">
                        {q.clients?.name}
                      </Link>
                    ) : "-"}
                  </TableCell>
                  <TableCell>₹{(q.grand_total || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={q.status === "Accepted" ? "default" : q.status === "Rejected" ? "destructive" : "secondary"}>
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/quotations/${q.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


