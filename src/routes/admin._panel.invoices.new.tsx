import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/_panel/invoices/new")({
  component: NewInvoice,
});

const lineItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  room: z.string().optional(),
  quantity: z.coerce.number().min(0.01),
  rate: z.coerce.number().min(0),
  discount: z.coerce.number().default(0),
  gst_percent: z.coerce.number().default(18),
});

const invoiceSchema = z.object({
  client_id: z.string().min(1, "Client required"),
  project_id: z.string().optional(),
  number: z.string().min(1, "Invoice number required"),
  invoice_date: z.string().min(1, "Date required"),
  due_date: z.string().optional(),
  is_igst: z.boolean().default(false),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(lineItemSchema).min(1, "At least one item required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

function NewInvoice() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const searchParams = Route.useSearch<{ clientId?: string; projectId?: string }>();

  // Fetch metadata
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name, company");
      return data || [];
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("id, name, client_id");
      return data || [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["business_profile"],
    queryFn: async () => {
      const { data } = await supabase.from("business_profile").select("*").single();
      return data;
    },
  });

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_id: searchParams.clientId || "",
      project_id: searchParams.projectId || "",
      number: "",
      invoice_date: new Date().toISOString().split("T")[0],
      due_date: "",
      is_igst: false,
      notes: "",
      terms: "",
      items: [{ description: "", room: "", quantity: 1, rate: 0, discount: 0, gst_percent: 18 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for dynamic calculation
  const items = form.watch("items");
  const is_igst = form.watch("is_igst");

  // Auto-generate invoice number based on profile
  useEffect(() => {
    if (profile && !form.getValues("number")) {
      form.setValue("number", `${profile.invoice_prefix}-${String(profile.starting_number).padStart(3, "0")}`);
      form.setValue("terms", profile.terms || "");
    }
  }, [profile, form]);

  const { mutate: createInvoice, isPending } = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      // 1. Calculate totals
      let taxable_total = 0;
      let discount_total = 0;
      let tax_total = 0;
      
      const processedItems = values.items.map(item => {
        const itemAmount = item.quantity * item.rate;
        const itemDiscount = item.discount || 0;
        const itemTaxable = itemAmount - itemDiscount;
        const itemTax = (itemTaxable * item.gst_percent) / 100;
        
        taxable_total += itemTaxable;
        discount_total += itemDiscount;
        tax_total += itemTax;
        
        return {
          ...item,
          amount: itemAmount,
        };
      });

      const subtotal = taxable_total + discount_total;
      const exactGrandTotal = taxable_total + tax_total;
      const round_off = Math.round(exactGrandTotal) - exactGrandTotal;
      const grand_total = Math.round(exactGrandTotal);

      let cgst = 0, sgst = 0, igst = 0;
      if (values.is_igst) {
        igst = tax_total;
      } else {
        cgst = tax_total / 2;
        sgst = tax_total / 2;
      }

      // 2. Insert Invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          client_id: values.client_id,
          project_id: values.project_id || null,
          number: values.number,
          invoice_date: values.invoice_date,
          due_date: values.due_date || null,
          is_igst: values.is_igst,
          notes: values.notes || null,
          terms: values.terms || null,
          subtotal,
          discount_total,
          taxable_total,
          cgst,
          sgst,
          igst,
          round_off,
          grand_total,
          status: "PENDING",
          amount_paid: 0,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // 3. Insert Items
      const invoiceItemsToInsert = processedItems.map((item, index) => ({
        invoice_id: invoice.id,
        description: item.description,
        room: item.room || null,
        quantity: item.quantity,
        rate: item.rate,
        discount: item.discount,
        gst_percent: item.gst_percent,
        amount: item.amount,
        position: index,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItemsToInsert);

      if (itemsError) throw itemsError;
      
      // Update starting number if it was used
      if (profile && values.number === `${profile.invoice_prefix}-${String(profile.starting_number).padStart(3, "0")}`) {
        await supabase.from("business_profile").update({ starting_number: profile.starting_number + 1 }).eq("id", profile.id);
      }

      return invoice;
    },
    onSuccess: (data) => {
      toast.success("Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      navigate({ to: `/admin/invoices/${data.id}` });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  function onSubmit(values: InvoiceFormValues) {
    createInvoice(values);
  }

  // Calculate live totals for preview
  const liveTaxable = items.reduce((acc, i) => acc + ((i.quantity || 0) * (i.rate || 0)) - (i.discount || 0), 0);
  const liveTax = items.reduce((acc, i) => {
    const amt = ((i.quantity || 0) * (i.rate || 0)) - (i.discount || 0);
    return acc + (amt * (i.gst_percent || 0)) / 100;
  }, 0);
  const liveGrandTotal = Math.round(liveTaxable + liveTax);

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create Invoice</h1>
        <p className="text-sm text-muted-foreground">Generate a professional GST compliant invoice.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Header Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
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
              name="project_id"
              render={({ field }) => {
                const clientId = form.watch("client_id");
                const filteredProjects = projects?.filter(p => p.client_id === clientId);
                return (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined} disabled={!clientId}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredProjects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice # *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-2 pt-8">
              <FormField
                control={form.control}
                name="is_igst"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Out of State (IGST)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Itemized Bill</h3>
            <div className="rounded-md border">
              <div className="grid grid-cols-[1fr_120px_100px_120px_100px_100px_100px_50px] gap-2 p-3 font-medium text-sm text-muted-foreground border-b bg-muted/50">
                <div>Description / Material</div>
                <div>Room</div>
                <div>Qty</div>
                <div>Rate</div>
                <div>Discount</div>
                <div>GST %</div>
                <div className="text-right">Total</div>
                <div></div>
              </div>
              
              <div className="p-3 space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[1fr_120px_100px_120px_100px_100px_100px_50px] gap-2 items-start">
                    <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="Item description" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.room`} render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="e.g. Master Bed" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.rate`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.discount`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.gst_percent`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    
                    <div className="text-right py-2 font-medium">
                      ₹{(((items[index]?.quantity || 0) * (items[index]?.rate || 0)) - (items[index]?.discount || 0)).toLocaleString()}
                    </div>
                    
                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ description: "", room: "", quantity: 1, rate: 0, discount: 0, gst_percent: profile?.default_gst || 18 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Thank you for your business..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Payment terms..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3 rounded-lg border p-6 bg-muted/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxable Value</span>
                <span>₹{liveTaxable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Tax ({is_igst ? 'IGST' : 'CGST + SGST'})</span>
                <span>₹{liveTax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span>₹{liveGrandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/invoices" })}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


