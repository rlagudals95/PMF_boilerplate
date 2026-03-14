CREATE TABLE IF NOT EXISTS "payments" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "provider" varchar(20) NOT NULL,
  "order_no" varchar(120) NOT NULL,
  "product_description" varchar(160) NOT NULL,
  "amount" integer NOT NULL,
  "currency" varchar(10) NOT NULL,
  "status" varchar(20) NOT NULL,
  "customer_name" varchar(120) NOT NULL,
  "customer_email" varchar(160),
  "pay_token" varchar(160),
  "checkout_url" text,
  "pay_method" varchar(80),
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "approved_at" timestamptz,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL
);
