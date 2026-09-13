import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/biz";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-[10px] uppercase tracking-[.25em] text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-2 display-serif text-3xl md:text-4xl">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors",
        accent && "border-champagne/60",
      )}
    >
      <p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-medium tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const statusTone: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Partially Paid": "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Sent: "bg-amber-50 text-amber-700 border-amber-200",
  Overdue: "bg-red-50 text-red-700 border-red-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Expired: "bg-red-50 text-red-700 border-red-200",
  "On Hold": "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status?: string | null }) {
  const value = status ?? "—";
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[.08em]",
        statusTone[value] ?? "border-border bg-secondary text-secondary-foreground",
      )}
    >
      {value}
    </span>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full md:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}

export function Money({ value, className }: { value: number | null | undefined; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{inr(value)}</span>;
}

export function Panel({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-md border border-border bg-card", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          {title && <h2 className="text-sm font-medium uppercase tracking-[.14em]">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{message}</p>;
}
