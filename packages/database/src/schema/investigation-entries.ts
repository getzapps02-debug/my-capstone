import { sql } from "drizzle-orm"
import { check, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

export const investigationEntries = pgTable(
  "investigation_entries",
  {
    id: text("id").notNull(),
    title: text("title").notNull(),
    status: text("status", {
      enum: ["draft", "active"],
    }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    datasetOwner: text("dataset_owner", {
      enum: ["sample", "personal"],
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.datasetOwner, table.id],
      name: "investigation_entries_dataset_owner_id_pk",
    }),
    check(
      "investigation_entries_title_not_blank",
      sql`length(trim(${table.title})) > 0`
    ),
  ]
)

export type InvestigationEntryRow = typeof investigationEntries.$inferSelect
export type NewInvestigationEntryRow = typeof investigationEntries.$inferInsert
