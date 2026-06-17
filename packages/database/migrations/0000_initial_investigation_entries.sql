CREATE TABLE IF NOT EXISTS "investigation_entries" (
  "id" text NOT NULL,
  "title" text NOT NULL,
  "status" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "dataset_owner" text NOT NULL,
  CONSTRAINT "investigation_entries_dataset_owner_id_pk" PRIMARY KEY ("dataset_owner", "id"),
  CONSTRAINT "investigation_entries_title_not_blank" CHECK (length(trim("title")) > 0),
  CONSTRAINT "investigation_entries_status_valid" CHECK ("status" IN ('draft', 'active')),
  CONSTRAINT "investigation_entries_dataset_owner_valid" CHECK ("dataset_owner" IN ('sample', 'personal'))
);

CREATE INDEX IF NOT EXISTS "investigation_entries_dataset_owner_idx"
  ON "investigation_entries" ("dataset_owner");
