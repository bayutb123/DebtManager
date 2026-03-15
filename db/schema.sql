-- Debt & Receivable Manager schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric NOT NULL,
  paid_amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receivables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric NOT NULL,
  paid_amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('DEBT','RECEIVABLE')),
  amount numeric NOT NULL,
  date date NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_debts_contact ON debts(contact_id);
CREATE INDEX IF NOT EXISTS idx_receivables_contact ON receivables(contact_id);
CREATE INDEX IF NOT EXISTS idx_tx_ref ON transactions(reference_id);

-- Status is derived in app; enforce basic check
ALTER TABLE debts ADD CONSTRAINT IF NOT EXISTS debts_status_check
  CHECK (status IN ('ACTIVE','PARTIAL','PAID','OVERDUE'));
ALTER TABLE receivables ADD CONSTRAINT IF NOT EXISTS receivables_status_check
  CHECK (status IN ('ACTIVE','PARTIAL','PAID','OVERDUE'));
