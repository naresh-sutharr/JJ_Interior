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
import { Search, Plus, TrendingDown } from "lucide-react";
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

export const Route = createFileRoute("/admin/_panel/expenses")({
  component: ExpensesList,
});

const expenseSchema = z.object({
  project_id: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  vendor: z.string().optional(),
  description: z.string().optional(),
  expense_date: z.string().min(1, "Date is required"),
  method: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

function ExpensesList() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select(`
          *,
          projects (name)
        `)
        .order("expense_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects-dropdown"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("id, name");
      return data || [];
    },
  });

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      project_id: "",
      category: "",
      amount: 0,
      vendor: "",
      description: "",
      expense_date: new Date().toISOString().split("T")[0],
      method: "Bank Transfer",
    },
  });

  const { mutate: logExpense, isPending } = useMutation({
    mutationFn: async (values: ExpenseFormValues) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          ...values,
          project_id: values.project_id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Expense logged successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const filteredExpenses = expenses?.filter((exp) =>
    exp.category.toLowerCase().includes(search.toLowerCase()) ||
    exp.vendor?.toLowerCase().includes(search.toLowerCase()) ||
    exp.description?.toLowerCase().includes(search.toLowerCase()) ||
    exp.projects?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track project and business expenses.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <TrendingDown className="mr-2 h-4 w-4" /> Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Expense</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => logExpense(v))} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Business / General" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Business / General</SelectItem>
                          {projects?.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Materials">Materials</SelectItem>
                            <SelectItem value="Labour">Labour</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Hardware">Hardware</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Electrician">Electrician</SelectItem>
                            <SelectItem value="Carpenter">Carpenter</SelectItem>
                            <SelectItem value="Civil Work">Civil Work</SelectItem>
                            <SelectItem value="Painting">Painting</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor / Paid To</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Century Ply" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expense_date"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" disabled={isPending}>
                    {isPending ? "Saving..." : "Log Expense"}
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
            placeholder="Search expenses..."
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
              <TableHead>Category</TableHead>
              <TableHead>Vendor/Desc</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Loading expenses...</TableCell>
              </TableRow>
            ) : filteredExpenses?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No expenses found.</TableCell>
              </TableRow>
            ) : (
              filteredExpenses?.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>{new Date(exp.expense_date).toLocaleDateString()}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>
                    <div className="font-medium">{exp.vendor || "-"}</div>
                    <div className="text-xs text-muted-foreground">{exp.description}</div>
                  </TableCell>
                  <TableCell>{exp.projects?.name || <span className="text-muted-foreground">General Business</span>}</TableCell>
                  <TableCell className="text-right text-red-600 font-medium">₹{exp.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


