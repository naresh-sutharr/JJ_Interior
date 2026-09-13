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
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_panel/projects")({
  component: ProjectsList,
});

function ProjectsList() {
  const [search, setSearch] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          clients (name, company)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage ongoing and completed interior projects.</p>
        </div>
        <Button asChild>
          <Link to="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or clients..."
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
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : filteredProjects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Link to={`/admin/clients/${project.client_id}`} className="hover:underline">
                      {project.clients?.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.location || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{(project.budget || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/projects/${project.id}`}>View</Link>
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


