-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Business Profile
CREATE TABLE business_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL DEFAULT 'Tulsi Interior',
    tagline TEXT,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    gstin TEXT,
    pan TEXT,
    bank_name TEXT,
    account_number TEXT,
    ifsc TEXT,
    upi_id TEXT,
    invoice_prefix TEXT DEFAULT 'INV',
    quotation_prefix TEXT DEFAULT 'QTN',
    starting_number INTEGER DEFAULT 1,
    default_gst_percent NUMERIC DEFAULT 18,
    default_payment_terms TEXT,
    invoice_footer TEXT,
    terms_conditions TEXT,
    authorized_signature_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    billing_address TEXT,
    project_address TEXT,
    gstin TEXT,
    pan TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    project_type TEXT,
    start_date DATE,
    expected_completion DATE,
    budget NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Planning', -- Planning, Design, In Progress, Material Procurement, Installation, Completed, On Hold
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Catalog Items
CREATE TABLE catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT, -- Plywood, Laminate, MDF, Hinges, etc.
    description TEXT,
    unit TEXT, -- sqft, rft, nos, sheet, etc.
    default_rate NUMERIC DEFAULT 0,
    gst_percent NUMERIC DEFAULT 18,
    brand TEXT,
    material TEXT,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Quotations
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    quotation_number TEXT NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    status TEXT DEFAULT 'Draft', -- Draft, Sent, Accepted, Rejected, Expired
    subtotal NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    taxable_amount NUMERIC DEFAULT 0,
    cgst NUMERIC DEFAULT 0,
    sgst NUMERIC DEFAULT 0,
    igst NUMERIC DEFAULT 0,
    grand_total NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Quotation Items
CREATE TABLE quotation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE SET NULL,
    category TEXT,
    description TEXT NOT NULL,
    room TEXT,
    material TEXT,
    brand TEXT,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit TEXT,
    rate NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    gst_percent NUMERIC DEFAULT 0,
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status TEXT DEFAULT 'PENDING', -- PAID, PARTIALLY PAID, PENDING, OVERDUE
    subtotal NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    taxable_amount NUMERIC DEFAULT 0,
    cgst NUMERIC DEFAULT 0,
    sgst NUMERIC DEFAULT 0,
    igst NUMERIC DEFAULT 0,
    round_off NUMERIC DEFAULT 0,
    grand_total NUMERIC DEFAULT 0,
    amount_paid NUMERIC DEFAULT 0,
    balance_amount NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Invoice Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE SET NULL,
    category TEXT,
    description TEXT NOT NULL,
    room TEXT,
    material TEXT,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit TEXT,
    rate NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    taxable_value NUMERIC DEFAULT 0,
    gst_percent NUMERIC DEFAULT 0,
    gst_amount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC NOT NULL,
    payment_method TEXT, -- Cash, UPI, Bank Transfer, Cheque, Card
    transaction_id TEXT,
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    vendor TEXT,
    category TEXT, -- Materials, Labour, Furniture, Hardware, Transport, etc.
    description TEXT,
    amount NUMERIC NOT NULL,
    payment_method TEXT,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document_type TEXT, -- Client Document, Project Document, Design File, Receipt, Invoice, Quotation, Contract
    file_url TEXT NOT NULL,
    file_size NUMERIC,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Functions and Triggers

-- Trigger to update invoice balance when a payment is added/updated/deleted
CREATE OR REPLACE FUNCTION update_invoice_balance() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE invoices 
        SET amount_paid = amount_paid + NEW.amount,
            balance_amount = grand_total - (amount_paid + NEW.amount)
        WHERE id = NEW.invoice_id;
        
        -- Update status
        UPDATE invoices
        SET status = CASE 
            WHEN balance_amount <= 0 THEN 'PAID'
            WHEN amount_paid > 0 THEN 'PARTIALLY PAID'
            ELSE 'PENDING'
        END
        WHERE id = NEW.invoice_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE invoices 
        SET amount_paid = amount_paid - OLD.amount,
            balance_amount = grand_total - (amount_paid - OLD.amount)
        WHERE id = OLD.invoice_id;
        
        -- Update status
        UPDATE invoices
        SET status = CASE 
            WHEN balance_amount <= 0 THEN 'PAID'
            WHEN amount_paid > 0 THEN 'PARTIALLY PAID'
            ELSE 'PENDING'
        END
        WHERE id = OLD.invoice_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE invoices 
        SET amount_paid = amount_paid - OLD.amount + NEW.amount,
            balance_amount = grand_total - (amount_paid - OLD.amount + NEW.amount)
        WHERE id = NEW.invoice_id;
        
        -- Update status
        UPDATE invoices
        SET status = CASE 
            WHEN balance_amount <= 0 THEN 'PAID'
            WHEN amount_paid > 0 THEN 'PARTIALLY PAID'
            ELSE 'PENDING'
        END
        WHERE id = NEW.invoice_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_change
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_invoice_balance();


-- RLS Policies
DO $$ 
DECLARE 
    t record;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('business_profile', 'clients', 'projects', 'catalog_items', 'quotations', 'quotation_items', 'invoices', 'invoice_items', 'payments', 'expenses', 'documents')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t.tablename);
        
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated users" ON %I;', t.tablename);
        
        EXECUTE format('CREATE POLICY "Allow authenticated users" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t.tablename);
    END LOOP;
END $$;
