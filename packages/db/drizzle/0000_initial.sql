CREATE TABLE IF NOT EXISTS "products" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "slug" varchar(120) NOT NULL,
  "name" varchar(120) NOT NULL,
  "category" varchar(120) NOT NULL,
  "one_liner" text NOT NULL,
  "stage" varchar(20) NOT NULL,
  "value_props" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "experiments" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "product_id" varchar(64) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "code" varchar(40) NOT NULL,
  "name" varchar(120) NOT NULL,
  "hypothesis" text NOT NULL,
  "channel" varchar(40) NOT NULL,
  "status" varchar(20) NOT NULL,
  "success_metric" varchar(200) NOT NULL,
  "owner" varchar(120) NOT NULL,
  "notes" text,
  "start_date" varchar(40),
  "end_date" varchar(40),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "leads" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "name" varchar(120) NOT NULL,
  "phone" varchar(40) NOT NULL,
  "email" varchar(160),
  "product_interest" varchar(160) NOT NULL,
  "source" varchar(40) NOT NULL,
  "status" varchar(20) NOT NULL,
  "message" text,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "consultation_requests" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "lead_id" varchar(64) NOT NULL REFERENCES "leads"("id") ON DELETE CASCADE,
  "product_interest" varchar(160) NOT NULL,
  "consultation_type" varchar(20) NOT NULL,
  "preferred_date" varchar(80),
  "rental_period" varchar(80),
  "budget_range" varchar(80),
  "notes" text,
  "status" varchar(20) NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "page_events" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "path" varchar(160) NOT NULL,
  "event_name" varchar(40) NOT NULL,
  "session_id" varchar(120),
  "lead_id" varchar(64),
  "experiment_id" varchar(64),
  "properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "occurred_at" timestamptz NOT NULL
);
