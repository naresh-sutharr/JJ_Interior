-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin','staff');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'admin')
  on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- BUSINESS PROFILE ----------------------------------------------------
create table public.business_profile (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Tulsi Interior',
  tagline text default 'Luxury Interior Design & Turnkey Solutions',
  logo_url text,
  address text default '',
  phone text default '',
  whatsapp text default '',
  email text default '',
  website text default '',
  gstin text default '',
  pan text default '',
  bank_name text default '',
  account_number text default '',
  ifsc text default '',
  upi_id text default '',
  invoice_prefix text not null default 'TI-INV-',
  quotation_prefix text not null default 'TI-QTN-',
  starting_number int not null default 1,
  default_gst numeric not null default 18,
  payment_terms text default 'Payment due within 15 days.',
  invoice_footer text default 'Thank you for choosing Tulsi Interior.',
  terms text default '1. 50% advance payment required to commence work.\n2. Balance payable on completion.\n3. Goods once sold will not be taken back.',
  signature_name text default 'Gopalram',
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.business_profile to authenticated;
grant all on public.business_profile to service_role;
alter table public.business_profile enable row level security;
create policy "admin all business" on public.business_profile for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.business_profile (business_name) values ('Tulsi Interior');

-- CLIENTS -------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  whatsapp text,
  email text,
  billing_address text,
  project_address text,
  gstin text,
  pan text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  location text,
  project_type text,
  start_date date,
  expected_completion date,
  budget numeric not null default 0,
  status text not null default 'Planning',
  progress int not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  unit text default 'Nos',
  default_rate numeric not null default 0,
  gst_percent numeric not null default 18,
  brand text,
  material text,
  sku text,
  created_at timestamptz not null default now()
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  quote_date date not null default current_date,
  valid_until date,
  project_address text,
  notes text,
  terms text,
  status text not null default 'Draft',
  discount_total numeric not null default 0,
  subtotal numeric not null default 0,
  tax_total numeric not null default 0,
  grand_total numeric not null default 0,
  is_igst boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  position int not null default 0,
  category text,
  description text not null default '',
  room text,
  material text,
  brand text,
  quantity numeric not null default 1,
  unit text default 'Nos',
  rate numeric not null default 0,
  discount numeric not null default 0,
  gst_percent numeric not null default 18,
  amount numeric not null default 0
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  invoice_date date not null default current_date,
  due_date date,
  project_address text,
  notes text,
  terms text,
  status text not null default 'Pending',
  subtotal numeric not null default 0,
  discount_total numeric not null default 0,
  taxable_total numeric not null default 0,
  cgst numeric not null default 0,
  sgst numeric not null default 0,
  igst numeric not null default 0,
  round_off numeric not null default 0,
  grand_total numeric not null default 0,
  amount_paid numeric not null default 0,
  is_igst boolean not null default false,
  quotation_id uuid references public.quotations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  position int not null default 0,
  description text not null default '',
  room text,
  material text,
  quantity numeric not null default 1,
  unit text default 'Nos',
  rate numeric not null default 0,
  discount numeric not null default 0,
  gst_percent numeric not null default 18,
  amount numeric not null default 0
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_date date not null default current_date,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  amount numeric not null default 0,
  method text not null default 'Bank Transfer',
  transaction_id text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  project_id uuid references public.projects(id) on delete set null,
  vendor text,
  category text not null default 'Materials',
  description text,
  amount numeric not null default 0,
  method text default 'Cash',
  receipt_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  doc_type text not null default 'Other',
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  file_path text not null,
  file_name text,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  project_type text,
  budget text,
  message text,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

-- grants + RLS for admin tables
do $$
declare t text;
begin
  foreach t in array array['clients','projects','catalog_items','quotations','quotation_items','invoices','invoice_items','payments','expenses','documents','leads']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy "admin all" on public.%I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''));', t);
    execute format('create trigger touch_%I before update on public.%I for each row execute function public.touch_updated_at();', t, t);
  end loop;
end $$;

-- public contact form can create leads
grant insert on public.leads to anon;
create policy "anon create lead" on public.leads for insert to anon with check (true);

-- payment totals keep invoices in sync
create or replace function public.sync_invoice_totals()
returns trigger language plpgsql security definer set search_path = public as $$
declare inv uuid; paid numeric; total numeric; due date;
begin
  inv := coalesce(new.invoice_id, old.invoice_id);
  if inv is null then return coalesce(new, old); end if;
  select coalesce(sum(amount),0) into paid from public.payments where invoice_id = inv;
  select grand_total, due_date into total, due from public.invoices where id = inv;
  update public.invoices set amount_paid = paid,
    status = case
      when paid >= total - 0.5 then 'Paid'
      when paid > 0 then 'Partially Paid'
      when due is not null and due < current_date then 'Overdue'
      else 'Pending' end
  where id = inv;
  return coalesce(new, old);
end; $$;
create trigger payments_sync after insert or update or delete on public.payments
for each row execute function public.sync_invoice_totals();

create index on public.projects (client_id);
create index on public.invoices (client_id);
create index on public.invoices (project_id);
create index on public.payments (invoice_id);
create index on public.expenses (project_id);
