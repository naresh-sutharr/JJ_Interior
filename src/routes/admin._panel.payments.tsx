import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_panel/payments")({
  component: PaymentsList,
});

const paymentSchema = z.object({
  invoice_id: z.string().min(1, "Invoice is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  method: z.string().min(1, "Method is required"),
  payment_date: z.string().min(1, "Date is required"),
  transaction_id: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

function PaymentsList() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          invoices (number),
          clients (name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: pendingInvoices } = useQuery({
    queryKey: ["pending_invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("id, number, grand_total, amount_paid, clients(name)")
        .in("status", ["PENDING", "PARTIALLY PAID"]);
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoice_id: "",
      amount: 0,
      method: "Bank Transfer",
      payment_date: new Date().toISOString().split("T")[0],
      transaction_id: "",
      notes: "",
    },
  });

  const { mutate: recordPayment, isPending } = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      const selectedInvoice = pendingInvoices?.find(i => i.id === values.invoice_id);
      if (!selectedInvoice) throw new Error("Invalid invoice");

      // Insert payment (trigger on backend updates invoice balance & status automatically)
      const { data, error } = await supabase
        .from("payments")
        .insert({
          invoice_id: values.invoice_id,
          client_id: selectedInvoice.clients?.[0]?.id || selectedInvoice.client_id, // depends on type
          amount: values.amount,
          method: values.method,
          payment_date: values.payment_date,
          transaction_id: values.transaction_id || null,
          notes: values.notes || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["pending_invoices"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const filteredPayments = payments?.filter((payment) =>
    payment.invoices?.number?.toLowerCase().includes(search.toLowerCase()) ||
    payment.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Record and track client payments.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => recordPayment(v))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoice_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice *</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        const inv = pendingInvoices?.find(i => i.id === val);
                        if (inv) {
                          form.setValue("amount", (inv.grand_total || 0) - (inv.amount_paid || 0));
                        }
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select pending invoice" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pendingInvoices?.map(inv => {
                            const bal = (inv.grand_total || 0) - (inv.amount_paid || 0);
                            return (
                              <SelectItem key={inv.id} value={inv.id}>
                                {inv.number} - {inv.clients?.name} (Bal: ₹{bal})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹) *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payment_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transaction_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID / UTR</FormLabel>
                      <FormControl>
                        <Input placeholder="Ref number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Payment"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice or client..."
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
              <TableHead>Date</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Loading payments...</TableCell>
              </TableRow>
            ) : filteredPayments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No payments found.</TableCell>
              </TableRow>
            ) : (
              filteredPayments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{payment.invoices?.number}</TableCell>
                  <TableCell>{payment.clients?.name}</TableCell>
                  <TableCell>
                    {payment.method} 
                    {payment.transaction_id && <span className="text-muted-foreground text-xs block">Ref: {payment.transaction_id}</span>}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


