import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/_panel/projects/new")({
  component: NewProject,
});

const projectSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  name: z.string().min(1, "Project Name is required"),
  location: z.string().optional(),
  project_type: z.string().optional(),
  status: z.string().default("Planning"),
  budget: z.coerce.number().min(0).optional(),
  start_date: z.string().optional(),
  expected_completion: z.string().optional(),
  notes: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

function NewProject() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const searchParams = Route.useSearch<{ clientId?: string }>();

  const { data: clients } = useQuery({
    queryKey: ["clients-dropdown"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name, company").order("name");
      return data || [];
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      client_id: searchParams.clientId || "",
      name: "",
      location: "",
      project_type: "",
      status: "Planning",
      budget: 0,
      start_date: "",
      expected_completion: "",
      notes: "",
    },
  });

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      // transform empty strings to null for dates
      const dataToInsert = {
        ...values,
        start_date: values.start_date || null,
        expected_completion: values.expected_completion || null,
      };
      
      const { data, error } = await supabase
        .from("projects")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", data.client_id] });
      navigate({ to: `/admin/projects/${data.id}` });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  function onSubmit(values: ProjectFormValues) {
    createProject(values);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add New Project</h1>
        <p className="text-sm text-muted-foreground">Set up a new interior design or architecture project.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Client *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.company ? `(${client.company})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Aster Residence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Luxury Residence">Luxury Residence</SelectItem>
                      <SelectItem value="Modern Villa">Modern Villa</SelectItem>
                      <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                      <SelectItem value="Turnkey">Turnkey</SelectItem>
                      <SelectItem value="Renovation">Renovation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Material Procurement">Material Procurement</SelectItem>
                      <SelectItem value="Installation">Installation</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Budget (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Location / City</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expected_completion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Completion</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any specific requirements..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/projects" })}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


