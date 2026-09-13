export type LineLike = {
  quantity: number;
  rate: number;
  discount: number;
  gst_percent: number;
};

export const inr = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export const num = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const fmtDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export const today = () => new Date().toISOString().slice(0, 10);

export function lineTaxable(line: LineLike) {
  const gross = num(line.quantity) * num(line.rate);
  return Math.max(gross - num(line.discount), 0);
}

export function lineGst(line: LineLike) {
  return (lineTaxable(line) * num(line.gst_percent)) / 100;
}

export function lineTotal(line: LineLike) {
  return lineTaxable(line) + lineGst(line);
}

export function documentTotals(lines: LineLike[], isIgst: boolean) {
  const subtotal = lines.reduce((sum, line) => sum + num(line.quantity) * num(line.rate), 0);
  const discountTotal = lines.reduce((sum, line) => sum + num(line.discount), 0);
  const taxableTotal = lines.reduce((sum, line) => sum + lineTaxable(line), 0);
  const gstTotal = lines.reduce((sum, line) => sum + lineGst(line), 0);
  const cgst = isIgst ? 0 : gstTotal / 2;
  const sgst = isIgst ? 0 : gstTotal / 2;
  const igst = isIgst ? gstTotal : 0;
  const raw = taxableTotal + gstTotal;
  const grandTotal = Math.round(raw);
  return {
    subtotal,
    discountTotal,
    taxableTotal,
    gstTotal,
    cgst,
    sgst,
    igst,
    roundOff: grandTotal - raw,
    grandTotal,
  };
}

export function nextNumber(prefix: string, existing: string[], startingNumber = 1) {
  const numbers = existing
    .map((value) => Number(String(value).replace(prefix, "").replace(/\D/g, "")))
    .filter((value) => Number.isFinite(value));
  const next = Math.max(startingNumber - 1, ...(numbers.length ? numbers : [0])) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

export const INVOICE_STATUSES = ["Pending", "Partially Paid", "Paid", "Overdue"] as const;
export const QUOTATION_STATUSES = ["Draft", "Sent", "Accepted", "Rejected", "Expired"] as const;
export const PROJECT_STATUSES = [
  "Planning",
  "Design",
  "In Progress",
  "Material Procurement",
  "Installation",
  "Completed",
  "On Hold",
] as const;
export const WORK_CATEGORIES = [
  "Civil Work",
  "Carpentry",
  "Modular Kitchen",
  "Wardrobe",
  "Furniture",
  "Electrical",
  "False Ceiling",
  "Painting",
  "Lighting",
  "Glass Work",
  "Hardware",
  "Fabric",
  "Decor",
  "Other",
] as const;
export const EXPENSE_CATEGORIES = [
  "Materials",
  "Labour",
  "Furniture",
  "Hardware",
  "Transport",
  "Electrician",
  "Carpenter",
  "Civil Work",
  "Painting",
  "Other",
] as const;
export const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Cheque", "Card", "Other"] as const;
export const UNITS = ["Nos", "Sqft", "Rft", "Set", "Lot", "Hour", "Day", "Kg", "Litre"] as const;
