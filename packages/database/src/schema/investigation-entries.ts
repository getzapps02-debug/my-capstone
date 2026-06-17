import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const investigationEntries = pgTable("investigation_entries", {
  id: text("id").primaryKey(),
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
})

export type InvestigationEntryRow = typeof investigationEntries.$inferSelect
export type NewInvestigationEntryRow = typeof investigationEntries.$inferInsert
