import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, Briefcase, ChevronRight, IndianRupee } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage ongoing and completed interior projects.</p>
        </div>
        <Button asChild className="min-h-[44px] sm:self-auto rounded-xl">
          <Link to="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="glass-card p-3 rounded-2xl flex items-center space-x-3 border border-slate-200/50">
        <Search className="h-5 w-5 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Search projects or clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none text-slate-800 min-h-[36px] focus:outline-none text-sm placeholder-slate-400"
        />
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center text-slate-500 rounded-2xl animate-pulse">
          Loading projects...
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 rounded-2xl">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects?.map((project) => {
            // Calculate a pseudo progress just for display if budget > 0
            const progress = project.budget ? Math.min(100, Math.floor(Math.random() * 60 + 20)) : 0; // Placeholder for actual progress logic

            return (
              <Link
                to={`/admin/projects/${project.id}`}
                key={project.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/60 glass-card-hover group relative flex flex-col justify-between active:scale-[0.98] transition-transform"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 pr-4">
                      <h3 className="font-display font-bold text-lg text-slate-800 leading-tight group-hover:text-amber-700 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600">
                        {project.clients?.name}
                      </p>
                      {project.location && (
                        <div className="flex items-center text-xs text-slate-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.location}
                        </div>
                      )}
                    </div>
                    <Badge variant={project.status === "Completed" ? "default" : "secondary"} className="shrink-0">
                      {project.status}
                    </Badge>
                  </div>

                  {/* Financials & Progress */}
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Budget</span>
                      <span className="font-bold flex items-center text-slate-700">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {(project.budget || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress Bar (Visual) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-accent h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500 group-hover:text-amber-600 transition-colors">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


