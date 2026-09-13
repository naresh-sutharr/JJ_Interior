import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const Route = createFileRoute("/admin/_panel/clients/new")({
  component: NewClient,
});

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  billing_address: z.string().optional(),
  project_address: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

function NewClient() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      whatsapp: "",
      email: "",
      billing_address: "",
      project_address: "",
      gstin: "",
      pan: "",
      notes: "",
    },
  });

  const { mutate: createClient, isPending } = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      // transform empty strings to null for email to avoid unique constraint issues if any,
      // though supabase string columns usually accept empty string. 
      const dataToInsert = {
        ...values,
        email: values.email || null,
      };
      const { data, error } = await supabase
        .from("clients")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Client created successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      navigate({ to: `/admin/clients/${data.id}` });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  function onSubmit(values: ClientFormValues) {
    createClient(values);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add New Client</h1>
        <p className="text-sm text-muted-foreground">Enter the client's contact and billing details.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gstin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input placeholder="27XXXXX1234X1ZX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN</FormLabel>
                  <FormControl>
                    <Input placeholder="ABCDE1234F" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-1 md:col-span-2">
              <FormField
                control={form.control}
                name="billing_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full billing address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <FormField
                control={form.control}
                name="project_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Project Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Project site address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any additional notes..." {...field} />
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
              onClick={() => navigate({ to: "/admin/clients" })}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Client"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


