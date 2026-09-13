import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_panel/documents")({
  component: DocumentsList,
});

function DocumentsList() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          projects (name),
          clients (name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground">Manage project files, drawings, and contracts.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Related To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Loading documents...</TableCell>
              </TableRow>
            ) : documents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              documents?.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {doc.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.category || "General"}</Badge>
                  </TableCell>
                  <TableCell>
                    {doc.projects?.name || doc.clients?.name || "-"}
                  </TableCell>
                  <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </a>
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


